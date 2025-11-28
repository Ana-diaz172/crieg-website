import fs from 'fs/promises';
import path from 'path';
import type { NextRequest } from 'next/server';

export async function loadCertTemplate(req?: NextRequest): Promise<Uint8Array> {
    const isVercel = !!process.env.VERCEL;

    if (!isVercel) {
        const templatePath = path.resolve(process.cwd(), 'public', 'cert-template.pdf');
        const buf = await fs.readFile(templatePath);
        return new Uint8Array(buf);
    }

    const base =
        process.env.NEXT_PUBLIC_DOMAIN ??
        (req ? `${req.nextUrl.protocol}//${req.headers.get('host')}` : undefined);

    if (!base) {
        throw new Error('Cannot resolve base URL for template fetch in production');
    }

    const url = `${base.replace(/\/$/, '')}/cert-template.pdf`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`Template fetch failed: ${res.status} ${res.statusText}`);
    }
    const ab = await res.arrayBuffer();
    return new Uint8Array(ab);
}
