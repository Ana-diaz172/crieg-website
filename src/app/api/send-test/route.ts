import { NextRequest, NextResponse } from 'next/server';
import { generateCertificateBuffer } from '@/lib/certificate';
import { sendCertificateEmail } from '@/lib/email-resend';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { to, fullName, contactId = 'TEST-ID' } = await req.json();
        if (!to || !fullName) return NextResponse.json({ ok: false, error: 'to & fullName required' }, { status: 400 });

        const pdf = await generateCertificateBuffer({ fullName, contactId, sessionId: 'TEST' });
        const id = await sendCertificateEmail({ to, fullName, pdf });

        return NextResponse.json({ ok: true, id });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
    }
}
