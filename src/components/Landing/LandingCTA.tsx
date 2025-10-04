import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import { useAuthStatus } from "@/hooks/useAuthStatus";

const LandingCTA = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStatus();
  return <section className="py-16 px-4 bg-[#F5F8FA]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-r from-[#5A5CFF] via-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent">
          Try Adaptrix for Free
        </h2>
        <p className="text-lg sm:text-xl font-medium text-[#0F1117]/80 mb-8 max-w-2xl mx-auto" style={{
        fontFamily: "Inter, sans-serif"
      }}>Upload your ad and start connecting with new customers today.</p>
        <Button size="lg" className="font-semibold text-lg px-8 py-4 bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] text-white shadow-lg hover-scale hover:shadow-xl transition-all duration-300 animate-enter" onClick={() => {
          analytics.ctaClick('Start Localizing', 'Final CTA');
          navigate(isAuthenticated ? "/upload" : "/auth?mode=signup");
        }}>
          Start Localizing
        </Button>
        <div className="flex justify-center gap-2 mt-3 mb-6">
          <span className="text-sm text-[#00C9A7] flex items-center gap-1 font-semibold">
            <Check size={16} className="stroke-[3px]" />
            No credit card needed
          </span>
        </div>
      </div>
    </section>;
};
export default LandingCTA;