"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Compass, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { cx } from "@/lib/format";
import { RevealText } from "@/components/motion/RevealText";
import { TextileWeavePattern } from "@/components/motion/TextileWeavePattern";

interface MaterialGrade {
  id: string;
  name: string;
  kannadaName: string;
  badge: string;
  characteristics: string;
  patinaBehavior: string;
  bestFor: string;
  tanninMethod: string;
  colorSwatch: string;
  specDetails: string[];
}

const LEATHER_GRADES: MaterialGrade[] = [
  {
    id: "full-grain",
    name: "Full-Grain Leather",
    kannadaName: "ಪೂರ್ಣ-ಧಾನ್ಯದ ಚರ್ಮ",
    badge: "Grade 01 · Heirloom Quality",
    characteristics: "The outermost layer of the hide with its natural grain left completely un-sanded. Shows natural growth marks, stretch density, and original pores. It breathes freely and is the strongest leather available.",
    patinaBehavior: "Absorbs ambient light, friction, and natural oils to darken into a luminous golden-amber sheen over decades.",
    bestFor: "Executive briefcases, heavy-duty carryalls, heirloom travel weekenders.",
    tanninMethod: "45-Day Slow Acacia nilotica (Babul) Tree Bark Pit Tanning",
    colorSwatch: "#7A3D18",
    specDetails: [
      "100% natural uncut epidermis",
      "Zero synthetic polymer coatings",
      "Tensile strength: 24.5 N/mm²",
      "Absorbs natural beeswax conditioners",
    ],
  },
  {
    id: "top-grain",
    name: "Top-Grain Leather",
    kannadaName: "ಉನ್ನತ-ಧಾನ್ಯದ ಚರ್ಮ",
    badge: "Grade 02 · Supple & Uniform",
    characteristics: "The top surface is lightly smoothed to remove surface blemishes while retaining structural fiber density. Treated with a breathable protective micro-pigment coat for everyday water and stain resistance.",
    patinaBehavior: "Maintains its refined, elegant tone with a soft, supple hand feel that becomes more flexible with daily use.",
    bestFor: "Everyday structured work totes, minimalist crossbodies, elegant satchels.",
    tanninMethod: "Botanical Wattle & Myrobalan Nut Infusion",
    colorSwatch: "#9E5828",
    specDetails: [
      "Refined uniform surface grain",
      "Lightweight, flexible drape",
      "Stain & drizzle resistant",
      "Smooth satin matte luster",
    ],
  },
  {
    id: "pebble-grain",
    name: "Textured Pebble Grain",
    kannadaName: "ಕಲ್ಲು-ವಿನ್ಯಾಸದ ಚರ್ಮ",
    badge: "Grade 03 · Scratch-Resistant",
    characteristics: "Full-bodied natural hide embossed with a textured pebbled grain. Exceptionally resilient against keys, everyday friction, and urban moisture.",
    patinaBehavior: "Resists scratches and maintains its structured architectural silhouette year after year.",
    bestFor: "Daily commute crossbodies, travel slings, compact wristlets.",
    tanninMethod: "Combination Vegetable & Natural Wax Hot-Stuffed",
    colorSwatch: "#2C1E14",
    specDetails: [
      "High abrasion resistance",
      "Ideal for monsoon weather",
      "Easy maintenance with damp cloth",
      "Micro-embossed pebble texture",
    ],
  },
  {
    id: "suede",
    name: "Suede / Roughout Hide",
    kannadaName: "ಸ್ವೆಡ್ ಮೃದು ಚರ್ಮ",
    badge: "Grade 04 · Velvety Luxury",
    characteristics: "Buffed fibrous hide layer offering a lush, velvety nap. Provides warm, tactile richness for contrast accent panels and soft interior linings.",
    patinaBehavior: "Softens into an ultra-supple drape with rich vintage character.",
    bestFor: "Contrast flap accents, interior bag pockets, luxury evening clutches.",
    tanninMethod: "Organic Chrome-Free Castor Oil Conditioning",
    colorSwatch: "#8C6546",
    specDetails: [
      "Velvety soft fibrous surface",
      "Warm tactile contrast",
      "Natural interior protective lining",
      "Gentle brass-brush maintenance",
    ],
  },
];

export function MaterialStoriesSection() {
  const [activeGrade, setActiveGrade] = useState<MaterialGrade>(LEATHER_GRADES[0]);

  return (
    <section className="relative py-20 sm:py-28 bg-[#FAF7F2] border-b border-espresso/15 overflow-hidden">
      {/* 1. Underlying Handloom Weave Texture */}
      <TextileWeavePattern tone="parchment" animated={true} />

      <div className="shell relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-saddle-deep" />
            <span className="eyebrow text-saddle-deep tracking-[0.2em]">Honest Materials</span>
          </div>
          <RevealText as="h2" className="display-lg sm:display-xl text-espresso font-display">
            Leather Grades in Plain English
          </RevealText>
          <p className="mt-3 text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans max-w-xl">
            We never hide behind misleading marketing jargon. Here is the verified anatomy of our leathers, their aging characteristics, and how to choose the right hide for your daily carry.
          </p>
        </div>

        {/* Interactive Material Grade Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {LEATHER_GRADES.map((g) => {
            const isSel = activeGrade.id === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setActiveGrade(g)}
                className={cx(
                  "p-4 sm:p-5 text-left border rounded-xs transition-all duration-300 relative cursor-pointer overflow-hidden",
                  isSel
                    ? "bg-ivory border-espresso shadow-lg ring-1 ring-espresso"
                    : "bg-paper/70 border-espresso/15 hover:border-espresso/40 hover:bg-paper"
                )}
              >
                {/* Active Indicator Top Stripe */}
                {isSel && <div className="absolute top-0 inset-x-0 h-1 bg-[#8A5D3B]" />}

                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-4 h-4 rounded-full border border-espresso/20 shadow-xs shrink-0"
                    style={{ backgroundColor: g.colorSwatch }}
                  />
                  <span className="text-[0.625rem] font-mono text-walnut/70 uppercase tracking-widest">{g.badge.split("·")[0]}</span>
                </div>

                <h4 className="font-display text-lg text-espresso font-semibold line-clamp-1">
                  {g.name}
                </h4>
                <p className="text-[0.6875rem] text-saddle-deep font-serif italic mt-0.5">
                  {g.kannadaName}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Material Interactive Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGrade.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="border-2 border-espresso/15 bg-ivory rounded-xs p-6 sm:p-10 shadow-xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left: Material Swatch & Macro Simulation */}
              <div className="lg:col-span-5 relative aspect-square rounded-xs border border-espresso/15 p-6 flex flex-col justify-between overflow-hidden shadow-inner"
                style={{
                  background: `radial-gradient(circle at 40% 30%, ${activeGrade.colorSwatch}dd 0%, ${activeGrade.colorSwatch} 60%, #150E09 100%)`,
                }}
              >
                {/* Dynamic Surface Highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between z-10">
                  <span className="text-[0.6875rem] font-bold font-mono tracking-widest text-[#FAF7F2] uppercase bg-black/40 px-2.5 py-1 rounded-2xs backdrop-blur-xs">
                    {activeGrade.badge}
                  </span>
                  <span className="text-xs font-serif text-[#FAF7F2]/80">
                    {activeGrade.kannadaName}
                  </span>
                </div>

                <div className="text-center z-10 py-6">
                  <h3 className="font-display text-3xl sm:text-4xl text-[#FAF7F2] font-semibold tracking-wide drop-shadow-md">
                    {activeGrade.name}
                  </h3>
                  <p className="text-xs font-sans text-[#FAF7F2]/80 mt-1 uppercase tracking-widest">
                    {activeGrade.tanninMethod}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[0.6875rem] text-[#FAF7F2]/80 font-mono z-10 border-t border-white/15 pt-2">
                  <span>Natural Hide Dermis</span>
                  <span>100% Genuine</span>
                </div>
              </div>

              {/* Right: Technical Details & Patina Behavior */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="eyebrow text-saddle-deep">{activeGrade.badge}</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl text-espresso font-semibold">
                    {activeGrade.name}
                  </h3>
                  <p className="font-serif text-sm text-saddle-deep mt-0.5 italic">
                    {activeGrade.tanninMethod}
                  </p>

                  <p className="mt-4 text-xs sm:text-sm text-charcoal/85 leading-relaxed">
                    {activeGrade.characteristics}
                  </p>

                  <div className="mt-5 p-4 rounded-xs bg-paper border border-espresso/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-saddle-deep">
                      Patina & Aging Behavior:
                    </p>
                    <p className="text-xs text-charcoal/80 mt-1 leading-relaxed">
                      {activeGrade.patinaBehavior}
                    </p>
                  </div>
                </div>

                {/* Technical Bullet Points */}
                <div className="mt-6 pt-5 border-t border-espresso/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal/85">
                  {activeGrade.specDetails.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check size={14} className="text-saddle-deep shrink-0 mt-0.5" />
                      <span className="leading-snug">{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link to Customizer */}
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/custom?leather=${activeGrade.id}`}
                    className="btn btn-sm btn-solid flex items-center gap-2 shadow-md hover:shadow-xl transition-all"
                  >
                    <Compass size={14} className="text-sand" />
                    <span>Design with {activeGrade.name}</span>
                    <ArrowRight size={13} />
                  </Link>
                  <Link
                    href="/leather-guide"
                    className="text-xs font-semibold uppercase tracking-wider text-espresso underline underline-offset-4"
                  >
                    Read Full Leather Guide →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
