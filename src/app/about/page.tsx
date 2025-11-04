import Image from "next/image";

export default function AboutDetailedPage() {
  const partnerships = [
    "Hospital de Especialidades del Bajío",
    "Centro Médico de León",
    "Hospital Regional de León",
    "Instituto de Diagnóstico por Imagen",
    "Clínica de Especialidades Médicas",
    "Hospital General de Guanajuato",
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Image Section */}
      <div className="relative w-full h-[30vh] overflow-hidden">
        <img
          src="/about-banner-page.jpg"
          alt="Equipo médico de radiología trabajando en conjunto"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
      {/* Header Section */}
        <div className="mb-16">
          <div className="text-sm text-gray-500 mb-4 uppercase tracking-wide">
            COLEGIO DE RADIOLOGÍA
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-8 text-gray-900">
            Instituciones médicas aliadas
            <br />
            brindan una base sólida
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-8 sm:mb-12 lg:mb-20">
        {/* Left: Medical Building Illustration */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 backdrop-blur-sm w-full max-w-md">
              <div className="relative w-full h-[300px]">
                <Image
                  src="/about-crieg.png"
                  alt="Ilustración de un edificio médico"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-light text-gray-900">
                Nuestro principal objetivo es la Educación Médica,
                <br />
                fortalecer nuestra unidad médica a nivel regional.
              </h2>

              <div className="h-px bg-gray-300 w-full"></div>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  La asociación se denomina{" "}
                  <span className="text-gray-900 font-medium">
                    Colegio de Radiología e Imagen del Estado de Guanajuato,
                  </span>{" "}
                  seguida de las palabras Asociación Civil o de sus iniciales
                  A.C.. Su domicilio se encuentra en el estado de Guanajuato,
                  con la posibilidad de establecer oficinas o dependencias en
                  cualquier municipio del mismo estado. La duración de la
                  asociación será de noventa y nueve (99) años, contados a
                  partir de la fecha del acta constitutiva.
                </p>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4 lg:gap-8 mb-8 lg:mb-16">
        {/* Left Card - Mission */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-light mb-4 text-gray-900">Misión</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Ofrecer a los asociados eventos de educación médica continua de
                una forma organizada, previsible y transparente con valor ante
                el Consejo Mexicano de Radiología e Imagen.
              </p>

              <h3 className="text-2xl font-light mb-4 text-gray-900">Visión</h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Ser la organización que ofrezca el mayor puntaje anual de
                recertificación para los médicos radiólogos del Estado de
                Guanajuato.
              </p>

              <h3 className="text-2xl font-light mb-4 text-gray-900">
                Valores
              </h3>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 leading-relaxed">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Trabajo en equipo
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Sentido de pertenencia
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Solidaridad
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Calidad
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Academia
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Originalidad
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Responsabilidad
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Confianza
                </li>
              </ul>
            </div>
          </div>

          {/* Right Card - Certification */}
          <div className="space-y-6 mt-6 lg:mt-0">
            <div>
              <h3 className="text-2xl font-light mb-4 text-gray-900">
                Objetivos
              </h3>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Agrupar en un cuerpo colegiado a los Médicos Especializados en
                  Radiología Diagnóstica y Terapéutica del Estado de Guanajuato.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Crear y organizar eventos para la difusión del conocimiento en
                  la especialidad tanto de forma presencial como a través de
                  medios electrónicos.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Promover la certificación ante el Consejo Mexicano de
                  Radiología e Imagen.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Estimular la investigación.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Fomentar la relación del Colegio con otras organizaciones
                  médicas estatales, con asociaciones médicas de otros estados,
                  con sociedades médicas nacionales y con organismos médicos
                  extranjeros.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Involucrar a los médicos residentes de las sedes de la
                  especialidad en el Estado de Guanajuato en la actividad
                  académica del Colegio de Radiología e Imagen del Estado de
                  Guanajuato A.C.
                </li>
              </ul>
            </div>
          </div>
        </div>


        {/* Bottom branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-12 pt-6 border-t border-gray-300 space-y-4 sm:space-y-0">
  <div className="flex items-start sm:items-center space-x-0 sm:space-x-4">
    <span className="text-lg sm:text-xl font-base text-gray-900 leading-snug">
      Colegio de Radiología e Imagen del Estado de Guanajuato
    </span>
  </div>

  <div className="flex items-center space-x-2 text-sm text-gray-500">
    <span>Constituido en</span>
    <div className="font-semibold text-gray-900">2024</div>
  </div>
</div>

      </div>
    </div>
  );
}
