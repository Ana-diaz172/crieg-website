"use client";

import Image from "next/image";
import { ArrowUpRight, ScrollText } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const slides = [
  { src: "/banner.webp", alt: "Banner CRIEG" },
  { src: "/banner-congreso.webp", alt: "Congreso CRIEG 2026" },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen sm:h-screen lg:h-full lg:min-h-[820px] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            fill
            src={s.src}
            alt={s.alt}
            className={i === 1 ? "object-contain" : "object-cover"}
            priority={i === 0}
          />
        </div>
      ))}

      <div className="absolute inset-x-0 top-0 bg-linear-to-b from-black/70 to-transparent h-[110px] sm:h-[130px] z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent z-10" />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {current === 1 && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20">
          <Link
            href="https://crieg-20923872.hubspotpagebuilder.com/2do-congreso-virtual-crieg"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#8B1A1A] hover:bg-[#a52020] text-white px-8 py-3 rounded-full text-base font-semibold transition flex items-center gap-2"
          >
            Consulta el programa
            <ArrowUpRight className="size-5" />
          </Link>
        </div>
      )}

      <div
        className={`absolute left-0 bottom-20 sm:bottom-24 lg:bottom-20 w-full flex justify-center items-center z-20 transition-opacity duration-500 ${
          current === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
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
                href="/membership"
              >
                Colegiarse
                <ArrowUpRight className="text-white" />
              </Link>
              <Link
                className="border border-white px-6 py-3 rounded-full flex gap-3 cursor-pointer mt-4 items-center text-base sm:text-lg font-medium hover:bg-[#0D5C36] transition"
                href="/invoice"
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