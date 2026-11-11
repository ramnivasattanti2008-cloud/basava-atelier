"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/format";

interface TextileWeavePatternProps {
  className?: string;
  tone?: "parchment" | "ivory" | "dark-sand";
  animated?: boolean;
}

/**
 * Handwoven Indian Textile Weave Pattern
 *
 * Emulates the tactile warp and weft of handloom weaving, with ultra-fine
 * alternating threads creating a quiet, textured surface on parchment.
 */
export function TextileWeavePattern({
  className,
  tone = "parchment",
  animated = true,
}: TextileWeavePatternProps) {
  const isParchment = tone === "parchment";
  const threadColor = isParchment ? "#8A5D3B" : tone === "ivory" ? "#C5A059" : "#4A3323";
  const threadOpacity = isParchment ? 0.06 : 0.045;

  return (
    <div
      className={cx(
        "absolute inset-0 pointer-events-none select-none overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* 1. Underlying Organic Paper / Linen Texture Tone */}
      <div
        className={cx(
          "absolute inset-0",
          isParchment
            ? "bg-[#FAF7F2]"
            : tone === "ivory"
            ? "bg-[#F4EFE6]"
            : "bg-[#20150D]"
        )}
      />

      {/* 2. Micro Warp & Weft Thread Grid Pattern (16x16 module) */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id={`textile-weave-${tone}`}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            {/* Warp (Vertical Threads) */}
            <line x1="4" y1="0" x2="4" y2="16" stroke={threadColor} strokeWidth="0.8" strokeOpacity={threadOpacity} />
            <line x1="12" y1="0" x2="12" y2="16" stroke={threadColor} strokeWidth="0.8" strokeOpacity={threadOpacity} />

            {/* Weft (Horizontal Crossing Threads) */}
            <line x1="0" y1="4" x2="16" y2="4" stroke={threadColor} strokeWidth="0.8" strokeOpacity={threadOpacity * 0.8} />
            <line x1="0" y1="12" x2="16" y2="12" stroke={threadColor} strokeWidth="0.8" strokeOpacity={threadOpacity * 0.8} />

            {/* Interlocking Thread Knots */}
            <rect x="3" y="3" width="2" height="2" fill={threadColor} fillOpacity={threadOpacity * 1.4} />
            <rect x="11" y="11" width="2" height="2" fill={threadColor} fillOpacity={threadOpacity * 1.4} />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#textile-weave-${tone})`} />
      </svg>

      {/* 3. Subtle Gentle Loom Thread Breath Animation */}
      {animated && (
        <motion.div
          animate={{
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-radial from-transparent via-[#EADFCB]/10 to-transparent pointer-events-none"
        />
      )}
    </div>
  );
}
