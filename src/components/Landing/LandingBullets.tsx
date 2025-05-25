
import { ArrowRight, UploadCloud, Languages, Rocket } from "lucide-react";

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
  <section className="max-w-3xl mx-auto mb-12">
    <div className="grid gap-7 md:grid-cols-3">
      {POINTS.map((pt, i) => (
        <div
          key={pt.title}
          className="flex flex-col items-center text-center px-3 py-6 rounded-xl bg-white/60 border border-border shadow animate-fade-in hover:scale-105 hover:shadow-lg transition-transform duration-300"
        >
          <pt.Icon className="mb-3 text-[#5A5CFF]" size={32} strokeWidth={2.2} />
          <span className="mb-2 text-3xl font-black text-[#5A5CFF]">{i + 1}</span>
          <div className="font-extrabold text-lg tracking-tight mb-1">{pt.title}</div>
          <div className="text-base text-muted-foreground mb-2">{pt.desc}</div>
          <ArrowRight className="text-[#00C9A7] mt-2" size={20} />
        </div>
      ))}
    </div>
  </section>
);

export default LandingBullets;
