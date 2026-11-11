"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/format";

interface BlockPrintPatternProps {
  className?: string;
  tone?: "parchment" | "dark-heritage";
  density?: "sparse" | "rich";
}

/**
 * Hand-Block Print Geometric Motif Pattern
 *
 * Inspired by traditional Indian carved wooden block printing on handmade cotton paper.
 * Geometric diamond buttah motifs reveal with subtle stamp-pressure depth.
 */
export function BlockPrintPattern({
  className,
  tone = "parchment",
  density = "sparse",
}: BlockPrintPatternProps) {
  const isDark = tone === "dark-heritage";
  const stampColor = isDark ? "#CAA359" : "#6E4E37";
  const stampOpacity = isDark ? 0.08 : 0.055;
  const cellSize = density === "rich" ? 40 : 64;

  return (
    <div
      className={cx(
        "absolute inset-0 pointer-events-none select-none overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id={`block-print-${tone}-${density}`}
            width={cellSize}
            height={cellSize}
            patternUnits="userSpaceOnUse"
          >
            {/* Hand-Carved Woodblock Buttah / Paisley Geometry */}
            <g transform={`translate(${cellSize / 2}, ${cellSize / 2})`}>
              {/* Outer Diamond Contour */}
              <polygon
                points="0,-10 10,0 0,10 -10,0"
                fill="none"
                stroke={stampColor}
                strokeWidth="0.85"
                strokeOpacity={stampOpacity}
              />
              {/* Inner Carved Floral Petals */}
              <circle cx="0" cy="-4" r="1.5" fill={stampColor} fillOpacity={stampOpacity * 1.2} />
              <circle cx="4" cy="0" r="1.5" fill={stampColor} fillOpacity={stampOpacity * 1.2} />
              <circle cx="0" cy="4" r="1.5" fill={stampColor} fillOpacity={stampOpacity * 1.2} />
              <circle cx="-4" cy="0" r="1.5" fill={stampColor} fillOpacity={stampOpacity * 1.2} />
              <circle cx="0" cy="0" r="1.2" fill={stampColor} fillOpacity={stampOpacity * 1.8} />

              {/* Four Tiny Corner Registration Pricks (authentic block printer register marks) */}
              <circle cx="-16" cy="-16" r="0.75" fill={stampColor} fillOpacity={stampOpacity * 0.8} />
              <circle cx="16" cy="-16" r="0.75" fill={stampColor} fillOpacity={stampOpacity * 0.8} />
              <circle cx="-16" cy="16" r="0.75" fill={stampColor} fillOpacity={stampOpacity * 0.8} />
              <circle cx="16" cy="16" r="0.75" fill={stampColor} fillOpacity={stampOpacity * 0.8} />
            </g>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#block-print-${tone}-${density})`} />
      </svg>
    </div>
  );
}
