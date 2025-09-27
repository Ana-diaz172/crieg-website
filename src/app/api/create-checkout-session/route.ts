import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-08-27.basil',
});

const memberships = {
    'crieg-medicos': {
        name: 'Membresía Médicos Radiólogos CRIEG',
        description: 'Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos al mantener tu membresía CRIEG vigente.',
        amount: 260000,
    },
    'crieg-residentes': {
        name: 'Membresía Residentes CRIEG',
        description: 'Accede a congresos con tarifas preferenciales y mantén tu membresía CRIEG al día con regularización automática.',
        amount: 60000,
    },
    'fmri': {
        name: 'Membresía FMRI',
        description: 'Disfruta costos preferenciales en congresos, acceso a contenido académico exclusivo y reconocimiento oficial con la carta de pertenencia a la FMRI.',
        amount: 400000,
    },
};

export async function POST(request: NextRequest) {
    try {
        const { membershipId } = await request.json();

        const membership = memberships[membershipId as keyof typeof memberships];
        if (!membership) {
            return NextResponse.json({ error: 'Membresía no válida' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'mxn',
                        product_data: {
                            name: membership.name,
                            description: membership.description,
                        },
                        unit_amount: membership.amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/`,
            metadata: {
                membershipId,
            },
        });

        return NextResponse.json({
            checkoutUrl: session.url,
            sessionId: session.id
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}