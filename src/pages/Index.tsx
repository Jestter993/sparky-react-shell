
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import LandingNav from "@/components/Landing/LandingNav";
import LandingHero from "@/components/Landing/LandingHero";
import LandingTags from "@/components/Landing/LandingTags";
import LandingDemo from "@/components/Landing/LandingDemo";

import LandingPricing from "@/components/Landing/LandingPricing";
import LandingFeatures from "@/components/Landing/LandingFeatures";
import LandingWhoItsFor from "@/components/Landing/LandingWhoItsFor";
import LandingFeedback from "@/components/Landing/LandingFeedback";
import LandingFooter from "@/components/Landing/LandingFooter";

const Index = () => {
  const { isAuthenticated, loading } = useAuthStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Check if we should prevent redirect (when user clicks "Back to home")
    const preventRedirect = location.state?.preventRedirect;
    
    // Only auto-redirect once when the component first mounts and user is authenticated
    // and if not explicitly prevented
    if (!loading && isAuthenticated && !hasRedirected.current && !preventRedirect) {
      hasRedirected.current = true;
      navigate("/upload");
    }
  }, [isAuthenticated, loading, navigate, location.state]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F8FA] relative flex flex-col justify-center items-center font-inter">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5A5CFF]"></div>
      </main>
    );
  }

  // Show landing page for both authenticated and non-authenticated users
  return (
    <main className="min-h-screen bg-[#F5F8FA] relative flex flex-col justify-between font-inter">
      <LandingNav />
      <div className="flex-1 flex flex-col gap-2 md:gap-6">
        <LandingHero />
        <LandingTags />
        <LandingDemo />
        <LandingFeatures />
        <LandingPricing />
        <LandingWhoItsFor />
        <LandingFeedback />
      </div>
      <LandingFooter />
    </main>
  );
};

export default Index;
