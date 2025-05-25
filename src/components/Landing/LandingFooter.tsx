
const socialProof = [
  { quote: "Adaptrix made our multi-market campaign feel native everywhere.", author: "Sophie Martins, Global Brand Director" },
  { quote: "Literal translations cost us conversions—Adaptrix fixes that.", author: "Javier Ortega, Performance Marketer" },
  { quote: "Finally: culture-perfect ads, without the stress or delay.", author: "Elena Petrova, E-commerce Lead" },
];

const LandingFooter = () => (
  <footer className="py-10 px-2 mt-10 border-t border-border bg-[#F5F8FA]">
    <section className="max-w-4xl mx-auto mb-9">
      <div className="grid gap-6 md:grid-cols-3">
        {socialProof.map(({ quote, author }) => (
          <div key={author} className="rounded-lg bg-white/90 border border-border p-5 shadow hover:scale-105 transition-transform duration-300">
            <blockquote className="italic leading-snug text-[#5A5CFF] mb-2">“{quote}”</blockquote>
            <div className="text-xs text-muted-foreground font-semibold">{author}</div>
          </div>
        ))}
      </div>
    </section>
    <div className="flex flex-col items-center gap-2">
      <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent">Adaptrix</span>
      <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Adaptrix — Speak Ad. Any Language.</span>
    </div>
  </footer>
);

export default LandingFooter;
