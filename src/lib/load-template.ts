// src/lib/load-template.ts
import fs from 'fs/promises';
import path from 'path';
import type { NextRequest } from 'next/server';

export async function loadCertTemplate(req?: NextRequest): Promise<Uint8Array> {
    const isVercel = !!process.env.VERCEL;

    if (!isVercel) {
        // Local dev: se puede leer desde el FS
        const templatePath = path.resolve(process.cwd(), 'public', 'cert-template.pdf');
        const buf = await fs.readFile(templatePath);
        return new Uint8Array(buf);
    }

    // Producción (Vercel): leer por URL pública
    // Usa NEXT_PUBLIC_DOMAIN o arma la base desde el request
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
