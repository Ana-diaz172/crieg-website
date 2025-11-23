"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface AlegraInvoiceFormProps {
  onSuccess?: (data: any) => void;
}

export default function AlegraInvoiceForm({
  onSuccess,
}: AlegraInvoiceFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rfc: "",
    businessName: "",
    taxRegime: "",
    cfdiUse: "",
    street: "",
    exteriorNumber: "",
    interiorNumber: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    country: "México",
    purchaseId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/invoicing/alegra-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Ocurrió un error al generar la factura."
        );
      }

      setSuccessMessage(
        "Tu factura ha sido generada correctamente. Revisa tu correo electrónico."
      );
      if (onSuccess) onSuccess(data);
    } catch (error: any) {
      setErrorMessage(
        error.message || "Error inesperado al generar la factura."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Facturación electrónica</CardTitle>
          <CardDescription className="text-sm">
            Ingresa tus datos fiscales y el ID de compra que recibiste por
            correo para generar tu factura.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Contact section */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Datos de contacto
              </h2>
              <Separator className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Fiscal section */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Datos fiscales
              </h2>
              <Separator className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="rfc">RFC</Label>
                  <Input
                    id="rfc"
                    name="rfc"
                    value={formData.rfc}
                    onChange={handleChange}
                    className="uppercase"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="businessName">Razón social</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="taxRegime">Régimen fiscal</Label>
                  <Input
                    id="taxRegime"
                    name="taxRegime"
                    value={formData.taxRegime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cfdiUse">Uso de CFDI</Label>
                  <Input
                    id="cfdiUse"
                    name="cfdiUse"
                    placeholder="G03, P01, etc."
                    value={formData.cfdiUse}
                    onChange={handleChange}
                    className="uppercase"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Address section */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Dirección fiscal
              </h2>
              <Separator className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="street">Calle</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="exteriorNumber">No. exterior</Label>
                  <Input
                    id="exteriorNumber"
                    name="exteriorNumber"
                    value={formData.exteriorNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="interiorNumber">No. interior</Label>
                  <Input
                    id="interiorNumber"
                    name="interiorNumber"
                    value={formData.interiorNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="neighborhood">Colonia</Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="zipCode">Código postal</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Purchase section */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Información de compra
              </h2>
              <Separator className="mb-4" />
              <div className="space-y-1.5">
                <Label htmlFor="purchaseId">ID de compra (Stripe)</Label>
                <Input
                  id="purchaseId"
                  name="purchaseId"
                  value={formData.purchaseId}
                  onChange={handleChange}
                  placeholder="Ej: cs_test_a1B2C3..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Este ID viene en el correo de confirmación de compra que te
                  enviamos.
                </p>
              </div>
            </section>

            {/* Feedback messages */}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg"
            >
              {isSubmitting ? "Generando factura..." : "Generar factura"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
