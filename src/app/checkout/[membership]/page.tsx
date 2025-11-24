"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, FormSchemaType } from "@/schema/checkoutSchema";
import PersonalDataForm from "@/components/checkout/PersonalDataForm";
import AcademicDataForm from "@/components/checkout/AcademicDataForm";

// Types
type MembershipId =
  | "crieg-medicos"
  | "crieg-residentes"
  | "fmri"
  | "crieg-fmri";

export type ProfessionalType = "medico" | "residente";

export interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  city: string;
  date_of_birth: string;
  active_member: string;

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

interface Membership {
  name: string;
  price: string;
  description: string;
}

const memberships: Record<MembershipId, Membership> = {
  "crieg-medicos": {
    name: "Membresía Médicos Radiólogos CRIEG",
    price: "$2,600",
    description:
      "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos.",
  },
  "crieg-residentes": {
    name: "Membresía Residentes CRIEG",
    price: "$600",
    description:
      "Accede a congresos con tarifas preferenciales y mantén tu membresía CRIEG al día.",
  },
  fmri: {
    name: "Membresía FMRI",
    price: "$4,000",
    description:
      "Disfruta costos preferenciales en congresos y acceso a contenido académico exclusivo.",
  },
  "crieg-fmri": {
    name: "Membresía CRIEG y FMRI",
    price: "$6,600",
    description:
      "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos al mantener tu membresía CRIEG y FMRI vigente.",
  },
};

const personalFields: (keyof FormData)[] = [
  "firstname",
  "lastname",
  "email",
  "phone",
  "city",
  "date_of_birth",
  "active_member",
];

const academicFields: (keyof FormData)[] = [
  "university",
  "specialty",
  "sub_specialty",
  "professional_id",
  "specialty_prof_id",
  "sub_specialty_prof_id",
  "validity_period",
  "added_certification",
  "professional_type",
  "residency_location",
  "current_residency_year",
  "head_professor_name",
];

export default function CheckoutPage() {
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
    ? memberships[membershipId as MembershipId]
    : null;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!membershipId) return;

    const professionalType = watch("professional_type");
    const step2Fields: (keyof FormData)[] = [
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
      return; // No continuar si hay errores
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
    const fieldsToValidate: (keyof FormData)[] =
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

  if (!membership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">
            Membresía no encontrada
          </h1>
          <p className="text-gray-600 mb-4">
            Por favor selecciona una membresía válida.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#0B4B2B] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
          >
            Volver a membresías
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* LEFT CONTENT SECTION */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-12 lg:px-16 xl:px-24 py-12">
            <div className="mb-8 mt-24">
              <h1 className="text-3xl font-light leading-tight text-gray-900 mb-6">
                Formato de recolección de datos Membresía CRIEG Y FMRI 2025
              </h1>

              {/* Membership Info Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#0B4B2B] mb-2">
                  {membership.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {membership.description}
                </p>
                <div className="flex gap-2 items-center">
                  <span className="text-gray-700">Precio:</span>
                  <span className="text-2xl font-semibold text-[#0B4B2B]">
                    {membership.price}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white shadow-md rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">
                {" "}
                Formulario de Registro{" "}
              </h2>

              {/* Step indicator */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">Paso {step} de 2</p>
                <div className="h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className={`h-2 bg-[#0B4B2B] rounded-full transition-all duration-500 ${
                      step === 1 ? "w-1/2" : "w-full"
                    }`}
                  />
                </div>
              </div>

              {step === 1 && (
                <PersonalDataForm register={register} errors={errors} />
              )}
              {step === 2 && (
                <AcademicDataForm
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  trigger={trigger}
                />
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(step - 1)}
                  >
                    Atrás
                  </Button>
                )}
                {step < 2 ? (
                  <Button
                    type="button"
                    className="flex-1 bg-[#0B4B2B] text-white hover:bg-green-800"
                    onClick={nextStep}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#0B4B2B] text-white hover:bg-green-800 disabled:bg-gray-400"
                  >
                    {loading ? "Procesando..." : "Proceder al pago"}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="hidden lg:block lg:w-1/2 xl:w-1/2 relative">
          <div className="sticky top-0 h-screen">
            <Image
              src="/form-banner.webp"
              alt="Equipo médico de radiología"
              fill
              className="object-cover"
              priority
            />

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/10 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 -left-8 w-6 h-6 bg-white/15 rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
