// app/api/debug/hubspot-properties/route.ts
import { NextResponse } from "next/server";

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!;

export async function GET() {
    if (!HUBSPOT_ACCESS_TOKEN) {
        return NextResponse.json(
            { error: "HUBSPOT_ACCESS_TOKEN not configured" },
            { status: 500 }
        );
    }

    try {
        const url = "https://api.hubapi.com/crm/v3/properties/contacts";

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({
                error: "Failed to fetch properties",
                details: error
            }, { status: response.status });
        }

        const data = await response.json();
        const properties = data.results || [];

        // Filtrar solo las propiedades relevantes
        const customProps = properties.filter((p: any) =>
            !p.name.startsWith("hs_") &&
            !p.name.startsWith("hubspot")
        );

        const stripeProps = properties.filter((p: any) =>
            p.name.includes("stripe") ||
            p.name.includes("payment")
        );

        const allCustomNames = customProps.map((p: any) => p.name).sort();
        const stripeNames = stripeProps.map((p: any) => p.name).sort();

        // Campos que necesitamos para el webhook
        const requiredFields = [
            "stripe_customer_id",
            "stripe_session_id",
            "stripe_payment_intent_id",
            "stripe_charge_id",
            "stripe_invoice_id",
            "stripe_receipt_url",
            "stripe_amount",
            "stripe_currency",
            "payment_status",
            "last_payment_date",
        ];

        const existingRequired = requiredFields.filter(field =>
            allCustomNames.includes(field)
        );

        const missingRequired = requiredFields.filter(field =>
            !allCustomNames.includes(field)
        );

        return NextResponse.json({
            summary: {
                total: properties.length,
                custom: customProps.length,
                stripeRelated: stripeProps.length,
                requiredExisting: existingRequired.length,
                requiredMissing: missingRequired.length
            },
            existing: {
                required: existingRequired,
                stripe: stripeNames,
                allCustom: allCustomNames
            },
            missing: {
                required: missingRequired
            },
            details: {
                custom: customProps.map((p: any) => ({
                    name: p.name,
                    label: p.label,
                    type: p.type,
                    fieldType: p.fieldType
                })),
                stripe: stripeProps.map((p: any) => ({
                    name: p.name,
                    label: p.label,
                    type: p.type,
                    fieldType: p.fieldType
                }))
            }
        });

    } catch (error: any) {
        console.error("List properties error:", error);
        return NextResponse.json(
            { error: "Failed to list properties", details: error?.message },
            { status: 500 }
        );
    }
}