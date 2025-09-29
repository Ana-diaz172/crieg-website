import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createOrUpdateContact } from '@/lib/hubspot';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const memberships = {
    'crieg-medicos': { name: 'Membresía Médicos Radiólogos CRIEG', description: '...', amount: 260000 },
    'crieg-residentes': { name: 'Membresía Residentes CRIEG', description: '...', amount: 60000 },
    'fmri': { name: 'Membresía FMRI', description: '...', amount: 400000 },
};

type IncomingFormData = {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    membership_type: 'CRIEG' | 'FMRI';
    city: string;
    professional_type: 'medico' | 'residente';
    residency_location?: string;
    current_residency_year?: string;
    head_professor_name?: string;
};

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            return NextResponse.json({ error: 'Content-Type debe ser application/json' }, { status: 400 });
        }

        const bodyText = await request.text();
        if (!bodyText.trim()) {
            return NextResponse.json({ error: 'El cuerpo de la solicitud está vacío' }, { status: 400 });
        }

        let membershipId: string, formData: IncomingFormData;
        try {
            const body = JSON.parse(bodyText);
            membershipId = body.membershipId;
            formData = body.formData as IncomingFormData;
        } catch {
            return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
        }

        if (!membershipId) return NextResponse.json({ error: 'membershipId es requerido' }, { status: 400 });
        const membership = memberships[membershipId as keyof typeof memberships];
        if (!membership) return NextResponse.json({ error: 'Membresía no válida' }, { status: 400 });
        if (!formData?.email) return NextResponse.json({ error: 'email es requerido en formData' }, { status: 400 });

        // 1) Crea la sesión con el email del formulario
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: formData.email, // ✅ rellena el correo en Checkout
            line_items: [
                {
                    price_data: {
                        currency: 'mxn',
                        product_data: { name: membership.name, description: membership.description },
                        unit_amount: membership.amount,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/`,
            metadata: {
                membershipId,
                professional_type: formData.professional_type || '',
            },
        });

        // 2) Asegura el contacto en HubSpot ANTES de redirigir (para que el webhook luego solo actualice estado)
        await createOrUpdateContact(
            {
                firstName: formData.firstname,
                lastName: formData.lastname,
                email: formData.email,
                phone: formData.phone,
                membershipType: formData.membership_type,
                city: formData.city,
                professionalType: formData.professional_type,
                residencyLocation: formData.residency_location,
                currentResidencyYear: formData.current_residency_year,
                headProfessorName: formData.head_professor_name,
            },
            session.id // guarda el session_id en HubSpot
        );

        return NextResponse.json({ checkoutUrl: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
