import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const testimonials = [
  {
    quote: "Finally, something that doesn't sound like Google Translate. This actually feels native.",
    author: "Nina 29, Independent Meta Ads Consultant"
  },
  {
    quote: "I tested Spanish and French versions of our hero ad — both came back polished and way faster than Fiverr.",
    author: "Luca 33, DTC Brand Owner (Skincare)"
  },
  {
    quote: "Super easy to use. I just uploaded the video, picked the language, and got a version I could post right away.",
    author: "Jasmine 26, TikTok Freelancer for Shopify Stores"
  }
];

const LandingFeedback = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const sectionRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const testimonialsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTestimonialsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    if (testimonialsRef.current) {
      testimonialsObserver.observe(testimonialsRef.current);
    }

    return () => {
      observer.disconnect();
      testimonialsObserver.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-feedback', {
        body: { email, message }
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Thanks for your feedback. We'll get back to you soon.",
      });
      
      setEmail("");
      setMessage("");
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

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbrand.com"
                className="h-12 text-base"
                required
              />
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think, what features you'd love to see, or any bugs you've spotted..."
                className="min-h-[120px] text-base resize-none"
                required
              />
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

        {/* What Users Are Saying Section */}
        <div 
          ref={testimonialsRef}
          className={`mt-20 transition-all duration-700 ${
            testimonialsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="font-playfair italic text-[#4A5568] text-lg mb-8">
            What Users Are Saying
          </h3>
          
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`group rounded-lg bg-white border border-border p-6 shadow-sm hover:scale-105 transition-transform duration-300 ${
                  testimonialsVisible ? "animate-fade-in" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <blockquote className="italic text-muted-foreground group-hover:text-[#5A5CFF] leading-relaxed transition-colors duration-300 mb-8">
                  "{testimonial.quote}"
                </blockquote>
                <div className="text-sm text-foreground font-medium">
                  – {testimonial.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFeedback;
