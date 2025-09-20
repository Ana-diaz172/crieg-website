import AboutValues from "@/components/AboutValues";
import { members } from "@/mock/members";
import {
  ArrowUpRight,
  Star,
  GraduationCap,
  Eye,
  HeartHandshake,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-26 z-50 flex items-center px-8">
        <div className="w-full max-w-7xl mx-auto flex items-center">
          <Link href="/" className="w-20 cursor-pointer">
            <Image
              src="/crieg-logo.png"
              alt="Crieg Logo"
              width={80}
              height={40}
              className="object-contain"
            />
          </Link>
          <nav className="ml-auto">
            <ul className="flex gap-6 text-white font-medium items-center">
              <Link className="hover:text-[#a7c3b5]" href="">
                Inicio
              </Link>
              <Link className="hover:text-[#a7c3b5]" href="">
                Acerca de nosotros
              </Link>
              <Link className="hover:text-[#a7c3b5]" href="">
                Contacto
              </Link>
              <Link
                className="bg-[#0B4B2B] border border-[#07572f] px-6 py-3 rounded-full flex gap-1 cursor-pointer items-center text-base font-medium hover:bg-[#0D5C36] transition"
                href=""
              >
                Colegiarse
                <ArrowUpRight className="text-white" />
              </Link>
            </ul>
          </nav>
        </div>
      </div>
      <div className="relative h-[90vh] w-full overflow-hidden">
        <Image
          fill
          src="/banner.webp"
          alt="Crieg Logo"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 h-[130px] to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute left-0 bottom-32 w-full flex justify-center items-center">
          <div className="flex flex-col justify-start items-start gap-2 text-white w-full max-w-7xl">
            <div className="w-full max-w-3xl">
              <h1 className="text-6xl font-bold text-shadow-lg">
                Colegio de Radiología e Imagen del estado de Guanajuato.
              </h1>
              <p className="text-xl">
                Nuestro principal objetivo es la Educación Médica Continua
                involucrando a nuestros médicos desde su residencia.
              </p>
              <button
                type="button"
                className="bg-[#0B4B2B] border border-[#07572f] px-6 py-3 rounded-full flex gap-3 cursor-pointer mt-4 items-center text-lg font-medium hover:bg-[#0D5C36] transition"
              >
                Colegiarse
                <ArrowUpRight className="text-white" />
              </button>
              <div className="border-l border-white pl-4 mt-6">
                <div className="flex items-center gap-2">
                  <Star className="text-white mb-2 size-4" />
                  <Star className="text-white mb-2 size-4" />
                  <Star className="text-white mb-2 size-4" />
                  <Star className="text-white mb-2 size-4" />
                  <Star className="text-white mb-2 size-4" />
                </div>
                <p className="text-white">1,000+ Médicos Colegiados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About Us */}
      <div className="">
        <AboutValues />
      </div>
      <div className="w-full mx-auto my-16 px-8 max-w-7xl">
        <div>
          <h2 className="text-2xl font-bold mb-6">Mesa directiva</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <div>
                <div className="relative w-full h-auto mb-2 bg-gray-100">
                  <Image
                    src={member.image}
                    alt="Member 1"
                    width={400}
                    height={400}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <p className="text-base text-gray-900 font-medium">
                  {member.name}
                </p>
                <p className="text-sm text-gray-500">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
