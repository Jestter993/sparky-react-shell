
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#00C9A7]/10 to-[#5A5CFF]/15 px-4">
      <div className="bg-white/80 p-8 rounded-2xl shadow-xl border border-border max-w-md w-full flex flex-col items-center animate-scale-in">
        <div className="font-extrabold text-2xl mb-3 bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent">Welcome to Adaptrix!</div>
        <p className="text-base text-muted-foreground mb-6 text-center">Let's make your creative workflow a breeze. You can set up your profile, demo the product, or upload your first video.</p>
        <Button
          variant="default"
          className="w-full bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] text-white font-bold"
          onClick={() => navigate("/")}
        >
          Go to Main App
        </Button>
      </div>
    </main>
  );
};

export default Onboarding;
