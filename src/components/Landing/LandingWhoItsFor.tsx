import { useState, useEffect, useRef } from "react";

const whoItsForData = [
  {
    title: "Shopify & Amazon Sellers",
    description: "Expanding to new countries? Get localized video ads without hiring freelancers.",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=400&h=300&fit=crop&crop=center",
    imageAlt: "Modern workspace with computer and desk setup"
  },
  {
    title: "DTC Marketers & Ad Creators", 
    description: "Running TikTok or Meta ads? Improve conversions with native-sounding copy.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop&crop=center",
    imageAlt: "Group of people around video marketing displays"
  },
  {
    title: "Freelancers & Growth Agencies",
    description: "Speed up client localization projects — test fast, launch global.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&crop=center", 
    imageAlt: "Developer working on code with MacBook"
  }
];

const LandingWhoItsFor = () => {
  const [visibleRows, setVisibleRows] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleRows(prev => prev.map(() => true));
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setVisibleRows(new Array(whoItsForData.length).fill(false));
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-[#F5F8FA]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Who It's For
          </h2>
        </div>
        
        <div className="space-y-16">
          {whoItsForData.map((item, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={index}
                className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 transition-all duration-700 ${
                  visibleRows[index] 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex-1">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {item.title}
                  </h3>
                  <p className="text-lg text-[#4A5568] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingWhoItsFor;