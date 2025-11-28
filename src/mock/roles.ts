import { Member } from "@/interface/member";

export const roleDetails: Record<
    Member["specialty"],
    { sections: { title: string; body: string[] }[] }
> = {
    Presidente: {
        sections: [
            {
                title: "Elección",
                body: [
                    "Será elegido mediante votación en Asamblea General Ordinaria.",
                    "Al ser elegido tendrá los títulos de Vicepresidente y Presidente-Electo por 2 años; al término de dicho periodo tomará el puesto de Presidente.",
                    "Con este periodo de vicepresidencia de 2 años se asegura la continuidad de proyectos, experiencia administrativa y sensibilidad con el Colegio en una Mesa Directiva previa a su nombramiento como Presidente.",
                ],
            },
            {
                title: "Funciones",
                body: [
                    "Proponer a miembros activos u honorarios para integrar la Mesa Directiva; deberán ser votados en Asamblea General Ordinaria.",
                    "Podrá llamar a miembros para una Mesa Directiva extendida mediante comisiones (página web, redes sociales, contacto con sedes de residencia, sesiones mensuales, congreso anual, relaciones públicas, concurso de carteles).",
                    "Nombrar un vocal por cada municipio para representar al Colegio con actividades de promoción, academia y asesoría.",
                    "Nombrar Delegados ante la Federación Mexicana de Radiología e Imagen u otras entidades.",
                    "Convocar y dirigir la Asamblea Ordinaria Anual y, cuando se requiera, Asambleas Extraordinarias.",
                    "Ser el representante legal del Colegio, con pleno poder administrativo y legal.",
                    "Coordinar los trabajos de la Mesa Directiva y proponer líneas de trabajo.",
                ],
            },
            {
                title: "Duración en el cargo",
                body: [
                    "Periodo de 2 años.",
                    "Podrá ser reelegido para el cargo de Presidente luego de un periodo de 2 años sin funciones administrativas.",
                    "Podrá ser elegido para un cargo diferente en la Mesa Directiva del periodo inmediato siguiente.",
                ],
            },
        ],
    },
    Secretario: {
        sections: [
            {
                title: "Elección",
                body: [
                    "Será elegido mediante votación en Asamblea General Ordinaria.",
                    "Al ser elegido tomará el puesto de Secretario General.",
                ],
            },
            {
                title: "Funciones",
                body: [
                    "Generar la orden del día para cada asamblea y redactar el acta posterior.",
                    "Asistir a cada reunión (física o virtual) de la Mesa Directiva.",
                    "Crear la orden del día y la minuta de cada reunión de Mesa Directiva.",
                    "Coordinar a las comisiones.",
                    "Puede fungir como Delegado o ser titular de una comisión.",
                ],
            },
            {
                title: "Duración en el cargo",
                body: [
                    "Periodo de 2 años.",
                    "Podrá ser reelegido luego de 2 años sin funciones administrativas.",
                    "Podrá ser elegido para un cargo diferente en la Mesa Directiva siguiente.",
                ],
            },
        ],
    },
    Tesorero: {
        sections: [
            {
                title: "Elección",
                body: [
                    "Será elegido mediante votación en Asamblea General Ordinaria.",
                    "Al ser elegido tomará el puesto de Tesorero.",
                ],
            },
            {
                title: "Funciones",
                body: [
                    "Recibir y tramitar el cambio de titulares de las cuentas bancarias del Colegio.",
                    "Administrar los recursos económicos del Colegio y realizar pagos a proveedores.",
                    "Recibir pagos por membresías, cursos, congresos y patrocinios.",
                    "Transferir anualmente recursos a la Federación por concepto de membresías.",
                    "Contratar a un contador de apoyo y emitir factura fiscal.",
                ],
            },
            {
                title: "Duración en el cargo",
                body: [
                    "Periodo de 2 años.",
                    "Podrá ser reelegido luego de 2 años sin funciones administrativas.",
                    "Podrá ser elegido para un cargo diferente en la Mesa Directiva siguiente.",
                ],
            },
        ],
    },
    Vicepresidente: {
        sections: [
            {
                title: "Elección",
                body: [
                    "Será elegido mediante votación en Asamblea General Ordinaria o Extraordinaria.",
                    "Tendrá los títulos de Vicepresidente y Presidente-Electo por 2 años; al término tomará el puesto de Presidente.",
                ],
            },
            {
                title: "Funciones",
                body: [
                    "Participar activamente en cada reunión de la Mesa Directiva.",
                    "Ser el nexo entre la Mesa Directiva actual y la siguiente que él presidirá.",
                    "Puede tener el cargo de Delegado, Vocal o ser titular de una comisión.",
                ],
            },
            {
                title: "Duración en el cargo",
                body: [
                    "El Vicepresidente tendrá un periodo de 2 años.",
                    "Posterior a este periodo tomará el cargo de Presidente.",
                ],
            },
        ],
    },
};

export const commonGuidelines = [
    // 5.3 Duración (ya incluida arriba para Vicepresidente; se mantiene aquí porque pediste incluirlo en todos)
    "Duración del Vicepresidente: 2 años; posteriormente toma el cargo de Presidente.",
    // Nombramiento y elección de Presidente
    "Nombramiento y elección de Presidente — Proceso de elección: convocatoria en la orden del día con al menos dos meses de anticipación; registro y publicación de candidatos al menos 15 días antes.",
    "Requisitos de candidatos a Presidente: ser miembro activo u honorario; no haber sido Presidente en los 2 años previos.",
    "Publicación de fecha y hora de elección: redes sociales del Colegio, chat oficial de WhatsApp, correo electrónico o impreso estatal, junto con la convocatoria, con al menos 2 meses de anticipación.",
    "Requisitos de electores: ser miembro activo u honorario y asistir en lugar, fecha y hora convocados.",
    "Criterios de elección: con dos candidatos, mayoría absoluta (>50%); con tres o más, mayoría relativa (mayor número de votos).",
    "El candidato elegido será Vicepresidente y Presidente-Electo por 2 años; al término tomará el cargo de Presidente, protestado en Asamblea General.",
    // Nombramiento de Secretario y Tesorero
    "Nombramiento de Secretario General y Tesorero — Proceso de elección: convocatoria con 2 meses; publicación de candidatos 15 días antes.",
    "Requisitos de candidatos: ser miembro activo u honorario; para Secretario/Tesorero, no haber ocupado ese cargo en al menos 2 años previos. El Secretario/Tesorero actual puede ser elegido a un cargo distinto en el siguiente periodo.",
    "Publicación de fecha y hora: redes sociales, chat oficial de WhatsApp, correo electrónico y medio impreso estatal con al menos 2 meses de anticipación.",
    "Requisitos de electores: ser miembro activo u honorario y asistir en lugar, fecha y hora convocados.",
    "Criterios de elección: con dos candidatos, mayoría absoluta; con tres o más, mayoría relativa.",
    // Ausencia
    "Ausencia de un miembro: si el Presidente deja su cargo, el Vicepresidente toma el puesto y concluye el periodo de 2 años.",
    "Ausencia del Secretario: el Presidente nombra un Secretario interino por el resto del periodo vigente.",
    "Ausencia del Tesorero: el Presidente nombra un Tesorero interino por el resto del periodo vigente.",
    "Si el Vicepresidente renuncia a tomar el puesto de Presidente, se convoca a nueva elección en Asamblea General Ordinaria o Extraordinaria.",
    // Entrega-Recepción
    "Entrega-Recepción: la Mesa Directiva saliente entrega el acta de asamblea ante Notario público con poderes y facultades a la entrante.",
    "Cada miembro saliente entrega actividades, bienes e información financiera correspondiente al Colegio.",
];
