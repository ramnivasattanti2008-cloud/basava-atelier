"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { Award, Check, Compass, Sparkles, Layers, Sliders } from "lucide-react";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { WaxSealInteractive } from "./WaxSealInteractive";

interface HeroInteractiveCardProps {
  product: Product;
}

interface LeatherSwatch {
  id: string;
  name: string;
  kannadaName: string;
  colorHex: string;
  tanninSource: string;
  filterStyle: string;
  description: string;
}

const LEATHER_SWATCHES: LeatherSwatch[] = [
  {
    id: "saddle-tan",
    name: "Royal Saddle Tan",
    kannadaName: "ರಾಜ ಸ್ಯಾಡಲ್ ಕಂದು",
    colorHex: "#C68B59",
    tanninSource: "Acacia nilotica (Babul) & Myrobalan",
    filterStyle: "none",
    description: "45-day botanical pit tanned. Natural grain warms into deep honey amber.",
  },
  {
    id: "mysore-cognac",
    name: "Mysore Cognac",
    kannadaName: "ಮೈಸೂರು ಕಾಗ್ನ್ಯಾಕ್",
    colorHex: "#8B4513",
    tanninSource: "Crushed Wattle Bark & Castor Oil",
    filterStyle: "sepia(0.35) saturate(1.4) hue-rotate(-12deg) contrast(1.05)",
    description: "Infused with organic castor oils. Velvety pull-up with rich mahogany undertones.",
  },
  {
    id: "midnight-onyx",
    name: "Midnight Onyx",
    kannadaName: "ಕಪ್ಪು ಓನಿಕ್ಸ್",
    colorHex: "#1E1C1A",
    tanninSource: "Ferrous Vitriol & Iron-Gall Bath",
    filterStyle: "grayscale(0.85) contrast(1.2) brightness(0.72)",
    description: "Deep obsidian dyed with natural iron oak-gall salts. Satin mineral sheen.",
  },
  {
    id: "nilgiri-olive",
    name: "Nilgiri Forest Olive",
    kannadaName: "ನೀಲಗಿರಿ ಆಲಿವ್ ಹಸಿರು",
    colorHex: "#4A523A",
    tanninSource: "Wild Oak Bark & Lichen Extract",
    filterStyle: "sepia(0.4) hue-rotate(55deg) saturate(0.85) contrast(1.08)",
    description: "Earthy botanical olive steeped with wild Nilgiri forest moss and lichen.",
  },
];

export function HeroInteractiveCard({ product }: HeroInteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSwatch, setSelectedSwatch] = useState<LeatherSwatch>(LEATHER_SWATCHES[0]);

  // Mouse tilt tracking with fluid spring physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      {/* 1. Warm Ambient Royal Golden Light Halo */}
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-[#caa359]/35 via-[#8a2e1e]/20 to-transparent blur-3xl pointer-events-none pulse-aura" />

      {/* 2. Interactive 3D Tilting Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative aspect-[4/5] w-full rounded-xs shadow-2xl p-6 sm:p-8 flex flex-col justify-between border-2 border-[#caa359]/40 bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#ECE3D4] overflow-hidden group select-none transition-shadow duration-500 hover:shadow-brass/25"
      >
        {/* Dynamic Specular Gold Sheen that glides with cursor */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 320px at ${shineX} ${shineY}, rgba(255, 235, 175, 0.55), transparent 70%)`,
          }}
        />

        {/* Traditional Pichwai Corner Flourishes */}
        <div className="absolute top-2 left-2 text-brass/40 pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M 0 0 L 12 0 C 12 6, 6 12, 0 12 Z" />
          </svg>
        </div>
        <div className="absolute top-2 right-2 text-brass/40 pointer-events-none rotate-90">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M 0 0 L 12 0 C 12 6, 6 12, 0 12 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 text-brass/40 pointer-events-none -rotate-90">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M 0 0 L 12 0 C 12 6, 6 12, 0 12 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 text-brass/40 pointer-events-none rotate-180">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M 0 0 L 12 0 C 12 6, 6 12, 0 12 Z" />
          </svg>
        </div>

        {/* Top Header Row with Active Leather Tag */}
        <div className="flex items-center justify-between text-xs z-10">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#caa359]" />
            <span className="eyebrow text-saddle-deep font-bold tracking-widest text-[0.625rem]">
              {selectedSwatch.name.toUpperCase()} · 100% BOTANICAL HIDE
            </span>
          </div>
          <span className="tabular font-bold text-espresso text-sm bg-linen/90 px-2.5 py-0.5 rounded-2xs border border-espresso/15 shadow-2xs">
            {formatINR(product.priceINR)}
          </span>
        </div>

        {/* Center: The Handcrafted Masterpiece with Float & Dynamic Filter */}
        <div className="relative aspect-square w-full my-auto flex items-center justify-center py-2 z-10">
          <motion.div
            animate={{ y: isHovered ? -8 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full h-full flex items-center justify-center transition-all duration-500 ease-out"
            style={{ filter: selectedSwatch.filterStyle }}
          >
            <ProductImage
              src={product.images[0]}
              alt={`${product.name} in ${selectedSwatch.name}`}
              sizes="(min-width: 1024px) 38vw, 90vw"
              eager
              className="p-3 drop-shadow-2xl filter contrast-105 transition-all duration-500"
            />
          </motion.div>
        </div>

        {/* Interactive Live Leather Swatch Picker Bar */}
        <div className="z-10 mb-2 py-2 px-3 rounded-xs bg-paper/85 border border-[#caa359]/30 backdrop-blur-xs flex items-center justify-between gap-3 shadow-2xs">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-saddle-deep truncate flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#caa359]" />
              {selectedSwatch.kannadaName} · {selectedSwatch.name}
            </p>
            <p className="text-[0.58rem] text-charcoal/70 truncate">
              {selectedSwatch.tanninSource}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {LEATHER_SWATCHES.map((swatch) => {
              const isSelected = selectedSwatch.id === swatch.id;
              return (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => setSelectedSwatch(swatch)}
                  title={`Switch leather to ${swatch.name}`}
                  className={`relative h-6 w-6 rounded-full transition-all duration-200 border cursor-pointer focus:outline-none ${
                    isSelected
                      ? "ring-2 ring-[#caa359] ring-offset-2 scale-110 border-white shadow-sm"
                      : "border-black/20 hover:scale-105 opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: swatch.colorHex }}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="swatch-check"
                      className="absolute inset-0 flex items-center justify-center text-white"
                    >
                      <Check size={11} strokeWidth={3} />
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Details & Direct Link */}
        <div className="border-t border-espresso/15 pt-3 flex items-center justify-between z-10 gap-2">
          <div className="min-w-0 pr-2">
            <p className="font-display text-base sm:text-lg text-espresso truncate font-semibold">
              {product.name}
            </p>
            <p className="text-[0.6875rem] text-walnut/80 flex items-center gap-1 truncate">
              <span>ಬೆಂಗಳೂರು · Hand Saddle-Stitched</span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/custom?ref=${product.slug}&leather=${selectedSwatch.id}`}
              className="btn btn-xs btn-outline hover:border-espresso font-semibold flex items-center gap-1"
              title="Customize this exact shape"
            >
              <Compass size={12} className="text-saddle-deep" />
              <span>Bespoke</span>
            </Link>
            <Link
              href={`/products/${product.slug}`}
              className="btn btn-xs btn-solid shadow-md hover:shadow-xl transition-all"
              aria-label={`Explore ${product.name}`}
            >
              Details
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 3. Interactive Floating Karnataka Royal Red Wax Seal */}
      <div className="absolute -top-7 -right-7 z-30 hidden sm:block float-slow">
        <WaxSealInteractive size={94} />
      </div>

      {/* 4. Heritage Badge on Bottom Left */}
      <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2.5 bg-espresso text-[#f4e2b8] px-4 py-2 shadow-xl border border-sand/40 rounded-2xs z-30">
        <Award size={15} className="text-[#caa359]" />
        <span className="text-[0.6875rem] font-bold tracking-widest uppercase">
          100% Genuine Full-Grain
        </span>
      </div>
    </div>
  );
}
