
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useNavigate } from "react-router-dom";

const LandingNav = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthStatus();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between py-6 px-4 md:px-10 bg-white/50 backdrop-blur-xl border-b border-border sticky top-0 z-30 transition-shadow">
      <div className="flex items-center gap-3">
        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent select-none">Adaptrix</span>
        <span className="hidden md:inline-block text-sm px-3 py-1 rounded bg-[#F5F8FA] text-[#0F1117]/80 ml-2">Speak Ad. Any Language.</span>
        {/* Logged in indicator */}
        {isAuthenticated && (
          <span className="ml-4 inline-flex items-center gap-1 px-2 py-1 rounded bg-[#00C9A7] text-xs font-semibold text-[#0F1117]">
            Logged in
          </span>
        )}
      </div>
      <div className="flex gap-3">
        {!isAuthenticated ? (
          <>
            <Button
              variant="secondary"
              onClick={() => navigate("/auth?mode=login")}
            >
              Login
            </Button>
            <Button
              variant="default"
              className="font-semibold bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] text-white shadow-md hover:scale-105 transition-transform"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Get started
            </Button>
          </>
        ) : (
          <Button
            variant="default"
            className="bg-[#00C9A7] text-[#0F1117] hover:bg-[#00b592] font-semibold"
            onClick={() => alert('Navigate to main app page')}
          >
            Go to Website
          </Button>
        )}
      </div>
    </nav>
  );
};

export default LandingNav;

