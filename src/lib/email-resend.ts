import { Resend } from 'resend';

export async function sendCertificateEmail(opts: {
    to: string;
    fullName: string;
    pdf: Buffer;
    invoiceUrl?: string | null; // 👈 añadimos esta propiedad
}) {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    if (!key || !from) {
        throw new Error(`Missing Resend envs: key=${!!key}, from=${from}`);
    }

    const resend = new Resend(key);
    const { to, fullName, pdf, invoiceUrl } = opts;
    const filename = `Reconocimiento - ${fullName.replace(/[/\\?%*:|"<>]/g, '')}.pdf`;
    const saludo = `Estimado${fullName.trim().endsWith('a') ? 'a' : ''} ${fullName},`;

    const facturaHTML = invoiceUrl
        ? `<p>Puedes descargar tu comprobante de pago aquí:</p>
         <p><a href="${invoiceUrl}" target="_blank">${invoiceUrl}</a></p>`
        : `<p>Si requieres factura, por favor responde este correo con:</p>
         <ul>
           <li>RFC</li>
           <li>Razón social</li>
           <li>Uso de CFDI</li>
           <li>Código postal fiscal</li>
         </ul>`;

    const { data, error } = await resend.emails.send({
        from,
        to,
        subject: 'Tu reconocimiento de membresía',
        html: `
        <p>${saludo}</p>
        <p>Agradecemos que formes parte del equipo <strong>CRIEG</strong>.</p>
        <p>Te adjuntamos tu certificado en este correo.</p>
        ${facturaHTML}
        <br/>
        <p>Saludos,<br/>Equipo CRIEG</p>
        `,
        attachments: [
            { filename, content: pdf.toString('base64') }
        ],
    });

    if (error) throw error;
    return data?.id;
}
