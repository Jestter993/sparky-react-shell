
import React from "react";
import { Globe, Star, Circle } from "lucide-react";

/**
 * @description
 * Card bullet points for the landing page — matching the reference image:
 * - Centered with section title (gradient highlight), subtitle, and horizontal cards with icon, title, and desc.
 */

const BULLETS = [
  {
    title: "Deep Cultural Transcreation",
    desc:
      "Go beyond word-for-word translation with AI that understands cultural context, idioms, and local references.",
    Icon: Globe,
    iconBg: "bg-[#d2f5ed]", // soft jade tint
    iconColor: "text-[#00C9A7]",
  },
  {
    title: "Fast High-Quality Localization",
    desc:
      "Transform your video ads into culturally authentic content across multiple languages in minutes, not days.",
    Icon: Star,
    iconBg: "bg-[#dbf3f7]", // soft blue/jade tint
    iconColor: "text-[#5A5CFF]",
  },
  {
    title: "Transparent Pricing",
    desc:
      "No hidden fees or confusing charges. Pay only for what you need with our simple, predictable pricing plans.",
    Icon: Circle,
    iconBg: "bg-[#e6f0fc]", // soft blue tint
    iconColor: "text-[#00C9A7]",
  },
];

const LandingBullets = () => (
  <section className="w-full bg-[#F5F8FA] py-20 px-4">
    <div className="max-w-5xl mx-auto flex flex-col items-center">
      {/* Title */}
      <h2 className="text-[2rem] md:text-4xl font-extrabold text-center leading-snug mb-4">
        Transform how your team creates{" "}
        <span className="bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent">
          global content
        </span>
      </h2>
      {/* Subtitle */}
      <div className="text-md md:text-lg text-[#252730B3] font-normal text-center mb-12 max-w-2xl">
        Our platform streamlines the localization workflow so your creative team can
        focus on strategy, not logistics.
      </div>
      {/* Card grid */}
      <div className="w-full flex flex-col md:flex-row gap-7 md:gap-6 items-stretch justify-center">
        {BULLETS.map((b, i) => (
          <div
            key={b.title}
            className="flex-1 bg-white rounded-2xl shadow-lg px-6 py-7 flex flex-col items-start min-w-[260px] max-w-md mx-auto md:mx-0"
            style={{
              boxShadow: "0 4px 24px 0 rgba(60,60,120,0.09)",
            }}
          >
            {/* Icon with soft background */}
            <div className={`rounded-xl ${b.iconBg} mb-5 p-3 flex items-center justify-center`}>
              <b.Icon className={`${b.iconColor}`} size={28} strokeWidth={2} />
            </div>
            {/* Title */}
            <div className="font-semibold text-lg text-[#0F1117] mb-1">
              {b.title}
            </div>
            {/* Description */}
            <div className="text-[#252730B3] text-base leading-relaxed">
              {b.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LandingBullets;
