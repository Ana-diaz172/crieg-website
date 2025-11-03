import { Client } from "@hubspot/api-client";
import { FilterOperatorEnum } from "@hubspot/api-client/lib/codegen/crm/contacts/models/Filter";

const hubspotClient = new Client({
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

// ⚙️ Si pones HS_CUSTOM_FIELDS=1 en tus envs (Vercel), el código enviará
// las propiedades personalizadas `professional_type` y `membership_type`.
// Si no, las filtrará (y `professional_type` lo mapea a `jobtitle`).
const HS_CUSTOM_FIELDS = process.env.HS_CUSTOM_FIELDS === "1";

const omitUndefined = <T extends Record<string, any>>(obj: T): Record<string, string> =>
    Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ) as Record<string, string>;

// Lista de campos de pago que SIEMPRE se deben enviar (ya existen en HubSpot)
const PAYMENT_FIELDS = [
    "stripe_customer_id",
    "stripe_session_id",
    "stripe_payment_intent_id",
    "stripe_charge_id",
    "stripe_invoice_id",
    "stripe_receipt_url",
    "stripe_amount",
    "stripe_currency",
    "payment_status",
    "last_payment_date",
];

// Filtra props que no existen en el portal si HS_CUSTOM_FIELDS no está activo.
// Además, mapea professional_type -> jobtitle cuando no se envían custom fields.
// IMPORTANTE: NO filtra campos de pago (stripe_*, payment_status, etc)
function sanitizeContactProps(input: Record<string, string>): Record<string, string> {
    const base = { ...input };

    if (!HS_CUSTOM_FIELDS) {
        // Quita props que no existen EXCEPTO campos de pago
        Object.keys(base).forEach(key => {
            // Mantener campos de pago
            if (PAYMENT_FIELDS.includes(key)) {
                return;
            }

            // Filtrar membership_type si no hay custom fields
            if (key === "membership_type") {
                delete base[key];
            }

            // Mapear professional_type -> jobtitle
            if (key === "professional_type") {
                if (base[key]) {
                    base["jobtitle"] = base[key];
                }
                delete base[key];
            }
        });
    }

    return base;
}

export interface ContactData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    membershipType: string;
    city: string;
    professionalType: "medico" | "residente";
    residencyLocation?: string;
    currentResidencyYear?: string;
    headProfessorName?: string;
}

/**
 * Find a contact by email and return a lean object.
 */
export async function findContactByEmail(email: string) {
    const search = await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [
            {
                filters: [
                    {
                        propertyName: "email",
                        operator: FilterOperatorEnum.Eq,
                        value: email,
                    },
                ],
            },
        ],
        limit: 1,
        properties: [
            "firstname",
            "lastname",
            "email",
            "phone",
            // Campos de pago
            "payment_status",
            "stripe_session_id",
            "stripe_payment_intent_id",
            "stripe_charge_id",
            "stripe_invoice_id",
            "stripe_receipt_url",
            "stripe_customer_id",
            "stripe_amount",
            "stripe_currency",
            "last_payment_date",
            // Campos de membresía
            "membership_type",
            "professional_type",
            "jobtitle",
            "city",
            "residency_location",
            "current_residency_year",
            "head_professor_name",
        ],
    });

    if (!search.results?.length) return null;
    const c = search.results[0] as any;
    return {
        id: c.id,
        firstname: c.properties?.firstname || "",
        lastname: c.properties?.lastname || "",
        email: c.properties?.email || "",
        phone: c.properties?.phone || "",
        payment_status: c.properties?.payment_status || "",
        stripe_session_id: c.properties?.stripe_session_id || "",
        stripe_payment_intent_id: c.properties?.stripe_payment_intent_id || "",
        stripe_charge_id: c.properties?.stripe_charge_id || "",
        stripe_invoice_id: c.properties?.stripe_invoice_id || "",
        stripe_receipt_url: c.properties?.stripe_receipt_url || "",
        stripe_customer_id: c.properties?.stripe_customer_id || "",
        stripe_amount: c.properties?.stripe_amount || "",
        stripe_currency: c.properties?.stripe_currency || "",
        last_payment_date: c.properties?.last_payment_date || "",
        membership_type: c.properties?.membership_type || "",
        professional_type: c.properties?.professional_type || "",
        jobtitle: c.properties?.jobtitle || "",
        city: c.properties?.city || "",
        residency_location: c.properties?.residency_location || "",
        current_residency_year: c.properties?.current_residency_year || "",
        head_professor_name: c.properties?.head_professor_name || "",
    };
}

/**
 * Upsert by email: if exists -> update; else -> create.
 * Returns contactId on success.
 */
export async function upsertContactByEmail(
    data: ContactData,
    extraProps?: Record<string, string | undefined>
): Promise<{ success: true; contactId: string } | { success: false; error: any }> {
    try {
        const baseProps: Record<string, string> = omitUndefined({
            firstname: data.firstName,
            lastname: data.lastName,
            email: data.email,
            phone: data.phone,
            city: data.city,
            // Estas dos props pueden no existir en tu portal:
            membership_type: data.membershipType,
            professional_type: data.professionalType,
            // Estas sí pueden existir tal cual si las creaste:
            residency_location: data.residencyLocation,
            current_residency_year: data.currentResidencyYear,
            head_professor_name: data.headProfessorName,
        });

        const mergedProps = omitUndefined({
            ...baseProps,
            ...(extraProps ?? {}),
        });

        // 🔒 Filtro/mapeo seguro según HS_CUSTOM_FIELDS
        const safeProps = sanitizeContactProps(mergedProps);

        console.log("[HUBSPOT] Upserting contact:", data.email);
        console.log("[HUBSPOT] Properties to send:", Object.keys(safeProps));

        // 1) Buscar por email
        const found = await hubspotClient.crm.contacts.searchApi.doSearch({
            filterGroups: [
                {
                    filters: [
                        {
                            propertyName: "email",
                            operator: FilterOperatorEnum.Eq,
                            value: data.email,
                        },
                    ],
                },
            ],
            limit: 1,
        });

        if (found.results?.length) {
            const contactId = (found.results[0] as any).id as string;
            console.log("[HUBSPOT] Updating existing contact:", contactId);
            await hubspotClient.crm.contacts.basicApi.update(contactId, { properties: safeProps });
            return { success: true, contactId };
        }

        // 2) Crear si no existe
        console.log("[HUBSPOT] Creating new contact");
        const created = await hubspotClient.crm.contacts.basicApi.create({
            properties: safeProps,
        });
        return { success: true, contactId: (created as any).id as string };
    } catch (err: any) {
        console.error("[HUBSPOT] Upsert error:", err?.message || err);

        // Carrera paralela: si llega 409, vuelve a buscar y actualiza
        if (err?.statusCode === 409) {
            try {
                console.log("[HUBSPOT] Handling 409 conflict...");
                const searchAgain = await hubspotClient.crm.contacts.searchApi.doSearch({
                    filterGroups: [
                        {
                            filters: [
                                {
                                    propertyName: "email",
                                    operator: FilterOperatorEnum.Eq,
                                    value: data.email,
                                },
                            ],
                        },
                    ],
                    limit: 1,
                });

                if (searchAgain.results?.length) {
                    const contactId = (searchAgain.results[0] as any).id as string;
                    console.log("[HUBSPOT] Found contact after conflict:", contactId);

                    // En update solo manda extraProps y cosas seguras
                    const safeUpdate = sanitizeContactProps(omitUndefined(extraProps ?? {}));
                    if (Object.keys(safeUpdate).length) {
                        await hubspotClient.crm.contacts.basicApi.update(contactId, {
                            properties: safeUpdate,
                        });
                    }
                    return { success: true, contactId };
                }
            } catch (e) {
                console.error("[HUBSPOT] Error handling 409:", e);
                return { success: false, error: e };
            }
        }

        return { success: false, error: err?.message || err };
    }
}

/**
 * Mantiene compatibilidad con tu API anterior; delega a upsert con `stripe_session_id`.
 */
export async function createOrUpdateContact(
    data: ContactData,
    stripeSessionId?: string
): Promise<{ success: boolean; contactId?: string; error?: any }> {
    const res = await upsertContactByEmail(data, {
        stripe_session_id: stripeSessionId,
    });
    if (res.success) return { success: true, contactId: res.contactId };
    return { success: false, error: (res as any).error };
}

/**
 * Actualiza campos de pago por contactId.
 * IMPORTANTE: Los campos de pago NO se sanitizan (siempre se envían)
 */
export async function updateHubspotContactPaymentFields(
    contactId: string,
    props: Record<string, string | undefined>
) {
    const properties = omitUndefined(props as any);

    console.log("[HUBSPOT]  Updating payment fields for contact:", contactId);
    console.log("[HUBSPOT] Payment properties:", Object.keys(properties));

    // Los campos de pago siempre se envían sin sanitización
    // porque ya existen en HubSpot (creados con el script)
    await hubspotClient.crm.contacts.basicApi.update(contactId, {
        properties,
    });

    console.log("[HUBSPOT] Payment fields updated successfully");
}