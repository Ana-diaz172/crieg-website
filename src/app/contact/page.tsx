"use client";

import { ArrowRight, Menu } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Content Section */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-12 lg:py-0">
          {/* Header */}
          <div className="mb-12">
            <h1 className="mt-20 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight text-gray-900 mb-6">
              Mantente en
              <br />
              contacto con CRIEG
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-lg">
              Estamos aquí para resolver cualquier duda
              <br />
              o consulta. Ya seas médico especialista
              <br />o residente, te tenemos cubierto.
            </p>
          </div>

          {/* Contact Form */}
          <ContactForm /> 

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 mt-10">
            {/* Email */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Email
              </h3>
              <a
                href="mailto:contacto@crieg.com.mx"
                className="text-gray-900 hover:text-green-600 transition-colors"
              >
                contacto@crieg.com.mx
              </a>
            </div>

            {/* Phone */}
            <div className="sm:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Teléfono
              </h3>
              <a
                href="tel:+524775907050"
                className="text-gray-900 hover:text-green-600 transition-colors"
              >
                +52 477 590 70 50
              </a>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Membership Card */}
            <a href="/membership">
              <div className="bg-[#0B4B2B] text-white p-6 rounded-lg group cursor-pointer hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-2">
                      ¿Quieres formar parte?
                    </p>
                    <h3 className="text-xl font-light">Colegiarse</h3>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative hidden lg:flex items-center justify-center p-8 lg:p-16">
          {/* Full-cover background image */}
          <Image
            src="/contact-banner.jpg"
            alt="Equipo médico de radiología"
            fill
            className="object-cover"
            priority
          />

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 -left-8 w-6 h-6 bg-white/15 rounded-full pointer-events-none" />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Menu className="h-5 w-5" />
          <span className="text-sm font-medium">menu</span>
        </div>
      </button>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-900/95 z-40 flex items-center justify-center">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <nav className="text-center space-y-8">
            <a
              href="/"
              className="block text-white text-2xl font-light hover:text-gray-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </a>
            <a
              href="/about"
              className="block text-white text-2xl font-light hover:text-gray-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Acerca de Nosotros
            </a>
            <a
              href="/contact"
              className="block text-white text-2xl font-light hover:text-gray-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </a>
            <a
              href="/membership"
              className="block text-white text-2xl font-light hover:text-gray-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Colegiarse
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
