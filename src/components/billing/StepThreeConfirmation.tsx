"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  cfdiUsages,
  paymentForms,
  paymentMethods,
  taxRegimes,
} from "@/constants/memberships";
import { StepProps } from "@/interface/Checkout";

export default function Step3Confirmation({
  formData,
  onInputChange,
}: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Confirmación y Envío
        </h2>
        <p className="text-gray-600">
          Revise sus datos para el envío de su factura
        </p>
      </div>

      {/* Summary Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Resumen de Factura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">RFC:</span>
              <p className="text-gray-600">{formData.taxId}</p>
            </div>
            <div>
              <span className="font-semibold">Razón Social:</span>
              <p className="text-gray-600">{formData.companyName}</p>
            </div>
            <div>
              <span className="font-semibold">Régimen Fiscal:</span>
              <p className="text-gray-600">
                {formData.taxRegime
                  ? taxRegimes.find((item) => item.value === formData.taxRegime)
                      ?.label
                  : ""}
              </p>
            </div>
            <div>
              <span className="font-semibold">Código Postal:</span>
              <p className="text-gray-600">{formData.postalCode}</p>
            </div>
            <div>
              <span className="font-semibold">Uso CFDI:</span>
              <p className="text-gray-600">
                {formData.cfdiUsage
                  ? cfdiUsages.find((item) => item.value === formData.cfdiUsage)
                      ?.label
                  : ""}
              </p>
            </div>
            <div>
              <span className="font-semibold"> Método de Pago:</span>
              <p className="text-gray-600">
                {formData.paymentMethod
                  ? paymentMethods.find(
                      (item) => item.value === formData.paymentMethod
                    )?.label
                  : ""}
              </p>
            </div>
            <div>
              <span className="font-semibold">Forma de Pago:</span>
              <p className="text-gray-600">
                {formData.paymentForm
                  ? paymentForms.find(
                      (item) => item.value === formData.paymentForm
                    )?.label
                  : ""}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="email">Email para el envío de la factura *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          placeholder="example@example.com"
          required
        />
      </div>
    </div>
  );
}
