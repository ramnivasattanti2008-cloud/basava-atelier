"use client";

import { motion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  /** Pixels of upward travel. Transforms are dropped for reduced-motion users. */
  rise?: number;
}

/** A single, gentle entrance as a section scrolls into view. Runs once. */
export function Reveal({ children, className, delay = 0, rise = 20 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: rise }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
