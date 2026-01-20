import { PRICES } from "@/constants/prices";
import { ICheckoutMembership, IInfoCard, IMembershipId, Member, Membership } from "@/interface/member";

export const members: Member[] = [
    {
        id: 1,
        name: "Dr. Luis Ricardo Hinojosa Gutiérrez ",
        specialty: "Presidente",
        image: "/members/member-1.jpeg",
    },
    {
        id: 2,
        name: "Dr. Rafael Paz Gómez",
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
        name: "Dr. Raúl Javier Ibarra Fombona",
        specialty: "Vicepresidente",
        image: "/members/member-4.jpeg",
    }
];

export const memberships: Membership[] = [
    {
        id: "crieg-medicos",
        title: "Membresía Médicos Radiólogos CRIEG",
        description:
            "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos al mantener tu membresía CRIEG vigente.",
        price: PRICES.CRIEG_MEDICOS.showPrice,
        priceSuffix: "/anual 2025",
        priceAmount: PRICES.CRIEG_MEDICOS.priceAmount,
        features: [
            "Cuotas preferenciales para el Congreso Virtual de Mayo y el Congreso Cervantino de Imágenes Médicas.",
            "Regularización automática al pagar la cuota 2025.",
            "Carta de pertenencia a CRIEG expedida por el Colegio.",
        ],
    },
    {
        id: "crieg-residentes",
        title: "Membresía <br /> Residentes CRIEG",
        description:
            "Accede a congresos con tarifas preferenciales y mantén tu membresía CRIEG al día con regularización automática.",
        price: PRICES.CRIEG_RESIDENTES.showPrice,
        priceSuffix: "/anual 2025",
        priceAmount: PRICES.CRIEG_RESIDENTES.priceAmount,
        features: [
            "Cuotas preferenciales para el Congreso Virtual de Mayo y el Congreso Cervantino de Imágenes Médicas.",
            "Regularización automática al pagar la cuota 2025.",
        ],
    },
    {
        id: "fmri",
        title: "Membresía FMRI",
        description:
            "Disfruta costos preferenciales en congresos, acceso a contenido académico exclusivo y reconocimiento oficial con la carta de pertenencia a la FMRI.",
        price: PRICES.FMRI.showPrice,
        priceSuffixLines: ["/hasta el 9 de marzo", "2025"],
        priceAmount: PRICES.FMRI.priceAmount,
        features: [
            "Cuotas preferenciales para los Congresos de Ultrasonido en Mérida y el Seccional en Guadalajara.",
            "Acceso al Journal con contenido académico exclusivo.",
            "Carta de pertenencia a la FMRI (expedida por la federación) para sumar puntajes.",
        ],
    },
    {
        id: "crieg-fmri",
        title: "Membresía CRIEG y FMRI",
        description:
            "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos al mantener tu membresía CRIEG y FMRI vigente.",
        price: PRICES.CRIEG_FMRI.showPrice,
        priceSuffix: "/anual 2025",
        priceAmount: PRICES.CRIEG_FMRI.priceAmount,
        features: [
            "Cuotas preferenciales para los Congresos de Ultrasonido en Mérida y el Seccional en Guadalajara.",
            "Acceso al Journal con contenido académico exclusivo.",
            "Carta de pertenencia a la FMRI (expedida por la federación) para sumar puntajes.",
            "Cuotas preferenciales para el Congreso Virtual de Mayo y el Congreso Cervantino de Imágenes Médicas.",
            "Regularización automática al pagar la cuota 2025.",
            "Carta de pertenencia a CRIEG expedida por el Colegio.",
            "Carta de pertenencia a CRIEG expedida por el Colegio.",
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
        name: "Membresía Médicos Radiólogos CRIEG",
        price: PRICES.CRIEG_MEDICOS.showPrice,
        description:
            "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos.",
    },
    "crieg-residentes": {
        name: "Membresía Residentes CRIEG",
        price: PRICES.CRIEG_RESIDENTES.showPrice,
        description:
            "Accede a congresos con tarifas preferenciales y mantén tu membresía CRIEG al día.",
    },
    fmri: {
        name: "Membresía FMRI",
        price: PRICES.FMRI.showPrice,
        description:
            "Disfruta costos preferenciales en congresos y acceso a contenido académico exclusivo.",
    },
    "crieg-fmri": {
        name: "Membresía CRIEG y FMRI",
        price: PRICES.CRIEG_FMRI.showPrice,
        description:
            "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos al mantener tu membresía CRIEG y FMRI vigente.",
    },
};
