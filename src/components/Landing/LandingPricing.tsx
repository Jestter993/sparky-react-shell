
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

const LandingPricing = () => (
  <section className="container py-16 lg:py-20" id="how-it-works">
    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent">
      How it works
    </h2>
    
    {/* Steps */}
    <div className="max-w-2xl mx-auto mb-12">
      <div className="flex flex-col gap-8">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center gap-6">
            {/* Numbered Circle */}
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] flex items-center justify-center">
              <span className="text-white text-xl font-bold">{step.number}</span>
            </div>
            {/* Step Text */}
            <div className="text-lg font-medium text-[#0F1117]">
              {step.title}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Best Results Tips */}
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-[#0F1117] mb-4">Best Results</h3>
        <ul className="space-y-2">
          {TIPS.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-[#0F1117]/80">
              <span className="text-[#00C9A7] mt-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default LandingPricing;
