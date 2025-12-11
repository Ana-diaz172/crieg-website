import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HubspotTracker from "@/components/HubspotTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crieg - Colegio de Radiología e Imagen del estado de Guanajuato",
  description: "Colegio de Radiología e Imagen del estado de Guanajuato",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var _hsq = window._hsq = window._hsq || [];
            _hsq.push(['setPath', window.location.pathname]);
            _hsq.push(['doNotTrackForms', true]); // 👈 Esto desactiva la captura automática
          `,
        }}
      />
      <script
        type="text/javascript"
        id="hs-script-loader"
        async
        defer
        src="//js.hs-scripts.com/20923872.js"
      ></script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <HubspotTracker />
        {children}
        <Footer />
      </body>
    </html>
  );
}
