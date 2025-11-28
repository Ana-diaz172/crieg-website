import { NextResponse } from "next/server";

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN!;

interface PropertyDefinition {
    name: string;
    label: string;
    type: string;
    fieldType: string;
    groupName: string;
    description?: string;
    options?: Array<{ label: string; value: string; displayOrder: number }>;
}

const properties: PropertyDefinition[] = [
    {
        name: "stripe_customer_id",
        label: "Stripe Customer ID",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation",
        description: "ID del cliente en Stripe"
    },
    {
        name: "stripe_session_id",
        label: "Stripe Session ID",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation",
        description: "ID de la sesión de checkout en Stripe"
    },
    {
        name: "stripe_payment_intent_id",
        label: "Stripe Payment Intent ID",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation",
        description: "ID del payment intent en Stripe"
    },
    {
        name: "stripe_charge_id",
        label: "Stripe Charge ID",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation",
        description: "ID del cargo en Stripe"
    },
    {
        name: "stripe_invoice_id",
        label: "Stripe Invoice ID",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation",
        description: "ID de la factura en Stripe"
    },
    {
        name: "stripe_receipt_url",
        label: "Stripe Receipt URL",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation",
        description: "URL del recibo de pago en Stripe"
    },
    {
        name: "stripe_amount",
        label: "Stripe Amount",
        type: "number",
        fieldType: "number",
        groupName: "contactinformation",
        description: "Monto pagado en centavos"
    },
    {
        name: "stripe_currency",
        label: "Stripe Currency",
        type: "string",
        fieldType: "text",
        groupName: "contactinformation",
        description: "Moneda del pago (ej: mxn)"
    },
    {
        name: "payment_status",
        label: "Payment Status",
        type: "enumeration",
        fieldType: "select",
        groupName: "contactinformation",
        description: "Estado del pago",
        options: [
            { label: "Pending", value: "pending", displayOrder: 0 },
            { label: "Completed", value: "completed", displayOrder: 1 },
            { label: "Failed", value: "failed", displayOrder: 2 }
        ]
    },
    {
        name: "last_payment_date",
        label: "Last Payment Date",
        type: "datetime",
        fieldType: "date",
        groupName: "contactinformation",
        description: "Fecha del último pago"
    }
];

async function createProperty(property: PropertyDefinition) {
    const url = "https://api.hubapi.com/crm/v3/properties/contacts";

    const body: any = {
        name: property.name,
        label: property.label,
        type: property.type,
        fieldType: property.fieldType,
        groupName: property.groupName,
    };

    if (property.description) {
        body.description = property.description;
    }

    if (property.options) {
        body.options = property.options;
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        // Si ya existe, no es error
        if (data.category === "CONFLICT") {
            return { success: true, exists: true, name: property.name };
        }
        throw new Error(`Failed to create ${property.name}: ${data.message}`);
    }

    return { success: true, created: true, name: property.name, data };
}

export async function POST() {
    if (!HUBSPOT_ACCESS_TOKEN) {
        return NextResponse.json(
            { error: "HUBSPOT_ACCESS_TOKEN not configured" },
            { status: 500 }
        );
    }

    try {
        const results = [];

        for (const property of properties) {
            try {
                const result = await createProperty(property);
                results.push(result);
                console.log(`✓ ${property.name}:`, result.created ? "created" : "already exists");
            } catch (error: any) {
                console.error(`✗ ${property.name}:`, error.message);
                results.push({
                    success: false,
                    name: property.name,
                    error: error.message
                });
            }
        }

        const created = results.filter(r => r.success && (r as any).created === true).length;
        const existed = results.filter(r => r.success && (r as any).exists === true).length;
        const failed = results.filter(r => !r.success).length;

        return NextResponse.json({
            success: failed === 0,
            summary: {
                total: properties.length,
                created,
                existed,
                failed
            },
            results
        });

    } catch (error: any) {
        console.error("Setup error:", error);
        return NextResponse.json(
            { error: "Setup failed", details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Use POST to create HubSpot properties",
        properties: properties.map(p => ({
            name: p.name,
            label: p.label,
            type: p.type
        }))
    });
}