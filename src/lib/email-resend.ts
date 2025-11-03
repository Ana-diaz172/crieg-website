// lib/email-resend.ts
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
    const billingLink = billingUrl || "https://crieg-website.vercel.app/billing";

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
