"use client";

import Image from "next/image";
import { ArrowUpRight, ScrollText, Star } from "lucide-react";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[100vh] sm:h-[100vh] lg:h-full lg:min-h-[820px] overflow-hidden">
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
      <div className="absolute left-0 bottom-20 sm:bottom-24 lg:bottom-20 w-full flex justify-center items-center">
        <div className="w-full max-w-7xl px-6 sm:px-8">
          <div className="w-full max-w-3xl text-white">
            <h1 className="font-light text-5xl sm:text-5xl lg:text-6xl leading-tight text-shadow-md mb-2">
              Colegio de Radiología e Imagen del estado de Guanajuato.
            </h1>

            <p className="text-base sm:text-lg max-w-[480px]">
              Nuestro principal objetivo es la educación médica continua
              involucrando a nuestros médicos desde su residencia.
            </p>

            <div className="flex gap-4">
              <Link
                className="bg-[#0B4B2B] border border-[#07572f] px-6 py-3 rounded-full flex gap-3 cursor-pointer mt-4 items-center text-base sm:text-lg font-medium hover:bg-[#0D5C36] transition"
                aria-label="Ir a Colegiarse"
                href="/membership"
              >
                Colegiarse
                <ArrowUpRight className="text-white" />
              </Link>
              <Link
                className="border border-white px-6 py-3 rounded-full flex gap-3 cursor-pointer mt-4 items-center text-base sm:text-lg font-medium hover:bg-[#0D5C36] transition"
                aria-label="Ir a Colegiarse"
                href="/billing"
              >
                Facturar
                <ScrollText className="text-white size-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
