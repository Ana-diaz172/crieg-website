import { ICheckoutMembership, IInfoCard, IMembershipId, Member, Membership } from "@/interface/member";

export const members: Member[] = [
    {
        id: 1,
        name: "Dr. Luis Ricardo Hinojosa Gutiérrez ",
        specialty: "Presidente",
        image: "/members/member-1.jpg",
    },
    {
        id: 2,
        name: "Dr. Rafael Paz Gómez",
        specialty: "Secretario",
        image: "/members/member-3.jpg",
    },
    {
        id: 3,
        name: "Dra. Ana Celia Castro Porras",
        specialty: "Tesorero",
        image: "/members/member-2.jpg",
    },
    {
        id: 4,
        name: "Dr. Raúl Javier Ibarra Fombona",
        specialty: "Vicepresidente",
        image: "/members/member-4.jpg",
    }
];

export const memberships: Membership[] = [
    {
        id: "crieg-medicos",
        title: "Membresía Médicos Radiólogos CRIEG",
        description:
            "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos al mantener tu membresía CRIEG vigente.",
        price: "$2,600",
        priceSuffix: "/anual 2025",
        priceAmount: 260000,
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
        price: "$600",
        priceSuffix: "/anual 2025",
        priceAmount: 60000,
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
        price: "$4,000",
        priceSuffixLines: ["/hasta el 9 de marzo", "2025"],
        priceAmount: 400000,
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
        price: "$6,600",
        priceSuffix: "/anual 2025",
        priceAmount: 660000,
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
        price: "$2,600",
        description:
            "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos.",
    },
    "crieg-residentes": {
        name: "Membresía Residentes CRIEG",
        price: "$600",
        description:
            "Accede a congresos con tarifas preferenciales y mantén tu membresía CRIEG al día.",
    },
    fmri: {
        name: "Membresía FMRI",
        price: "$4,000",
        description:
            "Disfruta costos preferenciales en congresos y acceso a contenido académico exclusivo.",
    },
    "crieg-fmri": {
        name: "Membresía CRIEG y FMRI",
        price: "$6,600",
        description:
            "Accede a congresos con tarifas preferenciales, respaldo institucional y beneficios exclusivos al mantener tu membresía CRIEG y FMRI vigente.",
    },
};
