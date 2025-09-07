import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LandingNav from "@/components/Landing/LandingNav";
import LandingFooter from "@/components/Landing/LandingFooter";


const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
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

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-feedback', {
        body: { 
          email, 
          message, 
          name: name || undefined,
          marketingConsent 
        }
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: marketingConsent 
          ? "Thanks for your feedback! We've added you to our newsletter." 
          : "Thanks for your feedback. We'll get back to you soon.",
      });
      
      setEmail("");
      setMessage("");
      setName("");
      setMarketingConsent(false);
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />
      
      <main className="flex-grow bg-[#F5F8FA]">
        <section 
          ref={sectionRef}
          className="pt-20 pb-8 px-4 min-h-full"
        >
          <div className="max-w-5xl mx-auto text-center">
            <div 
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Help Shape What We Build
              </h1>
              
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                We're in early access — and your feedback helps guide what comes next.<br />
                Spotted something weird? Want a new language? Let us know.
              </p>

              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="space-y-4">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="h-12 text-base md:text-base"
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="h-12 text-base md:text-base"
                    required
                  />
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message"
                    className="min-h-[120px] text-base resize-none"
                    required
                  />
                  
                  <div className="flex items-start space-x-3 text-left p-4">
                    <input
                      type="checkbox"
                      id="marketing-consent"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-1 accent-[#5A5CFF]"
                    />
                    <label htmlFor="marketing-consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      <span className="text-foreground font-medium">Join our newsletter</span> Get early updates on features, languages, and beta invites.
                    </label>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting || !email || !message}
                    className="w-full font-semibold text-lg px-8 h-12 bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] text-white shadow-lg hover-scale hover:shadow-xl transition-all duration-300 animate-enter disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <div className="-mt-16">
        <LandingFooter />
      </div>
    </div>
  );
};

export default Contact;