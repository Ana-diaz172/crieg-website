import { NextRequest, NextResponse } from "next/server";
import { findContactByEmail } from "@/lib/hubspot";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    if (!email) return NextResponse.json({ error: "email query required" }, { status: 400 });

    try {
        const contact = await findContactByEmail(email);
        if (!contact) return NextResponse.json({ found: false }, { status: 200 });
        return NextResponse.json({ found: true, contact }, { status: 200 });
    } catch (err) {
        console.error("[DEBUG_CONTACT] error:", err);
        return NextResponse.json({ error: (err as any)?.message || "unknown" }, { status: 500 });
    }
}
