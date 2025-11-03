import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { findContactByEmail, updateHubspotContactPaymentFields } from "@/lib/hubspot";
import { generateCertificateBuffer } from "@/lib/certificate";
import { sendCertificateEmail } from "@/lib/email-resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get("stripe-signature");
        if (!signature) return NextResponse.json({ error: "No signature found" }, { status: 400 });

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        } catch (err: any) {
            console.error("[WEBHOOK] Signature verification failed:", err.message);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        console.log("[WEBHOOK] type:", event.type);

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                const hubspotContactIdFromStripe =
                    (session.metadata && (session.metadata as any).hubspot_contact_id) ||
                    session.client_reference_id ||
                    null;

                const sessionId = session.id;
                const paymentIntentId =
                    typeof session.payment_intent === "string"
                        ? session.payment_intent
                        : (session.payment_intent as any)?.id;

                const stripeCustomerId =
                    typeof session.customer === "string"
                        ? session.customer
                        : (session.customer as any)?.id;

                const pi = (paymentIntentId
                    ? await stripe.paymentIntents.retrieve(paymentIntentId, {
                        expand: ["latest_charge", "invoice"],
                    })
                    : null) as Stripe.PaymentIntent | null;

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

                const amount =
                    (pi as any)?.amount_received ?? session.amount_total ?? null; // en centavos
                const currency = (pi as any)?.currency ?? session.currency ?? null;


                let targetContactId = hubspotContactIdFromStripe;
                if (!targetContactId) {
                    const email =
                        session.customer_details?.email || (session as any).customer_email || undefined;
                    if (email) {
                        const contact = await findContactByEmail(email);
                        targetContactId = contact?.id || null;
                    }
                }

                // Persist Stripe IDs into HubSpot props
                if (targetContactId) {
                    await updateHubspotContactPaymentFields(targetContactId, {
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
                    });
                }

                // OPTIONAL: your PDF + email logic
                try {
                    const email =
                        session.customer_details?.email ||
                        (session as any).customer_email ||
                        undefined;

                    if (email) {
                        const contact = await (targetContactId
                            ? Promise.resolve({ id: targetContactId, ...(await findContactByEmail(email)) })
                            : findContactByEmail(email));

                        const fullName =
                            `${(contact as any)?.firstname ?? ""} ${(contact as any)?.lastname ?? ""}`.trim() || "Miembro";

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
                    }
                } catch (e: any) {
                    console.error("[WEBHOOK] send error:", e?.name || "ERR", e?.message || e);
                }

                break;
            }

            case "checkout.session.expired": {
                const session = event.data.object as Stripe.Checkout.Session;

                const hubspotContactIdFromStripe =
                    (session.metadata && (session.metadata as any).hubspot_contact_id) ||
                    session.client_reference_id ||
                    null;

                const updateProps: Record<string, string | undefined> = {
                    stripe_session_id: session.id,
                    payment_status: "failed",
                    last_payment_date: new Date().toISOString(),
                };

                if (hubspotContactIdFromStripe) {
                    await updateHubspotContactPaymentFields(hubspotContactIdFromStripe, updateProps);
                } else {
                    const email =
                        session.customer_details?.email ||
                        (session as any).customer_email ||
                        undefined;
                    if (email) {
                        const c = await findContactByEmail(email);
                        if (c?.id) {
                            await updateHubspotContactPaymentFields(c.id, updateProps);
                        }
                    }
                }

                console.log("[WEBHOOK] expired ->", session.id);
                break;
            }

            default:
                console.log("[WEBHOOK] unhandled:", event.type);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("[WEBHOOK] handler failed:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
