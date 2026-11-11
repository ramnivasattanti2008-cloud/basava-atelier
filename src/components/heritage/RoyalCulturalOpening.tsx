"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Sparkles, Award } from "lucide-react";
import { cx } from "@/lib/format";

interface RoyalCulturalOpeningProps {
  className?: string;
}

/**
 * Royal Indian Heritage Cultural Opening Vignette
 *
 * Inspired by Vijayanagara & Hoysala architectural Torana (ceremonial arch),
 * royal court sandalwood carvings, and the sacred craftsmanship of Karnataka.
 * Features animated self-drawing filigree, glowing brass caustics, and bilingual hallmarks.
 */
export function RoyalCulturalOpening({ className }: RoyalCulturalOpeningProps) {
  const transitionConfig = {
    duration: 1.8,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <div className={cx("relative w-full max-w-2xl mx-auto my-6 select-none", className)}>
      {/* 1. Ambient Sunbeam & Mysore Gold Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-36 bg-gradient-to-r from-[#C5A059]/20 via-[#F5D77F]/25 to-[#C5A059]/20 rounded-full blur-3xl pointer-events-none" />

      {/* 2. Architectural Torana / Prabhavali Ornamental Arch Frame */}
      <div className="relative border border-[#C5A059]/35 bg-gradient-to-b from-[#25170F]/90 via-[#1C110A]/90 to-[#140B06]/90 rounded-xs p-5 sm:p-7 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Intricate Corner Jali Knot Flourishes */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#C5A059]/60 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#C5A059]/60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#C5A059]/60 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#C5A059]/60 pointer-events-none" />

        {/* Animated Background Torana SVG Linework */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          viewBox="0 0 600 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Symmetrical Arch Ribbons */}
          <motion.path
            d="M 50 190 Q 300 10 550 190"
            stroke="#F5D77F"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d="M 100 190 Q 300 40 500 190"
            stroke="#C5A059"
            strokeWidth="0.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Radiating Sunburst Rays */}
          {Array.from({ length: 9 }).map((_, i) => {
            const angle = (i - 4) * 14;
            const rad = (angle * Math.PI) / 180;
            const x2 = 300 + Math.sin(rad) * 90;
            const y2 = 60 - Math.cos(rad) * 45;
            return (
              <line
                key={i}
                x1="300"
                y1="60"
                x2={x2}
                y2={y2}
                stroke="#F5D77F"
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
            );
          })}
        </svg>

        {/* Center Content: Royal Crown Crest & Kannada Heritage Seal */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Animated Brand Crest Motif with Sand-Cast Brass Ring */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#F5D77F]/60" />
            <div className="relative flex items-center justify-center p-2 rounded-full border border-[#C5A059]/50 bg-[#170E08] shadow-lg">
              <Image
                src="/images/basava-logo-brass-4x.png"
                alt="BASAVA Royal Mark"
                width={36}
                height={30}
                priority
                className="h-7 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(245,215,127,0.4)]"
              />
            </div>
            <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#F5D77F]/60" />
          </motion.div>

          {/* Bilingual Royal Kannada Hallmark */}
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-2 text-xs font-serif tracking-[0.22em] uppercase text-[#F5D77F]"
          >
            <Sparkles size={11} className="text-[#F5D77F] animate-pulse" />
            <span className="font-semibold">ಕರಕುಶಲ ಪರಂಪರೆ · THE ATELIER STANDARD</span>
            <Sparkles size={11} className="text-[#F5D77F] animate-pulse" />
          </motion.div>

          {/* Cultural Creed Inscription */}
          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-2 text-xs sm:text-sm font-serif italic text-[#FAF7F2]/90 max-w-md leading-relaxed"
          >
            “Where ancestral Indian leathercraft meets timeless modern architecture.”
          </motion.p>

          {/* 4 Interactive Cultural Touchstone Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 pt-4 border-t border-[#C5A059]/20 grid grid-cols-2 sm:grid-cols-4 gap-2 w-full text-[0.6875rem] font-mono text-[#D8CEBD]/85"
          >
            <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-2xs bg-[#C5A059]/10 border border-[#C5A059]/25 hover:border-[#F5D77F] transition-colors">
              <span className="text-[#F5D77F]">✦</span>
              <span>Acacia Bark Tanned</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-2xs bg-[#C5A059]/10 border border-[#C5A059]/25 hover:border-[#F5D77F] transition-colors">
              <span className="text-[#F5D77F]">✦</span>
              <span>Hand Saddle-Stitched</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-2xs bg-[#C5A059]/10 border border-[#C5A059]/25 hover:border-[#F5D77F] transition-colors">
              <span className="text-[#F5D77F]">✦</span>
              <span>Sand-Cast Brass</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-2xs bg-[#C5A059]/10 border border-[#C5A059]/25 hover:border-[#F5D77F] transition-colors">
              <span className="text-[#F5D77F]">✦</span>
              <span>Wild Nilgiri Wax</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
