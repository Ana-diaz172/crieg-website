import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { findContactByEmail } from '@/lib/hubspot';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type GenerateOptions = {
    fullName: string;
    contactId: string;
    sessionId?: string;
    offsetX?: number;
    baseUrl?: string;
};

function debugPayload(payload: any) {
    const isProd = process.env.NODE_ENV === 'production';
    return isProd ? { error: 'Failed to generate certificate' } : payload;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const stage = {
        at: 'init' as
            | 'init'
            | 'params'
            | 'stripe'
            | 'hubspot'
            | 'pdf_gen'
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

        stage.at = 'pdf_gen';
        const baseUrl = `${req.nextUrl.protocol}//${req.headers.get('host')}`;
        const pdf = await generateCertificateBuffer({
            fullName,
            contactId: contact.id,
            sessionId,
            offsetX: -70,
            baseUrl, 
        });

        stage.at = 'respond';
        const filename = `Certificado - ${fullName.replace(/[/\\?%*:|"<>]/g, '')}.pdf`;
        return new NextResponse(new Uint8Array(pdf), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-store',
            },
        });
    } catch (err: any) {
        console.error('Certificate error at stage:', stage.at, err);
        return NextResponse.json(debugPayload({ stage, error: err?.message || String(err), stack: err?.stack }), { status: 500 });
    }
}

export async function generateCertificateBuffer(opts: GenerateOptions): Promise<Buffer> {
    const { fullName, contactId, sessionId, offsetX = -70, baseUrl } = opts;

    const isVercel = !!process.env.VERCEL;
    let templateBytes: Uint8Array;

    if (!isVercel) {
        const templatePath = path.resolve(process.cwd(), 'public', 'cert-template.pdf');
        const buf = await fs.readFile(templatePath);
        templateBytes = new Uint8Array(buf);
    } else {
        const base =
            baseUrl ||
            process.env.NEXT_PUBLIC_DOMAIN ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

        if (!base) {
            throw new Error('No puedo resolver baseUrl para cargar /cert-template.pdf en producción');
        }
        const url = `${base.replace(/\/$/, '')}/cert-template.pdf`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Error cargando plantilla (${res.status})`);
        templateBytes = new Uint8Array(await res.arrayBuffer());
    }

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

    const footerFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const rightMargin = 24;
    const bottomMargin = 18;
    let footerSize = 12;

    let footerText = `ID: ${contactId}`;
    // if (sessionId) footerText += `  |  Session: ${sessionId}`;

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

    pdfDoc.setTitle(`Certificado - ${fullName}`);
    pdfDoc.setAuthor('CRIEG / FMRI');
    pdfDoc.setSubject('Certificado oficial de membresía 2026');
    pdfDoc.setProducer('CRIEG Certificate Generator');
    pdfDoc.setCreator('CRIEG Website');
    pdfDoc.setCreationDate(new Date());

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
