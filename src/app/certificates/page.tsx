"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Certificate = {
  label: string;
  link: string;
};

type AnnualCertificate = {
  id: string;
  year: string;
  certificates: Certificate[];
};

const certificatesByYear: AnnualCertificate[] = [
  {
    id: "2024",
    year: "Constancias 2024",
    certificates: [
      {
        label: "Reconocimiento como Miembro 2024",
        link: "https://drive.google.com/drive/folders/1KwLllvEsCM3Imt5MERpCRtl9uKBY7LSq",
      },
      {
        label: "Constancias Sesiones Mensuales 2024",
        link: "https://drive.google.com/drive/folders/1-h9cT2OZzrqukaqGYNSf_oLo6wmZp-PP",
      },
      {
        label: "Constancias Congreso 2024",
        link: "https://drive.google.com/drive/folders/1u76OmkWsTUeImUFmQ69Eo-JP2kX6ZTac",
      },
    ],
  },
  {
    id: "2023",
    year: "Constancias 2023",
    certificates: [
      {
        label: "Reconocimiento como Miembro 2023",
        link: "https://drive.google.com/drive/folders/1YIcSISK3mew5-_euwK7MTyrBxCQJBy5U",
      },
      {
        label: "Constancias Sesiones Mensuales 2023",
        link: "https://drive.google.com/drive/folders/1mqQ6ymYwhejlSwkimjQd8v-sasut5vTD",
      },
      {
        label: "Constancias Ponentes 2023",
        link: "https://drive.google.com/drive/folders/1sYuoCpvAeQtYgmSmiKc7CTXMOeivOThc",
      },
      {
        label: "Constancias Congreso 2023",
        link: "https://drive.google.com/drive/folders/19W0Zf9G9zKBYA3J1tA5T9JpfZ_kF-VJf",
      },
    ],
  },
  {
    id: "2022",
    year: "Constancias 2022",
    certificates: [
      {
        label: "Reconocimiento como miembro 2022",
        link: "https://drive.google.com/drive/folders/1mot-YjJaE_PaoeHxfk4DzLj5iUk2MAZn",
      },
      {
        label: "Constancias Sesiones Mensuales 2022",
        link: "https://drive.google.com/drive/folders/1SNnweoa6eWOtRoRCL8Arwlvhm8JyQx7-",
      },
      {
        label: "Constancias Congreso 2022",
        link: "https://crieg.com.mx/congreso/constancias/",
      },
      {
        label: "Noticias Congreso",
        link: "https://crieg.com.mx/congreso/noticias/",
      },
      {
        label: "Congreso XVII",
        link: "https://crieg.com.mx/conferencia-dia-1/",
      },
    ],
  },
];

export default function CertificatesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Banner superior */}
      <div className="relative w-full h-[30vh] md:h-[30vh] overflow-hidden">
        <Image
          src="/about-banner-page.jpg"
          alt="Equipo médico de radiología trabajando en conjunto"
          fill
          className="object-cover object-center"
          priority
          />
        <div className="absolute inset-0 bg-black/30" />
          </div>
        <div className="text-center max-w-2xl mb-5 mt-12 px-6 mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Miembros de CRIEG
          </h2>
          <p className="text-base sm:text-lg font-light max-w-2xl">
            Consulta las constancias y reconocimientos de años anteriores.
          </p>
        </div>

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {certificatesByYear.map((year) => (
            <section key={year.id} className="text-center">
            <h2 className="text-2xl font-semibold text-[#0B4B2B] mb-6">
              {year.year}
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
              {year.certificates.map((certificate, i) => (
                  <Link
                  key={i}
                  href={certificate.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-[#0B4B2B] border border-[#07572f] px-6 py-2.5 text-white font-medium hover:bg-[#0D5C36] transition text-sm"
                  >
                  {certificate.label}
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
        </div>
  );
}
