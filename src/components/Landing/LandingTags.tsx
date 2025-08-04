
const tags = [
  "Cultural adaptation",
  "Nuanced dubbing",
  "Local expressions",
  "Tone matching",
];

const LandingTags = () => (
  <div className="flex flex-wrap gap-3 justify-center pb-10 -mt-16">
    {tags.map((tag) => (
      <span
        key={tag}
        className="px-4 py-2 rounded-full bg-gradient-to-r from-[#eaeaff] to-[#e6faf5] text-[#5A5CFF] font-bold text-xs uppercase tracking-wider shadow hover-scale animate-fade-in"
      >
        {tag}
      </span>
    ))}
  </div>
);

export default LandingTags;
