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
import { IInfoCard } from "@/interface/member";
import { infoCards } from "@/mock/member";

export default function InfoCardsSection() {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<IInfoCard | null>(null);

  const handleOpen = (card: IInfoCard) => {
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
            <div
              onClick={() => handleOpen(card)}
              className="border rounded-xl shadow-sm p-6 flex flex-col bg-white cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 text-center min-h-[280px] justify-between"
            >
              <div>
                <h3
                  className="text-2xl font-semibold text-[#0B4B2B] mb-3"
                  dangerouslySetInnerHTML={{ __html: card.title }}
                />
                <p className="text-sm font-normal text-gray-500">
                  {card.description}
                </p>
              </div>
              <div className="mt-4 text-sm text-[#0B4B2B] font-medium">
                <span>Ver más</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sheet  */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-2xl mx-auto rounded-t-2xl p-8 max-h-screen overflow-y-auto">
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
