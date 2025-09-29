"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowRight, Menu } from "lucide-react";
import Image from "next/image";

const memberships = {
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const membershipId = params.membership as string;

  const membership = membershipId
    ? memberships[membershipId as keyof typeof memberships]
    : null;

  const handleCheckout = async () => {
    if (!membershipId) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/create-checkout-session", {
        membershipId,
      });

      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al procesar el pago. Intenta de nuevo.");
      setLoading(false);
    }
  };

  const onSubmit = (data: any) => {
    console.log("Formulario enviado:", data);
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
            className="bg-[#0B4B2B] text-white px-4 py-2 rounded-lg"
          >
            Volver a membresías
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-100">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Content Section (unchanged) */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-32 py-12 lg:py-0">
          {/* Header */}
          <div className="mb-16">
            <h1 className="mt-20 text-3xl font-light leading-tight text-gray-900 mb-6">
              Formato de recolección de datos Membresía CRIEG Y FMRI 2025
            </h1>
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#0B4B2B] mb-2">
                  {membership.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {membership.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Precio</span>
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">
                Formulario de Registro
              </h2>

              {/* Información Personal */}
              <fieldset className="mb-8 border-b pb-6">
                <legend className="text-xl font-semibold mb-4">
                  Información Personal
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      {...register("firstName", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      {...register("lastName", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
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
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Teléfono Fijo *
                    </label>
                    <input
                      type="tel"
                      {...register("landlinePhone", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.landlinePhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.landlinePhone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      {...register("whatsapp", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.whatsapp && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.whatsapp.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Teléfono Móvil *
                    </label>
                    <input
                      type="tel"
                      {...register("mobilePhone", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.mobilePhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mobilePhone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha de nacimiento *
                    </label>
                    <input
                      type="date"
                      {...register("birthDate", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.birthDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.birthDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Constancia de miembro activo *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      {...register("membershipCertificate", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.membershipCertificate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.membershipCertificate.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Lugar de Residencia Actual (Ciudad) *
                    </label>
                    <input
                      type="text"
                      {...register("currentCity", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.currentCity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.currentCity.message}
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* Datos Académicos */}
              <fieldset className="mb-8 border-b pb-6">
                <legend className="text-xl font-semibold mb-4">
                  Datos Académicos
                </legend>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre Completo de la Universidad que Emite su Título de
                      Medicina *
                    </label>
                    <input
                      type="text"
                      {...register("medicalDegreeUniversity", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.medicalDegreeUniversity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.medicalDegreeUniversity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Universidad e Institución de Especialidad en Radiología *
                    </label>
                    <input
                      type="text"
                      {...register("radiologySpecialtyInstitution", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.radiologySpecialtyInstitution && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.radiologySpecialtyInstitution.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Universidad e Institución de Subespecialidad(s) o Curso(s)
                      de Alta Especialidad
                      <br />
                      <span className="text-gray-500 text-xs">
                        (Escriba "No aplica" si no tiene)
                      </span>
                    </label>
                    <input
                      type="text"
                      {...register("subspecialtyInstitution")}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cédula Profesional *<br />
                      <span className="text-gray-500 text-xs">
                        (Escriba "No aplica" si no tiene)
                      </span>
                    </label>
                    <input
                      type="text"
                      {...register("professionalLicense", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.professionalLicense && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.professionalLicense.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cédula Profesional de Especialidad *<br />
                      <span className="text-gray-500 text-xs">
                        (Escriba "No aplica" si no tiene)
                      </span>
                    </label>
                    <input
                      type="text"
                      {...register("specialtyLicense", {
                        required: "Este campo es obligatorio",
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.specialtyLicense && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.specialtyLicense.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cédula Profesional de Subespecialidad
                      <br />
                      <span className="text-gray-500 text-xs">
                        (Escriba "No aplica" si no tiene)
                      </span>
                    </label>
                    <input
                      type="text"
                      {...register("subspecialtyLicense")}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Periodo de Vigencia de su última Certificación ante el
                      CMRI *
                    </label>
                    <input
                      type="text"
                      {...register("cmriCertificationPeriod", {
                        required: "Este campo es obligatorio",
                      })}
                      placeholder="Ej: 2023-2026"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.cmriCertificationPeriod && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cmriCertificationPeriod.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ¿Cuenta con Certificación Agregada? ¿En qué área? ¿Cuál es
                      la vigencia? ¿Folio? *
                    </label>
                    <textarea
                      {...register("additionalCertification", {
                        required: "Este campo es obligatorio",
                      })}
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.additionalCertification && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.additionalCertification.message}
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* Residente */}
              <fieldset className="mb-6">
                <legend className="text-xl font-semibold mb-4">
                  Si es usted residente
                </legend>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sede de Residencia
                    </label>
                    <input
                      type="text"
                      {...register("residencyLocation")}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Grado que cursa actualmente
                    </label>
                    <input
                      type="text"
                      {...register("currentResidencyYear")}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre de su Profesor Titular
                    </label>
                    <input
                      type="text"
                      {...register("headProfessorName")}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </fieldset>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Enviar Formulario
              </button>
            </form>
          </div>
        </div>

        {/* Right Image Section (modified to full-cover image) */}
        <div className="relative flex items-center justify-center p-8 lg:p-16">
          {/* Full-cover background image for the entire right section */}
          <Image
            src="/form-banner.png" // <-- your image
            alt="Equipo médico de radiología"
            fill
            className="object-cover"
            priority
          />

          {/* Decorative elements (kept, now overlaying the background image) */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 -left-8 w-6 h-6 bg-white/15 rounded-full pointer-events-none" />

          {/* Mobile Menu Button (unchanged) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Menu className="h-5 w-5" />
              <span className="text-sm font-medium">menu</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay (unchanged) */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-900/95 z-40 flex items-center justify-center">
          <nav className="text-center space-y-8">
            <a
              href="/"
              className="block text-white text-2xl font-light hover:text-gray-300 transition-colors"
            >
              Inicio
            </a>
            <a
              href="/about"
              className="block text-white text-2xl font-light hover:text-gray-300 transition-colors"
            >
              Acerca de Nosotros
            </a>
            <a
              href="/contact"
              className="block text-white text-2xl font-light hover:text-gray-300 transition-colors"
            >
              Contacto
            </a>
            <a
              href="/membership"
              className="block text-white text-2xl font-light hover:text-gray-300 transition-colors"
            >
              Colegiarse
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}

{
  /* <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Confirmar compra
          </h1>
          <p className="text-gray-600">
            Revisa los detalles de tu membresía antes de proceder al pago.
          </p>
        </div>

        <div className="border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#0B4B2B] mb-2">
            {membership.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4">{membership.description}</p>
          <div className="flex justify-between items-center">
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

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full cursor-pointer bg-[#0B4B2B] hover:bg-green-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? "Procesando..." : "Proceder al pago"}
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full cursor-pointer mt-4 text-gray-600 hover:text-gray-800 py-2 transition-colors"
        >
          Volver a membresías
        </button>
      </div>
    </div> */
}
function useForm(): {
  register: any;
  handleSubmit: any;
  formState: { errors: any };
} {
  throw new Error("Function not implemented.");
}
