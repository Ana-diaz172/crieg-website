import { PRICES } from "@/constants/prices";
import {
  ICheckoutMembership,
  IInfoCard,
  IMembershipId,
  Member,
  Membership,
} from "@/interface/member";

export const members: Member[] = [
  {
    id: 1,
    name: "Dr. Raúl Javier Ibarra Fombona",
    specialty: "Presidente",
    image: "/members/member-1.jpeg",
  },
  {
    id: 2,
    name: " Dr. Luis Ricardo Hinojosa Gutiérrez",
    specialty: "Secretario",
    image: "/members/member-3.jpeg",
  },
  {
    id: 3,
    name: "Dra. Talia Minerva Rivera Villanueva",
    specialty: "Tesorero",
    image: "/members/member-2.jpeg",
  },
  {
    id: 4,
    name: "Dr. Filiberto Eduardo Vela López",
    specialty: "Vicepresidente",
    image: "/members/member-4.jpeg",
  },
];

export const memberships: Membership[] = [
  {
    id: "crieg-medicos",
    title: "Médico Radiólogo – Miembro CRIEG",
    description:
      "Cuotas preferenciales en congresos, sesiones educativas mensuales, regularización automática 2026 y constancia oficial de pertenencia al CRIEG.",
    price: PRICES.CRIEG_MEDICOS.showPrice,
    priceSuffixLines: ["/hasta el 15 de marzo", "2026"],
    priceAmount: PRICES.CRIEG_MEDICOS.priceAmount,
    features: [
      "Cuotas preferenciales para el XXI Congreso Internacional Cervantino de Imágenes Médicas y el 2° Congreso Virtual de Imágenes Médicas.",
      "Sesiones Mensuales Educativas.",
      "Regularización automática al pagar la cuota 2026.",
      "Constancia de pertenencia a CRIEG expedida por el Colegio.",
    ],
  },
  {
    id: "crieg-residentes",
    title: "Residente - Miembro CRIEG",
    description:
      "Cuotas preferenciales en congresos CRIEG, sesiones educativas mensuales y regularización automática de tu membresía.",
    price: PRICES.CRIEG_RESIDENTES.showPrice,
    priceSuffixLines: ["/hasta el 15 de marzo", "2026"],
    priceAmount: PRICES.CRIEG_RESIDENTES.priceAmount,
    features: [
      "Cuotas preferenciales para el XXI Congreso Internacional Cervantino de Imágenes Médicas y el 2° Congreso Virtual de Imágenes Médicas.",
      "Sesiones mensuales educativas.",
      "Regularización automática al pagar la cuota 2026.",
      "Constancia oficial de pertenencia al CRIEG expedida por el Colegio.",
    ],
  },
//   {
//     id: "fmri",
//     title: "Médico Radiólogo – Miembro FMRI",
//     description:
//       "Beneficios exclusivos en congresos, aval académico y respaldo institucional como miembro de la FMRI.",
//     price: PRICES.FMRI.showPrice,
//     priceSuffixLines: ["/hasta el 25 de marzo", "2026"],
//     priceAmount: PRICES.FMRI.priceAmount,
//     features: [
//       "Cuotas preferenciales en congresos y eventos académicos.",
//       "Inscripción gratuita o con descuento a congresos (según categoría y edad).",
//       "Acceso a eventos clave 2026 como la Semana Internacional de Ultrasonido y el Congreso Nacional.",
//       "Posibilidad de participar y publicar trabajos en la revista JMeXFRI.",
//       "Aval académico y respaldo institucional.",
//     ],
//   },
  {
    id: "crieg-fmri",
    title: "Médico Radiólogo – Miembro CRIEG y FMRI",
    description:
      "Pertenencia activa a CRIEG y FMRI con acceso académico, cuotas preferenciales y reconocimiento gremial.",
    price: PRICES.CRIEG_FMRI.showPrice,
    priceSuffixLines: ["/hasta el 15 de marzo", "2026"],
    priceAmount: PRICES.CRIEG_FMRI.priceAmount,
    features: [
      "Pertenencia activa al Colegio de Radiología e Imagen del Estado de Guanajuato y a la Federación Mexicana de Radiología e Imagen (FMRI).",
      "Derecho a constancias oficiales y reconocimiento gremial.",
      "Acceso a actividades académicas, sesiones científicas y eventos del colegio con cuotas preferenciales.",
    ],
  },
  {
    id: "fmri-residentes",
    title: "Residente - Miembro FMRI y CRIEG",
    description:
      "Acceso gratuito a eventos FMRI y participación en actividades académicas nacionales como residente.",
    price: PRICES.FMRI_RESIDENTES.showPrice,
    priceSuffixLines: ["/hasta el 15 de marzo", "2026"],
    priceAmount: PRICES.FMRI_RESIDENTES.priceAmount,
    features: [
      "Inscripción gratuita a los eventos organizados por la Federación Mexicana de Radiología e Imagen (FMRI).",
      "Acceso a actividades académicas nacionales y beneficios federativos durante todo el año.",
    ],
  },
];

export const infoCards: IInfoCard[] = [
  {
    id: "active_member",
    title: "Miembro Activo",
    description:
      "Médico Radiólogo con cédula de especialista que ha cubierto el pago de la anualidad del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
    rights: [
      "Tiene derecho a los beneficios de pertenecer al Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Al voto y opinión en las asambleas tanto ordinarias como extraordinarias del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "A postularse para cualquier cargo en la Mesa Directiva del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Difusión de actividades y logros profesionales.",
      "Tiene derecho a realizar el pago de membresía anual a la Federación Mexicana de Radiología e Imagen.",
      "A postularse para cualquier cargo en la Mesa Directiva de laFederación Mexicana de Radiología e Imagen.",
    ],
    obligations: [
      "Realizar su pago anual de membresía al Colegio de Radiología e Imagen del Estado de Guanajuato.",
      "Acudir y participar en cada asamblea tanto ordinaria como extraordinaria",
      "Participar en cada actividad académica del Colegio de Radiología e Imagen del Estado de Guanajuato A. C.",
    ],
  },
  {
    id: "transitory_member",
    title: "Miembro Transitorio",
    description:
      "Médico Residente de Radiología Diagnóstica y Terapéutica o Médico Residente en Curso de Subespecialidad o Médico Residente en Curso de Alta Especialidad que ha cubierto el pago de la anualidad del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
    rights: [
      "Tiene derecho a los beneficios de pertenecer al Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Tiene derecho a realizar el pago de membresía anual a la Federación Mexicana de Radiología e Imagen.",
    ],
    obligations: [
      "Realizar su pago anual de membresía al Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Participar en cada actividad académica del Colegio de Radiología del Estado de Guanajuato A. C.",
    ],
  },
  {
    id: "honorary_member",
    title: "Miembro Honorario",
    description:
      "Médico Radiólogo que ha formado parte del Colegio de Radiología e Imagen del Estado de Guanajuato A.C. por 25 años o más.",
    rights: [
      "Tiene derecho a los beneficios de pertenecer al Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Al voto y opinión en las asambleas tanto ordinarias como extraordinarias del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "A postularse para cualquier cargo en la Mesa Directiva del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
      "Tiene derecho a hacer el pago de membresía anual a la Federación Mexicana de Radiología e Imagen.",
      "A postularse para cualquier cargo en la Mesa Directiva de la Federación Mexicana de Radiología e Imagen.",
      "El miembro honorario adquiere el derecho a no realizar pago anual para pertenecer al Colegio de Radiología e Imagen del Estado de Guanajuato A. C.",
    ],
    obligations: [
      "Acudir y participar en cada asamblea tanto ordinaria como extraordinaria.",
      "Participar en cada actividad académica del Colegio de Radiología e Imagen del Estado de Guanajuato A.C.",
    ],
  },
];

export const checkoutMemberships: Record<IMembershipId, ICheckoutMembership> = {
  "crieg-medicos": {
    name: "Médico Radiólogo – Miembro CRIEG",
    price: PRICES.CRIEG_MEDICOS.showPrice,
    description:
      "Cuotas preferenciales en congresos, sesiones educativas mensuales, regularización automática 2026 y constancia oficial de pertenencia al CRIEG.",
  },
  "crieg-residentes": {
    name: "Residente - Miembro CRIEG",
    price: PRICES.CRIEG_RESIDENTES.showPrice,
    description:
      "Cuotas preferenciales en congresos CRIEG, sesiones educativas mensuales y regularización automática de tu membresía.",
  },
//   fmri: {
//     name: "Médico Radiólogo – Miembro FMRI",
//     price: PRICES.FMRI.showPrice,
//     description:
//       "Beneficios exclusivos en congresos, aval académico y respaldo institucional como miembro de la FMRI.",
//   },
  "crieg-fmri": {
    name: "Médico Radiólogo – Miembro CRIEG y FMRI",
    price: PRICES.CRIEG_FMRI.showPrice,
    description:
      "Pertenencia activa a CRIEG y FMRI con acceso académico, cuotas preferenciales y reconocimiento gremial.",
  },
  "fmri-residentes": {
    name: "Residente - Miembro FMRI y CRIEG",
    price: PRICES.FMRI_RESIDENTES.showPrice,
    description:
      "Acceso gratuito a eventos FMRI y participación en actividades académicas nacionales como residente.",
  },
};
