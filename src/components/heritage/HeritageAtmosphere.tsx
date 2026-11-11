"use client";

import { useId } from "react";
import { cx } from "@/lib/format";

interface HeritageAtmosphereProps {
  className?: string;
  variant?: "mesh" | "jali" | "weave" | "radial-spotlight" | "full";
  intensity?: "subtle" | "medium" | "prominent";
  children?: React.ReactNode;
}

/**
 * HeritageAtmosphere
 *
 * Implements an Indian luxury artisanal background system:
 * - Ultra-fine block-print jali geometric filigree (1.5% to 3% opacity)
 * - Microscopic organic handspun khadi weave structure
 * - Warm ambient candlelit radial mesh (#A88959 antique brass & #D5C3A5 natural sand)
 * - Soft drifting ambient golden dust particles
 */
export function HeritageAtmosphere({
  className,
  variant = "full",
  intensity = "subtle",
  children,
}: HeritageAtmosphereProps) {
  const patternId = useId();

  const opacityMap = {
    subtle: "opacity-[0.022]",
    medium: "opacity-[0.04]",
    prominent: "opacity-[0.065]",
  };

  return (
    <div className={cx("relative isolate overflow-hidden", className)}>
      {/* 1. Multi-Point Ambient Warmth Radial Mesh */}
      {(variant === "mesh" || variant === "full" || variant === "radial-spotlight") && (
        <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
          {/* Top-Center Candle Glow */}
          <div
            className="absolute -top-32 left-1/2 h-[550px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(168, 137, 89, 0.14) 0%, rgba(213, 195, 165, 0.08) 45%, rgba(241, 233, 218, 0) 70%)",
            }}
          />

          {/* Bottom-Right Subdued Terracotta/Brass Accent */}
          <div
            className="absolute -bottom-24 -right-24 h-[420px] w-[500px] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, rgba(118, 84, 59, 0.08) 0%, rgba(168, 137, 89, 0.04) 50%, rgba(241, 233, 218, 0) 70%)",
            }}
          />

          {/* Bottom-Left Sand Warmth */}
          <div
            className="absolute -bottom-20 -left-20 h-[380px] w-[450px] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, rgba(213, 195, 165, 0.12) 0%, rgba(241, 233, 218, 0) 65%)",
            }}
          />
        </div>
      )}

      {/* 2. Authentic Indian Architectural Jali / Block-Print Geometric Watermark */}
      {(variant === "jali" || variant === "full") && (
        <svg
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute inset-0 -z-10 h-full w-full select-none text-espresso",
            opacityMap[intensity]
          )}
        >
          <defs>
            <pattern
              id={patternId}
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(0)"
            >
              {/* Central 8-Pointed Star / Indian Architectural Octagram */}
              <path
                d="M 32 16 L 36 28 L 48 32 L 36 36 L 32 48 L 28 36 L 16 32 L 28 28 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
              />
              {/* Interlocking Diamond Connectors */}
              <path
                d="M 0 32 L 16 32 M 48 32 L 64 32 M 32 0 L 32 16 M 32 48 L 32 64"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
              {/* Corner Florets */}
              <circle cx="0" cy="0" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="64" cy="0" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="0" cy="64" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="64" cy="64" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
              {/* Center Medallion Dot */}
              <circle cx="32" cy="32" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      )}

      {/* 3. Micro Organic Khadi Weave Overlay */}
      {(variant === "weave" || variant === "full") && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.018] mix-blend-multiply"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #30251E, #30251E 1px, transparent 1px, transparent 4px),
                              repeating-linear-gradient(90deg, #30251E, #30251E 1px, transparent 1px, transparent 4px)`,
          }}
        />
      )}

      {/* Content */}
      {children}
    </div>
  );
}

/**
 * Animated Ambient Gold Dust Particles
 * Subtle, low-CPU drifting particles that add cinematic luxury depth.
 */
export function AmbientDustParticles({ count = 6, className }: { count?: number; className?: string }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${15 + (i * 14) % 75}%`,
    top: `${20 + (i * 17) % 65}%`,
    size: 2 + (i % 3),
    duration: 8 + (i * 2.5),
    delay: i * 1.3,
  }));

  return (
    <div className={cx("pointer-events-none absolute inset-0 overflow-hidden select-none -z-10", className)} aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-tr from-brass/50 to-sand/80 blur-[0.6px] animate-float-dust"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
