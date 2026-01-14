export const taxRegimes = [
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
  { value: "620", label: "Sociedades Cooperativas de Producción" },
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
      "Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
  },
  { value: "626", label: "Régimen Simplificado de Confianza (RESICO)" },
  { value: "628", label: "Hidrocarburos" },
  {
    value: "629",
    label: "Regímenes Fiscales Preferentes y Empresas Multinacionales",
  },
  { value: "630", label: "Enajenación de acciones en bolsa de valores" },
  { value: "615", label: "Régimen de los ingresos por obtención de premios" },
];

export const cfdiUsages = [
  { value: "G01", label: "Adquisición de mercancías" },
  { value: "G02", label: "Devoluciones, descuentos o bonificaciones" },
  { value: "G03", label: "Gastos en general" },
  { value: "I01", label: "Construcciones" },
  { value: "I02", label: "Mobiliario y equipo de oficina por inversiones" },
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
  { value: "D05", label: "Intereses reales por créditos hipotecarios" },
  { value: "D06", label: "Aportaciones voluntarias al SAR" },
  { value: "D07", label: "Primas por seguros de gastos médicos" },
  { value: "D08", label: "Gastos de transportación escolar obligatoria" },
  {
    value: "D09",
    label: "Depósitos en cuentas para el ahorro / Seguridad Social",
  },
  { value: "D10", label: "Pagos por servicios educativos (colegiaturas)" },
  { value: "S01", label: "Sin efectos fiscales" }, // Sustituye a P01 que ya no es válido
  { value: "CP01", label: "Pagos" },
  { value: "CN01", label: "Nómina" },
];

export const paymentMethods = [
  { value: "01", label: "01 - Efectivo" },
  { value: "02", label: "02 - Cheque nominativo" },
  { value: "03", label: "03 - Transferencia electrónica de fondos" },
  { value: "04", label: "04 - Tarjeta de crédito" },
  { value: "05", label: "05 - Monedero electrónico" },
  { value: "06", label: "06 - Dinero electrónico" },
  { value: "08", label: "08 - Vales de despensa" },
  { value: "12", label: "12 - Dación en pago" },
  { value: "17", label: "17 - Compensación" },
  { value: "28", label: "28 - Tarjeta de débito" },
  { value: "29", label: "29 - Tarjeta de servicios" },
  { value: "99", label: "99 - Por definir" },
];

export const paymentForms = [
  { value: "PUE", label: "PUE - Pago en una sola exhibición" },
  { value: "PPD", label: "PPD - Pago en parcialidades o diferido" },
];
