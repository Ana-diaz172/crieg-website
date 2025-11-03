"use client";

import Image from "next/image";
import { Check, FileUser, FileText, FileCheck } from "lucide-react";

interface StepperSidebarProps {
  currentStep: number;
}

export default function StepperSidebar({ currentStep }: StepperSidebarProps) {
  return (
    <div className="flex p-6 flex-col h-[100%] bg-[#FAFAFA] w-[360px] rounded-lg relative border">
      <div className="relative h-[60px] w-[60px]">
        <Image
          src="/crieg-logo.png"
          alt="Logo"
          className="w-full h-full object-fit"
          fill
        />
      </div>
      <div className="mt-8">
        <p className="font-semibold text-xl">Pasos para generar factura</p>
        <p className="text-base text-gray-500">
          Complete todos los pasos que se piden para generar su factura
        </p>
      </div>
      <div className="flex flex-col mt-10">
        <StepItem
          step={1}
          currentStep={currentStep}
          icon={FileUser}
          title="Detalles del Cliente"
          description="Completar datos del cliente."
        />
        <ConnectorLine currentStep={currentStep} step={2} />
        <StepItem
          step={2}
          currentStep={currentStep}
          icon={FileText}
          title="Detalles de la Factura"
          description="Completar datos de factura."
        />
        <ConnectorLine currentStep={currentStep} step={3} />
        <StepItem
          step={3}
          currentStep={currentStep}
          icon={FileCheck}
          title="Confirmación y Envío"
          description="Revisar datos y enviar factura."
        />
      </div>
    </div>
  );
}

interface StepItemProps {
  step: number;
  currentStep: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function StepItem({
  step,
  currentStep,
  icon: Icon,
  title,
  description,
}: StepItemProps) {
  const isActive = currentStep >= step;

  return (
    <div
      className={`flex items-center gap-2 ${isActive ? "opacity-100" : "opacity-50"}`}
    >
      <div
        className={`flex items-center justify-center border w-9 h-9 rounded-sm ${
          isActive ? "bg-blue-500 text-white" : "bg-white text-gray-500"
        }`}
      >
        {currentStep > step ? (
          <Check className="w-4 h-4" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-base">{title}</p>
        <p className="text-base font-regular">{description}</p>
      </div>
    </div>
  );
}

function ConnectorLine({
  currentStep,
  step,
}: {
  currentStep: number;
  step: number;
}) {
  const isActive = currentStep >= step;

  return (
    <div className="flex items-center justify-center w-[36px]">
      <div
        className={`h-[32px] w-[2px] rounded-full ${
          isActive ? "bg-blue-500" : "bg-gray-300"
        }`}
      />
    </div>
  );
}
