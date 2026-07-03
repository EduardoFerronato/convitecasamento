import { SiteBackground } from "@/components/ui/WeddingUI";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Countdown } from "@/components/Countdown";
import { Story } from "@/components/Story";
import { GiftList } from "@/components/GiftList";
import { RSVP } from "@/components/RSVP";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-night">
      <SiteBackground />
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <Countdown />
        <Story />
        <GiftList />
        <RSVP />
        <Footer />
      </div>
    </main>
  );
}
