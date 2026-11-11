"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/format";

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

/**
 * Editorial Text Reveal Component
 *
 * Reveals typography smoothly through an invisible clipping mask
 * with fluid luxury agency spring physics.
 */
export function RevealText({
  children,
  className,
  delay = 0,
  duration = 0.8,
  as: Component = "div",
}: RevealTextProps) {
  return (
    <Component className={cx("overflow-hidden leading-tight", className)}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1], // Luxury cubic bezier
        }}
      >
        {children}
      </motion.div>
    </Component>
  );
}
