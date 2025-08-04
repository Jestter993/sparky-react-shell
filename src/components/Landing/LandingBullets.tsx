
import React from "react";

/**
 * @description
 * Feature highlights section for the landing page — "Why Adaptrix feels more native"
 * - Centered with section title (gradient highlight) and horizontal cards with emoji icons, titles, and descriptions.
 */

const BULLETS = [
  {
    title: "Cultural nuance over word-for-word",
    desc:
      "Ad copy is adapted to idioms, tone, and phrasing — not just translated.",
    emoji: "🗣️",
    iconBg: "bg-[#e6f0fc]", // soft blue tint for speech
  },
  {
    title: "Built for ad creators",
    desc:
      "Keeps call-to-actions sharp and natural. Perfect for short-form video platforms.",
    emoji: "🎯",
    iconBg: "bg-[#d2f5ed]", // soft jade tint for targeting
  },
  {
    title: "No editing tools needed",
    desc:
      "We handle the transcription, translation, and voiceover behind the scenes.",
    emoji: "🛠️",
    iconBg: "bg-[#f0e6fc]", // soft purple tint for tools
  },
];

const LandingBullets = () => (
  <section className="w-full bg-[#F5F8FA] py-20 px-4">
    <div className="max-w-5xl mx-auto flex flex-col items-center">
      {/* Title */}
      <h2 className="text-[2rem] md:text-4xl font-extrabold text-center leading-snug mb-12">
        Why Adaptrix feels{" "}
        <span className="bg-gradient-to-r from-[#5A5CFF] to-[#00C9A7] bg-clip-text text-transparent">
          more native
        </span>
      </h2>
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
            {/* Emoji icon with soft background */}
            <div className={`rounded-xl ${b.iconBg} mb-5 p-3 flex items-center justify-center w-14 h-14`}>
              <span className="text-2xl">{b.emoji}</span>
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
