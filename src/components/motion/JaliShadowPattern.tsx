"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/format";

interface JaliShadowPatternProps {
  className?: string;
  tone?: "dark-heritage" | "parchment";
  animated?: boolean;
}

/**
 * Architectural Jali Geometric Screen & Shadow Pattern
 *
 * Renders an intricate geometric stone lattice inspired by classic Indian
 * architectural screens, where sunlight creates shifting shadows across surfaces.
 * Ultra-lightweight SVG vector math with hardware-accelerated ambient opacity drifts.
 */
export function JaliShadowPattern({
  className,
  tone = "dark-heritage",
  animated = true,
}: JaliShadowPatternProps) {
  const isDark = tone === "dark-heritage";
  const strokeColor = isDark ? "#CAA359" : "#76543B";
  const strokeOpacity = isDark ? 0.12 : 0.07;

  return (
    <div
      className={cx(
        "absolute inset-0 pointer-events-none select-none overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* 1. Diagonal Soft Sunlight Gradient Beam */}
      <div
        className={cx(
          "absolute inset-0 transition-opacity duration-1000",
          isDark
            ? "bg-gradient-to-tr from-[#140D08] via-transparent to-[#281A10]/40"
            : "bg-gradient-to-tr from-transparent via-[#F7F2EA]/60 to-transparent"
        )}
      />

      {/* 2. Scalable Geometric Jali Pattern (Repeated in 48x48 cell modules) */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id={`jali-pattern-${tone}`}
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            {/* Center Octagonal Knot */}
            <path
              d="M 24 6 L 36 12 L 42 24 L 36 36 L 24 42 L 12 36 L 6 24 L 12 12 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.85"
              strokeOpacity={strokeOpacity}
            />
            {/* Interlocking Diamond Struts */}
            <path
              d="M 24 0 L 48 24 L 24 48 L 0 24 Z"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.75"
              strokeOpacity={strokeOpacity * 0.75}
            />
            {/* Four Corner Rosette Nodes */}
            <circle cx="0" cy="0" r="2.5" fill={strokeColor} fillOpacity={strokeOpacity * 0.9} />
            <circle cx="48" cy="0" r="2.5" fill={strokeColor} fillOpacity={strokeOpacity * 0.9} />
            <circle cx="0" cy="48" r="2.5" fill={strokeColor} fillOpacity={strokeOpacity * 0.9} />
            <circle cx="48" cy="48" r="2.5" fill={strokeColor} fillOpacity={strokeOpacity * 0.9} />
            <circle cx="24" cy="24" r="2" fill={strokeColor} fillOpacity={strokeOpacity * 0.7} />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#jali-pattern-${tone})`} />
      </svg>

      {/* 3. Subtle Slow Shifting Architectural Sunlight Caustic */}
      {animated && (
        <motion.div
          animate={{
            x: ["-5%", "5%", "-5%"],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cx(
            "absolute inset-y-0 -inset-x-1/4 transform -skew-x-12 pointer-events-none",
            isDark
              ? "bg-gradient-to-r from-transparent via-[#E8CB85]/[0.045] to-transparent"
              : "bg-gradient-to-r from-transparent via-[#A88959]/[0.05] to-transparent"
          )}
        />
      )}
    </div>
  );
}
