
import LandingNav from "@/components/Landing/LandingNav";
import LandingHero from "@/components/Landing/LandingHero";
import LandingTags from "@/components/Landing/LandingTags";
import LandingDemo from "@/components/Landing/LandingDemo";
import LandingBullets from "@/components/Landing/LandingBullets";
import LandingPricing from "@/components/Landing/LandingPricing";
import LandingFooter from "@/components/Landing/LandingFooter";

const Index = () => (
  <main className="min-h-screen bg-[#F5F8FA] relative flex flex-col justify-between font-inter">
    <LandingNav />
    <div className="flex-1 flex flex-col gap-2 md:gap-6">
      <LandingHero />
      <LandingTags />
      <LandingDemo />
      <LandingBullets />
      <LandingPricing />
    </div>
    <LandingFooter />
  </main>
);

export default Index;
