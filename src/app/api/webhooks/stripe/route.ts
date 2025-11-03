import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { findContactByEmail, updateHubspotContactPaymentFields } from "@/lib/hubspot";
import { generateCertificateBuffer } from "@/lib/certificate";
import { sendCertificateEmail } from "@/lib/email-resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        // 1) Verifica firma y construye evento
        const rawBody = await request.text();
        const signature = request.headers.get("stripe-signature");
        if (!signature) {
            console.error("[WEBHOOK] Missing signature header");
            return NextResponse.json({ error: "No signature found" }, { status: 400 });
        }

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        } catch (err: any) {
            console.error("[WEBHOOK] Signature verification failed:", err?.message || err);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        console.log("[WEBHOOK] type:", event.type);

        // 2) Manejo de eventos que nos importan
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            // Extrae ids útiles
            const sessionId = session.id;
            const stripeCustomerId =
                typeof session.customer === "string" ? session.customer : (session.customer as any)?.id;
            const hubspotContactIdFromStripe =
                (session.metadata && (session.metadata as any).hubspot_contact_id) ||
                session.client_reference_id ||
                null;

            // Recupera PI con expansiones para obtener latest_charge e invoice
            const paymentIntentId =
                typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : (session.payment_intent as any)?.id;

            const pi = paymentIntentId
                ? await stripe.paymentIntents.retrieve(paymentIntentId, {
                    expand: ["latest_charge", "invoice"],
                })
                : null;

            // chargeId y recibo
            let chargeId: string | null = null;
            let receiptUrl: string | null = null;
            if (pi?.latest_charge) {
                if (typeof pi.latest_charge === "string") {
                    chargeId = pi.latest_charge;
                    const ch = await stripe.charges.retrieve(chargeId);
                    receiptUrl = ch.receipt_url ?? null;
                } else {
                    chargeId = pi.latest_charge.id;
                    receiptUrl = pi.latest_charge.receipt_url ?? null;
                }
            }

            const invoiceId =
                typeof (pi as any)?.invoice === "string"
                    ? ((pi as any).invoice as string)
                    : (pi as any)?.invoice?.id || null;

            const amount = (pi as Stripe.PaymentIntent | null)?.amount_received ?? session.amount_total ?? null; // centavos
            const currency = (pi as Stripe.PaymentIntent | null)?.currency ?? session.currency ?? null;

            // Resuelve el contacto (preferimos metadata; si no, por email)
            let targetContactId = hubspotContactIdFromStripe as string | null;
            let email =
                session.customer_details?.email ||
                (session as any).customer_email ||
                undefined;

            if (!targetContactId && email) {
                const found = await findContactByEmail(email);
                targetContactId = found?.id || null;
            }

            // 3) Actualiza HubSpot con los datos del pago
            const paymentFields: Record<string, string | undefined> = {
                stripe_session_id: sessionId,
                stripe_payment_intent_id: paymentIntentId || undefined,
                stripe_charge_id: chargeId || undefined,
                stripe_invoice_id: invoiceId || undefined,
                stripe_receipt_url: receiptUrl || undefined,
                stripe_customer_id: stripeCustomerId || undefined,
                stripe_amount: amount != null ? String(amount) : undefined,
                stripe_currency: currency || undefined,
                payment_status: "completed",
                last_payment_date: new Date().toISOString(),
            };

            if (targetContactId) {
                await updateHubspotContactPaymentFields(targetContactId, paymentFields);
                console.log("[WEBHOOK] HubSpot updated for contact:", targetContactId);
            } else {
                console.warn("[WEBHOOK] No HubSpot contactId resolved. Skipping HubSpot update.");
            }

            // 4) Enviar correo con PDF (si tienes esa lógica)
            try {
                if (email) {
                    // Si quieres nombre real, puedes leerlo de HubSpot con findContactByEmail(email)
                    const fullName = "Miembro"; // o recupera de HubSpot
                    const baseUrl =
                        process.env.NEXT_PUBLIC_DOMAIN ||
                        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

                    const pdf = await generateCertificateBuffer({
                        fullName,
                        contactId: targetContactId ?? "N/A",
                        sessionId,
                        offsetX: -70,
                        baseUrl,
                    });

                    const id = await sendCertificateEmail({ to: email, fullName, pdf });
                    console.log("[WEBHOOK] RESEND_MAIL_SENT", { id, to: email });
                } else {
                    console.warn("[WEBHOOK] No email in session; skipping email send.");
                }
            } catch (e: any) {
                console.error("[WEBHOOK] sendCertificateEmail error:", e?.message || e);
            }
        }

        if (event.type === "checkout.session.expired") {
            const session = event.data.object as Stripe.Checkout.Session;

            const hubspotContactIdFromStripe =
                (session.metadata && (session.metadata as any).hubspot_contact_id) ||
                session.client_reference_id ||
                null;

            const email =
                session.customer_details?.email ||
                (session as any).customer_email ||
                undefined;

            const updateProps: Record<string, string | undefined> = {
                stripe_session_id: session.id,
                payment_status: "failed",
                last_payment_date: new Date().toISOString(),
            };

            let targetContactId = hubspotContactIdFromStripe as string | null;
            if (!targetContactId && email) {
                const c = await findContactByEmail(email);
                targetContactId = c?.id || null;
            }

            if (targetContactId) {
                await updateHubspotContactPaymentFields(targetContactId, updateProps);
                console.log("[WEBHOOK] expired -> HubSpot updated:", targetContactId);
            } else {
                console.warn("[WEBHOOK] expired -> no contactId resolved");
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("[WEBHOOK] handler failed:", error?.message || error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
