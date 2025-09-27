"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      setLoading(false);
    } else {
      router.push("/");
    }
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

        <button
          onClick={() => router.push("/")}
          className="w-full bg-[#0B4B2B] hover:bg-green-800 text-white py-3 rounded-lg font-medium"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
