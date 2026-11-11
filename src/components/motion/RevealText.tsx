"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/format";

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  animateOnMount?: boolean;
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
  animateOnMount = true, // Default to animateOnMount for reliable instant display
}: RevealTextProps) {
  return (
    <Component className={cx("overflow-hidden leading-tight", className)}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={animateOnMount ? { y: "0%", opacity: 1 } : undefined}
        whileInView={!animateOnMount ? { y: "0%", opacity: 1 } : undefined}
        viewport={!animateOnMount ? { once: true } : undefined}
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
