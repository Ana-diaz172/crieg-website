"use client";

import { Plus, Minus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type AccordionKey = "education" | "collaboration" | "research" | null;

export default function AboutHeroSection() {
  // Mantiene por defecto abierto "education" como en tu diseño original
  const [expanded, setExpanded] = useState<AccordionKey>("education");

  const toggleItem = (key: Exclude<AccordionKey, null>) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen py-12 lg:py-0">
          {/* Left Content */}
          <div className="space-y-8 lg:space-y-12">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-gray-900">
                Impulsando la
                <br />
                excelencia médica
              </h1>

              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  Somos el Colegio de Radiología e Imagen
                  <br />
                  del Estado de Guanajuato, dedicados a
                  <br />
                  la educación médica continua especializada.
                </p>

                <p className="text-lg leading-relaxed">
                  Ofreciendo eventos organizados, transparentes
                  <br />
                  y con valor ante el Consejo Mexicano de
                  <br />
                  Radiología e Imagen, damos más espacio para...
                </p>
              </div>
            </div>

            {/* Expandable Items */}
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleItem("education")}
                  className="flex items-center justify-between w-full text-left cursor-pointer"
                >
                  <span className="text-lg text-gray-900">
                    Desarrollo profesional y la certificación continua
                  </span>
                  {expanded === "education" ? (
                    <Minus className="h-5 w-5 text-gray-600 flex-shrink-0 ml-4" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-600 flex-shrink-0 ml-4" />
                  )}
                </button>

                {expanded === "education" && (
                  <div className="mt-4 text-gray-700 leading-relaxed">
                    <p>
                      Ofrecemos eventos de educación médica continua{" "}
                      <br className="hidden sm:inline" />
                      organizados y con valor ante el Consejo Mexicano{" "}
                      <br className="hidden sm:inline" />
                      de Radiología e Imagen, promoviendo la certificación{" "}
                      <br className="hidden sm:inline" />
                      y el mayor puntaje anual de recertificación.
                    </p>
                  </div>
                )}
              </div>

              {/* Item 2 */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleItem("collaboration")}
                  className="flex items-center justify-between w-full text-left cursor-pointer"
                >
                  <span className="text-lg text-gray-600">
                    Colaboración interinstitucional y el trabajo en equipo
                  </span>
                  {expanded === "collaboration" ? (
                    <Minus className="h-5 w-5 text-gray-600 flex-shrink-0 ml-4" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-600 flex-shrink-0 ml-4" />
                  )}
                </button>

                {expanded === "collaboration" && (
                  <div className="mt-4 text-gray-700 leading-relaxed">
                    <p>
                      Fomentamos la relación con otras organizaciones médicas{" "}
                      <br className="hidden sm:inline"/>
                      estatales, nacionales e internacionales, creando{" "}
                      <br className="hidden sm:inline"/>
                      una red sólida de conocimiento e innovación médica.
                    </p>
                  </div>
                )}
              </div>

              {/* Item 3 */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleItem("research")}
                  className="flex items-center justify-between w-full text-left cursor-pointer"
                >
                  <span className="text-lg text-gray-600">
                    Investigación y formación de nuevas generaciones
                  </span>
                  {expanded === "research" ? (
                    <Minus className="h-5 w-5 text-gray-600 flex-shrink-0 ml-4" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-600 flex-shrink-0 ml-4" />
                  )}
                </button>

                {expanded === "research" && (
                  <div className="mt-4 text-gray-700 leading-relaxed">
                    <p>
                      Estimulamos la investigación médica y involucramos{" "} 
                      <br className="hidden sm:inline"/>
                      activamente a los médicos residentes en actividades{" "}
                      <br className="hidden sm:inline"/>
                      académicas especializadas en radiología e imagen.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Ver más button */}
            <Link
              className="bg-[#0B4B2B] text-white w-fit border border-[#07572f] px-6 py-3 rounded-full flex gap-1 cursor-pointer items-center text-base font-medium hover:bg-[#0D5C36] transition"
              href="about"
            >
              Ver más
              <ArrowUpRight className="text-white" />
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative lg:h-screen flex items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none">
              <div className="aspect-[4/5] lg:aspect-[3/4] xl:aspect-[4/5] overflow-hidden">
                <img
                  src="about-banner.webp"
                  alt="Médicos especializados en radiología trabajando en equipo"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay profesional */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-gray-900/20 mix-blend-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
