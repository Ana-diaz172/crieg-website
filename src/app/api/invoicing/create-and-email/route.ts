import { NextResponse } from "next/server";
import { sendInvoiceEmail } from "@/lib/email-resend";

const ALEGRA_EMAIL = process.env.ALEGRA_EMAIL!;
const ALEGRA_API_TOKEN = process.env.ALEGRA_API_TOKEN!;
const ALEGRA_DEFAULT_ITEM_ID = process.env.ALEGRA_DEFAULT_ITEM_ID;
const ALEGRA_DEFAULT_TAX_ID = process.env.ALEGRA_DEFAULT_TAX_ID;

const ALEGRA_BASE_URL = "https://api.alegra.com/api/v1";

function getAlegraAuthHeader() {
  const base64 = Buffer.from(`${ALEGRA_EMAIL}:${ALEGRA_API_TOKEN}`).toString(
    "base64",
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
  purchaseId: string;
  paymentMethod: string; // credit-card | debit-card | ...
};

type HubspotStripeContact = {
  stripe_amount?: string;
  stripe_currency?: string;
  stripe_invoice_id?: string;
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  last_payment_date?: string;
};

async function getStripeInfoFromHubspotByEmail(
  email: string,
): Promise<HubspotStripeContact> {
  const base =
    process.env.NEXT_PUBLIC_DOMAIN ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (!base) {
    throw new Error(
      "No se pudo resolver base URL para llamar a /api/debug/contact",
    );
  }

  const url = `${base.replace(
    /\/$/,
    "",
  )}/api/debug/contact?email=${encodeURIComponent(email)}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Error llamando a /api/debug/contact: ${res.status} - ${text}`,
    );
  }

  const json = await res.json();
  if (!json.found || !json.contact) {
    throw new Error("No se encontró contacto en HubSpot para ese email.");
  }

  return json.contact as HubspotStripeContact;
}

// Agregar esta función de mapeo al inicio del archivo, después de las constantes
function mapSATRegimeToAlegra(satCode: string): string {
  const regimeMap: Record<string, string> = {
    "601": "GENERAL_REGIME_OF_MORAL_PEOPLE_LAW",
    "603": "REGIME_OF_MORAL_PEOPLE_NOT_PROFIT",
    "605": "SALARIED_REGIME",
    "612": "BUSINESS_ACTIVITIES_REGIME",
    "626": "REGIME_OF_TRUST",
    "616": "SIMPLIFIED_REGIME",
  };

  return regimeMap[satCode] || "SIMPLIFIED_REGIME";
}

async function findOrCreateAlegraContact(payload: InvoiceFormPayload) {
  const query = encodeURIComponent(payload.rfc || payload.email);
  const listUrl = `${ALEGRA_BASE_URL}/contacts?query=${query}`;

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

  const name = (payload.businessName || payload.fullName).trim();
  const rfc = payload.rfc.trim();
  const email = payload.email.trim();

  // Mapear el régimen SAT al formato de Alegra
  const alegraRegime = mapSATRegimeToAlegra(payload.taxRegime);
  
  if (Array.isArray(contacts) && contacts.length > 0) {
    const existing = contacts[0];
    

    // Actualizar datos fiscales para evitar errores SAT
    await fetch(`${ALEGRA_BASE_URL}/contacts/${existing.id}`, {
      method: "PUT",
      headers: {
        Authorization: getAlegraAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        identification: rfc,
        regime: alegraRegime,
        regimeObject: [alegraRegime],
        cfdiUse: payload.cfdiUse,
        address: {
          street: payload.street,
          exteriorNumber: payload.exteriorNumber,
          interiorNumber: payload.interiorNumber || "",
          colony: payload.neighborhood,
          municipality: payload.city,
          state: payload.state,
          zipCode: payload.zipCode,
          country: "MEX",
        },
      }),
    });

    return existing;
  }

  const createBody = {
    name,
    identification: rfc,
    thirdType: "NATIONAL",
    email,
    cfdiUse: payload.cfdiUse,
    regime: alegraRegime,
    regimeObject: [alegraRegime],
    paymentMethod: payload.paymentMethod,
    address: {
      street: payload.street,
      exteriorNumber: payload.exteriorNumber,
      interiorNumber: payload.interiorNumber || "",
      colony: payload.neighborhood,
      municipality: payload.city,
      state: payload.state,
      zipCode: payload.zipCode,
      country: "MEX",
    },
    type: ["client"],
    statementAttached: "no",
  };

  const createRes = await fetch(`${ALEGRA_BASE_URL}/contacts`, {
    method: "POST",
    headers: {
      Authorization: getAlegraAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createBody),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    console.error("❌ Error Respuesta Alegra (contact):", errorText);
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
  paymentMethod: string;
  cfdiUse: string;
  taxRegime: string;
}) {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Mexico_City",
  }).format(new Date());

  if (!ALEGRA_DEFAULT_ITEM_ID) {
    throw new Error(
      "Configuración incompleta: falta ALEGRA_DEFAULT_ITEM_ID en las variables de entorno.",
    );
  }

  const itemId = Number(ALEGRA_DEFAULT_ITEM_ID);
  if (!Number.isFinite(itemId)) {
    throw new Error(
      `  Configuración inválida: ALEGRA_DEFAULT_ITEM_ID ('${ALEGRA_DEFAULT_ITEM_ID}') no es un número.`,
    );
  }

  const items = [
    {
      id: itemId,
      price: params.amount,
      quantity: 1,
      productKey: "80141600",
      ...(ALEGRA_DEFAULT_TAX_ID
        ? { tax: [{ id: Number(ALEGRA_DEFAULT_TAX_ID) }] }
        : {}),
    },
  ];

  const accountNumber = "Stripe-0000";

  const body = {
    date: today,
    dueDate: today,
    client: { id: params.contactId },
    items,
    reference: params.reference,
    status: "open",
    paymentMethod: params.paymentMethod,
    paymentType: "PUE",
    accountNumber,
    cfdiUse: params.cfdiUse,
    regimeClient: params.taxRegime,
    stamp: {
      generateStamp: true,
    },
  };

  const res = await fetch(`${ALEGRA_BASE_URL}/invoices`, {
    method: "POST",
    headers: {
      Authorization: getAlegraAuthHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ ALEGRA STATUS:", res.status);
    console.error("❌ ALEGRA RESPONSE:", data);

    const errorCode = data?.error?.code;
    const errorMessage =
      data?.error?.message ||
      data?.message ||
      "No se pudo generar la factura en Alegra.";

    // Mensaje más amigable si es error SAT 3051
    if (errorCode === 3051) {
      throw new Error(
        "El nombre no coincide con el RFC registrado ante el SAT. Verifica exactamente como aparece en tu constancia de situación fiscal.",
      );
    }

    throw new Error(errorMessage);
  }

  return data;
}

export async function POST(req: Request) {
  try {
    if (!ALEGRA_EMAIL || !ALEGRA_API_TOKEN) {
      return NextResponse.json(
        { error: "Faltan variables de entorno ALEGRA." },
        { status: 500 },
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
      purchaseId,
      paymentMethod,
    } = body;

    if (!purchaseId || !email || !rfc || !businessName) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios." },
        { status: 400 },
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "La forma de pago es obligatoria." },
        { status: 400 },
      );
    }

    const stripeInfo = await getStripeInfoFromHubspotByEmail(email);
    const stripeAmountCents = Number(stripeInfo.stripe_amount ?? "0");

    if (!Number.isFinite(stripeAmountCents) || stripeAmountCents <= 0) {
      return NextResponse.json(
        { error: "Monto inválido en HubSpot." },
        { status: 400 },
      );
    }

    const amount = stripeAmountCents / 100;
    const currency =
      (stripeInfo.stripe_currency || "mxn").toUpperCase() || "MXN";
    const reference =
      stripeInfo.stripe_invoice_id ||
      stripeInfo.stripe_payment_intent_id ||
      `Compra ${purchaseId}`;

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
      purchaseId,
      paymentMethod,
    });

    const invoice = await createSimpleAlegraInvoice({
      contactId: contact.id,
      amount,
      currency,
      description: "Servicio adquirido en plataforma",
      reference,
      paymentMethod,
      cfdiUse,
      taxRegime,
    });

    const invoiceNumber = invoice.number ?? String(invoice.id);
    await sendAlegraInvoiceEmail({ invoiceId: invoice.id, emails: [email] });

    /* await sendInvoiceEmail({
      to: email,
      fullName,
      invoiceNumber,
      invoiceId: invoice.id,
      purchaseId,
      billingPortalUrl: process.env.NEXT_PUBLIC_BILLING_PORTAL_URL,
    }); */

    return NextResponse.json(
      { success: true, invoiceId: invoice.id, invoiceNumber },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Alegra invoice error:", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "No se pudo generar la factura. Verifica tus datos fiscales.",
      },
      { status: 400 },
    );
  }
}

async function sendAlegraInvoiceEmail(params: {
  invoiceId: number | string;
  emails: string[]; // destinatarios
}) {
  const url = `${ALEGRA_BASE_URL}/invoices/${encodeURIComponent(
    String(params.invoiceId),
  )}/email`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: getAlegraAuthHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      emails: params.emails,
    }),
  });

  const raw = await res.text();
  let data: any = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = { raw };
  }

  if (!res.ok) {
    console.error("❌ ALEGRA EMAIL STATUS:", res.status);
    console.error("❌ ALEGRA EMAIL RESPONSE:", data);
    throw new Error(
      `Error enviando email de factura en Alegra (${res.status}): ${
        data?.message || data?.error || data?.raw || JSON.stringify(data)
      }`,
    );
  }

  return data;
}
