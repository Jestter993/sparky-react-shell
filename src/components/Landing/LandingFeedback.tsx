import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LandingFeedback = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-4 bg-[#F5F8FA]"
    >
      <div className="max-w-5xl mx-auto text-center">
        <div 
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Help Shape What We Build
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            We're in early access — and your feedback helps guide what comes next.<br />
            Spotted something weird? Want a new language? Let us know.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbrand.com"
                className="flex-1 h-12 text-base"
                required
              />
              <Button
                type="submit"
                className="font-semibold text-lg px-8 h-12 bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] text-white shadow-lg hover-scale hover:shadow-xl transition-all duration-300 animate-enter"
              >
                Let's chat
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LandingFeedback;