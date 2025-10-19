import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendCertificateEmail(opts: {
    to: string;
    fullName: string;
    pdf: Buffer;
}) {
    const from = process.env.RESEND_FROM!; // ej: CRIEG <no-reply@crieg.com.mx>
    const { to, fullName, pdf } = opts;

    const filename = `Reconocimiento - ${fullName.replace(/[/\\?%*:|"<>]/g, '')}.pdf`;

    const saludo = `Estimado${fullName.trim().endsWith('a') ? 'a' : ''}, ${fullName}:`; // opcional: género básico

    const { data, error } = await resend.emails.send({
        from,
        to,
        subject: 'Tu reconocimiento de membresía',
        // Texto plano (mejora entregabilidad)
        text: `${saludo}

Agradecemos que formes parte del equipo CRIEG; te adjuntamos tu certificado en este email.

Saludos,
Equipo CRIEG
`,
        // HTML (lo que verán la mayoría)
        html: `
      <p>${saludo}</p>
      <p>Agreadecemos que formes parte del equipo <strong>CRIEG</strong>; te adjuntamos tu certificado en este email.</p>
      <p>Saludos,<br/>Equipo CRIEG</p>
    `,
        attachments: [
            {
                filename,
                content: pdf.toString('base64'), // Resend espera base64
            },
        ],
    });

    if (error) throw error;
    return data?.id;
}
