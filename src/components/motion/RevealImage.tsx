"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/format";

interface RevealImageProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  shape?: "rectangle" | "arch" | "soft-square";
}

/**
 * Editorial Image Reveal with Architectural Framing
 *
 * Implements smooth progressive image scale and unmasking inspired by
 * Indian architectural arches and clean luxury editorial framing.
 */
export function RevealImage({
  children,
  className,
  delay = 0.1,
  duration = 1.0,
  shape = "rectangle",
}: RevealImageProps) {
  const shapeClass = {
    rectangle: "rounded-xs",
    arch: "rounded-t-full rounded-b-xs",
    "soft-square": "rounded-sm",
  }[shape];

  return (
    <div className={cx("relative overflow-hidden", shapeClass, className)}>
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full h-full flex items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
}
