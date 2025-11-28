import Image from "next/image";

function BoardStatutesSectionOne() {
  return (
    <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed space-y-6">
      <h2 className="text-3xl font-light text-gray-900 mb-6 border-b pb-2">
        Mesa Directiva
      </h2>

      <ul className="list-[lower-alpha] list-outside ml-6 space-y-4 marker:font-semibold marker:text-gray-800">
        {/* Definición */}
        <li>
          <span className="font-semibold text-gray-800">Definición.</span>
          <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
            <li>
              Es la representación legal y administrativa del Colegio de
              Radiología e Imagen del Estado de Guanajuato A. C., estará formada
              por un Presidente, un Secretario General, un Tesorero y un
              Vice-presidente.
            </li>
          </ul>
        </li>

        {/* Funciones */}
        <li>
          <span className="font-semibold text-gray-800">Funciones.</span>
          <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
            <li>
              Generar acciones que den satisfacción a la misión, visión y
              objetivos del Colegio de Radiología e Imagen del Estado de
              Guanajuato A. C.
            </li>
          </ul>
        </li>

        {/* Capacidades de la Mesa Directiva */}
        <li>
          <span className="font-semibold text-gray-800">
            Capacidades de la Mesa Directiva.
          </span>
          <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
            <li>
              Comprar y/o arrendar equipo de oficina, equipo de cómputo, equipo
              electrónico, equipo de telecomunicaciones o bienes inmuebles si
              tienen como propósito cumplir con las funciones de la Mesa
              Directiva.
            </li>
            <li>
              En general, ejecutar toda clase de actos jurídicos, ya sean
              civiles o mercantiles permitidos por la Ley.
            </li>
          </ul>
        </li>

        {/* Facultades de la Mesa Directiva */}
        <li>
          <span className="font-semibold text-gray-800">
            Facultades de la Mesa Directiva.
          </span>
          <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-2 marker:font-normal marker:text-gray-700">
            <li>
              La Mesa Directiva gozará de las facultades que a continuación se
              mencionan, las que serán ejercidas a través de su Presidente,
              Secretario, Tesorero, y en su caso, Vicepresidente, en la forma y
              términos que determine la Asamblea General:
              {/* Sub-lista para los PODERES */}
              <ul className="list-disc list-outside ml-6 mt-2 space-y-1 font-medium text-gray-900 marker:text-[#0B4B2B]">
                <li>PODER GENERAL PARA PLEITOS Y COBRANZAS.</li>
                <li>PODER GENERAL PARA ACTOS DE ADMINISTRACIÓN.</li>
                <li>PODER GENERAL PARA ACTOS DE DOMINIO.</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                Los poderes se confieren en los términos de los Artículos 2064
                (dos mil sesenta y cuatro) y 2100 (dos mil cien) del Código
                Civil vigente para el Estado de Guanajuato, sus correlativos,
                los artículos 2554 (dos mil quinientos cincuenta y cuatro) y
                2587 (dos mil quinientos ochenta y siete) del Código Civil para
                el Distrito Federal, sus correlativos, de todas las Entidades
                Federativas de los Estados Unidos Mexicanos en donde se ejerza
                el presente mandato, los que confieren con todas las facultades
                generales y especiales que conforme a la Ley requieran cláusula
                especial, sin limitación alguna.
              </p>
              <p className="mt-4 font-medium text-gray-800">
                Enunciativa, más no limitativamente, queda facultado la Mesa
                Directiva:
              </p>
              {/* Sub-lista para las facultades detalladas */}
              <ul className="list-[lower-alpha] list-outside ml-6 mt-2 space-y-3 marker:font-normal marker:text-gray-700">
                <li>
                  Para iniciar, continuar, transigir, contestar o desistirse en
                  cualquier clase de juicio, trámite o diligencias ya sean
                  judiciales, administrativas, laborales o fiscales, en donde la
                  Asociación tenga o pueda llegar a tener el carácter de actora,
                  demandada, quejosa, ofendida tercer perjudicada o cualquier
                  otro carácter; en donde la Asociación tenga o pueda llegar a
                  tener algún interés, ya sea directo o indirecto.
                </li>
                <li>
                  Para que en los juicios, trámites o diligencias en que
                  intervengan, ejercite, toda clase de acciones, oponga
                  excepciones, reconvenga, duplique y replique, ofrezca y
                  desahogue toda clase de pruebas permitidas por la Ley,
                  incluyendo el juicio de Amparo, recuse Jueces, Magistrados o
                  Secretarios, articule y absuelva posiciones, conceda quitas y
                  esperas, transija, convenga, comprometa en arbitrios los
                  negocios sociales, para recibir y hacer pagos, hacer posturas,
                  pujas y mejoras, pedir y tomar posesión de bienes muebles o
                  inmuebles.
                </li>
                <li>
                  Para presentar denuncias y querellas penales en los casos en
                  que resulte ofendida la Asociación, aún en casos concretos y
                  especiales, pudiendo en todos los casos coadyuvar con el
                  Ministerio Público y en su caso otorgar el perdón
                  correspondiente.
                </li>
                <li>
                  Para que en los Juicios de carácter laboral tenga la
                  representación legal a que se refieren los Artículos 689 y 692
                  Fracciones II y III de la Ley Federal del Trabajo.
                </li>
                <li>
                  Para contratar empleados y, en su caso, despedirlos, así como
                  para asignar los empleos y sueldos.
                </li>
                <li>
                  Para contratar al Administrador y, en su caso, despedirlo, así
                  como para asignarle su sueldo y conferir las facultades que
                  estime pertinentes.
                </li>
                <li>
                  Para suscribir, aceptar, girar, librar, endosar o transmitir
                  cualquier título de crédito o documento que importe una
                  obligación o derecho en favor o en contra de la Asociación, en
                  los términos del Artículo noveno de la Ley General de Títulos
                  y Operaciones de Crédito, lo que podrá hacer con cualquier
                  carácter, incluso el de Aval.
                </li>
                <li>
                  Para constituir a la asociación en obligada solidaria,
                  fiadora, otorgar avales y en general otorgar garantías reales
                  o personales, en favor de terceras personas, ya sean físicas o
                  morales en las que tenga o no interés la sociedad, estén o no
                  dichas obligaciones relacionadas con el fin común de la
                  asociación y por lo tanto otorgar o suscribir títulos de
                  crédito, contratos y demás documentos que fueren necesarios
                  para la realización de estos actos, con o sin
                  contraprestación.
                </li>
                <li>
                  Para celebrar con toda clase de Instituciones Bancarias o
                  Financieras todo tipo de operaciones, ya sean activas o
                  pasivas, lo que podrá hacer en la forma que mejor estime sin
                  limitación alguna.
                </li>
                <li>
                  Para celebrar toda clase de convenios y contratos de cualquier
                  naturaleza, que éstos sean y que sirvan para cumplir
                  adecuadamente con el fin común.
                </li>
                <li>
                  Para adquirir bienes de cualquier naturaleza que éstos sean y
                  que sirvan para la mejor realización del fin común.
                </li>
                <li>
                  Para vender, gravar, donar e hipotecar los bienes de la
                  Asociación, lo que podrá hacer en la forma y términos que
                  libremente escoja y señale, sin limitación alguna.
                </li>
                <li>
                  Para conferir o delegar las anteriores facultades, a una o más
                  personas, total o parcialmentee, mediante poderes generales o
                  especiales, y, en su caso, revocarlos o limitarlos.
                </li>
              </ul>
              <p className="mt-4 font-medium text-gray-800">
                En general, la Mesa Directiva tendrá facultades para representar
                a la Asociación en la forma más amplia que en el caso proceda,
                ante cualquier persona física o moral ante autoridades, ya sean
                judiciales, administrativas, laborales o fiscales, pudiendo ser
                federales, estatales o municipales, de cualquier Entidad
                Federativa.
              </p>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

function BoardStatutesSectionTwo() {
  return (
    <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed space-y-6 mt-10">
      <h2 className="text-3xl font-light text-gray-900 mb-6 border-b pb-2">
        Proceso Electoral y Sucesión
      </h2>

      {/* Nombramiento y elección de Presidente */}
      <div className="pt-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Nombramiento y elección de Presidente.
        </h3>
        <ul className="list-[lower-alpha] list-outside ml-6 space-y-4 marker:font-semibold marker:text-gray-800">
          <li>
            <span className="font-semibold text-gray-800">
              Proceso de elección:
            </span>
            <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-2 marker:font-normal marker:text-gray-700">
              <li>
                Convocatoria a candidatos.
                <ul className="list-decimal list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
                  <li>
                    1. Se publicará la convocatoria para el proceso de elección
                    en la orden del día de la Asamblea al menos dos meses
                    previos a la fecha de la votación.
                  </li>
                  <li>
                    2. La Mesa Directiva en funciones, registrará a los miembros
                    interesados y publicará el listado de candidatos al menos 15
                    días previos al día de la elección.
                  </li>
                </ul>
              </li>
              <li>
                Requisitos de candidatos.
                <ul className="list-decimal list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
                  <li>
                    1. Ser miembro activo o miembro honorario del Colegio de
                    Radiología e Imagen del Estado de Guanajuato A.C.
                  </li>
                  <li>
                    2. No haber tenido cargo de Presidente del Colegio al menos
                    un periodo de 2 años previos a la fecha de la elección.
                  </li>
                </ul>
              </li>
              <li>
                Publicación de fecha y hora de la elección.
                <ul className="list-decimal list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
                  <li>
                    Se publicará en redes sociales, chat oficial de WhatsApp,
                    correo electrónico o en una publicación impresa de
                    circulación estatal, en conjunto con la convocatoria para la
                    Asamblea con al menos dos meses de anticipación.
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <li>
            <span className="font-semibold text-gray-800">
              Requisitos de los electores.
            </span>
            <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
              <li>
                Ser miembro activo o miembro honorario del Colegio de Radiología
                e Imagen del Estado de Guanajuato A.C. y formar parte de la
                asamblea en el lugar, fecha y hora convocados.
              </li>
            </ul>
          </li>

          <li>
            <span className="font-semibold text-gray-800">
              Criterios de elección.
            </span>
            <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
              <li>
                Se elegirá a un miembro escrutador quien contará los votos.
              </li>
              <li>
                Una votación entre dos candidatos se definirá con la mayoría
                absoluta, es decir, con más de la mitad de los votos.
              </li>
              <li>
                Una votación entre tres o más candidatos se definirá con la
                mayoría relativa, es decir, cuando una alternativa tenga el
                mayor número de votos.
              </li>
            </ul>
          </li>

          <li>
            <span className="font-semibold text-gray-800">
              El candidato elegido.
            </span>
            <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
              <li>
                El candidato elegido tendrá el nombramiento de Vicepresidente y
                Presidente-Electo por un periodo de dos años. Al término del
                periodo de 2 años, tomará el cargo de Presidente, el cual será
                protestado en Asamblea General.
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Nombramiento de Secretario General y Tesorero */}
      <div className="pt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Nombramiento de Secretario General y Tesorero.
        </h3>
        <ul className="list-[lower-alpha] list-outside ml-6 space-y-4 marker:font-semibold marker:text-gray-800">
          <li>
            <span className="font-semibold text-gray-800">
              Proceso de elección:
            </span>
            <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-2 marker:font-normal marker:text-gray-700">
              <li>
                Convocatoria a candidatos.
                <ul className="list-decimal list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
                  <li>
                    1. Se publicará la convocatoria para el proceso de elección
                    en la orden del día de la Asamblea al menos dos meses
                    previos a la fecha de la votación.
                  </li>
                  <li>
                    2. La Mesa Directiva registrará a los miembros interesados y
                    publicará el listado de candidatos al menos 15 días previos
                    al día de la elección.
                  </li>
                </ul>
              </li>
              <li>
                Requisitos de candidatos.
                <ul className="list-decimal list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
                  <li>
                    1. Ser miembro activo o miembro honorario del Colegio de
                    Radiología e Imagen del Estado de Guanajuato A.C.
                  </li>
                  <li>
                    2. No haber tenido cargo de Secretario General del Colegio
                    de Radiología e Imagen del Estado de Guanajuato A.C. al
                    menos un periodo de 2 años previos a la fecha de elección
                    para aspirar al puesto de Secretario General.
                  </li>
                  <li>
                    3. No haber tenido cargo de Tesorero del Colegio de
                    Radiología e Imagen del Estado de Guanajuato A.C. al menos
                    un periodo de 2 años previos a la fecha de elección para
                    aspirar al puesto de Tesorero.
                  </li>
                  <li>
                    4. El Secretario General actual podrá ser elegido para un
                    cargo diferente al de Secretario General en la Mesa
                    Directiva del periodo inmediato siguiente.
                  </li>
                  <li>
                    5. El Tesorero actual podrá ser elegido para un cargo
                    diferente al de Tesorero en la Mesa Directiva del periodo
                    inmediato siguiente.
                  </li>
                </ul>
              </li>
              <li>
                Publicación de fecha y hora de la elección.
                <ul className="list-decimal list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
                  <li>
                    1. Se publicará en redes sociales, chat oficial de WhatsApp,
                    correo electrónico y en un medio impreso de circulación
                    estatal, la convocatoria a la Asamblea con al menos dos
                    meses de anticipación.
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <li>
            <span className="font-semibold text-gray-800">
              Requisitos de los electores.
            </span>
            <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
              <li>
                Ser miembro activo o miembro honorario del Colegio de Radiología
                e Imagen del estado de Guanajuato A.C y formar parte de la
                asamblea en el lugar, fecha y hora convocados.
              </li>
            </ul>
          </li>

          <li>
            <span className="font-semibold text-gray-800">
              Criterios de elección.
            </span>
            <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-1 marker:font-normal marker:text-gray-700">
              <li>
                Una votación entre dos candidatos se definirá con la mayoría
                absoluta, es decir, con más de la mitad de los votos.
              </li>
              <li>
                Una votación entre tres o más candidatos se definirá con la
                mayoría relativa, es decir, cuando una alternativa tenga el
                mayor número de votos.
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Ausencia de un miembro de la Mesa Directiva */}
      <div className="pt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Ausencia de un Miembro de la Mesa Directiva.
        </h3>
        <ul className="list-[lower-alpha] list-outside ml-6 space-y-4 marker:font-semibold marker:text-gray-800">
          <li>
            <span className="font-semibold text-gray-800">
              Cualquier miembro de la Mesa Directiva puede dejar su cargo por
              cualquier motivo, tanto voluntario como involuntario (Renuncia por
              Motivos Personales, Incapacidad Física o Mental, Migración de la
              Entidad o Fallecimiento).
            </span>
          </li>

          <li>
            <span className="font-semibold text-gray-800">Actuación.</span>
            <ul className="list-[lower-roman] list-outside ml-6 mt-1 space-y-2 marker:font-normal marker:text-gray-700">
              <li>
                En caso de que el presidente deje su cargo el Vicepresidente
                tomará su puesto. Este nombramiento terminará el periodo de 2
                años.
              </li>
              <li>
                En caso de que el secretario general deje su cargo, el
                presidente nombrará a un secretario general interino. Este
                nombramiento terminará el periodo de la Mesa Directiva vigente.
              </li>
              <li>
                En caso de que el tesorero deje su cargo, el presidente nombrará
                a un tesorero interino. Este nombramiento terminará el periodo
                de la Mesa Directiva vigente.
              </li>
              <li>
                En caso de que el Vicepresidente renuncie a tomar el puesto de
                presidente. El presidente o cualquier miembro de la Mesa
                Directiva deberá convocar a una nueva elección en la siguiente
                Asamblea General Ordinaria o deberá convocar a elección en una
                Asamblea Extraordinaria.
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Entrega Recepción de una Mesa Directiva a otra. */}
      <div className="pt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Entrega Recepción de una Mesa Directiva a otra.
        </h3>
        <ul className="list-[lower-alpha] list-outside ml-6 space-y-4 marker:font-semibold marker:text-gray-800">
          <li>
            <span>
              La Mesa Directiva saliente deberá entregar a la Mesa Directiva
              entrante el acta de asamblea en donde se designa a la nueva Mesa
              Directiva y se le otorgan facultades y poderes necesarios para el
              cumplimiento de sus funciones, motivo por el cual se deberá de
              llevar el acta de asamblea ante Notario público.
            </span>
          </li>
          <li>
            <span>
              Cada miembro de la Mesa Directiva saliente deberá hacer entrega de
              sus actividades, de los bienes y de la información financiera
              concerniente al Colegio de Radiología e Imagen del Estado de
              Guanajuato A.C.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function BoardOfDirectors() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="relative w-full h-[30vh] md:h-[30vh] overflow-hidden">
        <Image
          src="/about-banner-page.jpg"
          alt="Equipo médico de radiología trabajando en conjunto"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
        <BoardStatutesSectionOne />
        <BoardStatutesSectionTwo />
      </div>
    </div>
  );
}
