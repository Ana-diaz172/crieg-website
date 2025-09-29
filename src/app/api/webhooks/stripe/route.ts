import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateContactWithPaymentStatus } from '@/lib/hubspot';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'No signature found' },
                { status: 400 }
            );
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return NextResponse.json(
                { error: `Webhook Error: ${err.message}` },
                { status: 400 }
            );
        }

        // Manejar diferentes tipos de eventos
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;

                // Actualizar HubSpot con el pago completado
                if (session.customer_email) {
                    await updateContactWithPaymentStatus(
                        session.customer_email,
                        'completed',
                        session.id
                    );
                }

                console.log('Payment completed for session:', session.id);
                break;

            case 'checkout.session.expired':
                const expiredSession = event.data.object as Stripe.Checkout.Session;

                if (expiredSession.customer_email) {
                    await updateContactWithPaymentStatus(
                        expiredSession.customer_email,
                        'failed',
                        expiredSession.id
                    );
                }

                console.log('Payment session expired:', expiredSession.id);
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object as Stripe.PaymentIntent;

                if (failedPayment.receipt_email) {
                    // Buscar la sesión relacionada para obtener más detalles
                    console.log('Payment failed for:', failedPayment.id);
                }
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

// Configuración especial para webhooks de Stripe
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';