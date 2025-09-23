import AboutValues from "@/components/AboutValues";
import HeroBanner from "@/components/HeroBanner";
import Navbar from "@/components/layout/Navbar";
import MemberGridWithSheets from "@/components/MemberGridWithSheets";
import { members } from "@/mock/members";

export default function Home() {
  return (
    <div>
      {/* Banner */}
      <HeroBanner />
      {/* About Us */}
      <AboutValues />
      {/* Members Grid */}
      <MemberGridWithSheets members={members} />
    </div>
  );
}
