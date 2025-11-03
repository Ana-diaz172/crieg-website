// src/lib/hubspot.ts
import { Client } from "@hubspot/api-client";
import { FilterOperatorEnum } from "@hubspot/api-client/lib/codegen/crm/contacts/models/Filter";

const hubspotClient = new Client({
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

const omitUndefined = <T extends Record<string, any>>(obj: T): Record<string, string> =>
    Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ) as Record<string, string>;

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
 * Busca un contacto por email. Devuelve id y un conjunto de props útiles.
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
        city: c.properties?.city || "",
        residency_location: c.properties?.residency_location || "",
        current_residency_year: c.properties?.current_residency_year || "",
        head_professor_name: c.properties?.head_professor_name || "",
    };
}

/**
 * Upsert por email: si existe → update; si no → create.
 * Devuelve siempre contactId en caso de éxito.
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
            membership_type: data.membershipType,
            professional_type: data.professionalType,
            residency_location: data.residencyLocation,
            current_residency_year: data.currentResidencyYear,
            head_professor_name: data.headProfessorName,
        });

        const mergedProps = {
            ...baseProps,
            ...(extraProps ? omitUndefined(extraProps as any) : {}),
        };

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
            await hubspotClient.crm.contacts.basicApi.update(contactId, { properties: mergedProps });
            return { success: true, contactId };
        }

        // 2) Crear si no existe
        const created = await hubspotClient.crm.contacts.basicApi.create({
            properties: mergedProps,
        });
        return { success: true, contactId: (created as any).id as string };
    } catch (err: any) {
        // Carrera paralela: si llega 409, extrae el ID y actualiza
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
                    await hubspotClient.crm.contacts.basicApi.update(contactId, {
                        properties: extraProps ? omitUndefined(extraProps as any) : {},
                    });
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
 * Mantengo tu API anterior por compatibilidad, pero ahora delega a upsert (evita 409).
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
 * Actualiza campos de pago por contactId (para el webhook o cualquier post-proceso).
 * Asegúrate de tener estas propiedades creadas en HubSpot si son custom.
 */
export async function updateHubspotContactPaymentFields(
    contactId: string,
    props: Record<string, string | undefined>
) {
    const properties = Object.fromEntries(
        Object.entries(props).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ) as Record<string, string>;

    await hubspotClient.crm.contacts.basicApi.update(contactId, {
        properties,
    });
}
