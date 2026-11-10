"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Clock, ShieldCheck, Compass } from "lucide-react";
import { cx } from "@/lib/format";
import { HeritageFlourish } from "./HeritageFlourish";

interface PatinaStage {
  year: number;
  label: string;
  kannadaLabel: string;
  headline: string;
  description: string;
  colorHex: string;
  brassFinish: string;
  characteristics: string[];
}

const PATINA_STAGES: PatinaStage[] = [
  {
    year: 0,
    label: "Day 1 · Atelier Fresh",
    kannadaLabel: "ಹೊಸ ವಿನ್ಯಾಸ",
    headline: "Unboxing Pristine Full-Grain Leather",
    description:
      "Direct from our Bengaluru workshop. The hide displays its raw, unblemished natural grain, infused with organic Nilgiri mountain beeswax and botanical acacia bark oils.",
    colorHex: "#b58759", // Warm honey saddle tan
    brassFinish: "Gleaming Hand-Polished Golden Brass",
    characteristics: [
      "Natural pebbled grain texture",
      "Fresh botanical bark aroma",
      "Firm, sculptural structure",
      "Crisp waxed saddlery edge",
    ],
  },
  {
    year: 1,
    label: "Year 1 · Daily Companion",
    kannadaLabel: "ಒಂದು ವರ್ಷದ ಸೌಂದರ್ಯ",
    headline: "Warming Honey Glow & Softening Grain",
    description:
      "Through 365 days of commutes, monsoon drizzles, and travels, the leather has absorbed sunlight and natural skin oils, deepening into a radiant amber tone.",
    colorHex: "#8f5e3b", // Amber caramel
    brassFinish: "Warm Satin Luster with Subtle Depth",
    characteristics: [
      "Subtle micro-creasing along flex points",
      "Edges buffed silky-smooth by touch",
      "Leather forms around daily essentials",
      "Minor surface scratches self-heal with friction",
    ],
  },
  {
    year: 5,
    label: "Year 5 · The Connoisseur’s Piece",
    kannadaLabel: "ಐದು ವರ್ಷಗಳ ಮೆರುಗು",
    headline: "Rich Cognac Depth & Hand-Burnished Sheen",
    description:
      "A profound transformation. The natural tannins have oxidized into a glossy, marbled cognac hue that cannot be bought or faked in a factory.",
    colorHex: "#683d24", // Deep rich cognac
    brassFinish: "Antique Brushed Brass with Deep Micro-Lowlights",
    characteristics: [
      "Glass-like natural friction polish",
      "Supple, buttery hand-feel",
      "Unique touch memory of its owner",
      "Indestructible linen stitching intact",
    ],
  },
  {
    year: 10,
    label: "Year 10+ · Family Heirloom",
    kannadaLabel: "ಪೀಳಿಗೆಯ ಪರಂಪರೆ",
    headline: "Dark Espresso Luster & Timeless Heritage",
    description:
      "More than a bag—it is an heirloom imbued with a decade of memories. Deep espresso tones, glowing highlights, and solid brass that tells a thousand stories.",
    colorHex: "#3e2417", // Dark royal espresso
    brassFinish: "Heritage Vintage Brass with Revered Character",
    characteristics: [
      "Unmatched vintage character",
      "Complete suppleness without loss of strength",
      "Zero peeling, flaking, or synthetic wear",
      "Ready to be passed to the next generation",
    ],
  },
];

export function PatinaInteractiveSimulator() {
  const [selectedIdx, setSelectedIdx] = useState(1);
  const stage = PATINA_STAGES[selectedIdx];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a1d16] via-[#1f1510] to-[#140d09] border border-[#a88959]/30 text-ivory p-6 sm:p-10 shadow-2xl">
      {/* Subtle decorative Jali screen watermark */}
      <div className="absolute inset-0 opacity-5 jaali-pattern pointer-events-none" />

      {/* Header with Bilingual Kannada Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rotate-45 bg-[#caa359]" />
          <span className="font-serif text-xs text-[#caa359] tracking-widest uppercase font-semibold">
            ಸಮಯದ ಸೌಂದರ್ಯ · The Art of Natural Aging
          </span>
          <span className="h-1.5 w-1.5 rotate-45 bg-[#caa359]" />
        </div>
        <h3 className="display-sm text-[#f1e9da]">
          Interactive Leather Patina Simulator
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-[#d5c3a5]/80 leading-relaxed font-sans">
          Unlike synthetic leathers that peel and crack, genuine BASAVA full-grain vegetable-tanned leather ripens with age. Drag the timeline below to witness a decade of living craft.
        </p>
        <HeritageFlourish variant="lotus" className="my-2 text-[#a88959]/70" />
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Dynamic Visual Bag / Swatch Preview */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-4/3 rounded-xl overflow-hidden border border-[#a88959]/40 shadow-inner p-1 flex items-center justify-center bg-black/40">
            {/* Background Radial Glow that changes with leather tone */}
            <motion.div
              animate={{ backgroundColor: stage.colorHex }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-4 rounded-lg opacity-40 blur-2xl"
            />

            {/* Simulated Leather Cutout & Saddle Stitches */}
            <motion.div
              animate={{ backgroundColor: stage.colorHex }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-56 h-48 sm:w-64 sm:h-52 rounded-lg shadow-2xl border-2 border-white/10 flex flex-col items-center justify-between p-4 overflow-hidden"
              style={{
                boxShadow: `0 15px 35px -10px ${stage.colorHex}88, inset 0 2px 4px rgba(255,255,255,0.25)`,
              }}
            >
              {/* Natural Grain Shimmer Overlay */}
              <div
                className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                  backgroundSize: "6px 6px",
                }}
              />

              {/* Top: Solid Brass Buckle Accent */}
              <div className="w-16 h-5 rounded-xs bg-gradient-to-r from-[#d8b264] via-[#f7e5b5] to-[#8d6725] border border-black/30 shadow-md flex items-center justify-center">
                <div className="w-10 h-1 bg-[#4a3518] rounded-full" />
              </div>

              {/* Center: Hot Stamped Gold Foil BASAVA Crest */}
              <div className="text-center relative z-10">
                <p className="font-serif text-lg tracking-[0.25em] text-[#f7e5b5] font-semibold drop-shadow-sm">
                  BASAVA
                </p>
                <p className="text-[0.55rem] tracking-[0.28em] text-[#d8b264]/90 uppercase font-sans">
                  BENGALURU · ATELIER
                </p>
              </div>

              {/* Bottom: Hand Saddle Stitching Simulation */}
              <div className="w-full border-t border-dashed border-[#caa359]/70 pt-2 flex justify-between text-[0.55rem] text-[#e5dac6]/70 uppercase tracking-wider font-mono">
                <span>7 Stitches / Inch</span>
                <span>Nilgiri Beeswax Finish</span>
              </div>
            </motion.div>

            {/* Corner Brass Rivets */}
            <div className="absolute top-3 left-3 h-2 w-2 rounded-full bg-gradient-to-tr from-[#8d6725] to-[#f7e5b5] shadow-sm" />
            <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-gradient-to-tr from-[#8d6725] to-[#f7e5b5] shadow-sm" />
            <div className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-gradient-to-tr from-[#8d6725] to-[#f7e5b5] shadow-sm" />
            <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-gradient-to-tr from-[#8d6725] to-[#f7e5b5] shadow-sm" />
          </div>

          <div className="mt-3 flex items-center gap-2 text-[0.7rem] text-[#caa359] font-medium tracking-wide">
            <Award size={12} />
            <span>Interactive simulated hide: changes color & patina in real-time</span>
          </div>
        </div>

        {/* Right: Stage Narrative & Details */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.year}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold tracking-wider uppercase bg-[#caa359]/20 text-[#caa359] border border-[#caa359]/40">
                  {stage.label}
                </span>
                <span className="font-serif text-xs text-[#d5c3a5]/70">
                  {stage.kannadaLabel}
                </span>
              </div>

              <h4 className="font-display text-2xl text-[#f7eedc] font-normal leading-tight">
                {stage.headline}
              </h4>

              <p className="text-xs sm:text-sm text-[#d5c3a5]/85 leading-relaxed font-sans">
                {stage.description}
              </p>

              {/* Key Characteristics Pill List */}
              <div className="pt-2">
                <p className="text-[0.65rem] uppercase tracking-widest text-[#caa359] font-semibold mb-2">
                  Observed Attributes:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stage.characteristics.map((char, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-[#f1e9da]/90 bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5"
                    >
                      <ShieldCheck size={12} className="text-[#caa359] shrink-0" />
                      <span className="truncate">{char}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brass Aging Note */}
              <div className="pt-2 flex items-center gap-2 text-[0.72rem] text-[#e5dac6]/80 bg-[#a88959]/10 border border-[#a88959]/30 rounded-lg p-2.5">
                <Award size={14} className="text-[#caa359] shrink-0" />
                <span>
                  <strong>Solid Brass Hardware:</strong> {stage.brassFinish}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom: Interactive Stage Buttons & Timeline Slider */}
      <div className="relative z-10 mt-10 pt-6 border-t border-[#a88959]/20">
        <div className="flex items-center justify-between mb-3 text-xs text-[#d5c3a5]/80 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-[#caa359]" /> Select Timeline Stage:
          </span>
          <span className="text-[#caa359] font-semibold">{stage.label}</span>
        </div>

        {/* 4 Clickable Timeline Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {PATINA_STAGES.map((s, idx) => {
            const active = idx === selectedIdx;
            return (
              <button
                key={s.year}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={cx(
                  "relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300",
                  active
                    ? "bg-[#caa359] text-[#1e130c] border-[#caa359] font-semibold shadow-lg scale-[1.02]"
                    : "bg-white/5 hover:bg-white/10 text-[#d5c3a5] border-white/10 hover:border-[#caa359]/50"
                )}
              >
                <span className="text-xs font-bold uppercase tracking-wider">
                  {s.year === 0 ? "Day 1" : `Year ${s.year}`}
                </span>
                <span
                  className={cx(
                    "text-[0.62rem] truncate mt-0.5",
                    active ? "text-[#30251e]" : "text-[#d5c3a5]/60"
                  )}
                >
                  {s.kannadaLabel}
                </span>

                {/* Subtle active indicator dot */}
                {active && (
                  <motion.div
                    layoutId="patinaActiveDot"
                    className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-[#caa359] shadow-sm"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

