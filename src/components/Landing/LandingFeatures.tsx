import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: "🎯",
    title: "Trained for Real Ad Voice",
    description: "Not general-purpose — our model is tuned to marketing tone, punchlines, and product pitches."
  },
  {
    icon: "🌎", 
    title: "Local Expressions, Not Just Languages",
    description: "We don't just do \"Spanish.\" We're building toward slang-accurate, region-specific voice — like Mexican Spanish vs. Spain Spanish."
  },
  {
    icon: "🚫",
    title: "No Bloat, No Buzzwords", 
    description: "You won't find useless settings or complex toggles here. One upload. One click. Real results."
  }
];

const LandingFeatures = () => {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate cards with staggered timing
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards(prev => {
                  const newState = [...prev];
                  newState[index] = true;
                  return newState;
                });
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Not Just Another Translator
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-500 ${
                visibleCards[index] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Icon */}
              <div className="text-4xl mb-4 text-center">
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-foreground mb-3 text-center">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center">
          <p className="font-playfair italic text-muted-foreground/70 text-lg">
            Most tools go wide. We're going deep — into how ads actually land in different cultures.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;