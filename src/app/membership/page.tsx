"use client";

import { BriefcaseMedical, Check } from "lucide-react";

// ---- Types ----
type Membership = {
  id: string;
  title: string;
  description: string;
  price: string; // e.g. "$2,600"
  priceSuffix?: string; // e.g. "/anual 2025"
  priceSuffixLines?: string[]; // For multi-line suffix (e.g., FMRI)
  ctaLabel?: string;
  features: string[];
};

// ---- Reusable Card Component ----
function MembershipCard({
  title,
  description,
  price,
  priceSuffix,
  priceSuffixLines,
  ctaLabel = "Seleccionar membresía",
  features,
}: Membership) {
  const hasMultiLineSuffix =
    Array.isArray(priceSuffixLines) && priceSuffixLines.length > 0;

  return (
    <div className="border rounded-xl shadow-sm p-6 flex flex-col">
      <BriefcaseMedical className="text-[#0B4B2B] mb-1" />
      <h3
        className="text-2xl font-semibold text-[#0B4B2B] mb-2"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p className="text-sm font-normal text-gray-500 mb-6">{description}</p>

      {/* Price block (handles single-line or multi-line suffix) */}
      {hasMultiLineSuffix ? (
        <div className="flex items-center mb-6">
          <p className="text-5xl font-semibold text-[#0B4B2B] m-0">{price}</p>
          <div className="flex flex-col justify-center leading-tight ml-1">
            {priceSuffixLines!.map((line, idx) => (
              <span key={idx} className="text-base font-normal text-gray-500">
                {line}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-5xl font-semibold text-[#0B4B2B] mb-6">
          {price}
          {priceSuffix && (
            <span className="text-base font-normal text-gray-500">
              {" "}
              {priceSuffix}
            </span>
          )}
        </p>
      )}

      <button className="w-full bg-[#0B4B2B] hover:bg-green-800 text-white py-2 rounded-lg font-medium mb-6">
        {ctaLabel}
      </button>

      <p className="text-base font-semibold text-black mb-2">Incluye</p>
      <div className="space-y-3 text-gray-700 text-base">
        {features.map((feat, i) => (
          <p key={i} className="flex items-start gap-2">
            <Check className="h-5 w-5 shrink-0 text-[#0B4B2B] mt-1" />
            <span>{feat}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

// ---- Data Source ----
const memberships: Membership[] = [
  {
    id: "crieg-medicos",
    title: "Membresía Médicos Radiólogos CRIEG",
    description:
      "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos al mantener tu membresía CRIEG vigente.",
    price: "$2,600",
    priceSuffix: "/anual 2025",
    features: [
      "Cuotas preferenciales para el Congreso Virtual de Mayo y el Congreso Cervantino de Imágenes Médicas.",
      "Regularización automática al pagar la cuota 2025.",
      "Carta de pertenencia a CRIEG expedida por el Colegio.",
    ],
  },
  {
    id: "crieg-residentes",
    title: "Membresía <br /> Residentes CRIEG",
    description:
      "Accede a congresos con tarifas preferenciales y mantén tu membresía CRIEG al día con regularización automática.",
    price: "$600",
    priceSuffix: "/anual 2025",
    features: [
      "Cuotas preferenciales para el Congreso Virtual de Mayo y el Congreso Cervantino de Imágenes Médicas.",
      "Regularización automática al pagar la cuota 2025.",
    ],
  },
  {
    id: "fmri",
    title: "Membresía FMRI",
    description:
      "Disfruta costos preferenciales en congresos, acceso a contenido académico exclusivo y reconocimiento oficial con la carta de pertenencia a la FMRI.",
    price: "$4,000",
    priceSuffixLines: ["/hasta el 9 de marzo", "2025"],
    features: [
      "Cuotas preferenciales para los Congresos de Ultrasonido en Mérida y el Seccional en Guadalajara.",
      "Acceso al Journal con contenido académico exclusivo.",
      "Carta de pertenencia a la FMRI (expedida por la federación) para sumar puntajes.",
    ],
  },
];

// ---- Page ----
export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pb-12">
      {/* Header */}
      <div className="relative w-full h-[25vh] overflow-hidden">
        <img
          src="/about-banner-page.jpg"
          alt="Equipo médico de radiología trabajando en conjunto"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Intro */}
      <div className="text-center max-w-2xl mb-12 mt-12 px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Sé parte de la comunidad CRIEG
        </h2>
        <p className="mt-2 text-gray-600">
          Fortalece tu desarrollo profesional con el respaldo del CRIEG.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-6">
        {memberships.map((m) => (
          <MembershipCard key={m.id} {...m} />
        ))}
      </div>
    </div>
  );
}
