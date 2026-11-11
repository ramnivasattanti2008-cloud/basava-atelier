"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Eye, ShieldCheck, Award, Sparkles } from "lucide-react";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { KolamLinework } from "@/components/motion/KolamLinework";

interface HeroInteractiveCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const LEATHER_SWATCHES = [
  { name: "Saddle Tan", color: "#8A4B20", border: "#C5A059" },
  { name: "Deep Walnut", color: "#3B2215", border: "#A67C3A" },
  { name: "Pitch Black", color: "#1A1513", border: "#8A6D3B" },
  { name: "Raw Honey", color: "#C68434", border: "#E6C17B" },
];

export function HeroInteractiveCard({ product, onQuickView }: HeroInteractiveCardProps) {
  const images = product?.images?.length ? product.images : ["/images/placeholder.jpg"];
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeSwatch, setActiveSwatch] = useState(LEATHER_SWATCHES[0]);
  const activeImage = images[activeIdx] || images[0];

  const viewLabels = ["Elevation", "3/4 Profile", "Craft Detail", "Interior"];

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* 1. Ambient Royal Gold & Amber Halos */}
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-[#C5A059]/20 via-[#8A2E1E]/15 to-transparent blur-3xl pointer-events-none" />

      {/* 2. Top-Right Corner Kolam Linework */}
      <div className="absolute -top-4 -right-4 z-20 pointer-events-none opacity-70">
        <KolamLinework size={64} variant="corner" tone="gold" animated={true} />
      </div>

      {/* 3. Main Luxury Heritage Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-xs border border-[#C5A059]/35 bg-gradient-to-b from-[#21150E]/95 via-[#180E08]/95 to-[#120B06]/95 p-6 sm:p-7 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col justify-between"
      >
        {/* Subtle Watermark Kolam Floor Art in Card Background */}
        <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
          <KolamLinework size={180} tone="gold" animated={false} />
        </div>

        {/* Top Header Row */}
        <div className="flex items-center justify-between text-xs pb-3.5 border-b border-[#C5A059]/20 relative z-10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F5D77F] animate-pulse" />
            <span className="font-serif tracking-[0.2em] uppercase text-[0.6875rem] text-[#F5D77F] font-bold">
              ATELIER SIGNATURE · ಬೆಂಗಳೂರು
            </span>
          </div>
          <span className="font-mono font-semibold text-[#FAF7F2] text-sm bg-[#C5A059]/15 px-3 py-0.5 rounded-2xs border border-[#C5A059]/30">
            {formatINR(product.priceINR)}
          </span>
        </div>

        {/* Center: Real High-Res Photography Stage */}
        <div className="relative aspect-square w-full my-4 flex items-center justify-center p-3 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full flex items-center justify-center relative"
            >
              <ProductImage
                src={activeImage}
                alt={`${product.name} — view ${activeIdx + 1}`}
                sizes="(min-width: 1024px) 36vw, 90vw"
                eager
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.65)] transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>

          {/* Floating Subtle Wax Seal Motif */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18100A]/85 border border-[#C5A059]/30 text-[0.625rem] font-serif text-[#E8CB85] backdrop-blur-xs">
            <Sparkles size={10} className="text-[#F5D77F]" />
            <span>Botanical Tanned</span>
          </div>
        </div>

        {/* View Switcher Angle Buttons */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-2.5 border-t border-b border-[#C5A059]/15 my-2 relative z-10">
            {images.slice(0, 4).map((_, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1 text-[0.625rem] font-mono uppercase tracking-wider rounded-2xs border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#C5A059] text-[#18100A] font-bold border-[#F5D77F] shadow-sm"
                      : "bg-[#1C120B]/60 border-[#C5A059]/20 text-[#D8CEBD]/75 hover:border-[#C5A059]/50 hover:text-[#FAF7F2]"
                  }`}
                >
                  <span>{idx + 1}.</span>
                  <span>{viewLabels[idx] || `Angle ${idx + 1}`}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Interactive Leather Swatch Preview Selector */}
        <div className="py-2 flex items-center justify-between text-xs border-b border-[#C5A059]/15 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[0.6875rem] font-serif text-[#D8CEBD]/75 uppercase tracking-wider">
              Hide Tone:
            </span>
            <span className="text-[0.6875rem] font-medium text-[#FAF7F2]">
              {activeSwatch.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {LEATHER_SWATCHES.map((swatch) => (
              <button
                key={swatch.name}
                type="button"
                onClick={() => setActiveSwatch(swatch)}
                className={`w-5 h-5 rounded-full transition-all duration-200 cursor-pointer ${
                  activeSwatch.name === swatch.name
                    ? "ring-2 ring-[#F5D77F] ring-offset-2 ring-offset-[#18100A] scale-110"
                    : "opacity-75 hover:opacity-100"
                }`}
                style={{ backgroundColor: swatch.color, border: `1px solid ${swatch.border}` }}
                title={swatch.name}
                aria-label={`Select ${swatch.name} leather tone`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Details & Direct Link */}
        <div className="pt-3.5 flex items-center justify-between gap-4 relative z-10">
          <div className="min-w-0">
            <p className="font-display text-lg text-[#FAF7F2] truncate font-medium">
              {product.name}
            </p>
            <p className="text-[0.6875rem] text-[#D8CEBD]/75 mt-0.5 truncate font-serif">
              {product.colours?.join(", ") || activeSwatch.name} · {product.material || "100% Genuine Full-Grain"}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="p-2 rounded-2xs border border-[#C5A059]/30 bg-[#251810] text-[#E8CB85] hover:text-[#FAF7F2] hover:border-[#F5D77F] transition-all cursor-pointer"
                title="Quick View Details"
                aria-label={`Quick view ${product.name}`}
              >
                <Eye size={14} />
              </button>
            )}
            <Link
              href={`/products/${product.slug}`}
              className="px-4 py-2 rounded-2xs bg-[#FAF7F2] text-[#18100A] hover:bg-[#EADFCB] text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-sm"
              aria-label={`Explore ${product.name}`}
            >
              <span>Explore</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Floating Authenticity Badge with Sand-Cast Brass Emblem */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute -bottom-3 -left-3 hidden sm:flex items-center gap-2.5 bg-[#170E08] text-[#F5D77F] px-4 py-2 shadow-2xl border border-[#C5A059]/50 rounded-2xs z-30"
      >
        <Award size={14} className="text-[#F5D77F]" />
        <span className="text-[0.6875rem] font-serif tracking-widest uppercase">
          ಕರ್ನಾಟಕ ಅಟೆಲಿಯರ್ · 100% FULL-GRAIN HIDE
        </span>
      </motion.div>
    </div>
  );
}
