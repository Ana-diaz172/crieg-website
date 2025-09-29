import { Client } from '@hubspot/api-client';

const hubspotClient = new Client({
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

const omitUndefined = <T extends Record<string, any>>(obj: T): Partial<T> =>
    Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ) as Partial<T>;

export interface ContactData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    membershipType: string;
    city: string;
    professionalType: string;
    residencyLocation?: string;
    currentResidencyYear?: string;
    headProfessorName?: string;
}

export async function createOrUpdateContact(
    data: ContactData,
    stripeSessionId?: string
) {
    try {
        const properties = omitUndefined({
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
            properties,
        });

        return { success: true, contactId: response.id };
    } catch (error: any) {
        if (error.statusCode === 409) {
            try {
                const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
                    filterGroups: [
                        {
                            filters: [
                                {
                                    propertyName: 'email',
                                    operator: 'EQ', // ✅ Esto es válido en v13.4.0
                                    value: data.email,
                                },
                            ],
                        },
                    ],
                    limit: 1,
                });

                if (searchResponse.results?.length > 0) {
                    const contactId = searchResponse.results[0].id;
                    await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });
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
                            operator: 'EQ', // ✅ Válido
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

        const properties = omitUndefined({
            payment_status: paymentStatus,
            stripe_session_id: stripeSessionId,
            last_payment_date:
                paymentStatus === 'completed' ? new Date().toISOString() : undefined,
        });

        await hubspotClient.crm.contacts.basicApi.update(contactId, { properties });
        return { success: true, contactId };
    } catch (error: any) {
        console.error('Error updating payment status:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}