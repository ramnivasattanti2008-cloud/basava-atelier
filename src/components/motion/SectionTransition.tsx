"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/format";
import { StitchLine } from "./StitchLine";

interface SectionTransitionProps {
  className?: string;
  variant?: "stitch" | "brass-divider" | "jali-knot";
  tone?: "espresso" | "brass" | "sand" | "ivory";
}

/**
 * Editorial Section Transition Divider
 *
 * Provides a tactile, researched transition between distinct atmospheric
 * background zones (e.g., from dark heritage hero to warm parchment collections).
 */
export function SectionTransition({
  className,
  variant = "stitch",
  tone = "brass",
}: SectionTransitionProps) {
  if (variant === "jali-knot") {
    return (
      <div className={cx("relative w-full flex items-center justify-center py-6", className)}>
        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />
        <div className="relative z-10 px-4 bg-paper/90 backdrop-blur-xs flex items-center gap-3 text-[#C5A059]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="stroke-current">
            <polygon points="10,2 18,10 10,18 2,10" strokeWidth="1" />
            <polygon points="10,5 15,10 10,15 5,10" strokeWidth="0.8" />
            <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          </svg>
          <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
        </div>
      </div>
    );
  }

  if (variant === "brass-divider") {
    return (
      <div className={cx("relative w-full h-[1px] overflow-hidden", className)}>
        <div className="absolute inset-0 bg-[#C5A059]/20" />
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-[#F5D77F] to-transparent"
        />
      </div>
    );
  }

  return (
    <div className={cx("relative w-full py-4", className)}>
      <StitchLine tone={tone} />
    </div>
  );
}
