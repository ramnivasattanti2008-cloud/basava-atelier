"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/format";

interface KolamLineworkProps {
  className?: string;
  size?: number;
  tone?: "brass" | "gold" | "subtle" | "dark";
  variant?: "medallion" | "corner" | "ribbon";
  animated?: boolean;
}

/**
 * Traditional Indian Geometric Floor Art & Linework (Sikku / Pulli Kolam Geometry)
 *
 * Restrained, non-religious, pure mathematical symmetry inspired by South Indian
 * heritage courtyard linework. Uses stroke-dasharray SVG self-drawing paths
 * with antique brass metallic tones.
 */
export function KolamLinework({
  className,
  size = 120,
  tone = "brass",
  variant = "medallion",
  animated = true,
}: KolamLineworkProps) {
  const strokeColor =
    tone === "brass"
      ? "#C5A059"
      : tone === "gold"
      ? "#F5D77F"
      : tone === "dark"
      ? "#3E2718"
      : "rgba(197, 160, 89, 0.25)";

  const transitionConfig = {
    duration: 2.2,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  if (variant === "corner") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cx("pointer-events-none select-none", className)}
        aria-hidden="true"
      >
        {/* Outer Corner Frame */}
        <motion.path
          d="M 6 94 L 6 20 C 6 12 12 6 20 6 L 94 6"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={animated ? { pathLength: 0 } : false}
          whileInView={animated ? { pathLength: 1 } : undefined}
          viewport={{ once: true }}
          transition={transitionConfig}
        />

        {/* Inner Braided Knot Curve */}
        <motion.path
          d="M 16 84 L 16 32 C 16 23 23 16 32 16 L 84 16"
          stroke={strokeColor}
          strokeWidth="0.8"
          strokeDasharray="2 2"
          strokeLinecap="round"
          initial={animated ? { pathLength: 0 } : false}
          whileInView={animated ? { pathLength: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ ...transitionConfig, delay: 0.2 }}
        />

        {/* Geometric Corner Loop */}
        <motion.path
          d="M 26 26 C 36 18 42 34 26 42 C 18 36 34 20 26 26 Z"
          stroke={strokeColor}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : false}
          whileInView={animated ? { pathLength: 1, opacity: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ ...transitionConfig, delay: 0.4 }}
        />

        {/* Ornamental Anchor Dots */}
        <circle cx="6" cy="6" r="2" fill={strokeColor} />
        <circle cx="26" cy="26" r="1.5" fill={strokeColor} />
      </svg>
    );
  }

  if (variant === "ribbon") {
    return (
      <div className={cx("relative w-full flex items-center justify-center overflow-hidden py-3", className)}>
        <svg
          width="100%"
          height="24"
          viewBox="0 0 600 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="max-w-2xl w-full"
          aria-hidden="true"
        >
          {/* Continuous Intersecting Sinusoidal Waves */}
          <motion.path
            d="M 0 12 Q 25 2 50 12 T 100 12 T 150 12 T 200 12 T 250 12 T 300 12 T 350 12 T 400 12 T 450 12 T 500 12 T 550 12 T 600 12"
            stroke={strokeColor}
            strokeWidth="0.9"
            fill="none"
            initial={animated ? { pathLength: 0 } : false}
            whileInView={animated ? { pathLength: 1 } : undefined}
            viewport={{ once: true }}
            transition={transitionConfig}
          />
          <motion.path
            d="M 0 12 Q 25 22 50 12 T 100 12 T 150 12 T 200 12 T 250 12 T 300 12 T 350 12 T 400 12 T 450 12 T 500 12 T 550 12 T 600 12"
            stroke={strokeColor}
            strokeWidth="0.9"
            fill="none"
            initial={animated ? { pathLength: 0 } : false}
            whileInView={animated ? { pathLength: 1 } : undefined}
            viewport={{ once: true }}
            transition={{ ...transitionConfig, delay: 0.15 }}
          />

          {/* Central Diamond Rosette */}
          <motion.polygon
            points="300,6 306,12 300,18 294,12"
            stroke={strokeColor}
            strokeWidth="1.2"
            fill={tone === "brass" ? "rgba(197, 160, 89, 0.2)" : "none"}
            initial={animated ? { scale: 0 } : false}
            whileInView={animated ? { scale: 1 } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
        </svg>
      </div>
    );
  }

  // Default: Symmetrical 4-Fold Medallion
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cx("pointer-events-none select-none", className)}
      aria-hidden="true"
    >
      {/* 4 Outer Interlocking Elliptical Petals (Sikku Loop) */}
      <motion.path
        d="M 60 20 C 72 20 80 40 80 60 C 80 80 72 100 60 100 C 48 100 40 80 40 60 C 40 40 48 20 60 20 Z"
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0 } : false}
        whileInView={animated ? { pathLength: 1 } : undefined}
        viewport={{ once: true }}
        transition={transitionConfig}
      />
      <motion.path
        d="M 20 60 C 20 48 40 40 60 40 C 80 40 100 48 100 60 C 100 72 80 80 60 80 C 40 80 20 72 20 60 Z"
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0 } : false}
        whileInView={animated ? { pathLength: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ ...transitionConfig, delay: 0.2 }}
      />

      {/* 45-Degree Rotated Diamond Loop */}
      <motion.rect
        x="42"
        y="42"
        width="36"
        height="36"
        rx="6"
        transform="rotate(45 60 60)"
        stroke={strokeColor}
        strokeWidth="0.8"
        strokeDasharray="2 3"
        fill="none"
        initial={animated ? { scale: 0, opacity: 0 } : false}
        whileInView={animated ? { scale: 1, opacity: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.4 }}
      />

      {/* Center Brass Eyelet */}
      <motion.circle
        cx="60"
        cy="60"
        r="4.5"
        stroke={strokeColor}
        strokeWidth="1.2"
        fill={strokeColor}
        fillOpacity="0.25"
        initial={animated ? { scale: 0 } : false}
        whileInView={animated ? { scale: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
      />

      {/* Cardinal Alignment Dots */}
      <circle cx="60" cy="12" r="1.5" fill={strokeColor} />
      <circle cx="108" cy="60" r="1.5" fill={strokeColor} />
      <circle cx="60" cy="108" r="1.5" fill={strokeColor} />
      <circle cx="12" cy="60" r="1.5" fill={strokeColor} />
    </svg>
  );
}
