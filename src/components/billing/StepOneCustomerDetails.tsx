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
import { taxRegimes } from "@/constants/memberships";
import { StepProps } from "@/interface/Checkout";

export default function StepOneCustomerDetails({
  formData,
  onInputChange,
  currentStep,
}: StepProps & { currentStep: number }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Detalles del cliente
        </h2>
        <p className="text-gray-600 text-base">
          Información fiscal del cliente
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="taxId">RFC *</Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={(e) => onInputChange("taxId", e.target.value)}
            placeholder="XAXX010101000"
            required
            maxLength={13}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Razón Social *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => onInputChange("companyName", e.target.value)}
            placeholder="Nombre de la empresa o persona"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxRegime">Régimen Fiscal *</Label>
          <Select
            key={`taxRegime-${currentStep}`}
            value={formData.taxRegime}
            onValueChange={(value) => onInputChange("taxRegime", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Selecciona un régimen fiscal"
                className="text-left"
              />
            </SelectTrigger>
            <SelectContent className="w-full max-w-[400px]">
              {taxRegimes.map((item) => (
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
          <Label htmlFor="postalCode">Código Postal *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => onInputChange("postalCode", e.target.value)}
            placeholder="00000"
            required
            maxLength={5}
            pattern="[0-9]{5}"
          />
        </div>
      </div>
    </div>
  );
}
