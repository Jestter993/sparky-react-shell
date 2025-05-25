
const tiers = [
  {
    title: "Starter",
    price: "Free",
    features: [
      "3 campaigns/month",
      "Nuanced translation engine",
      "No credit card required",
    ],
    cta: "Get started",
    highlight: true,
  },
  {
    title: "Pro",
    price: "$29/mo",
    features: [
      "Unlimited campaigns",
      "Bulk uploads",
      "Team collaboration",
      "Premium support",
    ],
    cta: "Start Pro",
    highlight: false,
  },
];

const LandingPricing = () => (
  <section className="container py-16 lg:py-20" id="pricing">
    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent">
      Simple, risk-free pricing
    </h2>
    <div className="flex flex-col gap-8 md:flex-row justify-center items-stretch">
      {tiers.map((tier) => (
        <div
          key={tier.title}
          className={`flex-1 rounded-2xl shadow-xl p-8 mx-2 border border-border text-center bg-white/90 ${tier.highlight ? "ring-2 ring-[#00C9A7]/40 scale-105" : ""} transition-transform`}
        >
          <div className="text-lg font-bold text-[#5A5CFF] mb-3">{tier.title}</div>
          <div className="text-4xl font-black mb-1">
            {tier.price}
            {tier.price === "Free" && <span className="ml-2 text-base font-medium text-[#00C9A7]">No card</span>}
          </div>
          <ul className="mt-3 mb-6 flex flex-col gap-1">
            {tier.features.map((f) => (
              <li key={f} className="text-base text-[#0F1117]/80">{f}</li>
            ))}
          </ul>
          <button className={`rounded-md px-6 py-2 font-semibold text-base ${tier.highlight ? "bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] text-white" : "bg-[#F5F8FA] text-[#5A5CFF]"}`}>
            {tier.cta}
          </button>
        </div>
      ))}
    </div>
    <div className="text-center mt-8 text-sm text-muted-foreground">
      {"No hidden fees. Cancel anytime."}
    </div>
  </section>
);

export default LandingPricing;
