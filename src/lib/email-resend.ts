import { Resend } from "resend";

export async function sendCertificateEmail(opts: {
  to: string;
  fullName: string;
  pdf: Buffer;
  invoiceId?: string | null;
  billingUrl?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) {
    throw new Error(`Missing Resend envs: key=${!!key}, from=${from}`);
  }

  const resend = new Resend(key);
  const { to, fullName, pdf, invoiceId, billingUrl } = opts;

  const filename = `Reconocimiento - ${fullName.replace(/[/\\?%*:|"<>]/g, "")}.pdf`;
  const saludo = `Estimado${fullName.trim().endsWith("a") ? "a" : ""} ${fullName},`;

  const safeInvoice = invoiceId || "—";
  const billingLink = billingUrl || "https://crieg-website.vercel.app/invoice";

  const textBody = `${saludo}

Gracias por formar parte del equipo CRIEG. Te adjuntamos tu certificado en este correo.

Datos para facturar en línea:
- Invoice ID: ${safeInvoice}
- Portal de facturación: ${billingLink}

Si necesitas apoyo, responde a este correo.

Saludos,
Equipo CRIEG
`;

  const htmlBody = `
  <p>${saludo}</p>
  <p>Gracias por formar parte del equipo <strong>CRIEG</strong>. Te adjuntamos tu certificado en este correo.</p>

  <h3>Datos para facturar en línea</h3>
  <p>
    <strong>Invoice ID:</strong>
    <code style="padding:2px 6px;border:1px solid #ddd;border-radius:4px;background:#f7f7f7;">
      ${safeInvoice}
    </code>
  </p>
  <p>
    <a href="${billingLink}" target="_blank" rel="noopener"
       style="display:inline-block;padding:10px 16px;border-radius:8px;border:1px solid #0b4b2b;text-decoration:none;">
      Ir al portal de facturación
    </a>
  </p>

  <p>Si necesitas apoyo, responde a este correo.</p>
  <p>Saludos,<br/>Equipo CRIEG</p>
`;

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Tu reconocimiento de membresía",
    text: textBody,
    html: htmlBody,
    attachments: [{ filename, content: pdf.toString("base64") }],
  });

  if (error) throw error;
  return data?.id;
}

/**
 * Send invoice email to user.
 * If you pass pdf, it will be attached; otherwise only links and IDs are sent.
 */
export async function sendInvoiceEmail(opts: {
  to: string;
  fullName: string;
  invoiceNumber: string | number;
  invoiceId: string | number;
  purchaseId?: string; // Stripe session/payment id
  billingPortalUrl?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) {
    throw new Error(`Missing Resend envs: key=${!!key}, from=${from}`);
  }

  const resend = new Resend(key);
  const { to, fullName, invoiceNumber, invoiceId, purchaseId, billingPortalUrl } = opts;

  const saludo = `Estimado${fullName.trim().endsWith("a") ? "a" : ""} ${fullName},`;
  const safeInvoiceNumber = String(invoiceNumber);
  const safePurchaseId = purchaseId || "—";
  const portalUrl =
    billingPortalUrl || process.env.NEXT_PUBLIC_BILLING_PORTAL_URL || "#";

  const textBody = `${saludo}

Te confirmamos que tu factura ha sido generada correctamente.

Datos de la factura:
- Número de factura: ${safeInvoiceNumber}
- ID interno (Alegra): ${invoiceId}
- ID de compra (Stripe): ${safePurchaseId}

Puedes consultar o gestionar tu facturación en:
${portalUrl}

Si necesitas apoyo o una corrección, responde directamente a este correo.

Saludos,
Equipo CRIEG
`;

  const htmlBody = `
  <p>${saludo}</p>
  <p>Te confirmamos que tu factura ha sido generada correctamente.</p>

  <h3>Datos de la factura</h3>
  <ul>
    <li><strong>Número de factura:</strong> ${safeInvoiceNumber}</li>
    <li><strong>ID interno (Alegra):</strong> ${invoiceId}</li>
    <li><strong>ID de compra (Stripe):</strong> ${safePurchaseId}</li>
  </ul>

  <p>Puedes consultar o gestionar tu facturación en:</p>
  <p>
    <a href="${portalUrl}" target="_blank" rel="noopener"
       style="display:inline-block;margin-top:4px;padding:10px 16px;border-radius:8px;border:1px solid #0b4b2b;text-decoration:none;">
      Ir al portal de facturación
    </a>
  </p>

  <p>Si necesitas apoyo o una corrección, responde directamente a este correo.</p>
  <p>Saludos,<br/>Equipo CRIEG</p>
`;

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: `Tu factura ${safeInvoiceNumber}`,
    text: textBody,
    html: htmlBody,
  });

  if (error) throw error;
  return data?.id;
}

export async function sendFmriEmail(opts: {
  to: string;
  fullName: string;
  membershipId: string;
  invoiceId?: string | null;
  amount?: number | null;
  currency?: string | null;
  billingUrl?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) {
    throw new Error(`Missing Resend envs: key=${!!key}, from=${from}`);
  }

  const resend = new Resend(key);
  const { to, fullName, membershipId, invoiceId, amount, currency, billingUrl } = opts;

  const saludo = `Estimado${fullName.trim().endsWith("a") ? "a" : ""} ${fullName},`;
  const safeInvoice = invoiceId || "—";
  const billingLink =
    billingUrl || process.env.NEXT_PUBLIC_BILLING_PORTAL_URL || "#";

  const formattedAmount =
    typeof amount === "number"
      ? (amount / 100).toLocaleString("es-MX", {
        style: "currency",
        currency: (currency || "mxn").toUpperCase(),
      })
      : "—";

  const textBody = `${saludo}

Gracias por completar tu proceso de membresía FMRI (${membershipId}).

Datos de tu pago:
- Monto: ${formattedAmount}
- Invoice ID (Stripe/Alegra): ${safeInvoice}

Puedes consultar o gestionar tu facturación en:
${billingLink}

Si necesitas apoyo, responde a este correo.

Saludos,
Equipo CRIEG
`;

  const htmlBody = `
  <p>${saludo}</p>
  <p>Gracias por completar tu proceso de membresía <strong>FMRI</strong> (<code>${membershipId}</code>).</p>

  <h3>Datos de tu pago</h3>
  <ul>
    <li><strong>Monto:</strong> ${formattedAmount}</li>
    <li><strong>Invoice ID (Stripe/Alegra):</strong> ${safeInvoice}</li>
  </ul>

  <p>Puedes consultar o gestionar tu facturación en:</p>
  <p>
    <a href="${billingLink}" target="_blank" rel="noopener"
       style="display:inline-block;margin-top:4px;padding:10px 16px;border-radius:8px;border:1px solid #0b4b2b;text-decoration:none;">
      Ir al portal de facturación
    </a>
  </p>

  <p>Si necesitas apoyo, responde a este correo.</p>
  <p>Saludos,<br/>Equipo CRIEG</p>
`;

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Confirmación de membresía FMRI",
    text: textBody,
    html: htmlBody,
  });

  if (error) throw error;
  return data?.id;
}