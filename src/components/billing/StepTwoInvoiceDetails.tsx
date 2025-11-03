"use client";

import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  cfdiUsages,
  paymentForms,
  paymentMethods,
} from "@/constants/memberships";
import { StepProps } from "@/interface/Checkout";

export default function StepTwoInvoiceDetails({
  formData,
  onInputChange,
  currentStep,
}: StepProps & { currentStep: number }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Detalles de la Factura
        </h2>
        <p className="text-gray-600 text-sm">Configuración de la factura</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cfdiUsage">Uso CFDI *</Label>
          <Select
            key={`cfdiUsage-${currentStep}`}
            value={formData.cfdiUsage}
            onValueChange={(value) => onInputChange("cfdiUsage", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona el Uso de CFDI" />
            </SelectTrigger>
            <SelectContent className="w-full max-w-[400px]">
              {cfdiUsages.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="w-full"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Método de Pago *</Label>
          <Select
            key={`paymentMethod-${currentStep}`}
            value={formData.paymentMethod}
            onValueChange={(value) => onInputChange("paymentMethod", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona el Método de Pago" />
            </SelectTrigger>
            <SelectContent className="w-full max-w-[400px]">
              {paymentMethods.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="w-full"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentForm">Forma de Pago *</Label>
          <Select
            key={`paymentForm-${currentStep}`}
            value={formData.paymentForm}
            onValueChange={(value) => onInputChange("paymentForm", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona la Forma de Pago" />
            </SelectTrigger>
            <SelectContent className="w-full max-w-[400px]">
              {paymentForms.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="w-full"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
