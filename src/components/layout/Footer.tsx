"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const mainLinks = [
    { label: "INICIO", href: "/" },
    { label: "ACERCA DE NOSOTROS", href: "/about" },
    { label: "CONTACTO", href: "/contact" },
    { label: "COLEGIARSE", href: "/membership" },
  ];

  const socialLinks = [
    { label: "FACEBOOK", href: "https://www.facebook.com/ColegiodeRadiologiaeImagendelEstadodeGuanajuato" },
    { label: "INSTAGRAM", href: "https://www.instagram.com/crieg.guanajuato/#" },
    { label: "YOUTUBE", href: "https://www.youtube.com/@CRIEGGuanajuato/videos" },
  ];

  const legalLinks = [
    { label: "Términos y Condiciones", href: "#" },
    { label: "Política de Privacidad", href: "#" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:block py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {mainLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:underline transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            <span className="hidden lg:block text-gray-300">|</span>
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:underline transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4">
          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-between w-full p-4 text-left"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="text-sm font-medium text-gray-700">MENÚ</span>
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Menu className="h-5 w-5 text-gray-700" />
            )}
          </button>

          {isMobileMenuOpen && (
            <div className="pb-4 space-y-2">
              {mainLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:underline hover:bg-gray-50 transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-gray-200 mt-4 pt-4">
                {socialLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:underline hover:bg-gray-50 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Logo and Brand */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex size-[50px] relative items-center space-x-4">
                  <Image src="/crieg-logo.png" fill alt="crieg logo" />
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span>© 2025 CRIEG</span>
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="hover:underline transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
