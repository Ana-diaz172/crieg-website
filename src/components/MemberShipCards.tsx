"use client";

import { ArrowUpRight, BriefcaseMedical, Check } from "lucide-react";
import { useRouter } from "next/navigation";

type Membership = {
  id: string;
  title: string;
  description: string;
  price: string;
  priceSuffix?: string;
  priceSuffixLines?: string[];
  ctaLabel?: string;
  features: string[];
  priceAmount: number;
};

function MembershipCard({
  id,
  title,
  description,
  price,
  priceSuffix,
  priceSuffixLines,
  ctaLabel = "Seleccionar membresía",
  features,
  priceAmount,
}: Membership) {
  const router = useRouter();
  const hasMultiLineSuffix =
    Array.isArray(priceSuffixLines) && priceSuffixLines.length > 0;

  const handleSelectMembership = () => {
    router.push(`/checkout/${id}`);
  };

  return (
    <div className="border rounded-xl shadow-sm p-6 flex flex-col">
      <BriefcaseMedical className="text-[#0B4B2B] mb-1" />
      <h3
        className="text-2xl font-semibold text-[#0B4B2B] mb-2"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p className="text-sm font-normal text-gray-500 mb-6">{description}</p>

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

      <button
        onClick={handleSelectMembership}
        className="w-full cursor-pointer bg-[#0B4B2B] hover:bg-green-800 text-white py-2 rounded-lg font-medium mb-6"
      >
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

const memberships: Membership[] = [
  {
    id: "crieg-medicos",
    title: "Membresía Médicos Radiólogos CRIEG",
    description:
      "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos al mantener tu membresía CRIEG vigente.",
    price: "$2,600",
    priceSuffix: "/anual 2025",
    priceAmount: 260000,
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
    priceAmount: 60000,
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
    priceAmount: 400000,
    features: [
      "Cuotas preferenciales para los Congresos de Ultrasonido en Mérida y el Seccional en Guadalajara.",
      "Acceso al Journal con contenido académico exclusivo.",
      "Carta de pertenencia a la FMRI (expedida por la federación) para sumar puntajes.",
    ],
  },
  {
    id: "crieg-fmri",
    title: "Membresía CRIEG y FMRI",
    description:
      "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos al mantener tu membresía CRIEG y FMRI vigente.",
    price: "$6,600",
    priceSuffix: "/anual 2025",
    priceAmount: 660000,
    features: [
      "Cuotas preferenciales para los Congresos de Ultrasonido en Mérida y el Seccional en Guadalajara.",
      "Acceso al Journal con contenido académico exclusivo.",
      "Carta de pertenencia a la FMRI (expedida por la federación) para sumar puntajes.",
      "Cuotas preferenciales para el Congreso Virtual de Mayo y el Congreso Cervantino de Imágenes Médicas.",
      "Regularización automática al pagar la cuota 2025.",
      "Carta de pertenencia a CRIEG expedida por el Colegio.",
      "Carta de pertenencia a CRIEG expedida por el Colegio.",
    ],
  },
];

export default function MemberShipCards() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center max-w-2xl mb-12 mt-12 px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Sé parte de la comunidad CRIEG
        </h2>
        <p className="mt-2 text-gray-600">
          Fortalece tu desarrollo profesional con el respaldo del CRIEG.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full px-6">
        {memberships.map((m) => (
          <MembershipCard key={m.id} {...m} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="/members"
          className="inline-flex items-center gap-2 px-6 py-3 text-[#0B4B2B] border border-[#0B4B2B] rounded-lg font-medium hover:bg-[#0B4B2B] hover:text-white transition"
        >
          Ver más sobre Miembros
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
