"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { cx } from "@/lib/format";

interface SmoothScrollIndicatorProps {
  targetId?: string;
  className?: string;
  label?: string;
}

/**
 * Editorial Smooth Scroll Cue
 *
 * Minimalist vertical scroll prompter featuring an animated brass line
 * and understated micro-typography.
 */
export function SmoothScrollIndicator({
  targetId = "collection-section",
  className,
  label = "SCROLL TO EXPLORE",
}: SmoothScrollIndicatorProps) {
  const handleScroll = () => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleScroll}
      className={cx(
        "group flex flex-col items-center gap-2 cursor-pointer select-none text-espresso/70 hover:text-espresso transition-colors focus:outline-none",
        className
      )}
      aria-label="Scroll down to explore collection"
    >
      <span className="font-sans text-[0.625rem] font-bold tracking-[0.24em] uppercase text-[#C5A059] group-hover:text-[#8A5D3B] transition-colors">
        {label}
      </span>

      <div className="relative w-4 h-9 rounded-full border border-[#C5A059]/40 flex items-start justify-center p-1 overflow-hidden">
        <motion.div
          animate={{
            y: [0, 16, 0],
            opacity: [0.9, 0.2, 0.9],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"
        />
      </div>
    </button>
  );
}
