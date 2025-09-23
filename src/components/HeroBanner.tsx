"use client";

import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Background image */}
      <Image
        fill
        src="/banner.webp"
        alt="Banner CRIEG"
        className="object-cover"
        priority
      />

      {/* Top gradient (keeps your exact look, just responsive height) */}
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent h-[110px] sm:h-[130px]" />

      {/* Bottom-to-top soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Content */}
      <div className="absolute left-0 bottom-20 sm:bottom-24 lg:bottom-32 w-full flex justify-center items-center">
        <div className="w-full max-w-7xl px-6 sm:px-8">
          <div className="w-full max-w-3xl text-white">
            <h1 className="font-light text-3xl sm:text-5xl lg:text-6xl leading-tight text-shadow-md mb-2">
              Colegio de Radiología e Imagen del estado de Guanajuato.
            </h1>

            <p className="text-base sm:text-lg max-w-[480px]">
              Nuestro principal objetivo es la educación médica continua
              involucrando a nuestros médicos desde su residencia.
            </p>

            <button
              type="button"
              className="bg-[#0B4B2B] border border-[#07572f] px-6 py-3 rounded-full flex gap-3 cursor-pointer mt-4 items-center text-base sm:text-lg font-medium hover:bg-[#0D5C36] transition"
              aria-label="Ir a Colegiarse"
            >
              Colegiarse
              <ArrowUpRight className="text-white" />
            </button>

            <div className="border-l border-white pl-4 mt-6">
              <div className="flex items-center gap-2">
                <Star className="text-white mb-1 h-4 w-4 sm:h-5 sm:w-5" />
                <Star className="text-white mb-1 h-4 w-4 sm:h-5 sm:w-5" />
                <Star className="text-white mb-1 h-4 w-4 sm:h-5 sm:w-5" />
                <Star className="text-white mb-1 h-4 w-4 sm:h-5 sm:w-5" />
                <Star className="text-white mb-1 h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <p className="text-white text-sm sm:text-base">
                1,000+ Médicos Colegiados
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
