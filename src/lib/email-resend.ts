import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendCertificateWithResend(opts: {
    to: string;
    fullName: string;
    pdfBuffer: Buffer;
}) {
    const { to, fullName, pdfBuffer } = opts;
    const from = process.env.RESEND_FROM!;

    const filename = `Reconocimiento - ${fullName.replace(/[/\\?%*:|"<>]/g, '')}.pdf`;

    const { error } = await resend.emails.send({
        from,
        to,
        subject: 'Tu reconocimiento de membresía',
        html: `<p>Hola <strong>${fullName}</strong>, adjuntamos tu reconocimiento en PDF.</p>`,
        attachments: [
            {
                filename,
                content: pdfBuffer.toString('base64'), // Resend espera base64
            },
        ],
    });

    if (error) throw error;
}
