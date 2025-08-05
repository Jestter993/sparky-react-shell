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
    <section ref={sectionRef} className="py-20 px-4 bg-[#F5F8FA]">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F1117] mb-4">
            Not Just Another Translator
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const iconBgColors = [
              'bg-[#e6f0fc]', // Target emoji - soft blue
              'bg-[#d2f5ed]', // Globe emoji - soft jade
              'bg-[#f0e6fc]'  // No entry emoji - soft purple
            ];
            
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 transition-all duration-500 ${
                  visibleCards[index] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  boxShadow: "0 4px 24px 0 rgba(60,60,120,0.09)"
                }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${iconBgColors[index]} rounded-2xl flex items-center justify-center text-2xl mb-6`}>
                  {feature.icon}
                </div>
                
                {/* Title */}
                <h3 className="font-semibold text-lg text-[#0F1117] mb-3">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-[#252730B3] text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
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