"use client";

import Image from "next/image";
import { cx } from "@/lib/format";

interface BasavaLogoProps {
  className?: string;
  symbolSize?: number;
  showWordmark?: boolean;
  showSubtitle?: boolean;
  invert?: boolean; // For dark surfaces (Heritage Brown backgrounds)
  orientation?: "horizontal" | "vertical";
}

/**
 * Official BASAVA Brand Logo Component
 *
 * Implements the authentic, un-distorted BASAVA symbol faithfully preserved
 * from the official store brand asset with transparent background,
 * accompanied by the bespoke editorial Cormorant Garamond typography
 * and bilingual heritage subtitle (ಬಸವ · BENGALURU).
 */
export function BasavaLogo({
  className,
  symbolSize = 34,
  showWordmark = true,
  showSubtitle = true,
  invert = false,
  orientation = "vertical",
}: BasavaLogoProps) {
  // Proportions: Original asset is 38 x 32 (ratio ~ 1.1875)
  const width = Math.round(symbolSize * 1.1875);
  const height = symbolSize;

  return (
    <div
      className={cx(
        "flex select-none items-center transition-opacity hover:opacity-95",
        orientation === "vertical" ? "flex-col text-center" : "flex-row gap-3 text-left",
        className
      )}
    >
      {/* Authentic Original Logo Mark */}
      <div
        className={cx(
          "relative flex items-center justify-center shrink-0",
          orientation === "vertical" ? "mb-1.5" : ""
        )}
        style={{ width, height }}
      >
        <Image
          src="/images/basava-logo.png"
          alt="BASAVA Official Brand Mark"
          width={width}
          height={height}
          priority
          className={cx(
            "object-contain filter transition-all",
            invert ? "brightness-0 invert sepia-[0.3]" : "brightness-95 contrast-125"
          )}
          style={{
            imageRendering: "-webkit-optimize-contrast",
          }}
        />
      </div>

      {/* Typography: Wordmark & Heritage Subtitle */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className={cx(
              "font-display font-medium tracking-[0.28em] uppercase transition-colors",
              invert ? "text-ivory" : "text-espresso",
              symbolSize <= 28 ? "text-base tracking-[0.22em]" : "text-xl md:text-2xl"
            )}
          >
            BASAVA
          </span>

          {showSubtitle && (
            <span
              className={cx(
                "mt-1 text-[0.52rem] font-medium tracking-[0.22em] uppercase transition-colors",
                invert ? "text-sand/80" : "text-saddle-deep"
              )}
            >
              ಬಸವ · BENGALURU
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact Icon-only mark for badges, favicons, and seals
 */
export function BasavaMark({
  size = 28,
  className,
  invert = false,
}: {
  size?: number;
  className?: string;
  invert?: boolean;
}) {
  const width = Math.round(size * 1.1875);
  return (
    <div className={cx("relative inline-flex items-center justify-center shrink-0", className)} style={{ width, height: size }}>
      <Image
        src="/images/basava-logo.png"
        alt="BASAVA Brand Mark"
        width={width}
        height={size}
        className={cx(
          "object-contain filter",
          invert ? "brightness-0 invert sepia-[0.3]" : "brightness-95 contrast-125"
        )}
        style={{ imageRendering: "-webkit-optimize-contrast" }}
      />
    </div>
  );
}

