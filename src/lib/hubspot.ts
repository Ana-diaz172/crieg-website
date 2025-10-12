import { Client } from '@hubspot/api-client';
import { FilterOperatorEnum } from '@hubspot/api-client/lib/codegen/crm/contacts/models/Filter';

const hubspotClient = new Client({
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

const omitUndefined = <T extends Record<string, any>>(obj: T): Record<string, string> =>
    Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ) as Record<string, string>;

export interface ContactData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    membershipType: string;
    city: string;
    professionalType: 'medico' | 'residente';
    residencyLocation?: string;
    currentResidencyYear?: string;
    headProfessorName?: string;
}

export async function createOrUpdateContact(
    data: ContactData,
    stripeSessionId?: string
) {
    try {
        // props para crear
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

        const response = await hubspotClient.crm.contacts.basicApi.create({
            properties: contactProps,
        });

        return { success: true, contactId: response.id };
    } catch (error: any) {
        // 409 = ya existe -> buscar y actualizar
        if (error.statusCode === 409) {
            try {
                const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
                    filterGroups: [
                        {
                            filters: [
                                {
                                    propertyName: 'email',
                                    operator: FilterOperatorEnum.Eq, // ✅ enum, no string
                                    value: data.email,
                                },
                            ],
                        },
                    ],
                    limit: 1,
                });

                if (searchResponse.results?.length > 0) {
                    const contactId = searchResponse.results[0].id;

                    // props para actualizar (recrea el objeto en este scope)
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

                return { success: false, error: 'Contact not found after conflict' };
            } catch (updateError) {
                console.error('Error updating contact:', updateError);
                return { success: false, error: updateError };
            }
        }

        console.error('Error creating contact:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

export async function updateContactWithPaymentStatus(
    email: string,
    paymentStatus: 'completed' | 'failed',
    stripeSessionId: string
) {
    try {
        const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
            filterGroups: [
                {
                    filters: [
                        {
                            propertyName: 'email',
                            operator: FilterOperatorEnum.Eq,
                            value: email,
                        },
                    ],
                },
            ],
            limit: 1,
        });

        if (!searchResponse.results || searchResponse.results.length === 0) {
            return { success: false, error: 'Contact not found' };
        }

        const contactId = searchResponse.results[0].id;

        const props: Record<string, string> = omitUndefined({
            payment_status: paymentStatus,
            stripe_session_id: stripeSessionId,
            last_payment_date:
                paymentStatus === 'completed' ? new Date().toISOString() : undefined,
        });

        await hubspotClient.crm.contacts.basicApi.update(contactId, {
            properties: props,
        });

        return { success: true, contactId };
    } catch (error: any) {
        console.error('Error updating payment status:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

export async function findContactByEmail(email: string) {
    const search = await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [
            {
                filters: [
                    {
                        propertyName: 'email',
                        operator: FilterOperatorEnum.Eq,
                        value: email,
                    },
                ],
            },
        ],
        limit: 1,
        properties: ['firstname', 'lastname', 'email', 'payment_status', 'stripe_session_id'],
    });

    if (!search.results?.length) return null;
    const c = search.results[0] as any;
    return {
        id: c.id,
        firstname: c.properties?.firstname || '',
        lastname: c.properties?.lastname || '',
        email: c.properties?.email || '',
        payment_status: c.properties?.payment_status || '',
        stripe_session_id: c.properties?.stripe_session_id || '',
    };
}