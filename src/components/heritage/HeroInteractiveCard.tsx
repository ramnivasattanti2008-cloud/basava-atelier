"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Eye, ShieldCheck, Award } from "lucide-react";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";

interface HeroInteractiveCardProps {
  product: Product;
}

export function HeroInteractiveCard({ product }: HeroInteractiveCardProps) {
  const images = product?.images?.length ? product.images : ["/images/placeholder.jpg"];
  const [activeIdx, setActiveIdx] = useState(0);
  const activeImage = images[activeIdx] || images[0];

  const viewLabels = ["Front Elevation", "3/4 Profile", "Craft Detail", "Interior"];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Soft Ambient Pedestal Glow */}
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-[#caa359]/12 via-[#a88959]/06 to-transparent blur-2xl pointer-events-none" />

      {/* Main Luxury Presentation Card */}
      <div className="relative rounded-xs border border-espresso/15 bg-paper p-6 sm:p-7 shadow-xl overflow-hidden flex flex-col justify-between select-none">
        {/* Top Header Row */}
        <div className="flex items-center justify-between text-xs pb-3 border-b border-espresso/10">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brass" />
            <span className="eyebrow text-saddle-deep tracking-[0.2em] text-[0.6875rem]">
              FEATURED ATELIER PIECE
            </span>
          </div>
          <span className="tabular font-semibold text-espresso text-sm bg-linen/70 px-2.5 py-0.5 rounded-2xs border border-espresso/10">
            {formatINR(product.priceINR)}
          </span>
        </div>

        {/* Center: Real High-Res Photography Stage */}
        <div className="relative aspect-square w-full my-3 flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full h-full flex items-center justify-center"
            >
              <ProductImage
                src={activeImage}
                alt={`${product.name} — view ${activeIdx + 1}`}
                sizes="(min-width: 1024px) 36vw, 90vw"
                eager
                className="max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* View Switcher Thumbnails (Real Angle Photos) */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 py-2 border-t border-b border-espresso/10 my-2">
            {images.slice(0, 4).map((img, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wider rounded-2xs border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-espresso text-ivory border-espresso shadow-2xs"
                      : "bg-paper border-espresso/15 text-charcoal/70 hover:border-espresso/40 hover:text-espresso"
                  }`}
                >
                  <span className="opacity-75">{idx + 1}.</span>
                  <span>{viewLabels[idx] || `Angle ${idx + 1}`}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom Details & Direct Link */}
        <div className="pt-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-lg text-espresso truncate">
              {product.name}
            </p>
            <p className="text-[0.6875rem] text-charcoal/70 mt-0.5 truncate">
              {product.colours?.join(", ") || "Full-Grain Leather"} · {product.material || "100% Genuine Hide"}
            </p>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="btn btn-sm btn-solid shrink-0 flex items-center gap-1.5"
            aria-label={`Explore ${product.name}`}
          >
            <span>Explore Piece</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Floating Authenticity Badge */}
      <div className="absolute -bottom-3 -left-3 hidden sm:flex items-center gap-2.5 bg-espresso text-ivory px-3.5 py-2 shadow-lg border border-sand/30 rounded-2xs z-20">
        <Award size={13} className="text-sand" />
        <span className="text-[0.6875rem] font-medium tracking-wider uppercase">
          100% Full-Grain Leather · Bengaluru
        </span>
      </div>
    </div>
  );
}
