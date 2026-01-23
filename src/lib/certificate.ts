import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

type GenerateOptions = {
    fullName: string;
    contactId: string;
    sessionId?: string;
    offsetX?: number;
    baseUrl?: string;
};

export async function generateCertificateBuffer(opts: GenerateOptions): Promise<Buffer> {
    const { fullName, contactId, sessionId, offsetX = -70, baseUrl } = opts;

    const isVercel = !!process.env.VERCEL;
    let templateBytes: Uint8Array;

    if (!isVercel) {
        // Local (FS)
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
    pdfDoc.setCreationDate(new Date());
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
    let footerSize = 10;

    let footerText = `${contactId}`;

    page.drawText(`GEN ${Date.now()}`, {
  x: 24,
  y: 24,
  size: 8,
  font: footerFont,
  color: rgb(0.6, 0.6, 0.6),
});


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

    pdfDoc.setTitle(`Reconocimiento - ${fullName}`);
    pdfDoc.setAuthor('CRIEG / FMRI');
    pdfDoc.setSubject('Reconocimiento oficial de membresía 2025');
    pdfDoc.setProducer('CRIEG Certificate Generator');
    pdfDoc.setCreator('CRIEG Website');
    pdfDoc.setCreationDate(new Date());

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
