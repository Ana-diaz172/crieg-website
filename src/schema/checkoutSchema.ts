import { z } from "zod";

const required_error = "Campo obligatorio";

export const FormSchema = z
  .object({
    firstname: z.string().min(1, required_error),
    lastname: z.string().min(1, required_error),
    email: z.string().min(1, required_error).email("Correo inválido"),
    phone: z
      .string()
      .min(10, { message: "Teléfono inválido" })
      .max(20, { message: "Teléfono inválido" })
      .regex(/^\+?[0-9\s-]{10,20}$/, {
        message:
          "Formato de teléfono inválido (usa solo números, espacios o guiones)",
      }),
    city: z.string().min(1, required_error),
    date_of_birth: z
      .string()
      .min(1, required_error)
      .refine(
        (value) => {
          const birthDate = new Date(value);
          const today = new Date();

          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          return age >= 18;
        },
        {
          message: "Debes ser mayor de 18 años",
        }
      ),

    university: z.string().min(1, required_error),
    specialty: z.string().min(1, required_error),
    sub_specialty: z.string().min(1, required_error),
    professional_id: z.string().min(1, required_error),
    specialty_prof_id: z.string().min(1, required_error),
    sub_specialty_prof_id: z.string().min(1, required_error),
    validity_period: z.string().min(1, required_error),
    added_certification: z.string().min(1, required_error),

    professional_type: z.enum(["medico", "residente"], {
      message: "Selecciona un tipo de profesional",
    }),

    residency_location: z.string().optional(),
    current_residency_year: z.string().optional(),
    head_professor_name: z.string().optional(),
  })

  .superRefine((data, ctx) => {
    // Validaciones adicionales si es residente
    if (data.professional_type === "residente") {
      if (!data.residency_location) {
        ctx.addIssue({
          path: ["residency_location"],
          code: z.ZodIssueCode.custom,
          message: "Campo obligatorio para residentes",
        });
      }
      if (!data.current_residency_year) {
        ctx.addIssue({
          path: ["current_residency_year"],
          code: z.ZodIssueCode.custom,
          message: "Campo obligatorio para residentes",
        });
      }
      if (!data.head_professor_name) {
        ctx.addIssue({
          path: ["head_professor_name"],
          code: z.ZodIssueCode.custom,
          message: "Campo obligatorio para residentes",
        });
      }
    }
  });

export type FormSchemaType = z.infer<typeof FormSchema>;
