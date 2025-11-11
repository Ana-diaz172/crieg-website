"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type InfoCard = {
  id: string;
  title: string;
  description: string;
  rights: string[];
  obligations: string[];
};

function InfoCard({
  title,
  description,
  onClick,
}: InfoCard & { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="border rounded-xl shadow-sm p-6 flex flex-col bg-white cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 text-center min-h-[280px] justify-between"
    >
      <div>
        <h3
          className="text-2xl font-semibold text-[#0B4B2B] mb-3"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-sm font-normal text-gray-500">{description}</p>
      </div>
      <div className="mt-4 text-sm text-[#0B4B2B] font-medium">
        <span>Ver más</span>
      </div>
    </div>
  );
}

const infoCards: InfoCard[] = [
  {
    id: "active_member",
    title: "Miembro Activo",
    description:
      "Médico Radiólogo con cédula de especialista que ha cubierto el pago de la anualidad del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
    rights: [
      "Tiene derecho a los beneficios de pertenecer al Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Al voto y opinión en las asambleas tanto ordinarias como extraordinarias del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "A postularse para cualquier cargo en la Mesa Directiva del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Difusión de actividades y logros profesionales.",
      "Tiene derecho a realizar el pago de membresía anual a la Federación Mexicana de Radiología e Imagen.",
      "A postularse para cualquier cargo en la Mesa Directiva de laFederación Mexicana de Radiología e Imagen.",
    ],
    obligations: [
      "Realizar su pago anual de membresía al Colegio de Radiología e Imagen del Estado de Guanajuato.",
      "Acudir y participar en cada asamblea tanto ordinaria como extraordinaria",
      "Participar en cada actividad académica del Colegio de Radiología e Imagen del Estado de Guanajuato A. C.",
    ],
  },
  {
    id: "transitory_member",
    title: "Miembro Transitorio",
    description:
      "Médico Residente de Radiología Diagnóstica y Terapéutica o Médico Residente en Curso de Subespecialidad o Médico Residente en Curso de Alta Especialidad que ha cubierto el pago de la anualidad del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
    rights: [
      "Tiene derecho a los beneficios de pertenecer al Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Tiene derecho a realizar el pago de membresía anual a la Federación Mexicana de Radiología e Imagen.",
    ],
    obligations: [
      "Realizar su pago anual de membresía al Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Participar en cada actividad académica del Colegio de Radiología del Estado de Guanajuato A. C.",
    ],
  },
  {
    id: "honorary_member",
    title: "Miembro Honorario",
    description:
      "Médico Radiólogo que ha formado parte del Colegio de Radiología e Imagen del Estado de Guanajuato A.C. por 25 años o más.",
    rights: [
      "Tiene derecho a los beneficios de pertenecer al Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Al voto y opinión en las asambleas tanto ordinarias como extraordinarias del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "A postularse para cualquier cargo en la Mesa Directiva del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Tiene derecho a hacer el pago de membresía anual a la Federación Mexicana de Radiología e Imagen.",
      "A postularse para cualquier cargo en la Mesa Directiva de la Federación Mexicana de Radiología e Imagen.",
      "El miembro honorario adquiere el derecho a no realizar pago anual para pertenecer al Colegio de Radiología e Imagen del Estado de Guanajuato A. C.",
    ],
    obligations: [
      "Acudir y participar en cada asamblea tanto ordinaria como extraordinaria.",
      "Participar en cada actividad académica del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
    ],
  },
];

export default function InfoCardsSection() {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<InfoCard | null>(null);

  const handleOpen = (card: InfoCard) => {
    setSelectedCard(card);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Imagen superior */}
      <div className="relative w-full h-[30vh] md:h-[30vh] overflow-hidden">
        <Image
          src="/about-banner-page.jpg"
          alt="Equipo médico de radiología trabajando en conjunto"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Encabezado */}
      <div className="text-center max-w-2xl mb-12 mt-12 px-6 mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Miembros de CRIEG
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full px-6 mb-16 mx-auto justify-items-center">
        {infoCards.map((card, index) => (
          <div
            key={card.id}
            className={`w-full sm:w-auto ${
              index === infoCards.length - 1
                ? "sm:col-span-2 sm:justify-self-center lg:col-span-1"
                : ""
            }`}
          >
            <InfoCard {...card} onClick={() => handleOpen(card)} />
          </div>
        ))}
      </div>

      {/* Sheet  */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-2xl mx-auto rounded-t-2xl p-8 max-h-[100vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle
              className="text-2xl font-semibold text-[#0B4B2B]"
              dangerouslySetInnerHTML={{
                __html: selectedCard?.title ?? "",
              }}
            />
            <SheetDescription className="text-gray-600">
              {selectedCard?.description}
            </SheetDescription>
          </SheetHeader>

          {selectedCard?.rights?.length ? (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-[#0B4B2B] mb-3">
                Derechos
              </h4>
              <ul className="space-y-3">
                {selectedCard.rights.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-gray-800 text-base"
                  >
                    <span className="w-2 h-2 mt-2 rounded-full bg-[#0B4B2B] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* OBLIGACIONES */}
          {selectedCard?.obligations?.length ? (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-[#0B4B2B] mb-3">
                Obligaciones
              </h4>
              <ul className="space-y-3">
                {selectedCard.obligations.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-gray-800 text-base"
                  >
                    <span className="w-2 h-2 mt-2 rounded-full bg-[#0B4B2B] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
