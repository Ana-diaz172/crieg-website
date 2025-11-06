"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import { Member } from "@/interface/Member";

type MemberGridWithSheetsProps = {
  members: Member[];
};

const roleDetails: Record<
  Member["specialty"],
  { sections: { title: string; body: string[] }[] }
> = {
  Presidente: {
    sections: [
      {
        title: "Elección",
        body: [
          "Será elegido mediante votación en Asamblea General Ordinaria.",
          "Al ser elegido tendrá los títulos de Vicepresidente y Presidente-Electo por 2 años; al término de dicho periodo tomará el puesto de Presidente.",
          "Con este periodo de vicepresidencia de 2 años se asegura la continuidad de proyectos, experiencia administrativa y sensibilidad con el Colegio en una Mesa Directiva previa a su nombramiento como Presidente.",
        ],
      },
      {
        title: "Funciones",
        body: [
          "Proponer a miembros activos u honorarios para integrar la Mesa Directiva; deberán ser votados en Asamblea General Ordinaria.",
          "Podrá llamar a miembros para una Mesa Directiva extendida mediante comisiones (página web, redes sociales, contacto con sedes de residencia, sesiones mensuales, congreso anual, relaciones públicas, concurso de carteles).",
          "Nombrar un vocal por cada municipio para representar al Colegio con actividades de promoción, academia y asesoría.",
          "Nombrar Delegados ante la Federación Mexicana de Radiología e Imagen u otras entidades.",
          "Convocar y dirigir la Asamblea Ordinaria Anual y, cuando se requiera, Asambleas Extraordinarias.",
          "Ser el representante legal del Colegio, con pleno poder administrativo y legal.",
          "Coordinar los trabajos de la Mesa Directiva y proponer líneas de trabajo.",
        ],
      },
      {
        title: "Duración en el cargo",
        body: [
          "Periodo de 2 años.",
          "Podrá ser reelegido para el cargo de Presidente luego de un periodo de 2 años sin funciones administrativas.",
          "Podrá ser elegido para un cargo diferente en la Mesa Directiva del periodo inmediato siguiente.",
        ],
      },
    ],
  },
  Secretario: {
    sections: [
      {
        title: "Elección",
        body: [
          "Será elegido mediante votación en Asamblea General Ordinaria.",
          "Al ser elegido tomará el puesto de Secretario General.",
        ],
      },
      {
        title: "Funciones",
        body: [
          "Generar la orden del día para cada asamblea y redactar el acta posterior.",
          "Asistir a cada reunión (física o virtual) de la Mesa Directiva.",
          "Crear la orden del día y la minuta de cada reunión de Mesa Directiva.",
          "Coordinar a las comisiones.",
          "Puede fungir como Delegado o ser titular de una comisión.",
        ],
      },
      {
        title: "Duración en el cargo",
        body: [
          "Periodo de 2 años.",
          "Podrá ser reelegido luego de 2 años sin funciones administrativas.",
          "Podrá ser elegido para un cargo diferente en la Mesa Directiva siguiente.",
        ],
      },
    ],
  },
  Tesorero: {
    sections: [
      {
        title: "Elección",
        body: [
          "Será elegido mediante votación en Asamblea General Ordinaria.",
          "Al ser elegido tomará el puesto de Tesorero.",
        ],
      },
      {
        title: "Funciones",
        body: [
          "Recibir y tramitar el cambio de titulares de las cuentas bancarias del Colegio.",
          "Administrar los recursos económicos del Colegio y realizar pagos a proveedores.",
          "Recibir pagos por membresías, cursos, congresos y patrocinios.",
          "Transferir anualmente recursos a la Federación por concepto de membresías.",
          "Contratar a un contador de apoyo y emitir factura fiscal.",
        ],
      },
      {
        title: "Duración en el cargo",
        body: [
          "Periodo de 2 años.",
          "Podrá ser reelegido luego de 2 años sin funciones administrativas.",
          "Podrá ser elegido para un cargo diferente en la Mesa Directiva siguiente.",
        ],
      },
    ],
  },
  Vicepresidente: {
    sections: [
      {
        title: "Elección",
        body: [
          "Será elegido mediante votación en Asamblea General Ordinaria o Extraordinaria.",
          "Tendrá los títulos de Vicepresidente y Presidente-Electo por 2 años; al término tomará el puesto de Presidente.",
        ],
      },
      {
        title: "Funciones",
        body: [
          "Participar activamente en cada reunión de la Mesa Directiva.",
          "Ser el nexo entre la Mesa Directiva actual y la siguiente que él presidirá.",
          "Puede tener el cargo de Delegado, Vocal o ser titular de una comisión.",
        ],
      },
      {
        title: "Duración en el cargo",
        body: [
          "El Vicepresidente tendrá un periodo de 2 años.",
          "Posterior a este periodo tomará el cargo de Presidente.",
        ],
      },
    ],
  },
};

const commonGuidelines = [
  // 5.3 Duración (ya incluida arriba para Vicepresidente; se mantiene aquí porque pediste incluirlo en todos)
  "Duración del Vicepresidente: 2 años; posteriormente toma el cargo de Presidente.",
  // Nombramiento y elección de Presidente
  "Nombramiento y elección de Presidente — Proceso de elección: convocatoria en la orden del día con al menos dos meses de anticipación; registro y publicación de candidatos al menos 15 días antes.",
  "Requisitos de candidatos a Presidente: ser miembro activo u honorario; no haber sido Presidente en los 2 años previos.",
  "Publicación de fecha y hora de elección: redes sociales del Colegio, chat oficial de WhatsApp, correo electrónico o impreso estatal, junto con la convocatoria, con al menos 2 meses de anticipación.",
  "Requisitos de electores: ser miembro activo u honorario y asistir en lugar, fecha y hora convocados.",
  "Criterios de elección: con dos candidatos, mayoría absoluta (>50%); con tres o más, mayoría relativa (mayor número de votos).",
  "El candidato elegido será Vicepresidente y Presidente-Electo por 2 años; al término tomará el cargo de Presidente, protestado en Asamblea General.",
  // Nombramiento de Secretario y Tesorero
  "Nombramiento de Secretario General y Tesorero — Proceso de elección: convocatoria con 2 meses; publicación de candidatos 15 días antes.",
  "Requisitos de candidatos: ser miembro activo u honorario; para Secretario/Tesorero, no haber ocupado ese cargo en al menos 2 años previos. El Secretario/Tesorero actual puede ser elegido a un cargo distinto en el siguiente periodo.",
  "Publicación de fecha y hora: redes sociales, chat oficial de WhatsApp, correo electrónico y medio impreso estatal con al menos 2 meses de anticipación.",
  "Requisitos de electores: ser miembro activo u honorario y asistir en lugar, fecha y hora convocados.",
  "Criterios de elección: con dos candidatos, mayoría absoluta; con tres o más, mayoría relativa.",
  // Ausencia
  "Ausencia de un miembro: si el Presidente deja su cargo, el Vicepresidente toma el puesto y concluye el periodo de 2 años.",
  "Ausencia del Secretario: el Presidente nombra un Secretario interino por el resto del periodo vigente.",
  "Ausencia del Tesorero: el Presidente nombra un Tesorero interino por el resto del periodo vigente.",
  "Si el Vicepresidente renuncia a tomar el puesto de Presidente, se convoca a nueva elección en Asamblea General Ordinaria o Extraordinaria.",
  // Entrega-Recepción
  "Entrega-Recepción: la Mesa Directiva saliente entrega el acta de asamblea ante Notario público con poderes y facultades a la entrante.",
  "Cada miembro saliente entrega actividades, bienes e información financiera correspondiente al Colegio.",
];

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
        {items.map((i, idx) => (
          <li key={idx} className="leading-relaxed">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MemberGridWithSheets({
  members,
}: MemberGridWithSheetsProps) {
  // Ensure order and stable keys
  const list = useMemo(() => members, [members]);

  return (
    <div className="w-full mx-auto my-16 px-8 max-w-7xl">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-gray-900">
        Mesa directiva
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
        {list.map((member) => (
          <div key={member.id}>
            <div className="relative w-full h-auto mb-2 rounded-lg">
              <Image
                src={member.image}
                alt={member.name}
                width={400}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>

            <p className="text-base text-gray-900 font-medium">{member.name}</p>
            <p className="text-sm text-gray-500">{member.specialty}</p>

            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="mt-4 text-[#0B4B2B] cursor-pointer font-medium transition hover:underline flex items-center"
                  aria-label={`Ver más sobre ${member.name}`}
                >
                  Ver más
                  <ArrowUpRight className="inline-block ml-1 size-4" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-full sm:max-w-md md:max-w-lg p-0"
              >
                <SheetHeader className="border-b border-gray-200 p-6">
                  <SheetTitle className="text-xl text-gray-900">
                    {member.name}
                  </SheetTitle>
                  <SheetDescription className="text-sm text-gray-600">
                    {member.specialty}
                  </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-9rem)]">
                  <div className="p-6 space-y-6">
                    {/* Header Card */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Miembro</p>
                        <p className="text-base font-medium text-gray-900 leading-tight">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {member.specialty}
                        </p>
                      </div>
                    </div>

                    {/* Role-specific sections */}
                    {roleDetails[member.specialty]?.sections.map((s, idx) => (
                      <Section key={idx} title={s.title} items={s.body} />
                    ))}

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* Common guidelines for all drawers */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Lineamientos institucionales (aplican a todos los
                        cargos)
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        {commonGuidelines.map((g, i) => (
                          <li key={i} className="leading-relaxed">
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollArea>

                <SheetFooter className="border-t border-gray-200 p-6">
                  <SheetClose asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Cerrar
                    </button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="/directors" 
          className="inline-flex items-center gap-2 px-6 py-3 text-[#0B4B2B] border border-[#0B4B2B] rounded-lg font-medium hover:bg-[#0B4B2B] hover:text-white transition"
        >
          Ver más sobre la Mesa Directiva
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
