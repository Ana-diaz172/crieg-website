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
        // Verificar el Content-Type primero
        const contentType = request.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            return NextResponse.json(
                { error: 'Content-Type debe ser application/json' },
                { status: 400 }
            );
        }

        // Leer el cuerpo como texto primero para mejor manejo de errores
        const bodyText = await request.text();

        // Verificar que el cuerpo no esté vacío
        if (!bodyText.trim()) {
            return NextResponse.json(
                { error: 'El cuerpo de la solicitud está vacío' },
                { status: 400 }
            );
        }

        let membershipId;
        try {
            const body = JSON.parse(bodyText);
            membershipId = body.membershipId;
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return NextResponse.json(
                { error: 'JSON inválido en el cuerpo de la solicitud' },
                { status: 400 }
            );
        }

        // Verificar que membershipId esté presente
        if (!membershipId) {
            return NextResponse.json(
                { error: 'El campo membershipId es requerido' },
                { status: 400 }
            );
        }

        // Verificar que la membresía exista
        const membership = memberships[membershipId as keyof typeof memberships];
        if (!membership) {
            return NextResponse.json(
                { error: 'Membresía no válida' },
                { status: 400 }
            );
        }

        // Crear sesión de Stripe
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
            success_url: `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/`,
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