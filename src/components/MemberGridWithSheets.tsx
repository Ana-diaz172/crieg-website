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
import { commonGuidelines, roleDetails } from "@/mock/roles";
import { Member } from "@/interface/member";

export type MemberGridWithSheetsProps = {
  members: Member[];
};

export default function MemberGridWithSheets({
  members,
}: MemberGridWithSheetsProps) {
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
                      <div className="space-y-2" key={idx}>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {s.title}
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                          {s.body.map((i, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {i}
                            </li>
                          ))}
                        </ul>
                      </div>
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
