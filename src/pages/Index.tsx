
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import LandingNav from "@/components/Landing/LandingNav";
import LandingHero from "@/components/Landing/LandingHero";
import LandingTags from "@/components/Landing/LandingTags";
import LandingDemo from "@/components/Landing/LandingDemo";
import LandingBullets from "@/components/Landing/LandingBullets";
import LandingPricing from "@/components/Landing/LandingPricing";
import LandingFooter from "@/components/Landing/LandingFooter";

const Index = () => {
  const { isAuthenticated, loading } = useAuthStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/upload");
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F8FA] relative flex flex-col justify-center items-center font-inter">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5A5CFF]"></div>
      </main>
    );
  }

  // Only show landing page if user is not authenticated
  if (!isAuthenticated) {
    return (
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
  }

  return null;
};

export default Index;
