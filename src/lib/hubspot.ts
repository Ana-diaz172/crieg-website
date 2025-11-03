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
 * Create or update a contact (dedupe by email) and return the contactId.
 */
export async function createOrUpdateContact(
    data: ContactData,
    stripeSessionId?: string
): Promise<{ success: boolean; contactId?: string; error?: any }> {
    try {
        const contactProps: Record<string, string> = omitUndefined({
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
            stripe_session_id: stripeSessionId,
        });

        // Try create
        const created = await hubspotClient.crm.contacts.basicApi.create({
            properties: contactProps,
        });

        return { success: true, contactId: (created as any).id };
    } catch (error: any) {
        if (error.statusCode === 409) {
            // Already exists -> search by email and update
            try {
                const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
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

                if (searchResponse.results?.length > 0) {
                    const contactId = searchResponse.results[0].id;

                    const updateProps: Record<string, string> = omitUndefined({
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
                        stripe_session_id: stripeSessionId,
                    });

                    await hubspotClient.crm.contacts.basicApi.update(contactId, {
                        properties: updateProps,
                    });

                    return { success: true, contactId };
                }

                return { success: false, error: "Contact not found after conflict" };
            } catch (updateError) {
                console.error("Error updating contact:", updateError);
                return { success: false, error: updateError };
            }
        }

        console.error("Error creating contact:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
}

/**
 * Update payment-related fields directly by HubSpot contactId.
 * Create these properties in HubSpot as custom fields if they don't exist.
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
    };
}
