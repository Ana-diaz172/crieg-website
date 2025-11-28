
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import { useForm, SubmitHandler } from "react-hook-form";
import { checkoutMemberships } from "@/mock/member";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, FormSchemaType } from "@/schema/checkoutSchema";
import { IMembershipId } from "@/interface/member";
import { CheckoutFormData } from "@/interface/checkout";

export function useCheckout() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);
    const params = useParams();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        clearErrors,
        formState: { errors },
    } = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
    });

    const membershipId = params.membership as string;
    const membership = membershipId
        ? checkoutMemberships[membershipId as IMembershipId]
        : null;

    const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
        if (!membershipId) return;

        const professionalType = watch("professional_type");
        const step2Fields: (keyof CheckoutFormData)[] = [
            "university",
            "specialty",
            "sub_specialty",
            "professional_id",
            "specialty_prof_id",
            "sub_specialty_prof_id",
            "validity_period",
            "added_certification",
            "professional_type",
        ];

        if (professionalType === "residente") {
            step2Fields.push(
                "residency_location",
                "current_residency_year",
                "head_professor_name"
            );
        }

        const isValid = await trigger(step2Fields);
        if (!isValid) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            const deleteCookie = (name: string) => {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${location.hostname}`;
            };

            ["hubspotutk", "__hssc", "__hssrc", "__hstc"].forEach(deleteCookie);

            const response = await axios.post("/api/create-checkout-session", {
                membershipId,
                formData: data,
            });

            window.location.href = response.data.checkoutUrl;
        } catch (err) {
            console.error("Error:", err);
            setError("Hubo un error al procesar el pago. Intenta de nuevo.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!membership) {
            router.push("/");
        }
    }, [membership, router]);

    const nextStep = async () => {
        const fieldsToValidate: (keyof CheckoutFormData)[] =
            step === 1
                ? [
                    "firstname",
                    "lastname",
                    "email",
                    "phone",
                    "city",
                    "date_of_birth",
                    "active_member",
                ]
                : [];

        const valid = await trigger(fieldsToValidate);

        if (valid) {
            setStep((prev) => prev + 1);

            setTimeout(() => {
                clearErrors();
            }, 0);
        }
    };

    return {
        membership,
        router,
        error,
        handleSubmit,
        onSubmit,
        step,
        register,
        watch,
        setValue,
        trigger,
        errors,
        loading,
        nextStep,
        setStep,
    }
}