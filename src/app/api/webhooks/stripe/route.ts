import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { findContactByEmail, updateHubspotContactPaymentFields } from "@/lib/hubspot";
import { generateCertificateBuffer } from "@/lib/certificate";
import { sendCertificateEmail } from "@/lib/email-resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper para procesar tareas asíncronas después de responder
async function processAsyncTasks(tasks: Array<() => Promise<void>>) {
    for (const task of tasks) {
        try {
            await task();
        } catch (err: any) {
            console.error("[WEBHOOK] Async task error:", err?.message || err);
        }
    }
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        // ========================================
        // 1) VERIFICACIÓN DE FIRMA (crítico, rápido)
        // ========================================
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

        console.log(`[WEBHOOK] Event received: ${event.type} | ID: ${event.id}`);

        // ========================================
        // 2) CHECKOUT.SESSION.COMPLETED
        // ========================================
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const sessionId = session.id;

            console.log(`[WEBHOOK] Processing session: ${sessionId}`);

            // Extraer datos básicos del session
            const stripeCustomerId = typeof session.customer === "string"
                ? session.customer
                : session.customer?.id || null;

            const hubspotContactIdFromMetadata = session.metadata?.hubspot_contact_id
                || session.client_reference_id
                || null;

            const email = session.customer_details?.email
                || (session as any).customer_email
                || null;

            // Validación temprana
            if (!email) {
                console.error(`[WEBHOOK] No email found in session ${sessionId}`);
                return NextResponse.json({
                    received: true,
                    warning: "No email in session"
                }, { status: 200 });
            }

            // ========================================
            // RESPUESTA RÁPIDA A STRIPE (< 3 segundos ideal)
            // ========================================
            const quickResponse = NextResponse.json({
                received: true,
                sessionId,
                timestamp: new Date().toISOString()
            });

            // ========================================
            // 3) PROCESAMIENTO ASÍNCRONO (después de responder)
            // ========================================
            const asyncTasks: Array<() => Promise<void>> = [];

            // Tarea 1: Obtener PaymentIntent y actualizar HubSpot
            asyncTasks.push(async () => {
                console.log(`[WEBHOOK:ASYNC] Starting HubSpot update for ${sessionId}`);

                try {
                    // Obtener PaymentIntent con expansiones
                    const paymentIntentId = typeof session.payment_intent === "string"
                        ? session.payment_intent
                        : session.payment_intent?.id || null;

                    let chargeId: string | null = null;
                    let receiptUrl: string | null = null;
                    let invoiceId: string | null = null;
                    let amount: number | null = null;
                    let currency: string | null = null;

                    if (paymentIntentId) {
                        const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
                            expand: ["latest_charge", "invoice"],
                        }) as Stripe.Response<Stripe.PaymentIntent> & {
                            latest_charge?: string | Stripe.Charge;
                            invoice?: string | Stripe.Invoice;
                        };

                        // Extraer datos del PaymentIntent
                        amount = pi.amount_received;
                        currency = pi.currency;

                        // Extraer Charge
                        if (pi.latest_charge) {
                            if (typeof pi.latest_charge === "string") {
                                chargeId = pi.latest_charge;
                                const charge = await stripe.charges.retrieve(chargeId);
                                receiptUrl = charge.receipt_url;
                            } else {
                                chargeId = pi.latest_charge.id;
                                receiptUrl = pi.latest_charge.receipt_url;
                            }
                        }

                        // Extraer Invoice
                        if (pi.invoice) {
                            invoiceId = typeof pi.invoice === "string" ? pi.invoice : pi.invoice?.id || null;
                        }
                    }

                    // Fallback a datos del session
                    amount = amount ?? session.amount_total ?? null;
                    currency = currency ?? session.currency ?? null;

                    // Resolver contacto en HubSpot
                    let targetContactId = hubspotContactIdFromMetadata;

                    if (!targetContactId && email) {
                        console.log(`[WEBHOOK:ASYNC] Finding contact by email: ${email}`);
                        const found = await findContactByEmail(email);
                        targetContactId = found?.id || null;
                    }

                    if (!targetContactId) {
                        console.warn(`[WEBHOOK:ASYNC] No HubSpot contact found for ${email}`);
                        return;
                    }

                    // Preparar campos para actualizar
                    const paymentFields: Record<string, string> = {};

                    if (sessionId) paymentFields.stripe_session_id = sessionId;
                    if (paymentIntentId) paymentFields.stripe_payment_intent_id = paymentIntentId;
                    if (chargeId) paymentFields.stripe_charge_id = chargeId;
                    if (invoiceId) paymentFields.stripe_invoice_id = invoiceId;
                    if (receiptUrl) paymentFields.stripe_receipt_url = receiptUrl;
                    if (stripeCustomerId) paymentFields.stripe_customer_id = stripeCustomerId;
                    if (amount !== null) paymentFields.stripe_amount = String(amount);
                    if (currency) paymentFields.stripe_currency = currency;

                    paymentFields.payment_status = "completed";
                    paymentFields.last_payment_date = new Date().toISOString();

                    // Actualizar HubSpot
                    await updateHubspotContactPaymentFields(targetContactId, paymentFields);

                    console.log(`[WEBHOOK:ASYNC] HubSpot updated successfully for contact: ${targetContactId}`);
                } catch (err: any) {
                    console.error(`[WEBHOOK:ASYNC] HubSpot update failed:`, err?.message || err);
                    throw err;
                }
            });

            // Tarea 2: Generar y enviar certificado
            asyncTasks.push(async () => {
                console.log(`[WEBHOOK:ASYNC] Starting certificate generation for ${sessionId}`);

                try {
                    if (!email) {
                        console.warn("[WEBHOOK:ASYNC] No email, skipping certificate");
                        return;
                    }

                    // Obtener nombre del contacto
                    const contact = await findContactByEmail(email);
                    const fullName = contact
                        ? `${contact.firstname || ""} ${contact.lastname || ""}`.trim()
                        : "Miembro";

                    if (!fullName || fullName === "Miembro") {
                        console.warn(`[WEBHOOK:ASYNC] Using fallback name for ${email}`);
                    }

                    // Generar PDF
                    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN
                        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

                    const pdf = await generateCertificateBuffer({
                        fullName,
                        contactId: contact?.id || "N/A",
                        sessionId,
                        offsetX: -70,
                        baseUrl,
                    });

                    // Enviar correo
                    const emailId = await sendCertificateEmail({
                        to: email,
                        fullName,
                        pdf
                    });

                    console.log(`[WEBHOOK:ASYNC] Certificate email sent successfully | ID: ${emailId} | To: ${email}`);
                } catch (err: any) {
                    console.error(`[WEBHOOK:ASYNC] Certificate generation/sending failed:`, err?.message || err);
                    throw err;
                }
            });

            // Ejecutar tareas asíncronas SIN bloquear la respuesta
            // Node.js continuará procesando después de enviar la respuesta
            setImmediate(() => {
                processAsyncTasks(asyncTasks).then(() => {
                    const duration = Date.now() - startTime;
                    console.log(`[WEBHOOK:ASYNC] All tasks completed in ${duration}ms for session ${sessionId}`);
                });
            });

            return quickResponse;
        }

        // ========================================
        // 4) CHECKOUT.SESSION.EXPIRED
        // ========================================
        if (event.type === "checkout.session.expired") {
            const session = event.data.object as Stripe.Checkout.Session;
            const sessionId = session.id;

            console.log(`[WEBHOOK] Session expired: ${sessionId}`);

            const hubspotContactIdFromMetadata = session.metadata?.hubspot_contact_id
                || session.client_reference_id
                || null;

            const email = session.customer_details?.email
                || (session as any).customer_email
                || null;

            // Respuesta rápida
            const quickResponse = NextResponse.json({ received: true, sessionId });

            // Actualización asíncrona
            setImmediate(async () => {
                try {
                    let targetContactId = hubspotContactIdFromMetadata;

                    if (!targetContactId && email) {
                        const contact = await findContactByEmail(email);
                        targetContactId = contact?.id || null;
                    }

                    if (targetContactId) {
                        await updateHubspotContactPaymentFields(targetContactId, {
                            stripe_session_id: sessionId,
                            payment_status: "failed",
                            last_payment_date: new Date().toISOString(),
                        });
                        console.log(`[WEBHOOK:ASYNC] Expired session updated in HubSpot: ${targetContactId}`);
                    } else {
                        console.warn(`[WEBHOOK:ASYNC] No contact found for expired session: ${sessionId}`);
                    }
                } catch (err: any) {
                    console.error(`[WEBHOOK:ASYNC] Failed to update expired session:`, err?.message || err);
                }
            });

            return quickResponse;
        }

        // Otros eventos no manejados
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
        return NextResponse.json({ received: true });

    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`[WEBHOOK] Handler failed after ${duration}ms:`, error?.message || error);
        return NextResponse.json({
            error: "Webhook handler failed",
            details: process.env.NODE_ENV === "development" ? error?.message : undefined
        }, { status: 500 });
    }
}