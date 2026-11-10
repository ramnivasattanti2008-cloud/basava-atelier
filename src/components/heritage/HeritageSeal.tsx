"use client";

import { cx } from "@/lib/format";
import { BasavaMark } from "@/components/brand/BasavaLogo";

interface HeritageSealProps {
  size?: number;
  className?: string;
  rotating?: boolean;
}

export function HeritageSeal({ size = 110, className, rotating = true }: HeritageSealProps) {
  return (
    <div
      className={cx("relative inline-flex items-center justify-center select-none", className)}
      style={{ width: size, height: size }}
      title="BASAVA — Handcrafted in Bengaluru, Bharat"
    >
      {/* Outer ambient brass glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#96722d]/20 to-[#ffd875]/20 blur-sm pointer-events-none" />

      {/* Rotating Circular Typography Ring */}
      <svg
        viewBox="0 0 200 200"
        className={cx("w-full h-full", rotating && "spin-seal")}
        aria-hidden="true"
      >
        <defs>
          <path
            id="heritageSealPath"
            d="M 100, 100 m -72, 0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"
          />
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d8b264" />
            <stop offset="50%" stopColor="#f7e5b5" />
            <stop offset="100%" stopColor="#8d6725" />
          </linearGradient>
        </defs>

        {/* Outer decorative beaded border */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="url(#brassGrad)"
          strokeWidth="1.5"
          strokeDasharray="2 4"
        />
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="url(#brassGrad)"
          strokeWidth="0.8"
        />

        {/* Circular Engraved Text */}
        <text
          fill="#c5a059"
          fontSize="10.8"
          letterSpacing="0.28em"
          fontFamily="serif"
          className="uppercase font-semibold"
        >
          <textPath href="#heritageSealPath" startOffset="0%">
            BASAVA · BENGALURU · BHARAT · ಕೈಯಿಂದ ಮಾಡಿದ · LEATHER ATELIER ·
          </textPath>
        </text>

        {/* Inner concentric ring */}
        <circle
          cx="100"
          cy="100"
          r="54"
          fill="none"
          stroke="url(#brassGrad)"
          strokeWidth="1.2"
        />
      </svg>

      {/* Static Inner Medallion Crest */}
      <div className="absolute inset-[27%] rounded-full bg-gradient-to-b from-[#2e1d13] to-[#160d08] border border-[#c5a059]/60 shadow-inner flex flex-col items-center justify-center text-center p-2">
        <BasavaMark size={Math.round(size * 0.22)} invert={true} />
        <span className="text-[0.42rem] tracking-[0.22em] uppercase font-semibold text-[#c5a059] mt-0.5">
          ATELIER
        </span>
      </div>
    </div>
  );
}
