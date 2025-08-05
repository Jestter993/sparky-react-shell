
import { useState } from "react";

const STEPS = [
  {
    number: "1",
    title: "Upload a short ad (15–60 seconds)",
  },
  {
    number: "2", 
    title: "Pick a target language",
  },
  {
    number: "3",
    title: "Get a new version with AI voiceover",
  },
];

const TIPS = [
  "Use a raw video (no subtitles or background music)",
  "Make sure your voiceover is clear and paced",
];

const LandingPricing = () => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  return (
    <section className="container py-20 lg:py-24" id="how-it-works">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16 text-[#0F1117]">
        How it works
      </h2>
      
      {/* Timeline Steps */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Timeline connector line - hidden on mobile */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+2.5rem)] right-[calc(16.67%+2.5rem)] h-1 bg-slate-200 z-0"></div>
          
          {STEPS.map((step, index) => (
            <div 
              key={step.number} 
              className="flex flex-col items-center text-center relative z-10"
              onMouseEnter={() => setHoveredStep(step.number)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Numbered Circle */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 transition-all duration-300 ease-in-out ${
                hoveredStep === step.number 
                  ? 'bg-[#5A5CFF] text-white border-[#5A5CFF] scale-110' 
                  : 'bg-white text-black border-slate-300'
              }`}>
                <span className="text-2xl font-bold">{step.number}</span>
              </div>
              {/* Step Text */}
              <div className={`text-xl max-w-sm transition-all duration-300 ease-in-out ${
                hoveredStep === step.number 
                  ? 'font-bold scale-105 bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent' 
                  : 'font-medium text-[#0F1117]'
              }`}>
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Results Tips */}
      <div className="max-w-4xl mx-auto text-center mt-12">
        <h3 className="text-sm font-bold text-[#0F1117] mb-4">For best results</h3>
        <ul className="space-y-2">
          {TIPS.map((tip, index) => (
            <li key={index} className="text-[#0F1117]/80">
              <span className="text-[#00C9A7]">• </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default LandingPricing;
