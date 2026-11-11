"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Eye,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  Pause,
  Play,
} from "lucide-react";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { KolamLinework } from "@/components/motion/KolamLinework";

interface HeroInteractiveCardProps {
  product?: Product;
  products?: Product[];
  onQuickView?: (product: Product) => void;
}

const CATEGORY_MAP = [
  { slug: "totes-carryalls", label: "Totes", kannada: "೦೧ · ಟೋಟ್" },
  { slug: "crossbody-bags", label: "Crossbody", kannada: "೦೨ · ಕ್ರಾಸ್‌ಬಾಡಿ" },
  { slug: "handbags", label: "Handbags", kannada: "೦೩ · ಹ್ಯಾಂಡ್‌ಬ್ಯಾಗ್" },
  { slug: "sling-bags", label: "Slings", kannada: "೦೪ · ಸ್ಲಿಂಗ್" },
  { slug: "shoulder-messenger-bags", label: "Shoulder", kannada: "೦೫ · ಶೋಲ್ಡರ್" },
  { slug: "envelope-bags", label: "Clutches", kannada: "೦೬ · ಎನ್ವೆಲಪ್" },
  { slug: "wristlets-wallets", label: "Wristlets", kannada: "೦೭ · ರಿಸ್ಟ್ಲೆಟ್" },
];

export function HeroInteractiveCard({
  product: initialProduct,
  products = [],
  onQuickView,
}: HeroInteractiveCardProps) {
  // 1. Build signature showcase items: 1 showpiece from each of the 7 collections
  const collectionPieces = useMemo(() => {
    if (!products.length && initialProduct) {
      return [{ product: initialProduct, categoryMeta: CATEGORY_MAP[0] }];
    }

    const pieces: { product: Product; categoryMeta: (typeof CATEGORY_MAP)[0] }[] = [];

    CATEGORY_MAP.forEach((cat) => {
      // Find highest priced or featured piece in this category
      const matches = products.filter((p) => p.category === cat.slug && p.images?.length);
      const chosen =
        matches.find((p) => p.featured) ||
        matches.sort((a, b) => (b.priceINR ?? 0) - (a.priceINR ?? 0))[0];

      if (chosen) {
        pieces.push({ product: chosen, categoryMeta: cat });
      }
    });

    if (!pieces.length && initialProduct) {
      return [{ product: initialProduct, categoryMeta: CATEGORY_MAP[0] }];
    }

    return pieces;
  }, [products, initialProduct]);

  // Current active collection index
  const [activeCollectionIdx, setActiveCollectionIdx] = useState(0);
  const currentItem = collectionPieces[activeCollectionIdx] || collectionPieces[0];
  const activeProduct = currentItem?.product || initialProduct!;
  const currentMeta = currentItem?.categoryMeta || CATEGORY_MAP[0];

  // Current angle image index within the active product
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const images = activeProduct?.images?.length ? activeProduct.images : ["/images/placeholder.jpg"];
  const activeImage = images[activeImageIdx] || images[0];

  // Auto-play state
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const ROTATE_INTERVAL = 4500; // 4.5 seconds per bag

  // Reset angle index when bag changes
  useEffect(() => {
    setActiveImageIdx(0);
    setProgress(0);
  }, [activeCollectionIdx]);

  // Auto-rotation timer with smooth progress bar
  useEffect(() => {
    if (isPaused || collectionPieces.length <= 1) return;

    const tickMs = 50;
    const increment = (tickMs / ROTATE_INTERVAL) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveCollectionIdx((idx) => (idx + 1) % collectionPieces.length);
          return 0;
        }
        return prev + increment;
      });
    }, tickMs);

    return () => clearInterval(timer);
  }, [isPaused, collectionPieces.length]);

  const viewLabels = ["Front Elevation", "3/4 Profile", "Craft Detail", "Interior"];

  const handlePrev = () => {
    setProgress(0);
    setActiveCollectionIdx((idx) => (idx - 1 + collectionPieces.length) % collectionPieces.length);
  };

  const handleNext = () => {
    setProgress(0);
    setActiveCollectionIdx((idx) => (idx + 1) % collectionPieces.length);
  };

  return (
    <div
      className="relative w-full max-w-lg mx-auto select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Ambient Royal Gold & Amber Halos */}
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-[#C5A059]/20 via-[#8A2E1E]/15 to-transparent blur-3xl pointer-events-none" />

      {/* 2. Top-Right Corner Kolam Linework */}
      <div className="absolute -top-4 -right-4 z-20 pointer-events-none opacity-70">
        <KolamLinework size={64} variant="corner" tone="gold" animated={true} />
      </div>

      {/* 3. Main Luxury Heritage Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-xs border border-[#C5A059]/35 bg-gradient-to-b from-[#21150E]/95 via-[#180E08]/95 to-[#120B06]/95 p-5 sm:p-7 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col justify-between"
      >
        {/* Subtle Watermark Kolam Floor Art in Card Background */}
        <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
          <KolamLinework size={180} tone="gold" animated={false} />
        </div>

        {/* Top Header Row with Collection Name & Price */}
        <div className="flex items-center justify-between text-xs pb-3 border-b border-[#C5A059]/20 relative z-10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5D77F] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5D77F]" />
            </span>
            <span className="font-serif tracking-[0.2em] uppercase text-[0.6875rem] text-[#F5D77F] font-bold">
              {currentMeta.kannada} · {currentMeta.label.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[0.625rem] text-[#D8CEBD]/60 font-mono">
              {activeCollectionIdx + 1}/{collectionPieces.length}
            </span>
            <span className="font-mono font-semibold text-[#FAF7F2] text-sm bg-[#C5A059]/15 px-2.5 py-0.5 rounded-2xs border border-[#C5A059]/30">
              {formatINR(activeProduct?.priceINR)}
            </span>
          </div>
        </div>

        {/* Collection Category Quick Tabs */}
        <div className="flex items-center justify-between gap-1 py-2 border-b border-[#C5A059]/15 overflow-x-auto no-scrollbar relative z-10 text-[0.625rem] font-mono">
          {collectionPieces.map((item, idx) => {
            const isSel = activeCollectionIdx === idx;
            return (
              <button
                key={item.categoryMeta.slug}
                type="button"
                onClick={() => {
                  setProgress(0);
                  setActiveCollectionIdx(idx);
                }}
                className={`px-2 py-1 rounded-2xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isSel
                    ? "bg-[#C5A059] text-[#18100A] font-bold shadow-xs"
                    : "text-[#D8CEBD]/60 hover:text-[#FAF7F2] hover:bg-[#C5A059]/10"
                }`}
              >
                {item.categoryMeta.label}
              </button>
            );
          })}
        </div>

        {/* Center: Real High-Res Photography Stage with Left/Right Arrows */}
        <div className="relative aspect-square w-full my-3 flex items-center justify-center p-2 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeProduct?.id}-${activeImage}`}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex items-center justify-center relative"
            >
              <ProductImage
                src={activeImage}
                alt={`${activeProduct?.name} — view ${activeImageIdx + 1}`}
                sizes="(min-width: 1024px) 36vw, 90vw"
                eager
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>

          {/* Floating Botanical Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18100A]/85 border border-[#C5A059]/30 text-[0.625rem] font-serif text-[#E8CB85] backdrop-blur-xs">
            <Sparkles size={10} className="text-[#F5D77F]" />
            <span>Botanical Tanned Hide</span>
          </div>

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-2 rounded-full border border-[#C5A059]/30 bg-[#18100A]/80 text-[#F5D77F] hover:bg-[#C5A059] hover:text-[#18100A] transition-all cursor-pointer shadow-md backdrop-blur-xs opacity-75 hover:opacity-100"
            aria-label="Previous Collection Piece"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full border border-[#C5A059]/30 bg-[#18100A]/80 text-[#F5D77F] hover:bg-[#C5A059] hover:text-[#18100A] transition-all cursor-pointer shadow-md backdrop-blur-xs opacity-75 hover:opacity-100"
            aria-label="Next Collection Piece"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* View Switcher Angle Buttons (Elevation, Profile, Detail, Interior) */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-2 border-t border-b border-[#C5A059]/15 my-1.5 relative z-10">
            {images.slice(0, 4).map((_: string, idx: number) => {
              const isSelected = activeImageIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
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

        {/* Dynamic Rotation Progress Bar */}
        <div className="w-full h-1 bg-[#C5A059]/15 rounded-full overflow-hidden my-2 relative z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C5A059] to-[#F5D77F]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        {/* Bottom Details & Direct Link */}
        <div className="pt-2 flex items-center justify-between gap-4 relative z-10">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct?.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-display text-base sm:text-lg text-[#FAF7F2] truncate font-medium">
                  {activeProduct?.name}
                </p>
                <p className="text-[0.6875rem] text-[#D8CEBD]/75 mt-0.5 truncate font-serif">
                  {activeProduct?.colours?.join(", ") || "Genuine Leather"} · {activeProduct?.material || "100% Genuine Full-Grain"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(activeProduct)}
                className="p-2 rounded-2xs border border-[#C5A059]/30 bg-[#251810] text-[#E8CB85] hover:text-[#FAF7F2] hover:border-[#F5D77F] transition-all cursor-pointer"
                title="Quick View Details"
                aria-label={`Quick view ${activeProduct?.name}`}
              >
                <Eye size={14} />
              </button>
            )}
            <Link
              href={`/products/${activeProduct?.slug}`}
              className="px-3.5 py-1.5 rounded-2xs bg-[#FAF7F2] text-[#18100A] hover:bg-[#EADFCB] text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-sm"
              aria-label={`Explore ${activeProduct?.name}`}
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
