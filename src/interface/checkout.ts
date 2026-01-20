export interface BillingFormData {
    // Step 1: Customer details
    taxId: string;
    companyName: string;
    taxRegime: string;
    postalCode: string;
    paymentId: string;

    // Step 2: Invoice details
    cfdiUsage: string;
    paymentMethod: string;
    paymentForm: string;

    // Step 3: Confirmation
    email: string;
}

export interface StepProps {
    formData: BillingFormData;
    onInputChange: (name: string, value: string) => void;
}

export type ProfessionalType = "medico" | "residente";
export interface CheckoutFormData {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    city: string;
    date_of_birth: string;

    university: string;
    specialty: string;
    sub_specialty: string;
    professional_id: string;
    specialty_prof_id: string;
    sub_specialty_prof_id: string;
    validity_period: string;
    added_certification: string;

    professional_type: ProfessionalType;
    residency_location?: string;
    current_residency_year?: string;
    head_professor_name?: string;
}