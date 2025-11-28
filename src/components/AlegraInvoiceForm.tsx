"use client";

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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  TAX_REGIME_OPTIONS,
  CFDI_USE_OPTIONS,
  MX_STATES,
  PAYMENT_METHOD_OPTIONS,
} from "@/constants/alegra";
import { useAlegraInvoiceForm } from "@/hooks/useAlegraInvoiceForm";

interface AlegraInvoiceFormProps {
  onSuccess?: (data: any) => void;
}

export default function AlegraInvoiceForm({
  onSuccess,
}: AlegraInvoiceFormProps) {
  const {
    formData,
    isSubmitting,
    errorMessage,
    successMessage,
    handleChange,
    handleSubmit,
    setFormData,
  } = useAlegraInvoiceForm({ onSuccess });

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
                  <Label>Régimen fiscal</Label>
                  <Select
                    value={formData.taxRegime}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, taxRegime: value }))
                    }
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona tu régimen fiscal" />
                    </SelectTrigger>
                    <SelectContent>
                      {TAX_REGIME_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Uso de CFDI</Label>
                  <Select
                    value={formData.cfdiUse}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, cfdiUse: value }))
                    }
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona el uso de CFDI" />
                    </SelectTrigger>
                    <SelectContent>
                      {CFDI_USE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="interiorNumber">
                    No. interior (opcional)
                  </Label>
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
                  <Label>Estado</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, state: value }))
                    }
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona tu estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {MX_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Purchase section */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Información de compra
              </h2>
              <Separator className="mb-4" />
              <div className="space-y-4">
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

                {/* Forma de pago */}
                <div className="space-y-1.5">
                  <Label>Forma de pago</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, paymentMethod: value }))
                    }
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona la forma de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Generando factura..." : "Generar factura"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
