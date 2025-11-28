import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { loadCertTemplate } from '@/lib/load-template';
import { sendCertificateEmail } from '@/lib/email-resend';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { to, fullName = 'Miembro', contactId = 'TEST-ID' } = await req.json();

        if (!to) return NextResponse.json({ ok: false, error: 'to required' }, { status: 400 });

        const templateBytes = await loadCertTemplate(req);

        const pdfDoc = await PDFDocument.load(templateBytes);
        const page = pdfDoc.getPages()[0];

        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontSize = 24;
        const text = fullName.toUpperCase();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const { width, height } = page.getSize();

        const x = (width - textWidth) / 2 - 70;
        const y = height * 0.45;

        page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.043, 0.294, 0.169) });

        const footerFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const footerText = `ID: ${contactId}  |  Session: TEST`;
        const fw = footerFont.widthOfTextAtSize(footerText, 12);
        page.drawText(footerText, { x: width - 24 - fw, y: 18, size: 12, font: footerFont, color: rgb(0.2, 0.2, 0.2) });

        const pdfBytes = await pdfDoc.save();

        const id = await sendCertificateEmail({ to, fullName, pdf: Buffer.from(pdfBytes) });

        return NextResponse.json({ ok: true, id });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
    }
}
