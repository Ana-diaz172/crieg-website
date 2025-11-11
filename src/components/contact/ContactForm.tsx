'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// 1. Definición del Esquema de Validación con Zod
const ContactSchema = z.object({
  name: z.string().min(2, {
    message: "El name debe tener al menos 2 caracteres.",
  }).max(50, {
    message: "El name no puede exceder los 50 caracteres.",
  }),
  email: z.string().email({
    message: "Debe ser una dirección de correo válida.",
  }),
  phone: z.string().min(8, {
    message: "El teléfono debe tener al menos 8 dígitos."
  }).max(15, {
    message: "El teléfono no puede exceder los 15 dígitos."
  }),
  note: z.string().min(1, {
    message: "El mensaje es obligatorio.",
  }).max(500, {
    message: "El mensaje es demasiado largo (máximo 500 caracteres).",
  }),
});

// Tipado del formulario
type ContactFormValues = z.infer<typeof ContactSchema>;


export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      note: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    console.log("Datos del formulario enviados:", data);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); 
      reset(); 

    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  }

  // Componente de Ayuda para Mostrar Errores
  const ErrorMessage = ({ message }: { message: string | undefined }) => (
    <p className="mt-1 text-sm text-red-600 h-5">{message}</p>
  );

  return (
    // CAMBIO CLAVE: max-w-xl (aprox 512px) cambiado a max-w-3xl (aprox 768px)
    <div className="w-full p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Envíanos un mensaje</h2>

      {/* note de éxito visible después de un envío exitoso */}
      {isSubmitSuccessful && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          ¡Gracias! Tu note ha sido enviado exitosamente. Nos pondremos en contacto pronto.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre completo *
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`mt-1 block w-full rounded-md border p-2 focus:ring-[#0B4B2B] focus:border-[#0B4B2B] ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          <ErrorMessage message={errors.name?.message} />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico *
          </label>
          <input
            id="correo"
            type="email"
            {...register("email")}
            className={`mt-1 block w-full rounded-md border p-2 focus:ring-[#0B4B2B] focus:border-[#0B4B2B] ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          <ErrorMessage message={errors.email?.message} />
        </div>

        {/* Campo Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono *
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className={`mt-1 block w-full rounded-md border p-2 focus:ring-[#0B4B2B] focus:border-[#0B4B2B] ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          <ErrorMessage message={errors.phone?.message} />
        </div>

        {/* Campo note Libre */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">
            Mensaje *
          </label>
          <textarea
            id="note"
            rows={4}
            {...register("note")}
            className={`mt-1 block w-full rounded-md border p-2 focus:ring-[#0B4B2B] focus:border-[#0B4B2B] ${
              errors.note ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          <ErrorMessage message={errors.note?.message} />
        </div>
        
        {/* Botón de Envío */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0B4B2B] hover:bg-[#0D5C36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B4B2B] disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </div>
      </form>
    </div>
  );
}