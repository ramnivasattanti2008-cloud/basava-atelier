"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Compass, ShieldCheck, Check, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { BasavaLogo } from "@/components/brand/BasavaLogo";
import { JaliShadowPattern } from "@/components/motion/JaliShadowPattern";
import { BrassBorderHighlight } from "@/components/motion/BrassBorderHighlight";
import { SmoothScrollIndicator } from "@/components/motion/SmoothScrollIndicator";
import { KolamLinework } from "@/components/motion/KolamLinework";
import { RoyalCulturalOpening } from "./RoyalCulturalOpening";
import { HeroInteractiveCard } from "./HeroInteractiveCard";

interface HeroEditorialExperienceProps {
  product: Product;
  products?: Product[];
  onQuickView?: (product: Product) => void;
}

export function HeroEditorialExperience({ product, products, onQuickView }: HeroEditorialExperienceProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#18100A] via-[#120B07] to-[#0D0704] text-[#FAF7F2] pt-6 pb-12 sm:pt-8 sm:pb-16 border-b border-[#C5A059]/30">
      {/* 1. Indian Architectural Jali Screen Shadow Background */}
      <JaliShadowPattern tone="dark-heritage" animated={true} />

      {/* 2. Ambient Warm Glow from Sand-Cast Brass and Mysore Gold */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-[#8A2E1E]/12 rounded-full blur-[120px] pointer-events-none" />

      {/* 3. Kolam Floor Art Watermark Linework in Hero Background */}
      <div className="absolute top-8 left-8 opacity-20 pointer-events-none hidden lg:block">
        <KolamLinework size={120} variant="corner" tone="gold" animated={true} />
      </div>

      {/* 4. Top Antique Brass Hairline Highlight */}
      <BrassBorderHighlight position="top" glow={true} />

      <div className="shell relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16 pt-2 pb-6">
          {/* Left Column: Editorial Headline, Cultural Opening & Shopping Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Authenticated Brand Identification & Official Logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mb-4 sm:mb-6"
            >
              <div className="flex items-center gap-3">
                <BasavaLogo
                  tone="brass"
                  orientation="horizontal"
                  symbolSize={36}
                  showWordmark={true}
                  showSubtitle={true}
                />
              </div>

              <div className="h-6 w-px bg-[#C5A059]/30 hidden sm:block" />

              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#F5D77F] text-xs font-serif tracking-widest uppercase shadow-sm">
                <Sparkles size={11} className="text-[#F5D77F] animate-pulse" />
                <span>ಬೆಂಗಳೂರು ಅಟೆಲಿಯರ್ · BENGALURU ATELIER</span>
              </div>
            </motion.div>

            {/* Direct, Unclipped Editorial Headline with Mysore Gold Shimmer */}
            <div className="space-y-2 mb-3">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#FAF7F2] font-medium tracking-tight leading-tight"
              >
                An art of its own.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="font-display italic text-2xl sm:text-3xl lg:text-4xl text-[#F5D77F] font-normal leading-snug"
              >
                Rooted in heritage. Crafted for today.
              </motion.p>
            </div>

            {/* Cultural Opening Centerpiece: Architectural Torana Arch & Heritage Seal */}
            <RoyalCulturalOpening className="my-2 sm:my-3" />

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2.5 max-w-xl text-[#D8CEBD]/90 leading-relaxed text-xs sm:text-sm font-sans"
            >
              Explore distinctive leather essentials or create a design that is uniquely yours.
              Every piece is shaped by hand in our Bengaluru workshop from 100% botanical tree-bark tanned hides, solid sand-cast brass, and hand-waxed saddle stitching built to last generations.
            </motion.p>

            {/* Two Clear Primary Shopping Actions */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/shop"
                className="btn btn-light btn-tactile shadow-xl hover:shadow-2xl transition-all flex items-center gap-2.5 px-7 py-3 text-xs font-bold tracking-widest uppercase text-espresso bg-[#FAF7F2] hover:bg-[#EADFCB]"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <Link
                href="/custom"
                className="btn btn-outline-light btn-tactile border-[#C5A059]/60 hover:border-[#F5D77F] hover:bg-[#C5A059]/15 transition-all flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase text-[#F5D77F]"
              >
                <Compass size={15} className="text-[#C5A059]" />
                <span>DESIGN YOUR OWN</span>
              </Link>
            </motion.div>

            {/* Value Guarantees Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-5 pt-3.5 border-t border-[#C5A059]/20 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-[#D8CEBD]/80"
            >
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#F5D77F] shrink-0 font-bold" />
                <span>40 Curated Pieces (₹1,000–₹6,000)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#F5D77F] shrink-0 font-bold" />
                <span>24K Gold Initials on Request</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#F5D77F] shrink-0 font-bold" />
                <span>Direct WhatsApp with Maker</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Interactive Tilting Showcase */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <HeroInteractiveCard
              product={product}
              products={products}
              onQuickView={onQuickView}
            />
          </div>
        </div>

        {/* Bottom Smooth Scroll Indicator */}
        <div className="mt-8 flex justify-center">
          <SmoothScrollIndicator targetId="collection-section" />
        </div>
      </div>

      {/* Bottom Antique Brass Hairline Highlight */}
      <BrassBorderHighlight position="bottom" glow={true} />
    </section>
  );
}
