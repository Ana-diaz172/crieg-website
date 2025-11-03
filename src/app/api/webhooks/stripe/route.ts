// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { findContactByEmail, updateHubspotContactPaymentFields } from "@/lib/hubspot";
import { generateCertificateBuffer } from "@/lib/certificate";
import { sendCertificateEmail } from "@/lib/email-resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PaymentExtract = {
    sessionId?: string;
    customerId?: string;
    email?: string | null;
    paymentIntentId?: string | null;
    chargeId?: string | null;
    invoiceId?: string | null;
    receiptUrl?: string | null;
    amount?: number | null;     // centavos
    currency?: string | null;
    hubspotContactId?: string | null;
};

// ---- Helpers de nombre ----
function titleCaseName(raw: string): string {
    return raw
        .trim()
        .split(/\s+/)
        .map(w => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
        .join(" ");
}

function nameFromEmail(email: string): string {
    const local = email.split("@")[0] || "";
    const cleaned = local.replace(/[._-]+/g, " ").replace(/\d+/g, "").trim();
    return cleaned ? titleCaseName(cleaned) : "Miembro";
}

async function resolveFullName(opts: {
    email?: string | null;
    hubspotFirst?: string;
    hubspotLast?: string;
    stripeCustomerId?: string | null;
}): Promise<string> {
    // 1) HubSpot
    const fromHS = `${opts.hubspotFirst || ""} ${opts.hubspotLast || ""}`.trim();
    if (fromHS && fromHS !== "") return titleCaseName(fromHS);

    // 2) Stripe Customer
    if (opts.stripeCustomerId) {
        try {
            const cust = await stripe.customers.retrieve(opts.stripeCustomerId);
            if (!("deleted" in cust)) {
                const name = (cust as Stripe.Customer).name?.trim();
                if (name) return titleCaseName(name);
            }
        } catch {
            // ignore
        }
    }

    // 3) Email local-part
    if (opts.email) return nameFromEmail(opts.email);

    // 4) Fallback
    return "Miembro";
}

// ---- Extractores ----
async function extractFromCheckoutSession(session: Stripe.Checkout.Session): Promise<PaymentExtract> {
    const out: PaymentExtract = {
        sessionId: session.id,
        email: session.customer_details?.email || (session as any).customer_email || null,
        hubspotContactId: session.metadata?.hubspot_contact_id || session.client_reference_id || null,
        customerId: typeof session.customer === "string" ? session.customer : session.customer?.id || undefined,
        paymentIntentId:
            typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id || null,
        amount: session.amount_total ?? null,
        currency: session.currency ?? null,
    };

    if (out.paymentIntentId) {
        const pi = await stripe.paymentIntents.retrieve(out.paymentIntentId, {
            expand: ["latest_charge", "invoice"],
        }) as Stripe.PaymentIntent & {
            latest_charge?: string | Stripe.Charge;
            invoice?: string | Stripe.Invoice;
        };

        out.amount = pi.amount_received ?? out.amount ?? pi.amount ?? null;
        out.currency = pi.currency ?? out.currency ?? null;

        if (pi.latest_charge) {
            if (typeof pi.latest_charge === "string") {
                out.chargeId = pi.latest_charge;
                const ch = await stripe.charges.retrieve(pi.latest_charge);
                out.receiptUrl = ch.receipt_url ?? null;
            } else {
                out.chargeId = pi.latest_charge.id;
                out.receiptUrl = pi.latest_charge.receipt_url ?? null;
            }
        }

        if (pi.invoice) {
            out.invoiceId = typeof pi.invoice === "string" ? pi.invoice : pi.invoice.id;
        }
    }

    return out;
}

async function extractFromPaymentIntent(pi: Stripe.PaymentIntent): Promise<PaymentExtract> {
    const expanded = await stripe.paymentIntents.retrieve(pi.id, {
        expand: ["latest_charge", "invoice", "customer"],
    }) as Stripe.PaymentIntent & {
        latest_charge?: string | Stripe.Charge;
        invoice?: string | Stripe.Invoice;
        customer?: string | Stripe.Customer;
    };

    const out: PaymentExtract = {
        paymentIntentId: expanded.id,
        amount: expanded.amount_received ?? expanded.amount ?? null,
        currency: expanded.currency ?? null,
    };

    if (expanded.customer) {
        if (typeof expanded.customer === "string") {
            out.customerId = expanded.customer;
            try {
                const cust = await stripe.customers.retrieve(expanded.customer);
                if (!("deleted" in cust) && (cust as Stripe.Customer).email) {
                    out.email = (cust as Stripe.Customer).email || null;
                }
            } catch {
                // ignore
            }
        } else {
            out.customerId = expanded.customer.id;
            out.email = expanded.customer.email || null;
        }
    }

    if (expanded.latest_charge) {
        if (typeof expanded.latest_charge === "string") {
            out.chargeId = expanded.latest_charge;
            const ch = await stripe.charges.retrieve(expanded.latest_charge);
            out.receiptUrl = ch.receipt_url ?? null;
        } else {
            out.chargeId = expanded.latest_charge.id;
            out.receiptUrl = expanded.latest_charge.receipt_url ?? null;
        }
    }

    if (expanded.invoice) {
        out.invoiceId = typeof expanded.invoice === "string" ? expanded.invoice : expanded.invoice.id;
    }

    return out;
}

// ---- HubSpot + Email (incluye nombre correcto) ----
async function updateHubspotAndEmail(ex: PaymentExtract) {
    // 1) Resolver contacto en HubSpot
    let targetContactId = ex.hubspotContactId || null;
    let hsFirst = "";
    let hsLast = "";

    let foundContact:
        | (Awaited<ReturnType<typeof findContactByEmail>>)
        | null = null;

    if (!targetContactId && ex.email) {
        foundContact = await findContactByEmail(ex.email);
        targetContactId = foundContact?.id || null;
    } else if (ex.email) {
        // Si ya tenemos contactId, aún vale la pena intentar leer nombres de HS por email
        foundContact = await findContactByEmail(ex.email);
    }

    if (foundContact) {
        hsFirst = foundContact.firstname || "";
        hsLast = foundContact.lastname || "";
    }

    if (!targetContactId) {
        console.warn("[WEBHOOK] No HubSpot contact found. Skipping HS update.");
        // Igual intentamos enviar el email con nombre derivado
    }

    // 2) Armar payload de pago (si hay contactId)
    if (targetContactId) {
        const paymentFields: Record<string, string> = {};
        if (ex.sessionId) paymentFields.stripe_session_id = ex.sessionId;
        if (ex.paymentIntentId) paymentFields.stripe_payment_intent_id = ex.paymentIntentId;
        if (ex.chargeId) paymentFields.stripe_charge_id = ex.chargeId;
        if (ex.invoiceId) paymentFields.stripe_invoice_id = ex.invoiceId;
        if (ex.receiptUrl) paymentFields.stripe_receipt_url = ex.receiptUrl;
        if (ex.customerId) paymentFields.stripe_customer_id = ex.customerId;
        if (ex.amount != null) paymentFields.stripe_amount = String(ex.amount);
        if (ex.currency) paymentFields.stripe_currency = ex.currency;
        paymentFields.payment_status = "completed";
        paymentFields.last_payment_date = new Date().toISOString();

        console.log("[HUBSPOT] Updating payment fields for contact:", targetContactId);
        console.log("[HUBSPOT] Payment properties:", paymentFields);
        await updateHubspotContactPaymentFields(targetContactId, paymentFields);
    }

    // 3) Enviar email con certificado si hay correo
    if (ex.email) {
        const fullName = await resolveFullName({
            email: ex.email || undefined,
            hubspotFirst: hsFirst,
            hubspotLast: hsLast,
            stripeCustomerId: ex.customerId || null,
        });

        const baseUrl =
            process.env.NEXT_PUBLIC_DOMAIN ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

        const pdf = await generateCertificateBuffer({
            fullName,
            contactId: targetContactId || "N/A",
            sessionId: ex.sessionId || ex.paymentIntentId || "N/A",
            offsetX: -70,
            baseUrl,
        });

        const emailId = await sendCertificateEmail({
            to: ex.email,
            fullName,
            pdf,
            invoiceUrl: ex.invoiceId ? `https://dashboard.stripe.com/invoices/${ex.invoiceId}/pdf` : null
        });


        console.log(`[EMAIL] Certificate email sent | id: ${emailId} | to: ${ex.email} | name: ${fullName}`);
    } else {
        console.warn("[EMAIL] No email available; skipping email send.");
    }
}

// ---- Handler principal ----
export async function POST(request: NextRequest) {
    const started = Date.now();

    try {
        // 1) Verificación de firma
        const rawBody = await request.text();
        const signature = request.headers.get("stripe-signature");
        if (!signature) {
            console.error("[WEBHOOK] Missing stripe-signature header");
            return NextResponse.json({ error: "No signature found" }, { status: 400 });
        }

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        } catch (err: any) {
            console.error("[WEBHOOK] Signature verification failed:", err?.message || err);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        console.log(`[WEBHOOK] Event received: ${event.type} | ID: ${event.id}`);

        // 2) Manejo de eventos
        if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log("[WEBHOOK] Processing Checkout Session:", session.id);

            const extracted = await extractFromCheckoutSession(session);
            console.log("[WEBHOOK] Extracted (session):", {
                sessionId: extracted.sessionId,
                paymentIntentId: extracted.paymentIntentId,
                chargeId: extracted.chargeId,
                invoiceId: extracted.invoiceId,
                email: extracted.email,
                customerId: extracted.customerId,
                amount: extracted.amount,
                currency: extracted.currency,
                hubspotContactId: extracted.hubspotContactId,
            });

            await updateHubspotAndEmail(extracted);

            const took = Date.now() - started;
            console.log(`[WEBHOOK] Done checkout.* in ${took}ms`);
            return NextResponse.json({ received: true });
        }

        if (event.type === "payment_intent.succeeded") {
            const pi = event.data.object as Stripe.PaymentIntent;
            console.log("[WEBHOOK] Processing Payment Intent:", pi.id);

            const extracted = await extractFromPaymentIntent(pi);
            console.log("[WEBHOOK] Extracted (pi):", {
                sessionId: extracted.sessionId,
                paymentIntentId: extracted.paymentIntentId,
                chargeId: extracted.chargeId,
                invoiceId: extracted.invoiceId,
                email: extracted.email,
                customerId: extracted.customerId,
                amount: extracted.amount,
                currency: extracted.currency,
                hubspotContactId: extracted.hubspotContactId,
            });

            await updateHubspotAndEmail(extracted);

            const took = Date.now() - started;
            console.log(`[WEBHOOK] Done pi.succeeded in ${took}ms`);
            return NextResponse.json({ received: true });
        }

        if (event.type === "checkout.session.expired") {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log(`[WEBHOOK] Session expired: ${session.id}`);

            const hubspotContactId =
                session.metadata?.hubspot_contact_id || session.client_reference_id || null;

            const email = session.customer_details?.email || (session as any).customer_email || null;

            let contactId = hubspotContactId;
            if (!contactId && email) {
                const found = await findContactByEmail(email);
                contactId = found?.id || null;
            }

            if (contactId) {
                await updateHubspotContactPaymentFields(contactId, {
                    stripe_session_id: session.id,
                    payment_status: "failed",
                    last_payment_date: new Date().toISOString(),
                });
                console.log(`[WEBHOOK] Expired session updated in HubSpot: ${contactId}`);
            } else {
                console.warn("[WEBHOOK] No contact found for expired session");
            }

            return NextResponse.json({ received: true });
        }

        // Otros eventos
        console.log(`[WEBHOOK] Unhandled type: ${event.type}`);
        return NextResponse.json({ received: true });
    } catch (error: any) {
        const took = Date.now() - started;
        console.error(`[WEBHOOK] Handler failed after ${took}ms:`, error?.message || error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
