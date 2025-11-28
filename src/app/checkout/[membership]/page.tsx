"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import PersonalDataForm from "@/components/checkout/PersonalDataForm";
import AcademicDataForm from "@/components/checkout/AcademicDataForm";

import { useCheckout } from "@/hooks/useCheckout";

export default function CheckoutPage() {
  const {
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
  } = useCheckout();

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
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-green-100">
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
