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
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
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
                CRIEG no es técnicamente solo un colegio —
                <br />
                pero nunca lo notarías.
              </h2>

              <div className="h-px bg-gray-300 w-full"></div>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Trabajar con{" "}
                  <span className="text-gray-900 font-medium">
                    instituciones médicas aliadas
                  </span>{" "}
                  nos permite desbloquear acceso seguro al sistema de salud de
                  Guanajuato y enfocarnos en construir programas innovadores de
                  educación médica continua para más de 200 médicos radiólogos.
                </p>

                <div className="space-y-4">
                  <p className="text-gray-700">
                    Al seleccionar una institución médica aliada, esto es lo que
                    buscamos:
                  </p>

                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Instituciones con certificaciones del Consejo de
                      Salubridad General
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <div>
                        <span className="text-gray-900 font-medium">
                          Excelencia académica sólida
                        </span>{" "}
                        — equipos de radiología de última generación, recursos
                        educativos actualizados, y un historial de formación
                        médica especializada
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Diversas fuentes de casos clínicos y una amplia gama de
                      especialidades médicas
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Una creencia compartida en nuestros ambiciosos objetivos
                      educativos y la determinación para ayudarnos a alcanzarlos
                    </li>
                  </ul>
                </div>

                <p className="text-gray-700">
                  Trabajamos principalmente con seis instituciones médicas
                  aliadas:
                </p>

                <ul className="space-y-2 text-gray-700">
                  {partnerships.slice(0, 4).map((partner, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left Card - Mission */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-light mb-4 text-gray-900">
                Todo comienza construyendo
                <br />
                nuestra base médica
              </h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Desde el inicio hasta el final, tu experiencia en CRIEG está
                diseñada alrededor de la excelencia médica, la fuente definitiva
                de confianza para el desarrollo profesional de tu especialidad.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Y para darte la mejor experiencia educativa posible, hemos
                preservado los mejores elementos de la formación médica
                tradicional — y eliminado lo peor.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Obtienes estabilidad y seguridad a través de instituciones
                médicas aliadas estratégicamente elegidas que apoyan un rango de
                especialidades y son menos sensibles a los cambios del
                ecosistema de salud.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Te libras de interfaces obsoletas y cuotas ocultas porque hemos
                diseñado una experiencia educativa que respeta el tiempo y
                recursos de tu práctica médica.
              </p>
            </div>
          </div>

          {/* Right Card - Certification */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-light mb-4 text-gray-900">
                Cómo tu certificación CMRI
                <br />
                supera 20x el puntaje estándar
              </h3>

              <p className="text-gray-700 leading-relaxed mb-6">
                Una{" "}
                <span className="text-gray-900 font-medium">
                  red de educación continua
                </span>{" "}
                es un programa que involucra distribuir estratégicamente eventos
                académicos a través de múltiples instituciones, reduciendo el
                impacto de cualquier punto único de falla.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Los participantes obtienen acceso a cobertura ampliada de
                recertificación sin necesidad de inscribirse en programas
                individuales, cumpliendo o superando los requisitos del Consejo
                Mexicano de Radiología e Imagen.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Nuestras instituciones aliadas participan en sus propias redes
                educativas que incluyen varios centros médicos certificados —
                todos se pueden encontrar en los Documentos CMRI , Documentos
                Académicos, Documentos de Certificación en nuestra página Legal.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Gracias a este programa, tus eventos de educación continua en
                CRIEG son elegibles para hasta 50 puntos en cobertura de
                recertificación — 20x el límite estándar por institución.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Para diversificar tus créditos, puedes usar CRIEG Academy para
                asignar cualquiera de tus fondos excedentes — por ejemplo, más
                allá de los 50 puntos asegurados — hacia programas de
                investigación que están invertidos en desarrollo académico a
                largo plazo.
              </p>
            </div>
          </div>
        </div>

        {/* Partner Institutions */}
        <div className="border-t border-gray-300 pt-12">
          <h4 className="text-sm text-gray-500 mb-8 uppercase tracking-wide">
            ALGUNAS DE LAS INSTITUCIONES MÉDICAS REGULADAS CON LAS QUE
            TRABAJAMOS
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {partnerships.map((partner, index) => (
              <div key={index} className="text-gray-700 text-sm">
                {partner}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom branding */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-300">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-base text-gray-900">
              Colegio de Radiología e Imagen del Estado de Guanajuato
            </span>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <span>constituido en</span>
            <div className="font-bold text-gray-900">2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}
  