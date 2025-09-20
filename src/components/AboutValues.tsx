import { GraduationCap, Eye, HeartHandshake, Users } from "lucide-react";

export default function AboutValues() {
  const cards = [
    {
      title: "Misión",
      Icon: GraduationCap,
      text: "Impulsar la educación médica continua en radiología e imagen, desde la residencia hasta la práctica profesional, mediante sesiones académicas, conferencias y congresos.",
    },
    {
      title: "Visión",
      Icon: Eye,
      text: "Ser la comunidad de referencia en el Bajío por su excelencia académica, innovación y colaboración interinstitucional, contribuyendo a una atención segura y de alto impacto para la sociedad.",
    },
    {
      title: "Valores",
      Icon: HeartHandshake,
      text: "Educación continua, ética y calidad, trabajo colaborativo y servicio a la comunidad médica. Promovemos el intercambio de conocimiento y el desarrollo profesional permanente.",
    },
  ];

  return (
    <div className="w-full my-16 px-8 bg-[#EDECE4] rounded-3xl py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          <Users className="size-6" />
          <h2 className="text-3xl font-bold mb-4 text-center">
            Acerca de Nosotros
          </h2>
        </div>
        <p className="text-base text-center text-gray-600 max-w-2xl mx-auto">
          Somos una organización dedicada a la educación médica continua en
          radiología e imagen. Promovemos que los médicos se mantengan
          actualizados y cuenten con espacios de desarrollo profesional.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ title, Icon, text }) => (
            <div
              key={title}
              className="bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition rounded p-6 pb-14"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full ">
                  <Icon className="h-5 w-5 text-gray-700" aria-hidden="true" />
                </span>
                <h3 className="text-2xl font-semibold">{title}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed px-2">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
