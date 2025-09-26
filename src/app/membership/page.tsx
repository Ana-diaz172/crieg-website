import MemberShipCards from "@/components/MemberShipCards";
import Image from "next/image";

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pb-12">
      {/* Header */}
      <div className="relative w-full h-[25vh] overflow-hidden">
        <Image
          src="/about-banner-page.jpg"
          alt="Equipo médico de radiología trabajando en conjunto"
          className="w-full h-full object-cover"
          fill
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Membership Cards */}
      <MemberShipCards />
    </div>
  );
}
