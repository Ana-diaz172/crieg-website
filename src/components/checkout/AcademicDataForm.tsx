"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  UseFormTrigger,
  FieldErrors,
} from "react-hook-form";
import { FormData, ProfessionalType } from "@/app/checkout/[membership]/page";

interface AcademicDataFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  trigger: UseFormTrigger<FormData>;
}

export default function AcademicDataForm({
  register,
  errors,
  watch,
  setValue,
  trigger,
}: AcademicDataFormProps) {
  const professionalType = watch("professional_type");

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Datos Académicos</h2>
        <p className="text-gray-600 text-base">
          Completa tu información profesional
        </p>
      </div>

      <div className="space-y-4 gap-4">
        {/* Tipo de profesional */}

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
          <Label htmlFor="university">
            Nombre Completo de la Universidad que Emite su Título de Medicina *
          </Label>
          <Input
            id="university"
            {...register("university", { required: true })}
          />
          {errors.university && (
            <p className="text-red-500 text-sm">{errors.university.message}</p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
          <Label htmlFor="specialty">
            Nombre Completo tanto de la Universidad como del Hospital y/o de la
            Institución donde cursó la Especialidad en Radiología *
          </Label>
          <Input
            id="specialty"
            {...register("specialty", { required: true })}
          />
          {errors.specialty && (
            <p className="text-red-500 text-sm">{errors.specialty.message}</p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
          <Label htmlFor="sub_specialty">
            Nombre Completo tanto de la Universidad como del Hospital y/o de la
            Institución donde cursó la(s) Sub Especialidad(es) o el(los)
            Curso(s) de Alta Especialidad *
          </Label>
          <p className="text-xs text-gray-500">
            En caso de no tener, escribir{" "}
            <span className="italic">"No aplica"</span>
          </p>
          <Input
            id="sub_specialty"
            {...register("sub_specialty", { required: true })}
          />
          {errors.sub_specialty && (
            <p className="text-red-500 text-sm">
              {errors.sub_specialty.message}
            </p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
          <Label htmlFor="professional_id">Cédula Profesional *</Label>
          <p className="text-xs text-gray-500">
            En caso de no tener, escribir{" "}
            <span className="italic">"No aplica"</span>
          </p>
          <Input
            id="professional_id"
            {...register("professional_id", { required: true })}
          />
          {errors.professional_id && (
            <p className="text-red-500 text-sm">
              {errors.professional_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
          <Label htmlFor="specialty_prof_id">
            Cédula Profesional de Especialidad *
          </Label>
          <p className="text-xs text-gray-500">
            En caso de no tener, escribir{" "}
            <span className="italic">"No aplica"</span>
          </p>
          <Input
            id="specialty_prof_id"
            {...register("specialty_prof_id", { required: true })}
          />
          {errors.specialty_prof_id && (
            <p className="text-red-500 text-sm">
              {errors.specialty_prof_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
          <Label htmlFor="sub_specialty_prof_id">
            Cédula Profesional de Sub Especialidad *
          </Label>
          <p className="text-xs text-gray-500">
            En caso de no tener, escribir{" "}
            <span className="italic">"No aplica"</span>
          </p>
          <Input
            id="sub_specialty_prof_id"
            {...register("sub_specialty_prof_id", { required: true })}
          />
          {errors.sub_specialty_prof_id && (
            <p className="text-red-500 text-sm">
              {errors.sub_specialty_prof_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
          <Label htmlFor=" validity_period">
            Periodo de Vigencia de su última Certificación ante el Consejo
            Mexicano de Radiología e Imagen CMRI *
          </Label>
          <Input
            id=" validity_period"
            {...register("validity_period", { required: true })}
          />
          {errors.validity_period && (
            <p className="text-red-500 text-sm">
              {errors.validity_period.message}
            </p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
          <Label htmlFor="added_certification">
            ¿Cuenta con Certificación Agregada? ¿En qué área? ¿Cuál es la
            vigencia de su certificado actual? ¿Cuál es el Folio de su
            Certificado Agregado? *
          </Label>
          <Input
            id="added_certification"
            {...register("added_certification", { required: true })}
          />
          {errors.added_certification && (
            <p className="text-red-500 text-sm">
              {errors.added_certification.message}
            </p>
          )}
        </div>

        <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
          <Label htmlFor="professional_type">Tipo de Profesional *</Label>
          <Select
            onValueChange={(value) => {
              setValue("professional_type", value as ProfessionalType);
              trigger("professional_type");
            }}
            value={professionalType || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medico">Médico</SelectItem>
              <SelectItem value="residente">Residente</SelectItem>
            </SelectContent>
          </Select>
          {/* Input hidden para que react-hook-form pueda validarlo */}
          <input
            type="hidden"
            {...register("professional_type", {
              required: "Este campo es obligatorio",
            })}
          />
          {errors.professional_type && (
            <p className="text-red-500 text-sm">
              {errors.professional_type.message}
            </p>
          )}
        </div>

        {professionalType === "residente" && (
          <>
            <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
              <Label htmlFor="residency_location">Sede de Residencia *</Label>
              <Input
                id="residency_location"
                {...register("residency_location", { required: true })}
                placeholder="Ej: Hospital General de León"
              />
              {errors.residency_location && (
                <p className="text-red-500 text-sm">
                  {errors.residency_location.message}
                </p>
              )}
            </div>

            <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
              <Label htmlFor="current_residency_year">Grado que cursa *</Label>
              <Input
                id="current_residency_year"
                {...register("current_residency_year", { required: true })}
                placeholder="Ej: R1, R2, R3..."
              />
              {errors.current_residency_year && (
                <p className="text-red-500 text-sm">
                  {errors.current_residency_year.message}
                </p>
              )}
            </div>

            <div className="space-y-2 block text-sm font-medium text-gray-700 mb-5">
              <Label htmlFor="head_professor_name">Profesor Titular *</Label>
              <Input
                id="head_professor_name"
                {...register("head_professor_name", { required: true })}
                placeholder="Nombre completo del profesor"
              />
              {errors.head_professor_name && (
                <p className="text-red-500 text-sm">
                  {errors.head_professor_name.message}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
