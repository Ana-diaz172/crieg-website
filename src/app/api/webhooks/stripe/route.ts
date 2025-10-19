// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateContactWithPaymentStatus, findContactByEmail } from '@/lib/hubspot';
import { generateCertificateBuffer } from '@/lib/certificate';
import { sendCertificateEmail } from '@/lib/email-resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('stripe-signature');
        if (!signature) return NextResponse.json({ error: 'No signature found' }, { status: 400 });

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        } catch (err: any) {
            console.error('[WEBHOOK] Signature verification failed:', err.message);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        console.log('[WEBHOOK] type:', event.type);

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                const email =
                    session.customer_details?.email ||
                    (session as any).customer_email ||
                    undefined;

                console.log('[WEBHOOK] completed -> email:', email, 'session:', session.id);

                if (!email) break;

                try {
                    const contact = await findContactByEmail(email);
                    const fullName = `${contact?.firstname ?? ''} ${contact?.lastname ?? ''}`.trim() || 'Miembro';

                    console.log('[WEBHOOK] contactId:', contact?.id, 'fullName:', fullName);

                    const baseUrl =
                        process.env.NEXT_PUBLIC_DOMAIN ||
                        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

                    const pdf = await generateCertificateBuffer({
                        fullName,
                        contactId: contact?.id ?? 'N/A',
                        sessionId: session.id,
                        offsetX: -70,
                        baseUrl, // 👈 importante en prod
                    });

                    console.log('[WEBHOOK] pdf bytes:', pdf.byteLength);

                    const id = await sendCertificateEmail({ to: email, fullName, pdf });
                    console.log('[WEBHOOK] RESEND_MAIL_SENT', { id, to: email });
                } catch (e: any) {
                    console.error('[WEBHOOK] send error:', e?.name || 'ERR', e?.message || e);
                }

                break;
            }

            case 'checkout.session.expired': {
                const session = event.data.object as Stripe.Checkout.Session;
                const email =
                    session.customer_details?.email ||
                    (session as any).customer_email ||
                    undefined;

                if (email) {
                    await updateContactWithPaymentStatus(email, 'failed', session.id);
                }
                console.log('[WEBHOOK] expired ->', session.id);
                break;
            }

            default:
                console.log('[WEBHOOK] unhandled:', event.type);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[WEBHOOK] handler failed:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
