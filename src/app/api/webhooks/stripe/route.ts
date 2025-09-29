import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateContactWithPaymentStatus, createOrUpdateContact } from '@/lib/hubspot';

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

                // ✅ email correcto en eventos nuevos
                const email =
                    (session.customer_details && session.customer_details.email) ||
                    (session as any).customer_email || // fallback legacy
                    undefined;

                if (email) {
                    // intenta update; si no existe, créalo mínimo y vuelve a actualizar
                    const res = await updateContactWithPaymentStatus(email, 'completed', session.id);
                    if (!res.success && String(res.error || '').includes('Contact not found')) {
                        await createOrUpdateContact(
                            {
                                firstName: '', lastName: '', email,
                                phone: '', membershipType: (session.metadata?.membershipId as string) || '',
                                city: '', professionalType: (session.metadata?.professional_type as any) || 'medico',
                            },
                            session.id
                        );
                        await updateContactWithPaymentStatus(email, 'completed', session.id);
                    }
                }

                console.log('Payment completed for session:', session.id);
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
