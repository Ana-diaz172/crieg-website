"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const removeFixed = pathname === "/success" || pathname === "/invoice";

  useEffect(() => {
    // Asegura el valor correcto al montar (por si inicia scrolleado)
    const syncScroll = () => setScrolled(window.scrollY > 0);
    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    return () => window.removeEventListener("scroll", syncScroll);
  }, []);

  return (
    <header
      className={twMerge(
        "top-0 left-0 w-full z-50 transition-colors duration-300",
        scrolled ? "bg-white shadow-sm" : "bg-transparent",
        "fixed",
        removeFixed && "static"
      )}
    >
      <div className="px-8">
        <div className="w-full max-w-7xl mx-auto flex items-center py-4">
          {/* Logo */}
          <Link
            href="/"
            className="w-20 shrink-0 cursor-pointer"
            aria-label="Ir a inicio"
          >
            <Image
              src="/crieg-logo.png"
              alt="Crieg Logo"
              width={80}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="ml-auto hidden md:block">
            <ul
              className={twMerge(
                "flex gap-6 font-medium items-center transition-colors",
                scrolled ? "text-gray-900" : "text-white",
                removeFixed && "text-gray-900"
              )}
            >
              <li>
                <Link
                  className="hover:text-[#a7c3b5] transition-colors"
                  href="/"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-[#a7c3b5] transition-colors"
                  href="/about"
                >
                  Acerca de nosotros
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-[#a7c3b5] transition-colors"
                  href="/contact"
                >
                  Contacto
                </Link>
              </li>
              <li>
                  <Link
                    href="/certificates"
                    className=" hover:text-[#a7c3b5] transition-colors"
                  >
                    Constancias
                  </Link>
              </li>
              <li>
                <Link
                  className="bg-[#0B4B2B] border border-[#07572f] px-6 py-3 rounded-full flex gap-1 cursor-pointer items-center text-base font-medium hover:bg-[#0D5C36] transition text-white"
                  href="/membership"
                >
                  Colegiarse
                  <ArrowUpRight className="text-white" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile trigger */}
          <div className="ml-auto md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Abrir menú"
                  className={twMerge(
                    "inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    scrolled
                      ? "text-gray-900 hover:text-gray-600 focus:ring-gray-300"
                      : "text-white hover:opacity-90 focus:ring-white/50"
                  )}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-full sm:max-w-xs p-0">
                <VisuallyHidden>
                  <h2>Menú principal</h2>
                </VisuallyHidden>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 relative">
                      <Image
                        src="/crieg-logo.png"
                        alt="Crieg Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-base font-medium text-gray-900">
                      CRIEG
                    </span>
                  </div>

                  <nav>
                    <ul className="space-y-3">
                      <li>
                        <SheetClose asChild>
                          <Link
                            href="/"
                            className="block rounded-md px-3 py-2 text-gray-900 hover:bg-gray-100"
                          >
                            Inicio
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link
                            href="/about"
                            className="block rounded-md px-3 py-2 text-gray-900 hover:bg-gray-100"
                          >
                            Acerca de nosotros
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link
                            href="/contact"
                            className="block rounded-md px-3 py-2 text-gray-900 hover:bg-gray-100"
                          >
                            Contacto
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="pt-2">
                        <SheetClose asChild>
                          <Link
                            href="/certificates"
                            className="block rounded-md px-3 py-2 text-gray-900 hover:bg-gray-100"
                          >
                            Constancias
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link
                            href="/membership"
                            className="inline-flex items-center gap-1 rounded-full bg-[#0B4B2B] border border-[#07572f] px-5 py-2.5 text-white font-medium hover:bg-[#0D5C36] transition"
                          >
                            Colegiarse
                            <ArrowUpRight className="text-white h-4 w-4" />
                          </Link>
                        </SheetClose>
                      </li>
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
