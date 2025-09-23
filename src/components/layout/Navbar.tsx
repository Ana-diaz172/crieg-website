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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
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
              className={`flex gap-6 font-medium items-center transition-colors ${
                scrolled ? "text-gray-900" : "text-white"
              }`}
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
                  className="bg-[#0B4B2B] border border-[#07572f] px-6 py-3 rounded-full flex gap-1 cursor-pointer items-center text-base font-medium hover:bg-[#0D5C36] transition text-white"
                  href="/colegiarse"
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
                  className={`inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    scrolled
                      ? "text-gray-900 hover:text-gray-600 focus:ring-gray-300"
                      : "text-white hover:opacity-90 focus:ring-white/50"
                  }`}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>

              {/* Drawer content */}
              <SheetContent side="right" className="w-full sm:max-w-xs p-0">
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
                            href="/acerca"
                            className="block rounded-md px-3 py-2 text-gray-900 hover:bg-gray-100"
                          >
                            Acerca de nosotros
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link
                            href="/contacto"
                            className="block rounded-md px-3 py-2 text-gray-900 hover:bg-gray-100"
                          >
                            Contacto
                          </Link>
                        </SheetClose>
                      </li>
                      <li className="pt-2">
                        <SheetClose asChild>
                          <Link
                            href="/colegiarse"
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
