import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/contact-email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.name || !body.email || !body.message) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: "Email inválido" },
                { status: 400 }
            );
        }

        await sendContactEmail({
            name: body.name,
            email: body.email,
            phone: body.phone,
            message: body.message,
        });

        return NextResponse.json({
            success: true,
            message: "Mensaje enviado correctamente"
        });

    } catch (error) {
        console.error("Error en /api/contact:", error);
        return NextResponse.json(
            { error: "Error al enviar el mensaje. Intenta nuevamente." },
            { status: 500 }
        );
    }
}