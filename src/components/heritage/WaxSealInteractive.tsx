"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Award, ShieldCheck } from "lucide-react";
import { BasavaMark } from "@/components/brand/BasavaLogo";
import { cx } from "@/lib/format";

interface WaxSealInteractiveProps {
  className?: string;
  size?: number;
}

export function WaxSealInteractive({ className, size = 120 }: WaxSealInteractiveProps) {
  const [pressed, setPressed] = useState(false);
  const [stampedCount, setStampedCount] = useState(0);

  const handlePress = () => {
    setPressed(true);
    setStampedCount((c) => c + 1);
    setTimeout(() => setPressed(false), 600);
  };

  return (
    <div className={cx("inline-flex flex-col items-center select-none", className)}>
      <motion.button
        type="button"
        onClick={handlePress}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className="relative group cursor-pointer focus:outline-none"
        style={{ width: size, height: size }}
        title="Click to stamp the Royal Karnataka Wax Seal"
      >
        {/* Outer ambient red/gold glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8a1c14]/40 to-[#e8cb85]/30 blur-md group-hover:blur-lg transition-all" />

        {/* The Organic Molten Wax Outline (Irregular Edge) */}
        <div
          className={cx(
            "absolute inset-0 rounded-full bg-gradient-to-br from-[#9c2017] via-[#85140c] to-[#590b05] border-2 border-[#b53228] transition-transform duration-300 shadow-xl overflow-hidden flex items-center justify-center",
            pressed && "scale-95 shadow-inner"
          )}
          style={{
            boxShadow:
              "0 8px 25px rgba(133, 20, 12, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -3px 6px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Inner Circular Engraved Ridge */}
          <div className="w-[84%] h-[84%] rounded-full border border-[#b53228]/80 flex flex-col items-center justify-center p-2 relative shadow-inner">
            {/* Concentric Beaded Circle */}
            <div className="absolute inset-1 rounded-full border border-dashed border-[#d86f67]/40 pointer-events-none" />

            {/* Official Basava Mark Inverted */}
            <BasavaMark size={Math.round(size * 0.35)} invert={true} />

            {/* Micro Inscription */}
            <span className="text-[0.45rem] tracking-[0.24em] font-serif uppercase font-bold text-[#f7e5b5] mt-0.5">
              ಕಾಯಕವೇ ಕೈಲಾಸ
            </span>
            <span className="text-[0.38rem] tracking-[0.28em] font-sans uppercase font-bold text-[#e5dac6]/70">
              BASAVA · BENGALURU
            </span>
          </div>

          {/* Shimmer Light Reflection Sweep */}
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </div>

        {/* Micro-sparkle particle on stamp */}
        {pressed && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-[#f7e5b5] pointer-events-none"
          />
        )}
      </motion.button>

      {/* Interactive Helper Text */}
      <div className="mt-2 text-center">
        <span className="text-[0.65rem] tracking-wider uppercase font-semibold text-[#a88959] flex items-center justify-center gap-1">
          <Award size={11} /> {stampedCount > 0 ? "Artisan Seal Stamped" : "Tap Seal to Stamp"}
        </span>
      </div>
    </div>
  );
}

