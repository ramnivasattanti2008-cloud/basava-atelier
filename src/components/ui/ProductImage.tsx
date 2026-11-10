"use client";

import { useState } from "react";
import Image from "next/image";
import { cx } from "@/lib/format";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  /** Load eagerly — use only for the first image a visitor sees. */
  eager?: boolean;
  className?: string;
}

/** Sources that next/image is configured to optimise (see next.config.ts). */
const canOptimise = (src: string) => src.startsWith("/") || src.startsWith("https://cdn.store.link/products/basava/");

/**
 * A catalogue photograph, sized to fill its parent (which must be positioned
 * and have a fixed aspect ratio). If no photograph exists, or it fails to
 * load, a clearly labelled plate is shown instead of a broken image.
 */
export function ProductImage({ src, alt, sizes, eager = false, className }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) return <PhotoPlate />;

  const classes = cx("absolute inset-0 h-full w-full object-contain", className);

  if (!canOptimise(src)) {
    return (
      // Uploaded and admin-entered images can come from anywhere, so they bypass the optimiser.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={classes}
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      className={classes}
      onError={() => setFailedSrc(src)}
    />
  );
}

/**
 * Stand-in for a photograph that has not been supplied.
 * Deliberately plain, and labelled, so it can never be mistaken for a product shot.
 */
export function PhotoPlate({ label = "Photograph to be supplied", className }: { label?: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cx("absolute inset-0 flex items-center justify-center bg-linen p-5 text-center", className)}
    >
      <span aria-hidden className="pointer-events-none absolute inset-3 border border-espresso/20" />
      <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-espresso/60" />
      <span aria-hidden className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-espresso/60" />
      <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-espresso/60" />
      <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-espresso/60" />
      <span className="eyebrow max-w-[14ch] leading-relaxed">{label}</span>
    </div>
  );
}
