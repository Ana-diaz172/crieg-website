import { useState } from "react";

export function useAlegraInvoiceForm({ onSuccess }: {
    onSuccess?: (data: any) => void;
}) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        rfc: "",
        businessName: "",
        taxRegime: "",
        cfdiUse: "",
        street: "",
        exteriorNumber: "",
        interiorNumber: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        purchaseId: "",
        paymentMethod: "", // 👈 nuevo campo
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsSubmitting(true);

        try {
            console.log("📤 Enviando datos:", formData); // Debug

            const res = await fetch("/api/invoicing/create-and-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log("📥 Respuesta del servidor:", data); // Debug

            if (!res.ok) {
                throw new Error(
                    data.error || "Ocurrió un error al generar la factura."
                );
            }

            setSuccessMessage(
                "Tu factura ha sido generada correctamente. Revisa tu correo electrónico."
            );
            if (onSuccess) onSuccess(data);
        } catch (error: any) {
            console.error("❌ Error:", error); // Debug
            setErrorMessage(
                error.message || "Error inesperado al generar la factura."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        errorMessage,
        successMessage,
        handleChange,
        handleSubmit,
        setFormData,
        
    };
}