"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Download } from "lucide-react";

function SuccessContent() {
  const [loading, setLoading] = useState(true);
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    // ⛔ evita dobles ejecuciones (StrictMode / Suspense)
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch(`/api/checkout/session-info?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setMembershipId(data.membershipId ?? null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B2B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando pago...</p>
        </div>
      </div>
    );
  }

  const isFmri = membershipId === "fmri";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          ¡Pago exitoso!
        </h1>

        <p className="text-gray-600 mb-8">
          Tu membresía ha sido activada correctamente. Recibirás un correo de
          confirmación en breve.
        </p>

        {/* 🔽 SOLO CRIEG VE CONSTANCIA */}
        {!isFmri && (
          <a
            href={`/api/certificate?session_id=${sessionId}`}
            className="gap-3 w-full bg-[#0B4B2B] hover:bg-green-800 text-white py-3 justify-center items-center rounded-lg font-medium flex mb-3"
          >
            <p>Descargar Constancia</p>
            <Download className="size-5" />
          </a>
        )}

        {/* 🔽 MENSAJE PARA FMRI */}
        {isFmri && (
          <p className="text-sm text-gray-600 mb-3">
            Esta membresía no incluye constancia descargable.
          </p>
        )}

        <button
          onClick={() => router.push("/")}
          className="w-full bg-[#0B4B2B] hover:bg-green-800 text-white py-3 rounded-lg font-medium mb-3"
        >
          Volver al inicio
        </button>

        {/* <button
          onClick={() => router.push("/invoice")}
          className="w-full bg-[#0B4B2B] hover:bg-green-800 text-white py-3 rounded-lg font-medium"
        >
          Factura ya
        </button> */}
        <button
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdZDNvaExJ2iJQnlL6wyohsqYCNhIJEZnSK4j744xuIJAz_Ug/viewform?usp=dialog&pli=1&authuser=0",
              "_blank",
            )
          }
          className="w-full bg-[#0B4B2B] hover:bg-green-800 text-white py-3 rounded-lg font-medium"
        >
          Factura ya
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4B2B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
