import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

type GenerateOptions = {
    fullName: string;
    contactId: string;
    sessionId?: string;
    offsetX?: number;
};

export async function generateCertificateBuffer(opts: GenerateOptions): Promise<Buffer> {
    const { fullName, contactId, sessionId, offsetX = -70 } = opts;

    // 1) Cargar plantilla
    const templatePath = path.resolve(process.cwd(), 'public', 'cert-template.pdf');
    const templateBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];

    // 2) Nombre centrado con offset
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

    // 3) Footer con IDs (inferior derecha)
    const footerFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const rightMargin = 24;
    const bottomMargin = 18;
    let footerSize = 10;

    let footerText = `${contactId}`;
    let footerWidth = footerFont.widthOfTextAtSize(footerText, footerSize);
    const maxWidth = width - rightMargin - 24;
    while (footerWidth > maxWidth && footerSize > 6) {
        footerSize -= 0.5;
        footerWidth = footerFont.widthOfTextAtSize(footerText, footerSize);
    }
    const fx = width - rightMargin - footerWidth;
    const fy = bottomMargin;

    page.drawText(footerText, {
        x: fx, y: fy, size: footerSize, font: footerFont, color: rgb(0.2, 0.2, 0.2),
    });

    // 4) Metadata
    pdfDoc.setTitle(`Reconocimiento - ${fullName}`);
    pdfDoc.setAuthor('CRIEG / FMRI');
    pdfDoc.setSubject('Reconocimiento oficial de membresía 2025');
    pdfDoc.setProducer('CRIEG Certificate Generator');
    pdfDoc.setCreator('CRIEG Website');
    pdfDoc.setCreationDate(new Date());

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
