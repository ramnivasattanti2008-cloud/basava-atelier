"use client";

import { motion } from "motion/react";
import { Compass, Sparkles, ShieldCheck, Check } from "lucide-react";
import { JaliShadowPattern } from "@/components/motion/JaliShadowPattern";
import { BrassBorderHighlight } from "@/components/motion/BrassBorderHighlight";
import { KolamLinework } from "@/components/motion/KolamLinework";
import { IndianHeritageCanvas } from "@/components/heritage/IndianHeritageCanvas";
import { BasavaLogo } from "@/components/brand/BasavaLogo";

interface ShopHeritageHeaderProps {
  onOpenAdvisor: () => void;
  totalPieces: number;
}

/**
 * Royal Indian Heritage Header for the Shopping Experience
 *
 * Implements traditional architectural jali patterns, animated rangoli/kolam
 * linework, floating golden ember particles, and Mysore court typography.
 */
export function ShopHeritageHeader({ onOpenAdvisor, totalPieces }: ShopHeritageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#18100A] via-[#120B07] to-[#0D0704] text-[#FAF7F2] pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-[#C5A059]/30 mb-8 select-none">
      {/* 1. Indian Architectural Jali Screen Shadow Background */}
      <JaliShadowPattern tone="dark-heritage" animated={true} />

      {/* 2. Interactive Gold Embers & Floating Particle Dust Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <IndianHeritageCanvas intensity="subtle" interactive={false} />
      </div>

      {/* 3. Ambient Warm Mysore Gold Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#C5A059]/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8A2E1E]/12 rounded-full blur-[100px] pointer-events-none" />

      {/* 4. Left & Right Animated Rangoli / Kolam Medallions */}
      <div className="absolute top-4 left-4 opacity-25 pointer-events-none hidden md:block">
        <KolamLinework size={90} variant="corner" tone="gold" animated={true} />
      </div>
      <div className="absolute top-4 right-4 opacity-25 pointer-events-none hidden md:block rotate-90">
        <KolamLinework size={90} variant="corner" tone="gold" animated={true} />
      </div>

      {/* 5. Top Antique Brass Hairline Highlight */}
      <BrassBorderHighlight position="top" glow={true} />

      <div className="shell relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C5A059]/20">
          <div>
            {/* Authenticated Bilingual Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#F5D77F] text-xs font-serif tracking-widest uppercase">
                <Sparkles size={11} className="text-[#F5D77F]" />
                <span>ಕರಕುಶಲ ಸಂಗ್ರಹ · THE ATELIER CATALOGUE</span>
              </div>
              <span className="text-xs text-[#D8CEBD]/60 font-mono hidden sm:inline">
                {totalPieces} CURATED PIECES
              </span>
            </motion.div>

            {/* Editorial Page Title */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#FAF7F2] font-medium tracking-tight"
            >
              The Complete Collection
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-2.5 max-w-2xl text-xs sm:text-sm text-[#D8CEBD]/85 leading-relaxed font-sans"
            >
              Browse all forty handcrafted genuine leather pieces. Each silhouette is shaped one by one in Bengaluru using 100% botanical tree-bark tanned hides, solid sand-cast brass, and unrefined Nilgiri forest beeswax.
            </motion.p>
          </div>

          {/* Interactive Silhouette Advisor Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            type="button"
            onClick={onOpenAdvisor}
            className="btn-tactile inline-flex items-center gap-2 px-5 py-3 border border-[#C5A059] bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer shadow-lg shrink-0 self-start md:self-auto"
          >
            <Compass size={15} className="text-[#F5D77F]" />
            <span>✦ Silhouette Advisor</span>
          </motion.button>
        </div>

        {/* Value Guarantees Row with Gold Accents */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[#D8CEBD]/80"
        >
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-1.5">
              <Check size={13} className="text-[#F5D77F] shrink-0 font-bold" />
              <span>100% Genuine Full-Grain Hides</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={13} className="text-[#F5D77F] shrink-0 font-bold" />
              <span>Solid Sand-Cast Moradabad Brass</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={13} className="text-[#F5D77F] shrink-0 font-bold" />
              <span>Two-Needle Hand Saddle-Stitched</span>
            </div>
          </div>

          <span className="font-mono text-[0.6875rem] text-[#F5D77F]/90 hidden lg:inline">
            ₹1,000 – ₹6,000 · Direct Atelier Pricing
          </span>
        </motion.div>

        {/* Symmetrical Rangoli Ribbon Divider */}
        <div className="mt-6 opacity-75">
          <KolamLinework variant="ribbon" tone="gold" animated={true} />
        </div>
      </div>

      {/* Bottom Antique Brass Hairline Highlight */}
      <BrassBorderHighlight position="bottom" glow={true} />
    </section>
  );
}
