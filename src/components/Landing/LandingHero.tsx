
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full flex flex-col items-center pt-16 pb-8 px-4 md:px-0 min-h-[50vh]">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-7 leading-tight tracking-tight bg-gradient-to-r from-[#5A5CFF] via-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent animate-fade-in">Localize Your Video Ads in One Click</h1>
        <p className="text-lg sm:text-xl font-medium text-[#0F1117]/80 mb-8 animate-fade-in" style={{fontFamily: "Inter, sans-serif"}}>
          Translate your ad videos into new markets in minutes, with cultural adaptation for better connection.
        </p>
        <Button
          size="lg"
          className="font-semibold text-lg px-8 py-4 bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] text-white shadow-lg hover-scale hover:shadow-xl transition-all duration-300 animate-enter"
          onClick={() => navigate("/auth?mode=signup")}
        >
          Get started
        </Button>
        <div className="flex justify-center gap-2 mt-3 mb-6">
          <span className="text-sm text-[#00C9A7] flex items-center gap-1 font-semibold">
            <Check size={16} className="stroke-[3px]" />
            No credit card needed
          </span>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
