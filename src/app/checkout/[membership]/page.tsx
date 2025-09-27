"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const memberships = {
  "crieg-medicos": {
    name: "Membresía Médicos Radiólogos CRIEG",
    price: "$2,600",
    description:
      "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos.",
  },
  "crieg-residentes": {
    name: "Membresía Residentes CRIEG",
    price: "$600",
    description:
      "Accede a congresos con tarifas preferenciales y mantén tu membresía CRIEG al día.",
  },
  fmri: {
    name: "Membresía FMRI",
    price: "$4,000",
    description:
      "Disfruta costos preferenciales en congresos y acceso a contenido académico exclusivo.",
  },
};

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const params = useParams();
  const router = useRouter();

  // Usar parámetros de la URL en lugar de searchParams
  const membershipId = params.membership as string;

  const membership = membershipId
    ? memberships[membershipId as keyof typeof memberships]
    : null;

  useEffect(() => {
    if (!membership) {
      router.push("/");
    }
  }, [membership, router]);

  const handleCheckout = async () => {
    if (!membershipId) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/create-checkout-session", {
        membershipId,
      });

      // Redirigir a Stripe Checkout
      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al procesar el pago. Intenta de nuevo.");
      setLoading(false);
    }
  };

  if (!membership) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">
            Membresía no encontrada
          </h1>
          <p className="text-gray-600 mb-4">
            Por favor selecciona una membresía válida.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#0B4B2B] text-white px-4 py-2 rounded-lg"
          >
            Volver a membresías
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Confirmar compra
          </h1>
          <p className="text-gray-600">
            Revisa los detalles de tu membresía antes de proceder al pago.
          </p>
        </div>

        <div className="border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#0B4B2B] mb-2">
            {membership.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4">{membership.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Precio:</span>
            <span className="text-2xl font-semibold text-[#0B4B2B]">
              {membership.price}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-[#0B4B2B] hover:bg-green-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? "Procesando..." : "Proceder al pago"}
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 py-2 transition-colors"
        >
          Volver a membresías
        </button>
      </div>
    </div>
  );
}
