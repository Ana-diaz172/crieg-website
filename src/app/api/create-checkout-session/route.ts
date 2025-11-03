import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrUpdateContact } from "@/lib/hubspot";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const memberships = {
    "crieg-medicos": { name: "Membresía Médicos Radiólogos CRIEG", description: "...", amount: 260000 },
    "crieg-residentes": { name: "Membresía Residentes CRIEG", description: "...", amount: 60000 },
    fmri: { name: "Membresía FMRI", description: "...", amount: 400000 },
} as const;

type IncomingFormData = {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    membership_type: "CRIEG" | "FMRI";
    city: string;
    professional_type: "medico" | "residente";
    residency_location?: string;
    current_residency_year?: string;
    head_professor_name?: string;
};

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
            return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 });
        }

        const bodyText = await request.text();
        if (!bodyText.trim()) {
            return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
        }

        let membershipId: keyof typeof memberships, formData: IncomingFormData;
        try {
            const body = JSON.parse(bodyText);
            membershipId = body.membershipId;
            formData = body.formData as IncomingFormData;
        } catch {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        if (!membershipId) return NextResponse.json({ error: "membershipId is required" }, { status: 400 });
        const membership = memberships[membershipId];
        if (!membership) return NextResponse.json({ error: "Invalid membership" }, { status: 400 });
        if (!formData?.email) return NextResponse.json({ error: "formData.email is required" }, { status: 400 });

        // 1) Ensure HubSpot contact first (get contactId as bridge)
        const contactRes = await createOrUpdateContact(
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
            undefined // no need to pass session yet
        );

        if (!contactRes?.success || !contactRes?.contactId) {
            return NextResponse.json({ error: "Failed to create/ensure HubSpot contact" }, { status: 500 });
        }
        const hubspotContactId = contactRes.contactId;

        const domain =
            process.env.NEXT_PUBLIC_DOMAIN ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

        // 2) Create/ensure Stripe Customer for better reporting
        const customer = await stripe.customers.create({
            email: formData.email,
            name: `${formData.firstname} ${formData.lastname}`.trim(),
            metadata: {
                hubspot_contact_id: hubspotContactId,
            },
        });

        // 3) Create checkout session (attach HubSpot ID as client_reference_id + metadata)
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer: customer.id,
            line_items: [
                {
                    price_data: {
                        currency: "mxn",
                        product_data: { name: membership.name, description: membership.description },
                        unit_amount: membership.amount,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domain}/`,
            client_reference_id: hubspotContactId,
            metadata: {
                hubspot_contact_id: hubspotContactId,
                membershipId: membershipId,
                professional_type: formData.professional_type || "",
            },
        });

        return NextResponse.json({ checkoutUrl: session.url, sessionId: session.id });
    } catch (error) {
        console.error("[CREATE_CHECKOUT_SESSION] error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
