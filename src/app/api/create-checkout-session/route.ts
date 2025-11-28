import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrUpdateContact } from "@/lib/hubspot";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Mapea tus membresías (centavos MXN)
const memberships = {
    "crieg-medicos": {
        name: "Membresía Médicos Radiólogos CRIEG",
        description: "...",
        amount: 260000,
    },
    "crieg-residentes": {
        name: "Membresía Residentes CRIEG",
        description: "...",
        amount: 60000,
    },
    fmri: {
        name: "Membresía FMRI",
        description: "...",
        amount: 400000,
    },
} as const;

// Helper para garantizar metadata de Stripe en string
const toStripeMetadata = (obj: Record<string, unknown>) =>
    Object.fromEntries(
        Object.entries(obj)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)])
    ) as Record<string, string>;

type IncomingFormData = {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    city: string;

    date_of_birth: string;
    active_member: string;
    university: string;
    specialty: string;
    sub_specialty: string;
    professional_id: string;
    specialty_prof_id: string;
    sub_specialty_prof_id: string;
    validity_period: string;
    added_certification: string;

    residency_location?: string;
    current_residency_year?: string;
    head_professor_name?: string;
};

export async function POST(request: NextRequest) {
    try {
        // Validación de envs críticas
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error("[CREATE_SESSION] Missing STRIPE_SECRET_KEY");
            return NextResponse.json(
                { error: "Server misconfigured: missing STRIPE_SECRET_KEY" },
                { status: 500 }
            );
        }
        if (!process.env.HUBSPOT_ACCESS_TOKEN) {
            console.error("[CREATE_SESSION] Missing HUBSPOT_ACCESS_TOKEN");
            return NextResponse.json(
                { error: "Server misconfigured: missing HUBSPOT_ACCESS_TOKEN" },
                { status: 500 }
            );
        }

        const contentType = request.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            return NextResponse.json(
                { error: "Content-Type must be application/json" },
                { status: 400 }
            );
        }

        const bodyText = await request.text();
        if (!bodyText.trim()) {
            return NextResponse.json(
                { error: "Request body is empty" },
                { status: 400 }
            );
        }

        let parsed: {
            membershipId: keyof typeof memberships;
            formData: IncomingFormData;
        };
        try {
            parsed = JSON.parse(bodyText);
        } catch (err) {
            console.error("[CREATE_SESSION] JSON parse error", err);
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const membershipId = parsed.membershipId;
        const formData = parsed.formData;

        if (!membershipId) {
            return NextResponse.json(
                { error: "membershipId is required" },
                { status: 400 }
            );
        }
        if (!formData?.email) {
            return NextResponse.json(
                { error: "formData.email is required" },
                { status: 400 }
            );
        }

        const membership = memberships[membershipId];
        if (!membership) {
            return NextResponse.json(
                { error: "Invalid membershipId" },
                { status: 400 }
            );
        }

        console.log("[CREATE_SESSION] Start:", {
            email: formData.email,
            membershipId,
        });

        // 1) Asegura contacto en HubSpot (ya incluye membership_id)
        const contactRes = await createOrUpdateContact(
            {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,

                date_of_birth: formData.date_of_birth,
                active_member: formData.active_member,
                university: formData.university,
                specialty: formData.specialty,
                sub_specialty: formData.sub_specialty,
                professional_id: formData.professional_id,
                specialty_prof_id: formData.specialty_prof_id,
                sub_specialty_prof_id: formData.sub_specialty_prof_id,
                validity_period: formData.validity_period,
                added_certification: formData.added_certification,

                residency_location: formData.residency_location,
                current_residency_year: formData.current_residency_year,
                head_professor_name: formData.head_professor_name,

                membership_id: membershipId,
            },
            undefined
        );

        if (!contactRes?.success || !contactRes?.contactId) {
            console.error(
                "[CREATE_SESSION] HubSpot createOrUpdateContact failed:",
                contactRes
            );
            return NextResponse.json(
                {
                    error: "Failed to create/update HubSpot contact",
                    details: contactRes?.error || null,
                },
                { status: 500 }
            );
        }

        const hubspotContactId = String(contactRes.contactId);
        console.log("[CREATE_SESSION] HubSpot contactId:", hubspotContactId);

        const email = String(formData.email);
        const first = formData.firstname ?? "";
        const last = formData.lastname ?? "";
        const fullName = `${first} ${last}`.trim() || undefined;

        const domain =
            process.env.NEXT_PUBLIC_DOMAIN ||
            (process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : "http://localhost:3000");

        // 2) Metadata base que viaja por Stripe
        const baseMetadata = toStripeMetadata({
            membership_id: membershipId,
            hubspot_contact_id: hubspotContactId,
            email: formData.email,
            city: formData.city,
            phone: formData.phone,
        });

        // 3) Crea Customer en Stripe
        const customer = await stripe.customers.create({
            email,
            name: fullName,
            metadata: baseMetadata,
        });

        console.log("[CREATE_SESSION] Stripe customer:", customer.id);

        // 4) Crea la sesión de Checkout + FACTURA
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer: customer.id,

            line_items: [
                {
                    price_data: {
                        currency: "mxn",
                        product_data: {
                            name: membership.name,
                            description: membership.description,
                        },
                        unit_amount: membership.amount,
                    },
                    quantity: 1,
                },
            ],

            invoice_creation: {
                enabled: true,
                invoice_data: {
                    description: membership.name,
                    metadata: baseMetadata,
                },
            },

            success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domain}/`,

            client_reference_id: hubspotContactId,

            metadata: baseMetadata,
        });

        console.log("[CREATE_SESSION] Stripe session:", session.id);

        return NextResponse.json({
            checkoutUrl: session.url,
            sessionId: session.id,
        });
    } catch (error: any) {
        console.error("[CREATE_SESSION] Unexpected error:", error?.message || error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error?.message || null,
            },
            { status: 500 }
        );
    }
}