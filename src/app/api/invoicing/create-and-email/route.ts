import { NextResponse } from "next/server";
import { sendInvoiceEmail } from "@/lib/email-resend";

const ALEGRA_EMAIL = process.env.ALEGRA_EMAIL!;
const ALEGRA_API_TOKEN = process.env.ALEGRA_API_TOKEN!;
const ALEGRA_DEFAULT_ITEM_ID = process.env.ALEGRA_DEFAULT_ITEM_ID;
const ALEGRA_DEFAULT_TAX_ID = process.env.ALEGRA_DEFAULT_TAX_ID;

function getAlegraAuthHeader() {
    const base64 = Buffer.from(`${ALEGRA_EMAIL}:${ALEGRA_API_TOKEN}`).toString(
        "base64"
    );
    return `Basic ${base64}`;
}

type InvoiceFormPayload = {
    fullName: string;
    email: string;
    rfc: string;
    businessName: string;
    taxRegime: string;
    cfdiUse: string;
    street: string;
    exteriorNumber: string;
    interiorNumber?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    purchaseId: string; // Stripe ID
};

async function findOrCreateAlegraContact(payload: InvoiceFormPayload) {
    const query = encodeURIComponent(payload.rfc || payload.email);
    const listUrl = `https://api.alegra.com/api/v1/contacts?query=${query}`;

    const listRes = await fetch(listUrl, {
        method: "GET",
        headers: {
            Authorization: getAlegraAuthHeader(),
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    let contacts: any[] = [];
    if (listRes.ok) {
        contacts = await listRes.json();
    }

    if (Array.isArray(contacts) && contacts.length > 0) {
        return contacts[0];
    }

    const addressLine = `${payload.street} ${payload.exteriorNumber}${payload.interiorNumber ? ` Int. ${payload.interiorNumber}` : ""
        }`;

    const createBody = {
        name: payload.businessName || payload.fullName,
        identification: payload.rfc,
        email: payload.email,
        address: {
            address: addressLine,
            city: payload.city,
            state: payload.state,
            country: payload.country,
            zipCode: payload.zipCode,
        },
    };

    const createRes = await fetch("https://api.alegra.com/api/v1/contacts", {
        method: "POST",
        headers: {
            Authorization: getAlegraAuthHeader(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(createBody),
    });

    if (!createRes.ok) {
        const errorText = await createRes.text();
        throw new Error(`Error creando contacto en Alegra: ${errorText}`);
    }

    const contactData = await createRes.json();
    return contactData;
}

async function createSimpleAlegraInvoice(params: {
    contactId: number;
    amount: number;
    currency: string;
    description: string;
    reference: string;
}) {
    const today = new Date().toISOString().slice(0, 10);

    const items = [
        {
            ...(ALEGRA_DEFAULT_ITEM_ID
                ? { id: Number(ALEGRA_DEFAULT_ITEM_ID) }
                : { name: params.description || "Servicio" }),
            price: params.amount,
            quantity: 1,
            ...(ALEGRA_DEFAULT_TAX_ID
                ? { tax: [{ id: Number(ALEGRA_DEFAULT_TAX_ID) }] }
                : {}),
        },
    ];

    const body = {
        date: today,
        dueDate: today,
        client: {
            id: params.contactId,
        },
        items,
        currency: params.currency.toUpperCase(),
        reference: params.reference,
        observations: "Factura generada automáticamente desde el portal.",
        status: "open",
    };

    const res = await fetch("https://api.alegra.com/api/v1/invoices", {
        method: "POST",
        headers: {
            Authorization: getAlegraAuthHeader(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            `Error creando factura en Alegra: ${data?.message || JSON.stringify(data)
            }`
        );
    }

    return data;
}

export async function POST(req: Request) {
    try {
        if (!ALEGRA_EMAIL || !ALEGRA_API_TOKEN) {
            return NextResponse.json(
                {
                    error:
                        "Faltan variables de entorno ALEGRA_EMAIL o ALEGRA_API_TOKEN.",
                },
                { status: 500 }
            );
        }

        const body = (await req.json()) as InvoiceFormPayload;

        const {
            fullName,
            email,
            rfc,
            businessName,
            taxRegime,
            cfdiUse,
            street,
            exteriorNumber,
            interiorNumber,
            neighborhood,
            city,
            state,
            zipCode,
            country,
            purchaseId,
        } = body;

        if (!purchaseId || !email || !rfc || !businessName) {
            return NextResponse.json(
                { error: "Faltan datos obligatorios para generar la factura." },
                { status: 400 }
            );
        }

        // 1) Contacto en Alegra
        const contact = await findOrCreateAlegraContact({
            fullName,
            email,
            rfc,
            businessName,
            taxRegime,
            cfdiUse,
            street,
            exteriorNumber,
            interiorNumber,
            neighborhood,
            city,
            state,
            zipCode,
            country,
            purchaseId,
        });

        // 2) Crear factura (monto fijo de prueba por ahora)
        const amount = 1000; // TODO: luego lo cambiamos por monto real de Stripe
        const currency = "MXN";
        const description = "Servicio adquirido en plataforma";
        const reference = `Compra ${purchaseId}`;

        const invoice = await createSimpleAlegraInvoice({
            contactId: contact.id,
            amount,
            currency,
            description,
            reference,
        });

        const invoiceNumber = invoice.number ?? String(invoice.id);

        // 3) Mandar correo al usuario con los datos de la factura
        await sendInvoiceEmail({
            to: email,
            fullName,
            invoiceNumber,
            invoiceId: invoice.id,
            purchaseId,
            billingPortalUrl: process.env.NEXT_PUBLIC_BILLING_PORTAL_URL,
        });

        return NextResponse.json(
            {
                success: true,
                invoiceId: invoice.id,
                invoiceNumber,
                contactId: contact.id,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Alegra invoice error:", error);
        return NextResponse.json(
            {
                error: error.message || "Error interno al generar la factura.",
            },
            { status: 500 }
        );
    }
}
