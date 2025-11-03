import { NextRequest, NextResponse } from "next/server";
import { findContactByEmail, updateHubspotContactPaymentFields } from "@/lib/hubspot";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        console.log("[TEST] Finding contact:", email);

        // 1. Buscar contacto
        const contact = await findContactByEmail(email);

        if (!contact) {
            return NextResponse.json({
                error: "Contact not found",
                email
            }, { status: 404 });
        }

        console.log("[TEST] Contact found:", contact.id);

        // 2. Preparar datos de prueba
        const testPaymentData = {
            stripe_customer_id: "cus_test_123456789",
            stripe_session_id: "cs_test_123456789",
            stripe_payment_intent_id: "pi_test_123456789",
            stripe_charge_id: "ch_test_123456789",
            stripe_invoice_id: "in_test_123456789",
            stripe_receipt_url: "https://pay.stripe.com/receipts/test_123",
            stripe_amount: "260000",
            stripe_currency: "mxn",
            payment_status: "completed",
            last_payment_date: new Date().toISOString(),
        };

        console.log("[TEST] Updating contact with test data...");

        // 3. Actualizar contacto
        await updateHubspotContactPaymentFields(contact.id, testPaymentData);

        console.log("[TEST] Update complete");

        // 4. Verificar actualización
        const updatedContact = await findContactByEmail(email);

        return NextResponse.json({
            success: true,
            message: "Payment fields updated with test data",
            contactId: contact.id,
            sentData: testPaymentData,
            before: {
                stripe_customer_id: contact.stripe_customer_id,
                payment_status: contact.payment_status,
            },
            after: {
                stripe_customer_id: updatedContact?.stripe_customer_id,
                payment_status: updatedContact?.payment_status,
            },
            fullContact: updatedContact
        });

    } catch (error: any) {
        console.error("[TEST] Error:", error);
        return NextResponse.json({
            error: "Test failed",
            details: error?.message || String(error),
            stack: error?.stack
        }, { status: 500 });
    }
}