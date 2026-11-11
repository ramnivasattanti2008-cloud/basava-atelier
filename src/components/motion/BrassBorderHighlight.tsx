"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/format";

interface BrassBorderHighlightProps {
  className?: string;
  position?: "top" | "bottom" | "both";
  glow?: boolean;
}

/**
 * Antique Sand-Cast Moradabad Brass Border Highlight
 *
 * Implements a refined metallic specular reflection gliding across
 * fine horizontal section borders, evoking polished sand-cast brass hardware.
 */
export function BrassBorderHighlight({
  className,
  position = "top",
  glow = true,
}: BrassBorderHighlightProps) {
  return (
    <div className={cx("relative w-full pointer-events-none select-none", className)}>
      {(position === "top" || position === "both") && (
        <div className="absolute top-0 inset-x-0 h-[1.5px] overflow-hidden">
          {/* Base Brass Hairline */}
          <div className="absolute inset-0 bg-[#C5A059]/20" />
          {/* Gliding Specular Brass Beam */}
          <motion.div
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: [0.16, 1, 0.3, 1],
              repeatDelay: 2,
            }}
            className={cx(
              "absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#F5D77F] to-transparent",
              glow && "shadow-[0_0_8px_rgba(245,215,127,0.7)]"
            )}
          />
        </div>
      )}

      {(position === "bottom" || position === "both") && (
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] overflow-hidden">
          <div className="absolute inset-0 bg-[#C5A059]/20" />
          <motion.div
            animate={{
              x: ["200%", "-100%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: [0.16, 1, 0.3, 1],
              repeatDelay: 2.5,
            }}
            className={cx(
              "absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#E8CB85] to-transparent",
              glow && "shadow-[0_0_8px_rgba(232,203,133,0.6)]"
            )}
          />
        </div>
      )}
    </div>
  );
}
