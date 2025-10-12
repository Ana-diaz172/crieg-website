import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateContactWithPaymentStatus, createOrUpdateContact, findContactByEmail } from '@/lib/hubspot';
import { generateCertificateBuffer } from '@/lib/certificate';
import { sendCertificateWithResend } from '@/lib/email-resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');
        if (!signature) return NextResponse.json({ error: 'No signature found' }, { status: 400 });

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                const email =
                    session.customer_details?.email ||
                    (session as any).customer_email;

                if (email) {
                    const contact = await findContactByEmail(email);
                    const fullName = `${contact?.firstname ?? ''} ${contact?.lastname ?? ''}`.trim() || 'Miembro';

                    const pdf = await generateCertificateBuffer({
                        fullName,
                        contactId: contact?.id ?? 'N/A',
                        sessionId: session.id,
                        offsetX: -70, // tu ajuste actual
                    });

                    await sendCertificateWithResend({ to: email, fullName, pdfBuffer: pdf });
                }
                break;
            }

            case 'checkout.session.expired': {
                const session = event.data.object as Stripe.Checkout.Session;
                const email =
                    (session.customer_details && session.customer_details.email) ||
                    (session as any).customer_email ||
                    undefined;

                if (email) {
                    await updateContactWithPaymentStatus(email, 'failed', session.id);
                }
                console.log('Payment session expired:', session.id);
                break;
            }

            case 'payment_intent.payment_failed': {
                const pi = event.data.object as Stripe.PaymentIntent;
                console.log('Payment failed for:', pi.id);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
