import { Resend } from "resend";

export async function sendContactEmail(opts: {
    name: string;
    email: string;
    phone?: string;
    message: string;
}) {
    const key = process.env.RESEND_API_CONTACT;
    const from = process.env.RESEND_FROM;
    const contactTo = process.env.RESEND_CONTACT_TO || "contacto@crieg.com.mx";

    if (!key || !from) {
        throw new Error(`Missing Resend envs: key=${!!key}, from=${from}`);
    }

    const resend = new Resend(key);
    const { name, email, phone, message } = opts;

    const safePhone = phone || "No proporcionado";

    const textBody = `Nueva consulta recibida

Datos del contacto:
- Nombre: ${name}
- Email: ${email}
- Teléfono: ${safePhone}

Mensaje:
${message}

---
Este mensaje fue enviado desde el formulario de contacto de CRIEG.
`;

    const htmlBody = `
  <h2>Nueva consulta recibida</h2>
  
  <h3>Datos del contacto</h3>
  <ul>
    <li><strong>Nombre:</strong> ${name}</li>
    <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
    <li><strong>Teléfono:</strong> ${safePhone}</li>
  </ul>

  <h3>Mensaje</h3>
  <p style="padding:12px;background:#f7f7f7;border-left:3px solid #0b4b2b;white-space:pre-wrap;">
${message}
  </p>

  <hr style="margin-top:24px;border:none;border-top:1px solid #ddd;"/>
  <p style="color:#666;font-size:12px;">
    Este mensaje fue enviado desde el formulario de contacto de CRIEG.
  </p>
`;

    const { data, error } = await resend.emails.send({
        from,
        to: contactTo,
        replyTo: email,
        subject: `Contacto: ${name}`,
        text: textBody,
        html: htmlBody,
    });

    if (error) throw error;

    await sendContactConfirmation({
        to: email,
        name,
        resend,
        from,
    });

    return data?.id;
}

async function sendContactConfirmation(opts: {
    to: string;
    name: string;
    resend: Resend;
    from: string;
}) {
    const { to, name, resend, from } = opts;

    const saludo = `Estimado${name.trim().endsWith("a") ? "a" : ""} ${name},`;

    const textBody = `${saludo}

Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo a la brevedad posible.

Nuestro equipo revisará tu consulta y te responderá en un plazo máximo de 48 horas hábiles.

Si tienes alguna pregunta urgente, puedes comunicarte con nosotros:
- Email: contacto@crieg.com.mx
- Teléfono: +52 477 590 70 50

Saludos,
Equipo CRIEG
`;

    const htmlBody = `
  <p>${saludo}</p>
  <p>Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo a la brevedad posible.</p>
  
  <p>Nuestro equipo revisará tu consulta y te responderá en un plazo máximo de <strong>48 horas hábiles</strong>.</p>

  <h3>¿Necesitas ayuda urgente?</h3>
  <p>Puedes comunicarte con nosotros:</p>
  <ul>
    <li><strong>Email:</strong> <a href="mailto:contacto@crieg.com.mx">contacto@crieg.com.mx</a></li>
    <li><strong>Teléfono:</strong> <a href="tel:+524775907050">+52 477 590 70 50</a></li>
  </ul>

  <p>Saludos,<br/>Equipo CRIEG</p>
`;

    try {
        await resend.emails.send({
            from,
            to,
            subject: "Hemos recibido tu mensaje - CRIEG",
            text: textBody,
            html: htmlBody,
        });
    } catch (error) {
        console.error("Error sending confirmation email:", error);
    }
}