import AboutValues from "@/components/AboutValues";
import HeroBanner from "@/components/HeroBanner";
import MemberGridWithSheets from "@/components/MemberGridWithSheets";
import MemberShipCards from "@/components/MemberShipCards";
import { members } from "@/mock/member";

export default function Home() {
  return (
    <div>
      {/* Banner */}
      <HeroBanner />
      
      {/* About Us */}
      <AboutValues />
      
      {/* Members Grid */}
      <MemberGridWithSheets members={members} />
      
      <div className="flex flex-col items-center my-12 max-w-7xl mx-auto px-6">
        {/* Tarjetas de Membresía */}
        <MemberShipCards />

        {/* Contenedor para la imagen alineada a la derecha */}
        <div className="w-full flex justify-end mt-12">
          <img
            src="/info-fmri.jpeg"
            alt="Información FMRI"
            className="w-full sm:max-w-md h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}