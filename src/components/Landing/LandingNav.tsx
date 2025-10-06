import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useNavigate, useLocation } from "react-router-dom";
import { analytics } from "@/utils/analytics";

const LandingNav = () => {
  const { isAuthenticated, logout, loading } = useAuthStatus();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleBackToHome = () => {
    // Track logo click
    analytics.ctaClick('Logo - Back to Home', 'Navigation');
    
    // Check if we're already on the home page
    if (location.pathname === "/") {
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to home and prevent auto-redirect
      navigate("/", { state: { preventRedirect: true } });
    }
  };

  const isUploadPage = location.pathname === "/upload";

  if (loading) {
    return (
      <nav className="flex items-center justify-between py-6 px-4 md:px-10 bg-white/50 backdrop-blur-xl border-b border-border sticky top-0 z-30 transition-shadow">
        <div className="flex items-center gap-3">
          <span 
            className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent select-none cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleBackToHome}
          >
            Adaptrix
          </span>
          <span className="hidden md:inline-block text-sm px-3 py-1 rounded bg-[#F5F8FA] text-[#0F1117]/80 ml-2">Speak Ad. Any Language.</span>
        </div>
        <div className="flex gap-3">
          <div className="w-20 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between py-6 px-4 md:px-10 bg-white/50 backdrop-blur-xl border-b border-border sticky top-0 z-30 transition-shadow">
      <div className="flex items-center gap-3">
        <span 
          className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent select-none cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleBackToHome}
        >
          Adaptrix
        </span>
        <span className="hidden md:inline-block text-sm px-3 py-1 rounded bg-[#F5F8FA] text-[#0F1117]/80 ml-2">Speak Ad. Any Language.</span>
      </div>
      <div className="flex gap-3">
        {!isAuthenticated ? (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                analytics.ctaClick('Login', 'Navigation');
                navigate("/auth?mode=login");
              }}
            >
              Login
            </Button>
            <Button
              variant="default"
              className="font-semibold bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] text-white shadow-md hover-scale"
              onClick={() => {
                analytics.ctaClick('Get started', 'Navigation');
                navigate("/auth?mode=signup");
              }}
            >
              Get started
            </Button>
          </>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-[#0F1117] text-[#0F1117] hover:bg-[#0F1117]/10"
              onClick={() => {
                if (isUploadPage) {
                  analytics.ctaClick('About Adaptrix', 'Navigation');
                  handleBackToHome();
                } else {
                  analytics.ctaClick('Localize video', 'Navigation');
                  navigate("/upload");
                }
              }}
            >
              {isUploadPage ? "About Adaptrix" : "Localize video"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default LandingNav;
