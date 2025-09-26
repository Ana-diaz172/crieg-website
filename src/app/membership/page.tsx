"use client";

import { Check } from "lucide-react";

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pb-12 px-6">
      {/* Encabezado */}
      <div className="relative w-full h-[25vh] overflow-hidden">
        <img
          src="/about-banner-page.jpg"
          alt="Equipo médico de radiología trabajando en conjunto"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="text-center max-w-2xl mb-12 mt-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Sé parte de la comunidad CRIEG
        </h2>
        <p className="mt-2 text-gray-600">
          Fortalece tu desarrollo profesional con el respaldo del CRIEG.
        </p>
      </div>

      {/* Tarjetas de membresía */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* Membresía Médicos Radiólogos */}
        <div className="border rounded-xl shadow-sm p-6 flex flex-col">
          <h3 className="text-2xl font-semibold text-[#0B4B2B] mb-2">
            Membresía Médicos Radiólogos CRIEG
          </h3>
          <p className="text-sm font-normal text-gray-500 mb-6">
            Accede a congresos con tarifas preferenciales, respaldo
            institucional y beneficios exclusivos al mantener tu membresía CRIEG
            vigente.
          </p>
          <p className="text-base font-normal text-gray-500"></p>
          <p className="text-5xl font-semibold text-[#0B4B2B] mb-6">
            $2,600
            <span className="text-base font-normal text-gray-500">
              /anual 2025
            </span>
          </p>
          <button className="w-full bg-[#0B4B2B] hover:bg-green-800 text-white py-2 rounded-lg font-medium mb-6">
            Seleccionar membresía
          </button>
          <p className="text-normal font-semibold text-black mb-2">Incluye</p>
          <div className="space-y-3 text-gray-700 text-normal">
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 shrink-0 text-[#0B4B2B] mt-1" />
              Cuotas preferenciales para el Congreso Virtual de Mayo y el
              Congreso Cervantino de Imágenes Médicas.
            </p>
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 shrink-0 text-[#0B4B2B]0 mt-1" />
              Regularización automática al pagar la cuota 2025.
            </p>
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 shrink-0 text-[#0B4B2B] mt-1" />
              Carta de pertenencia a CRIEG expedida por el Colegio.
            </p>
          </div>
        </div>

        {/* Membresía Residentes */}
        <div className="border rounded-xl shadow-sm p-6 flex flex-col">
          <h3 className="text-2xl font-semibold text-[#0B4B2B] mb-2">
            Membresía <br /> Residentes CRIEG
          </h3>
          <p className="text-sm font-normal text-gray-500 mb-6">
            Accede a congresos con tarifas preferenciales y mantén tu membresía
            CRIEG al día con regularización automática.{" "}
          </p>

          <p className="text-5xl font-semibold text-[#0B4B2B] mb-6">
            $600
            <span className="text-base font-normal text-gray-500">
              /anual 2025
            </span>
          </p>
          <button className="w-full bg-[#0B4B2B] hover:bg-green-800 text-white py-2 rounded-lg font-medium mb-6">
            Seleccionar membresía
          </button>
          <p className="text-normal font-semibold text-black mb-2">Incluye</p>
          <div className="space-y-3 text-gray-700 text-normal">
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 shrink-0 text-[#0B4B2B] mt-1" />
              Cuotas preferenciales para el Congreso Virtual de Mayo y el
              Congreso Cervantino de Imágenes Médicas.
            </p>
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 shrink-0 text-[#0B4B2B] mt-1" />
              Regularización automática al pagar la cuota 2025.
            </p>
          </div>
        </div>

        {/* Membresía FMRI */}
        <div className="border rounded-xl shadow-sm p-6 flex flex-col">
          <h3 className="text-2xl font-semibold text-[#0B4B2B] mb-2">
            Membresía FMRI
          </h3>
          <p className="text-sm font-normal text-gray-500 mb-6 mt-4">
            Disfruta costos preferenciales en congresos, acceso a contenido
            académico exclusivo y reconocimiento oficial con la carta de
            pertenencia a la FMRI.{" "}
          </p>

          <div className="flex items-center mb-6">
            <p className="text-5xl font-semibold text-[#0B4B2B] m-0">$4,000</p>
            <div className="flex flex-col justify-center leading-tight">
              <span className="text-base font-normal text-gray-500 ml-0.5">
                /hasta el 9 de marzo
              </span>
              <span className="text-base font-normal text-gray-500 ml-0.5">
                2025
              </span>
            </div>
          </div>

          <button className="w-full bg-[#0B4B2B] hover:bg-green-800 text-white py-2 rounded-lg font-medium mb-6">
            Seleccionar membresía
          </button>
          <p className="text-normal font-semibold text-black mb-2">Incluye</p>
          <div className="space-y-3 text-gray-700 text-normal">
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 shrink-0 text-[#0B4B2B] mt-1" />
              Cuotas preferenciales para los Congresos de Ultrasonido en Mérida
              y el Seccional en Guadalajara.
            </p>
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 shrink-0 text-[#0B4B2B] mt-1" />
              Acceso al Journal con contenido académico exclusivo.
            </p>
            <p className="flex items-start gap-2">
              <Check className="h-5 w-5 shrink-0 text-[#0B4B2B] mt-1" />
              Carta de pertenencia a la FMRI (expedida por la federación) para
              sumar puntajes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
