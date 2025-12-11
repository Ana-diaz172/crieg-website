"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el mensaje");
      }

      setStatus("success");

      // Limpiar formulario
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      // Reset success message después de 5 segundos
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Error al enviar el mensaje. Por favor intenta nuevamente."
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        data-hs-cf-bound="false"
        data-form-type="other"
      >
        {/* Nombre */}
        <div>
          <label
            htmlFor="contact_name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre completo *
          </label>
          <input
            type="text"
            id="contact_name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={status === "loading"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Ej: Dr. Juan Pérez"
            autoComplete="off"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact_email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="contact_email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={status === "loading"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="tu@email.com"
            autoComplete="off"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="contact_phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Teléfono (opcional)
          </label>
          <input
            type="tel"
            id="contact_phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={status === "loading"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="+52 477 123 4567"
            autoComplete="off"
          />
        </div>

        {/* Mensaje */}
        <div>
          <label
            htmlFor="contact_message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mensaje *
          </label>
          <textarea
            id="contact_message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={status === "loading"}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B4B2B] focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Escribe tu mensaje aquí..."
            autoComplete="off"
          />
        </div>

        {/* Mensaje de éxito */}
        {status === "success" && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 font-medium text-sm">
                ¡Mensaje enviado correctamente!
              </p>
              <p className="text-green-700 text-sm mt-1">
                Te responderemos a la brevedad posible.
              </p>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {status === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium text-sm">
                Error al enviar el mensaje
              </p>
              <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[#0B4B2B] text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <span>Enviar mensaje</span>
              <Send className="h-5 w-5" />
            </>
          )}
        </button>

        {/* Nota de privacidad */}
        <p className="text-xs text-gray-500 text-center">
          Al enviar este formulario, aceptas que CRIEG procese tus datos para
          responder a tu consulta.
        </p>
      </form>
    </div>
  );
}
