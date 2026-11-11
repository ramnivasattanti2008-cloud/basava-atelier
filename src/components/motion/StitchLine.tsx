"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/format";

interface StitchLineProps {
  className?: string;
  tone?: "espresso" | "brass" | "sand" | "ivory";
  orientation?: "horizontal" | "vertical";
  animated?: boolean;
}

/**
 * Authentic Hand-Saddle Stitch Line Component
 *
 * Recreates the two-needle Lin Câblé saddle stitch punched at a 45° angle.
 * Features an underlying burnished leather crease line and staggered stitch marks
 * that draw themselves across section boundaries.
 */
export function StitchLine({
  className,
  tone = "brass",
  orientation = "horizontal",
  animated = true,
}: StitchLineProps) {
  const toneClasses = {
    espresso: "stroke-[#30251E] text-[#30251E]",
    brass: "stroke-[#C5A059] text-[#C5A059]",
    sand: "stroke-[#CDAA6D] text-[#CDAA6D]",
    ivory: "stroke-[#FAF7F2] text-[#FAF7F2]",
  }[tone];

  const creaseTone = {
    espresso: "border-[#30251E]/20",
    brass: "border-[#C5A059]/25",
    sand: "border-[#CDAA6D]/20",
    ivory: "border-[#FAF7F2]/20",
  }[tone];

  if (orientation === "vertical") {
    return (
      <div className={cx("relative w-4 h-full flex items-center justify-center pointer-events-none select-none", className)}>
        {/* Leather Crease Line */}
        <div className={cx("absolute inset-y-0 w-[1px] border-l", creaseTone)} />
        {/* 45° Angled Stitch Marks */}
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <motion.line
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
            strokeDasharray="8 6"
            strokeWidth="1.8"
            strokeLinecap="round"
            className={toneClasses}
            initial={animated ? { pathLength: 0, opacity: 0 } : false}
            whileInView={{ pathLength: 1, opacity: 0.9 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cx("relative w-full h-4 flex items-center justify-center pointer-events-none select-none", className)}>
      {/* Underlying Creased Leather Groove */}
      <div className={cx("absolute inset-x-0 h-[1px] border-t", creaseTone)} />

      {/* SVG Saddle Stitch Line with 45° Diagonal Awl Punctures */}
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <motion.line
          x1="0%"
          y1="50%"
          x2="100%"
          y2="50%"
          strokeDasharray="9 7"
          strokeWidth="1.75"
          strokeLinecap="round"
          className={toneClasses}
          initial={animated ? { pathLength: 0, opacity: 0 } : false}
          whileInView={{ pathLength: 1, opacity: 0.85 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}
