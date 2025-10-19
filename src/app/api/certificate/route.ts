import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { findContactByEmail } from '@/lib/hubspot';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function debugPayload(payload: any) {
    const isProd = process.env.NODE_ENV === 'production';
    return isProd ? { error: 'Failed to generate certificate' } : payload;
}

export async function GET(req: NextRequest) {
    const stage = {
        at: 'init' as
            | 'init'
            | 'params'
            | 'stripe'
            | 'hubspot'
            | 'template_stat'
            | 'template_load'
            | 'pdf_draw'
            | 'pdf_save'
            | 'respond'
    };

    try {
        // 1) Params
        stage.at = 'params';
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
            return NextResponse.json(debugPayload({ stage, error: 'Missing session_id' }), { status: 400 });
        }

        // 2) Stripe
        stage.at = 'stripe';
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const paid =
            session.payment_status === 'paid' ||
            session.payment_status === 'no_payment_required';
        if (!paid) {
            return NextResponse.json(debugPayload({
                stage, error: 'Payment not completed',
                stripeStatus: session.status, paymentStatus: session.payment_status
            }), { status: 403 });
        }

        const email =
            session.customer_details?.email ||
            (session as any).customer_email ||
            null;

        if (!email) {
            return NextResponse.json(debugPayload({ stage, error: 'Email not available in session' }), { status: 400 });
        }


        // 3) HubSpot
        stage.at = 'hubspot';
        const contact = await findContactByEmail(email);
        if (!contact) {
            return NextResponse.json(debugPayload({ stage, error: 'Contact not found by email', email }), { status: 404 });
        }
        const fullName = `${contact.firstname ?? ''} ${contact.lastname ?? ''}`.trim();
        if (!fullName) {
            return NextResponse.json(debugPayload({ stage, error: 'Missing contact name', contact }), { status: 400 });
        }

        // 4) Plantilla PDF: verifica que exista
        stage.at = 'template_stat';
        const templatePath = path.resolve(process.cwd(), 'public', 'cert-template.pdf');
        try {
            await fs.stat(templatePath);
        } catch {
            return NextResponse.json(debugPayload({ stage, error: 'Template not found', templatePath }), { status: 500 });
        }

        // 5) Carga y compone PDF
        stage.at = 'template_load';
        const templateBytes = await fs.readFile(templatePath);

        stage.at = 'pdf_draw';
        const pdfDoc = await PDFDocument.load(templateBytes);
        const page = pdfDoc.getPages()[0];

        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontSize = 24;
        const text = fullName.toUpperCase();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const { width, height } = page.getSize();
        const x = (width - textWidth) / 2;
        const y = height * 0.45;

        const offsetX = -70;

        page.drawText(text, {
            x: (width - textWidth) / 2 + offsetX,
            y,
            size: fontSize,
            font,
            color: rgb(0.043, 0.294, 0.169),
        });

        const footerFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const rightMargin = 24;
        const bottomMargin = 18;
        let footerSize = 12;

        let footerText = `ID: ${contact.id}`;
        if ((contact as any).stripe_session_id) {
            footerText += `  |  Session: ${sessionId}`;
        }

        const maxWidth = width - rightMargin - 24;
        let footerWidth = footerFont.widthOfTextAtSize(footerText, footerSize);
        while (footerWidth > maxWidth && footerSize > 6) {
            footerSize -= 0.5;
            footerWidth = footerFont.widthOfTextAtSize(footerText, footerSize);
        }

        const fx = width - rightMargin - footerWidth;
        const fy = bottomMargin;

        page.drawText(footerText, {
            x: fx,
            y: fy,
            size: footerSize,
            font: footerFont,
            color: rgb(0.2, 0.2, 0.2),
        });

        stage.at = 'pdf_save';

        pdfDoc.setTitle("Reconocimiento");
        pdfDoc.setAuthor("CRIEG / FMRI");
        pdfDoc.setSubject("Reconocimiento oficial de membresía 2025");
        pdfDoc.setProducer("CRIEG Certificate Generator");
        pdfDoc.setCreator("CRIEG Website");
        pdfDoc.setCreationDate(new Date());

        const pdfBytes = await pdfDoc.save();

        // 6) Responder
        stage.at = 'respond';
        const filename = `Reconocimiento - ${fullName.replace(/[/\\?%*:|"<>]/g, '')}.pdf`;
        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-store',
            },
        });
    } catch (err: any) {
        // Log completo en servidor (Vercel o local)
        console.error('Certificate error at stage:', stage.at, err);
        // Respuesta “segura” en prod y detallada en dev
        return NextResponse.json(debugPayload({ stage, error: err?.message || String(err), stack: err?.stack }), { status: 500 });
    }
}

export async function generateCertificateBuffer(opts: {
    fullName: string;
    contactId: string;
    sessionId?: string;
    offsetX?: number;
}) {
    const { fullName, contactId, sessionId, offsetX = -70 } = opts;

    const templatePath = path.resolve(process.cwd(), 'public', 'cert-template.pdf');
    const templateBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 24;
    const text = fullName.toUpperCase();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const { width, height } = page.getSize();

    const x = (width - textWidth) / 2 + offsetX;
    const y = height * 0.45;

    page.drawText(text, {
        x, y, size: fontSize, font,
        color: rgb(0.043, 0.294, 0.169),
    });

    // Footer con IDs (esquina inferior derecha)
    const footerFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const rightMargin = 24;
    const bottomMargin = 18;
    let footerSize = 12;

    let footerText = `ID: ${contactId}`;
    if (sessionId) footerText += `  |  Session: ${sessionId}`;

    const maxWidth = width - rightMargin - 24;
    let footerWidth = footerFont.widthOfTextAtSize(footerText, footerSize);
    while (footerWidth > maxWidth && footerSize > 6) {
        footerSize -= 0.5;
        footerWidth = footerFont.widthOfTextAtSize(footerText, footerSize);
    }
    const fx = width - rightMargin - footerWidth;
    const fy = bottomMargin;

    page.drawText(footerText, {
        x: fx, y: fy, size: footerSize, font: footerFont, color: rgb(0.2, 0.2, 0.2),
    });

    // Metadata
    pdfDoc.setTitle('Reconocimiento');
    pdfDoc.setAuthor('CRIEG / FMRI');
    pdfDoc.setSubject('Reconocimiento oficial de membresía 2025');
    pdfDoc.setProducer('CRIEG Certificate Generator');
    pdfDoc.setCreator('CRIEG Website');
    pdfDoc.setCreationDate(new Date());

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
