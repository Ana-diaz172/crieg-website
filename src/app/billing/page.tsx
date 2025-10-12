"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,

  FileCheck,
  FileText,
  FileUser,
  ArrowRight,
  Check,
} from "lucide-react";

interface BillingFormData {
  // Step 1: Customer details
  taxId: string;
  companyName: string;
  taxRegime: string;
  postalCode: string;

  // Step 2: Invoice details
  cfdiUsage: string;
  paymentMethod: string;
  paymentForm: string;

  // Step 3: Confirmation
  email: string;
}

const taxRegimes = [
  { value: "601", label: "General de Ley Personas Morales" },
  { value: "603", label: "Personas Morales con Fines no Lucrativos" },
  {
    value: "605",
    label: "Sueldos y Salarios e Ingresos Asimilados a Salarios",
  },
  { value: "606", label: "Arrendamiento" },
  { value: "608", label: "Demás ingresos" },
  { value: "609", label: "Consolidación" },
  {
    value: "610",
    label:
      "Residentes en el Extranjero sin Establecimiento Permanente en México",
  },
  { value: "611", label: "Ingresos por Dividendos (socios y accionistas)" },
  {
    value: "612",
    label: "Personas Físicas con Actividades Empresariales y Profesionales",
  },
  { value: "614", label: "Ingresos por intereses" },
  { value: "616", label: "Sin obligaciones fiscales" },
  {
    value: "620",
    label:
      "Sociedades Cooperativas de Producción que optan por diferir sus ingresos",
  },
  { value: "621", label: "Incorporación Fiscal" },
  {
    value: "622",
    label: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
  },
  { value: "623", label: "Opcional para Grupos de Sociedades" },
  { value: "624", label: "Coordinados" },
  {
    value: "625",
    label:
      "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
  },
  { value: "626", label: "Régimen Simplificado de Confianza" },
  { value: "628", label: "Hidrocarburos" },
  {
    value: "629",
    label:
      "De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales",
  },
  { value: "630", label: "Enajenación de acciones en bolsa de valores" },
  { value: "615", label: "Régimen de los ingresos por obtención de premios" },
];

const cfdiUsages = [
  { value: "G01", label: "Adquisición de mercancías" },
  { value: "G02", label: "Devoluciones, descuentos o bonificaciones" },
  { value: "G03", label: "Gastos en general" },
  { value: "I01", label: "Construcciones" },
  { value: "I02", label: "Mobilario y equipo de oficina por inversiones" },
  { value: "I03", label: "Equipo de transporte" },
  { value: "I04", label: "Equipo de cómputo y accesorios" },
  { value: "I05", label: "Dados, troqueles, moldes, matrices y herramental" },
  { value: "I06", label: "Comunicaciones telefónicas" },
  { value: "I07", label: "Comunicaciones satelitales" },
  { value: "I08", label: "Otra maquinaria y equipo" },
  {
    value: "D01",
    label: "Honorarios médicos, dentales y gastos hospitalarios",
  },
  { value: "D02", label: "Gastos médicos por incapacidad o discapacidad" },
  { value: "D03", label: "Gastos funerales" },
  { value: "D04", label: "Donativos" },
  {
    value: "D05",
    label:
      "Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)",
  },
  { value: "D06", label: "Aportaciones voluntarias al SAR" },
  { value: "D07", label: "Primas por seguros de gastos médicos" },
  { value: "D08", label: "Gastos de transportación escolar obligatoria" },
  {
    value: "D09",
    label:
      "Depósitos en cuentas para el ahorro, primas que en términos de la Ley de Seguridad Social",
  },
  { value: "D10", label: "Pagos por servicios educativos (colegiaturas)" },
  { value: "P01", label: "Por definir" },
];

const paymentMethods = [
  { value: "01", label: "Efectivo" },
  { value: "02", label: "Cheque nominativo" },
  { value: "03", label: "Transferencia electrónica de fondos" },
  { value: "04", label: "Tarjeta de crédito" },
  { value: "28", label: "Tarjeta de débito" },
  { value: "99", label: "Por definir" },
];

const paymentForms = [
  { value: "PUE", label: "Pago en una sola exhibición" },
  { value: "PPD", label: "Pago en parcialidades o diferido" },
];

export default function BillingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BillingFormData>({
    taxId: "",
    companyName: "",
    taxRegime: "",
    postalCode: "",
    cfdiUsage: "",
    paymentMethod: "",
    paymentForm: "",
    email: "",
  });

  const handleInputChange = (name: string, value: string) => {
    console.log(`Updating ${name} to:`, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      console.log("Moving to next step. Current form data:", formData);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      console.log("Moving to previous step. Current form data:", formData);
      setCurrentStep(currentStep - 1);
    }
  };

  const isStep1Valid = () => {
    return (
      formData.taxId &&
      formData.companyName &&
      formData.taxRegime &&
      formData.postalCode
    );
  };

  const isStep2Valid = () => {
    return formData.cfdiUsage && formData.paymentMethod && formData.paymentForm;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // Here you would typically send the data to your backend
  };

  // Debug effect to log form data changes
  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  // Debug effect to log step changes
  useEffect(() => {
    console.log("Current step:", currentStep);
  }, [currentStep]);

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Detalles del Cliente
        </h2>
        <p className="text-gray-600 text-sm">Información fiscal del cliente</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="taxId">RFC *</Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={(e) => handleInputChange("taxId", e.target.value)}
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
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            placeholder="Nombre de la empresa o persona"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxRegime">Tax Regime *</Label>
          <Select
            key={`taxRegime-${currentStep}`} // Force re-render with key
            value={formData.taxRegime}
            onValueChange={(value) => handleInputChange("taxRegime", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Select a tax regime"
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
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            placeholder="00000"
            required
            maxLength={5}
            pattern="[0-9]{5}"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
        <p className="text-gray-600 text-sm">Invoice configuration</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cfdiUsage">CFDI Usage *</Label>
          <Select
            key={`cfdiUsage-${currentStep}`} // Force re-render with key
            value={formData.cfdiUsage}
            onValueChange={(value) => handleInputChange("cfdiUsage", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select CFDI usage" />
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
          <Label htmlFor="paymentMethod">Payment Method *</Label>
          <Select
            key={`paymentMethod-${currentStep}`} // Force re-render with key
            value={formData.paymentMethod}
            onValueChange={(value) => handleInputChange("paymentMethod", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
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
          <Label htmlFor="paymentForm">Payment Form *</Label>
          <Select
            key={`paymentForm-${currentStep}`} // Force re-render with key
            value={formData.paymentForm}
            onValueChange={(value) => handleInputChange("paymentForm", value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment form" />
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

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Confirmation and Sending
        </h2>
        <p className="text-gray-600">Review the data and send your invoice</p>
      </div>

      {/* Summary Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Tax ID:</span>
              <p className="text-gray-600">{formData.taxId}</p>
            </div>
            <div>
              <span className="font-semibold">Company Name:</span>
              <p className="text-gray-600">{formData.companyName}</p>
            </div>
            <div>
              <span className="font-semibold">Tax Regime:</span>
              <p className="text-gray-600">
                {formData.taxRegime
                  ? taxRegimes.find((item) => item.value === formData.taxRegime)
                      ?.label
                  : ""}
              </p>
            </div>
            <div>
              <span className="font-semibold">Postal Code:</span>
              <p className="text-gray-600">{formData.postalCode}</p>
            </div>
            <div>
              <span className="font-semibold">CFDI Usage:</span>
              <p className="text-gray-600">
                {formData.cfdiUsage
                  ? cfdiUsages.find((item) => item.value === formData.cfdiUsage)
                      ?.label
                  : ""}
              </p>
            </div>
            <div>
              <span className="font-semibold">Payment Method:</span>
              <p className="text-gray-600">
                {formData.paymentMethod
                  ? paymentMethods.find(
                      (item) => item.value === formData.paymentMethod
                    )?.label
                  : ""}
              </p>
            </div>
            <div>
              <span className="font-semibold">Payment Form:</span>
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
        <Label htmlFor="email">Email for sending *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="example@example.com"
          required
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="w-full h-screen bg-white rounded-lg shadow-lg flex px-12 py-6">
      {/* Left Sidebar */}
      <div className="flex p-6 flex-col h-[100%] bg-[#FAFAFA] w-[420px] rounded-lg relative border">
        <div className="relative h-[60px] w-[60px]">
          <Image
            src="/crieg-logo.png"
            alt="Logo"
            className="w-full h-full object-fit"
            fill
          />
        </div>
        <div className="mt-8">
          <p className="font-semibold text-lg">Steps to generate invoice</p>
          <p className="text-sm text-gray-500">
            Complete all the steps you are asked to generate the invoice
          </p>
        </div>
        <div className="flex flex-col mt-10">
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 1 ? "opacity-100" : "opacity-50"
            }`}
          >
            <div
              className={`flex items-center justify-center border w-9 h-9 rounded-sm ${
                currentStep >= 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-500"
              }`}
            >
              {currentStep > 1 ? (
                <Check className="w-4 h-4" />
              ) : (
                <FileUser className="w-4 h-4" />
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">Your details</p>
              <p className="text-sm font-regular">Complete customer details.</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-[36px]">
            <div
              className={`h-[32px] w-[2px] rounded-full ${
                currentStep >= 2 ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          </div>
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 2 ? "opacity-100" : "opacity-50"
            }`}
          >
            <div
              className={`flex items-center justify-center border w-9 h-9 rounded-sm ${
                currentStep >= 2
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-500"
              }`}
            >
              {currentStep > 2 ? (
                <Check className="w-4 h-4" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">Invoice</p>
              <p className="text-sm font-regular">Complete invoice details.</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-[36px]">
            <div
              className={`h-[32px] w-[2px] rounded-full ${
                currentStep >= 3 ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          </div>
          <div
            className={`flex items-center gap-2 ${
              currentStep >= 3 ? "opacity-100" : "opacity-50"
            }`}
          >
            <div
              className={`flex items-center justify-center border w-9 h-9 rounded-sm ${
                currentStep >= 3
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-500"
              }`}
            >
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">Confirmation and Sending</p>
              <p className="text-sm font-regular">
                Review the data and send your invoice.
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="flex text-gray-500 hover:text-gray-700 items-center gap-2 absolute bottom-6 left-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <p className="text-sm font-regular">Return to home</p>
        </button>
      </div>

      {/* Right Content */}
      <div className="w-[calc(100%-420px)] flex justify-center items-center">
        <div className="flex flex-col w-full items-center max-w-[600px]">
          <div className="relative h-[80px] w-[80px] mb-6">
            <Image
              src="/crieg-logo.png"
              alt="Logo"
              className="w-full h-full object-fit"
              fill
            />
          </div>

          <Card className="w-full">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                {renderCurrentStep()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        (currentStep === 1 && !isStep1Valid()) ||
                        (currentStep === 2 && !isStep2Valid())
                      }
                      className="flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!formData.email}
                      className="flex items-center gap-2"
                    >
                      Generate Invoice
                      <FileCheck className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
