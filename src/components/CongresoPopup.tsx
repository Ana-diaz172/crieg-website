"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

export default function CongresoPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const congresoActivo = new Date() >= new Date("2026-06-02T15:00:00");
    const yaVisto = sessionStorage.getItem("congreso-popup");
    if (congresoActivo && !yaVisto) {
      setTimeout(() => setVisible(true), 1000);
    }
  }, []);

  const cerrar = () => {
    sessionStorage.setItem("congreso-popup", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={cerrar}
          className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
          aria-label="Cerrar"
        >
          <X className="size-5" />
        </button>
        <div className="relative w-full aspect-[16/7]">
          <Image
            fill
            src="/banner-congreso.webp"
            alt="2do Congreso Virtual de Radiología CRIEG 2026"
            className="object-contain bg-white"
          />
        </div>
        <div className="bg-[#6B1A1A] py-4 px-6 flex items-center justify-between gap-4">
          <p className="text-white text-sm font-medium">
            25 - 26 Junio 2026 · Virtual · Guanajuato, México
          </p>
          <Link
            href="https://crieg-20923872.hubspotpagebuilder.com/2do-congreso-virtual-crieg"
            target="_blank"
            rel="noopener noreferrer"
            onClick={cerrar}
            className="bg-white text-[#6B1A1A] hover:bg-gray-100 px-5 py-2 rounded-full text-sm font-bold transition whitespace-nowrap"
          >
            Consulta el programa →
          </Link>
        </div>
      </div>
    </div>
  );
}