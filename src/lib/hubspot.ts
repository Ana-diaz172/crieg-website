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

// Filtra props que no existen en el portal si HS_CUSTOM_FIELDS no está activo.
// Además, mapea professional_type -> jobtitle cuando no se envían custom fields.
function sanitizeContactProps(input: Record<string, string>): Record<string, string> {
    const base = { ...input };

    if (!HS_CUSTOM_FIELDS) {
        // Quita props que no existen
        delete base["membership_type"];
        // Mapea professional_type -> jobtitle (conserva el dato sin tronar)
        if (base["professional_type"]) {
            base["jobtitle"] = base["professional_type"];
        }
        delete base["professional_type"];
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
            "payment_status",
            "stripe_session_id",
            "stripe_payment_intent_id",
            "stripe_charge_id",
            "stripe_invoice_id",
            "stripe_receipt_url",
            "stripe_customer_id",
            "stripe_amount",
            "stripe_currency",
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
        payment_status: c.properties?.payment_status || "",
        stripe_session_id: c.properties?.stripe_session_id || "",
        stripe_payment_intent_id: c.properties?.stripe_payment_intent_id || "",
        stripe_charge_id: c.properties?.stripe_charge_id || "",
        stripe_invoice_id: c.properties?.stripe_invoice_id || "",
        stripe_receipt_url: c.properties?.stripe_receipt_url || "",
        stripe_customer_id: c.properties?.stripe_customer_id || "",
        stripe_amount: c.properties?.stripe_amount || "",
        stripe_currency: c.properties?.stripe_currency || "",
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
            await hubspotClient.crm.contacts.basicApi.update(contactId, { properties: safeProps });
            return { success: true, contactId };
        }

        // 2) Crear si no existe
        const created = await hubspotClient.crm.contacts.basicApi.create({
            properties: safeProps,
        });
        return { success: true, contactId: (created as any).id as string };
    } catch (err: any) {
        // Carrera paralela: si llega 409, vuelve a buscar y actualiza
        if (err?.statusCode === 409) {
            try {
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
 */
export async function updateHubspotContactPaymentFields(
    contactId: string,
    props: Record<string, string | undefined>
) {
    const properties = omitUndefined(props as any);
    const safe = sanitizeContactProps(properties);
    await hubspotClient.crm.contacts.basicApi.update(contactId, {
        properties: safe,
    });
}
