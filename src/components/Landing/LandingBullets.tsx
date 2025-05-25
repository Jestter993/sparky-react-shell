
import React from "react";
import { UploadCloud, Languages, Rocket, ArrowRight, ArrowDown } from "lucide-react";

const POINTS = [
  {
    title: "Upload",
    desc: "Drag & drop your ad creative. We auto-detect language and tone.",
    Icon: UploadCloud,
  },
  {
    title: "Adapt",
    desc: "Adaptrix's AI rewrites, dubs, and localizes—matching idioms, humor, and nuance.",
    Icon: Languages,
  },
  {
    title: "Launch",
    desc: "Export ready-to-deploy assets for any market, all in minutes.",
    Icon: Rocket,
  },
];

const LandingBullets = () => (
  <section className="max-w-4xl w-full mx-auto mb-12">
    {/* On medium screens and up: all cards + arrows in one horizontal flex line */}
    <div className="hidden md:flex md:flex-row md:items-center md:justify-center gap-2">
      {POINTS.map((pt, i) => (
        <React.Fragment key={pt.title}>
          <div className="flex flex-col items-center text-center px-3 py-6 rounded-xl bg-white/60 border border-border shadow animate-fade-in hover:scale-105 hover:shadow-lg transition-transform duration-300 min-w-[210px] max-w-xs flex-shrink-0">
            <pt.Icon className="mb-3 text-[#5A5CFF]" size={32} strokeWidth={2.2} />
            <span className="mb-2 text-3xl font-black text-[#5A5CFF]">{i + 1}</span>
            <div className="font-extrabold text-lg tracking-tight mb-1">{pt.title}</div>
            <div className="text-base text-muted-foreground mb-2">{pt.desc}</div>
          </div>
          {i < POINTS.length - 1 && (
            <ArrowRight className="text-[#00C9A7] shrink-0 mx-2" size={32} strokeWidth={2.3} />
          )}
        </React.Fragment>
      ))}
    </div>
    {/* On small screens: vertical list, arrows between cards */}
    <div className="md:hidden flex flex-col items-center gap-1">
      {POINTS.map((pt, i) => (
        <React.Fragment key={pt.title}>
          <div className="w-full flex flex-col items-center text-center px-3 py-6 rounded-xl bg-white/60 border border-border shadow animate-fade-in hover:scale-105 hover:shadow-lg transition-transform duration-300">
            <pt.Icon className="mb-3 text-[#5A5CFF]" size={32} strokeWidth={2.2} />
            <span className="mb-2 text-3xl font-black text-[#5A5CFF]">{i + 1}</span>
            <div className="font-extrabold text-lg tracking-tight mb-1">{pt.title}</div>
            <div className="text-base text-muted-foreground mb-2">{pt.desc}</div>
          </div>
          {i < POINTS.length - 1 && (
            <ArrowDown className="text-[#00C9A7] my-2" size={28} strokeWidth={2.3} />
          )}
        </React.Fragment>
      ))}
    </div>
  </section>
);

export default LandingBullets;
