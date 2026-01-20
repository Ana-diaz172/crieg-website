"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CheckoutFormData } from "@/interface/checkout";

interface PersonalDataFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

export default function PersonalDataForm({
  register,
  errors,
}: PersonalDataFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Datos Personales</h2>
        <p className="text-gray-600 text-base">
          Ingresa tu información de contacto
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-1">
          <Label htmlFor="firstname">Nombres *</Label>
          <Input
            id="firstname"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <p className="text-red-500 text-sm">{errors.firstname.message}</p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-1">
          <Label htmlFor="lastname">Apellidos *</Label>
          <Input id="lastname" {...register("lastname", { required: true })} />
          {errors.lastname && (
            <p className="text-red-500 text-sm">{errors.lastname.message}</p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-1">
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-1">
          <Label htmlFor="phone">Teléfono (WhatsApp) *</Label>
          <Input id="phone" {...register("phone", { required: true })} />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-1">
          <Label htmlFor="city">Ciudad *</Label>
          <Input id="city" {...register("city", { required: true })} />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-1">
          <Label htmlFor="date_of_birth">Fecha de Nacimiento *</Label>
          <Input
            id="date_of_birth"
            type="date"
            {...register("date_of_birth", { required: true })}
          />
          {errors.date_of_birth && (
            <p className="text-red-500 text-sm">
              {errors.date_of_birth.message}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
