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