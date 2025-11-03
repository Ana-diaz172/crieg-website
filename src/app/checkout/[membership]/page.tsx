"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";

// Types
interface Membership {
  name: string;
  price: string;
  description: string;
}

type MembershipId = "crieg-medicos" | "crieg-residentes" | "fmri";

type MembershipType = "CRIEG" | "FMRI";
type ProfessionalType = "medico" | "residente";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  membership_type: MembershipType;
  city: string;
  professional_type: ProfessionalType;
  residency_location?: string;
  current_residency_year?: string;
  head_professor_name?: string;
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
};

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const params = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const professionalType = watch("professional_type");

  const membershipId = params.membership as string;

  const membership = membershipId
    ? memberships[membershipId as MembershipId]
    : null;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!membershipId) return;

    document.cookie =
      "hubspotutk=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";

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
        {/* Left Content Section - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-12 lg:px-16 xl:px-24 py-12">
            {/* Header */}
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

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white shadow-md rounded-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">
                Formulario de Registro
              </h2>

              {/* Información del Registro */}
              <fieldset className="mb-6">
                <legend className="text-xl font-semibold mb-6">
                  Información del Registro
                </legend>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombres *
                      </label>
                      <input
                        type="text"
                        {...register("firstname", {
                          required: "Este campo es obligatorio",
                        })}
                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent"
                        placeholder="Ingresa tus nombres"
                      />
                      {errors.firstname && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstname.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellidos *
                      </label>
                      <input
                        type="text"
                        {...register("lastname", {
                          required: "Este campo es obligatorio",
                        })}
                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent"
                        placeholder="Ingresa tus apellidos"
                      />
                      {errors.lastname && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastname.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Este campo es obligatorio",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Correo inválido",
                        },
                      })}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent"
                      placeholder="ejemplo@correo.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      {...register("phone", {
                        required: "Este campo es obligatorio",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Ingresa un número válido de 10 dígitos",
                        },
                      })}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent"
                      placeholder="3312345678"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Inscripción *
                    </label>
                    <select
                      {...register("membership_type", {
                        required: "Este campo es obligatorio",
                      })}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="CRIEG">CRIEG</option>
                      <option value="FMRI">FMRI</option>
                    </select>
                    {errors.membership_type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.membership_type.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      {...register("city", {
                        required: "Este campo es obligatorio",
                      })}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent"
                      placeholder="Ingresa tu ciudad"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Es médico o residente *
                    </label>
                    <select
                      {...register("professional_type", {
                        required: "Este campo es obligatorio",
                      })}
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="medico">Médico</option>
                      <option value="residente">Residente</option>
                    </select>
                    {errors.professional_type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.professional_type.message}
                      </p>
                    )}
                  </div>

                  {/* Campos condicionales para Residentes */}
                  {professionalType === "residente" && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold text-[#0B4B2B] mb-4">
                        Información de Residencia
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sede de Residencia *
                          </label>
                          <input
                            type="text"
                            {...register("residency_location", {
                              required:
                                professionalType === "residente"
                                  ? "Este campo es obligatorio para residentes"
                                  : false,
                            })}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent bg-white"
                            placeholder="Ingresa la sede de residencia"
                          />
                          {errors.residency_location && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.residency_location.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Grado que cursa actualmente *
                          </label>
                          <input
                            type="text"
                            {...register("current_residency_year", {
                              required:
                                professionalType === "residente"
                                  ? "Este campo es obligatorio para residentes"
                                  : false,
                            })}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent bg-white"
                            placeholder="Ej: R1, R2, R3, R4"
                          />
                          {errors.current_residency_year && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.current_residency_year.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de su Profesor Titular *
                          </label>
                          <input
                            type="text"
                            {...register("head_professor_name", {
                              required:
                                professionalType === "residente"
                                  ? "Este campo es obligatorio para residentes"
                                  : false,
                            })}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent bg-white"
                            placeholder="Ingresa el nombre completo"
                          />
                          {errors.head_professor_name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.head_professor_name.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </fieldset>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 cursor-pointer bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Volver a membresías
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0B4B2B] cursor-pointer text-white py-3 px-4 rounded-md hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? "Procesando..." : "Proceder al pago"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Image Section - Fixed */}
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
