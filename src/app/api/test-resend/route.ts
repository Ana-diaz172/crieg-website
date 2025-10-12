import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const resendKeySet = !!process.env.RESEND_API_KEY;
        const from = process.env.RESEND_FROM;

        // 1) sanity check envs (no imprimas la API key)
        if (!resendKeySet || !from) {
            return NextResponse.json({
                ok: false,
                where: 'env',
                resendKeySet,
                from
            }, { status: 500 });
        }

        const { searchParams } = new URL(req.url);
        const to = searchParams.get('to');
        if (!to) return NextResponse.json({ ok: false, error: 'Missing ?to=' }, { status: 400 });

        const resend = new Resend(process.env.RESEND_API_KEY!);

        // 2) envío MUY simple sin adjunto para aislar
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject: 'Test Resend (sin adjunto)',
            html: `<p>Hola! Esto es una prueba simple.</p>`,
        });

        return NextResponse.json({
            ok: !error,
            dataId: data?.id || null,
            error: error ? { name: error.name, message: error.message } : null,
        });
    } catch (e: any) {
        return NextResponse.json({ ok: false, caught: e?.message }, { status: 500 });
    }
}
