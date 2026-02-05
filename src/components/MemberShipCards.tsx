"use client";

import { memberships } from "@/mock/member";
import { ArrowUpRight, BriefcaseMedical, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MemberShipCards() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center max-w-2xl mb-12 mt-12 px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Sé parte de la comunidad CRIEG
        </h2>
        <p className="mt-2 text-gray-600 whitespace-pre-line text-sm sm:text-base">
          {`Regularización automática: Al realizar el pago, el estatus se actualiza automáticamente como Miembro Activo CRIEG 2026.

          Gestión del grupo exclusivo de Whatsapp: El 27 de marzo se eliminarán del grupo a quienes no sean miembros activos.
          Quienes realicen su pago serán agregados nuevamente al grupo oficial.

          Pagos fuera de la plataforma no serán válidos para membresía ni constancias.`}
        </p>
      </div>

      {/* --- Contenedor Flexible para 3 arriba y 2 centradas abajo --- */}
      <div className="flex flex-wrap justify-center gap-8 max-w-7xl w-full px-6">
        {memberships.map((m) => {
          const hasMultiLineSuffix =
            Array.isArray(m.priceSuffixLines) && m.priceSuffixLines.length > 0;

          const handleSelectMembership = () => {
            router.push(`/checkout/${m.id}`);
          };

          return (
            <div
              key={m.id}
              className="border rounded-xl shadow-sm p-6 flex flex-col w-full sm:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] min-w-[300px]"
            >
              <BriefcaseMedical className="text-[#0B4B2B] mb-1" />
              <h3
                className="text-2xl font-semibold text-[#0B4B2B] mb-2"
                dangerouslySetInnerHTML={{ __html: m.title }}
              />
              <p className="text-sm font-normal text-gray-500 mb-6">
                {m.description}
              </p>

              {hasMultiLineSuffix ? (
                <div className="flex mb-6 flex-col items-start">
                  <p className="text-5xl font-semibold text-[#0B4B2B] m-0">
                    {m.price}
                  </p>
                  <div className="flex flex-col justify-center leading-tight ml-1">
                    {m.priceSuffixLines!.map((line, idx) => (
                      <span
                        key={idx}
                        className="text-base font-normal text-gray-500"
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                   <p className="text-5xl font-semibold text-[#0B4B2B]">
                    {m.price}
                  </p>
                  {m.priceSuffix && (
                    <span className="text-base font-normal text-gray-500 ml-1">
                      {m.priceSuffix}
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={handleSelectMembership}
                className="w-full cursor-pointer bg-[#0B4B2B] hover:bg-green-800 text-white py-2 rounded-lg font-medium mb-6 transition-colors"
              >
                {m.ctaLabel ?? "Seleccionar membresía"}
              </button>

              <p className="text-base font-semibold text-black mb-2">Incluye</p>
              <div className="space-y-3 text-gray-700 text-base">
                {m.features.map((feat, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-[#0B4B2B] mt-1" />
                    <span>{feat}</span>
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 mb-12 w-full max-w-7xl px-6">
        {/* Botón centrado independiente */}
        <div className="flex justify-center w-full">
          <a
            href="/members"
            className="inline-flex items-center gap-2 px-6 py-3 text-[#0B4B2B] border border-[#0B4B2B] rounded-lg font-medium hover:bg-[#0B4B2B] hover:text-white transition"
          >
            Ver más sobre Miembros
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>      
      </div>
    </div>
  );
}