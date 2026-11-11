"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Award, ArrowRight, ShieldCheck, Check, Compass } from "lucide-react";
import { cx } from "@/lib/format";
import { HeritageFlourish } from "./HeritageFlourish";

interface PaintingChapter {
  id: string;
  plateNumber: string;
  kannadaNumber: string;
  title: string;
  kannadaTitle: string;
  region: string;
  subtitle: string;
  accentColor: string;
  bgGradient: string;
  illustrationSvg: React.ReactNode;
  lore: string;
  secrets: string[];
}

const CHAPTERS: PaintingChapter[] = [
  {
    id: "tanning",
    plateNumber: "PLATE 01",
    kannadaNumber: "ಚಿತ್ರ ೦೧",
    title: "The Sacred Groves of Kaveri & Palar",
    kannadaTitle: "ವನಸ್ಪತಿ ಹದಗೊಳಿಸುವಿಕೆ",
    region: "Ambur & Vaniyambadi Valleys",
    subtitle: "45-Day Slow Botanical Pit Infusion",
    accentColor: "#9E472A",
    bgGradient: "from-[#2A150D] via-[#1F1009] to-[#120804]",
    lore: "In the shadow of the Eastern Ghats, our hides rest for 45 continuous days in massive subterranean wooden vats filled with crushed Acacia nilotica (babul) bark and harda (myrobalan) nuts. Zero synthetic chromium or heavy metal pollutants. The Kaveri and Palar riverways remain pristine, while the leather drinks in natural botanical oils, breathing with an earthy, rain-soaked forest aroma.",
    secrets: [
      "100% Chromium-Free Organic Leaching",
      "Native Acacia Bark & Myrobalan Tannins",
      "Zero Liquid Discharge closed-loop water treatment",
      "Pores remain fully open to absorb decades of patina",
    ],
    illustrationSvg: (
      <svg viewBox="0 0 400 300" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
        {/* Pichwai Tree & Floral Vines */}
        <path d="M 200 290 Q 200 200 170 140 Q 140 80 100 40" stroke="#C5A059" strokeWidth="2.5" />
        <path d="M 200 200 Q 230 150 280 110 Q 320 80 340 40" stroke="#C5A059" strokeWidth="2" />
        <path d="M 170 140 Q 210 100 230 40" stroke="#C5A059" strokeWidth="1.5" />
        {/* Lotus Buds & Leaves */}
        <circle cx="100" cy="40" r="16" fill="#8A2E1E" fillOpacity="0.4" stroke="#E5C168" strokeWidth="1.5" />
        <circle cx="340" cy="40" r="14" fill="#8A2E1E" fillOpacity="0.4" stroke="#E5C168" strokeWidth="1.5" />
        <circle cx="230" cy="40" r="12" fill="#8A2E1E" fillOpacity="0.4" stroke="#E5C168" strokeWidth="1.5" />
        {/* Botanical Earthen Tannin Urn */}
        <path d="M 160 290 L 160 250 Q 160 210 200 210 Q 240 210 240 250 L 240 290 Z" fill="#6E351E" fillOpacity="0.5" stroke="#C5A059" strokeWidth="2" />
        <ellipse cx="200" cy="210" rx="35" ry="10" fill="#E5C168" fillOpacity="0.3" stroke="#E5C168" strokeWidth="1.5" />
        {/* Sun & Sacred Rays */}
        <circle cx="200" cy="90" r="28" fill="#F5D77F" fillOpacity="0.15" stroke="#F5D77F" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="200" cy="90" r="14" fill="#F5D77F" fillOpacity="0.6" />
      </svg>
    ),
  },
  {
    id: "saddlery",
    plateNumber: "PLATE 02",
    kannadaNumber: "ಚಿತ್ರ ೦೨",
    title: "The Vijayanagara Saddler’s Bench",
    kannadaTitle: "ಕೈ ಹೊಲಿಗೆ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಕಲೆ",
    region: "Bengaluru Master Atelier",
    subtitle: "Two-Needle Lin Câblé Hand Saddle-Stitching",
    accentColor: "#C5A059",
    bgGradient: "from-[#241A0E] via-[#1B1309] to-[#0F0B05]",
    lore: "Seated at wooden clam vises hand-crafted from teakwood, our Bengaluru artisans punch every diamond hole at an exact 45° angle using French diamond awls. Two needles bearing high-twist French Lin Câblé linen thread cross inside each hole under reciprocal hand-tension. Even if a thread were severed by friction, the remaining loop holds indefinitely. Mass-produced machine lockstitches unravel in a heartbeat; our saddle-stitch endures for generations.",
    secrets: [
      "Traditional two-needle manual saddle lockstitch",
      "Lin Câblé #532 natural flax linen thread",
      "Diamond awl punched at 45° angle (7 stitches/inch)",
      "Will never unravel even under extreme mechanical load",
    ],
    illustrationSvg: (
      <svg viewBox="0 0 400 300" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
        {/* Two Crossed Needles with Flowing Thread */}
        <line x1="80" y1="240" x2="320" y2="60" stroke="#E5C168" strokeWidth="3" strokeLinecap="round" />
        <line x1="80" y1="60" x2="320" y2="240" stroke="#E5C168" strokeWidth="3" strokeLinecap="round" />
        <circle cx="310" cy="70" r="4" fill="#FAF7F2" />
        <circle cx="310" cy="230" r="4" fill="#FAF7F2" />
        {/* S-curved Waxed Linen Thread Ribbons */}
        <path d="M 80 150 Q 150 70 200 150 Q 250 230 320 150" stroke="#F5D77F" strokeWidth="1.8" strokeDasharray="6 4" />
        {/* Saddle Stitch Awl Piercings Pattern */}
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i} transform={`translate(${100 + i * 25}, 150)`}>
            <line x1="-6" y1="-8" x2="6" y2="8" stroke="#F5D77F" strokeWidth="2.5" />
          </g>
        ))}
      </svg>
    ),
  },
  {
    id: "metallurgy",
    plateNumber: "PLATE 03",
    kannadaNumber: "ಚಿತ್ರ ೦೩",
    title: "The Golden Foundry of Moradabad",
    kannadaTitle: "ಮೊರಾದಾಬಾದ್ ಶುದ್ಧ ಹಿತ್ತಾಳೆ",
    region: "Moradabad Sand-Casting Guilds",
    subtitle: "Solid Sand-Cast Virgin Pittal Brass",
    accentColor: "#D4AF37",
    bgGradient: "from-[#2C1D0B] via-[#1E1306] to-[#100902]",
    lore: "While global luxury brands have quietly transitioned to cheap zinc pot metal plated with decorative flash, BASAVA remains uncompromising. Our hardware is individually sand-cast in Moradabad using molten 65% virgin copper and 35% zinc poured at 950°C into green sand molds. Non-magnetic, rust-proof, and solid gold brass through and through. Scratches simply reveal more radiant brass beneath.",
    secrets: [
      "100% Solid Virgin Copper-Zinc Alloy (CuZn35)",
      "Poured in traditional green sand casting molds",
      "D-Rings load-tested to 85 kg (830 N) tensile strength",
      "Develops authentic warm antique patina without flaking",
    ],
    illustrationSvg: (
      <svg viewBox="0 0 400 300" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
        {/* Foundry Cruicible & Molten Gold Flow */}
        <path d="M 140 70 L 260 70 L 240 180 Q 200 210 160 180 Z" fill="#D4AF37" fillOpacity="0.25" stroke="#E5C168" strokeWidth="2.5" />
        <ellipse cx="200" cy="70" rx="60" ry="18" fill="#F5D77F" fillOpacity="0.5" stroke="#E5C168" strokeWidth="2" />
        {/* Molten Stream & Radiance */}
        <path d="M 200 195 Q 200 240 200 280" stroke="#F5D77F" strokeWidth="4" strokeLinecap="round" />
        <circle cx="200" cy="270" r="16" fill="#F5D77F" fillOpacity="0.4" />
        {/* Brass Swivel Clasp Silhouette */}
        <rect x="175" y="105" width="50" height="60" rx="8" fill="none" stroke="#FAF7F2" strokeWidth="2" />
        <circle cx="200" cy="120" r="10" stroke="#FAF7F2" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "burnishing",
    plateNumber: "PLATE 04",
    kannadaNumber: "ಚಿತ್ರ ೦೪",
    title: "The Nilgiri Forest Beeswax Dressing",
    kannadaTitle: "ನೀಲಗಿರಿ ಬೆಟ್ಟಗಳ ಜೇನುಮೇಣ",
    region: "Nilgiri Mountain Biosphere",
    subtitle: "Glass-Burnished Multi-Stage Edge Sealing",
    accentColor: "#B38728",
    bgGradient: "from-[#221A0F] via-[#161008] to-[#0A0703]",
    lore: "Plastic edge paint is designed for fast assembly lines; within a year of summer heat and monsoon humidity, it dries and peels away like tape. At BASAVA, we bevel every raw edge at 45°, wet-sand through 4 progressively fine grits to 1200 grit, and hand-rub raw, unrefined wild beeswax collected from the indigenous tribal communities of the Nilgiri hills. High-speed friction melts the wax deep into the dermis, creating a permanent, glass-smooth water-repellent seal.",
    secrets: [
      "Pure organic wild Nilgiri forest honeycomb beeswax",
      "Zero peeling synthetic edge paint or rubber coats",
      "Heated 65°C hand creasing iron creates permanent boundary",
      "Self-buffing: scratches disappear with ambient palm warmth",
    ],
    illustrationSvg: (
      <svg viewBox="0 0 400 300" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
        {/* Sacred Honeycomb Cells */}
        {[
          { x: 170, y: 100 },
          { x: 230, y: 100 },
          { x: 140, y: 140 },
          { x: 200, y: 140 },
          { x: 260, y: 140 },
          { x: 170, y: 180 },
          { x: 230, y: 180 },
        ].map((c, i) => (
          <polygon
            key={i}
            points={`${c.x},${c.y - 20} ${c.x + 18},${c.y - 10} ${c.x + 18},${c.y + 10} ${c.x},${c.y + 20} ${c.x - 18},${c.y + 10} ${c.x - 18},${c.y - 10}`}
            fill="#D4AF37"
            fillOpacity="0.25"
            stroke="#E5C168"
            strokeWidth="1.5"
          />
        ))}
        {/* Rosewood Slicker Rubbing Leather Edge */}
        <rect x="70" y="240" width="260" height="18" rx="4" fill="#8A4835" stroke="#E5C168" strokeWidth="1.5" />
        <line x1="70" y1="240" x2="330" y2="240" stroke="#F5D77F" strokeWidth="3" />
      </svg>
    ),
  },
];

export function RoyalIndianPaintingGallery() {
  const [activeTab, setActiveTab] = useState(0);
  const current = CHAPTERS[activeTab];

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-[#140C07] text-[#FAF7F2] border-y-2 border-[#caa359]/35">
      {/* 1. Mughal Jaali Arabesque Lattice & Jewel Glow */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, #e5c158 1.5px, transparent 2px),
            linear-gradient(45deg, transparent 48%, rgba(229,193,88,0.3) 49%, rgba(229,193,88,0.3) 51%, transparent 52%)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#caa359]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#8A2E1E]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="shell relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#caa359]/40 bg-[#caa359]/10 text-[#f5db99] text-xs font-serif tracking-widest uppercase mb-3 backdrop-blur-xs">
            <Sparkles size={13} className="text-[#caa359]" />
            <span>ರಾಜ ಚಿತ್ರಶಾಲೆ · THE LIVING ATELIER TAPESTRY</span>
            <Sparkles size={13} className="text-[#caa359]" />
          </div>

          <h2 className="display-lg sm:display-xl font-display text-[#FAF7F2]">
            Four Sacred Chapters of Indian Leathercraft
          </h2>
          <p className="text-sm sm:text-base text-[#D8CEBD]/85 mt-3 max-w-xl mx-auto leading-relaxed">
            Inspired by the court paintings of Mysore and Tanjore. Explore how botanical tannins, hand saddlery, virgin brass, and forest beeswax forge an indestructible heirloom.
          </p>
        </div>

        {/* Interactive Chapter Tab Portals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-10">
          {CHAPTERS.map((ch, idx) => {
            const isSel = activeTab === idx;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={cx(
                  "p-3.5 sm:p-5 text-left border rounded-xs transition-all duration-300 relative overflow-hidden group cursor-pointer",
                  isSel
                    ? "bg-[#25170E] border-[#caa359] shadow-xl ring-1 ring-[#caa359]/60"
                    : "bg-[#1A100A] border-[#caa359]/20 hover:border-[#caa359]/50 hover:bg-[#20140D]"
                )}
              >
                {/* Active Gold Indicator Sweep */}
                {isSel && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#CAA359] via-[#F5D77F] to-[#CAA359]" />
                )}

                <div className="flex items-center justify-between text-xs text-[#E8CB85] mb-2 font-mono">
                  <span className="font-bold tracking-wider">{ch.plateNumber}</span>
                  <span className="text-[0.625rem] opacity-75">{ch.kannadaNumber}</span>
                </div>

                <p className="font-display text-sm sm:text-base text-[#FAF7F2] font-semibold group-hover:text-[#F5D77F] transition-colors line-clamp-1">
                  {ch.title}
                </p>
                <p className="text-[0.6875rem] text-[#D8CEBD]/70 mt-1 truncate">
                  {ch.region}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Chapter Interactive Display Canvas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`border-2 border-[#caa359]/40 bg-gradient-to-br ${current.bgGradient} rounded-xs p-6 sm:p-10 shadow-2xl relative overflow-hidden`}
          >
            {/* Traditional Indian Palace Arch Mehrab Overlay */}
            <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full border border-[#caa359]/20 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Traditional Illustrated Artwork */}
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-xs border border-[#caa359]/30 bg-[#0E0704]/60 p-6 flex items-center justify-center shadow-inner group">
                {current.illustrationSvg}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[0.625rem] font-mono tracking-widest text-[#E8CB85] uppercase">
                  <span>{current.kannadaTitle}</span>
                  <span>{current.region}</span>
                </div>
              </div>

              {/* Right Column: Artisan Lore & Provenance Pillars */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#F5D77F] uppercase">
                      {current.plateNumber} · {current.subtitle}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl text-[#FAF7F2] font-semibold leading-snug">
                    {current.title}
                  </h3>
                  <p className="font-serif text-sm text-[#F5D77F]/90 mt-1 italic">
                    {current.kannadaTitle} · {current.region}
                  </p>

                  <p className="mt-4 text-xs sm:text-sm text-[#D8CEBD] leading-relaxed">
                    {current.lore}
                  </p>
                </div>

                {/* Craft Secret Bullet Points */}
                <div className="mt-6 pt-5 border-t border-[#caa359]/25 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#FAF7F2]">
                  {current.secrets.map((sec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check size={14} className="text-[#F5D77F] shrink-0 mt-0.5" />
                      <span className="leading-snug text-[#D8CEBD]">{sec}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link */}
                <div className="mt-7 flex items-center gap-4">
                  <a
                    href="/custom"
                    className="btn btn-light btn-tactile shimmer-badge shadow-md hover:shadow-xl py-2 px-5 text-xs font-bold tracking-wider inline-flex items-center gap-2"
                  >
                    <Compass size={14} className="text-saddle-deep" />
                    Customize with This Technique
                    <ArrowRight size={13} />
                  </a>
                  <a
                    href="/about"
                    className="text-xs font-semibold uppercase tracking-wider text-[#F5D77F] hover:underline"
                  >
                    Read Workshop Heritage →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
