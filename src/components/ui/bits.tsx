"use client";

import { Minus, Plus } from "lucide-react";
import { cx } from "@/lib/format";
import { swatchFor } from "@/lib/colours";

/**
 * Marks figures that were copied from the public catalogue and have not been
 * reconfirmed with the owner. Small on purpose, but always present.
 */
export function DemoTag({ children = "Demo data", title, className }: { children?: React.ReactNode; title?: string; className?: string }) {
  return (
    <span
      title={title ?? "Copied from the current public catalogue. Not yet reconfirmed with the owner."}
      className={cx(
        "inline-flex items-center border border-saddle-deep/50 px-1.5 py-[3px] align-middle text-[0.625rem] font-semibold uppercase leading-none tracking-[0.16em] text-saddle-deep",
        className,
      )}
    >
      {children}
    </span>
  );
}

interface QuantityProps {
  value: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
  size?: "sm" | "md";
}

export function QuantityStepper({ value, max, onChange, label, size = "md" }: QuantityProps) {
  const box = size === "sm" ? "h-9 w-9" : "h-12 w-12";
  return (
    <div className="inline-flex items-stretch border border-espresso/30" role="group" aria-label={label}>
      <button
        type="button"
        className={cx("flex items-center justify-center text-espresso transition-all hover:bg-linen active:scale-90 disabled:opacity-35", box)}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus size={14} strokeWidth={1.5} aria-hidden />
      </button>
      <span
        aria-live="polite"
        className={cx("tabular flex items-center justify-center border-x border-espresso/30 text-sm font-medium", size === "sm" ? "w-9" : "w-12")}
      >
        {value}
      </span>
      <button
        type="button"
        className={cx("flex items-center justify-center text-espresso transition-all hover:bg-linen active:scale-90 disabled:opacity-35", box)}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}

/** Indicative colour chip. Falls back to a struck-through chip when no swatch is known. */
export function Swatch({ colour, size = 14, className }: { colour: string; size?: number; className?: string }) {
  const hex = swatchFor(colour);
  return (
    <span
      aria-hidden
      className={cx("inline-block shrink-0 rounded-full border border-espresso/25 transition-transform duration-300 hover:scale-125 cursor-pointer", className)}
      style={{
        width: size,
        height: size,
        background: hex ?? "linear-gradient(135deg, transparent 46%, #573c2c 46%, #573c2c 54%, transparent 54%)",
      }}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cx(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <h2 className="display-lg">{title}</h2>
      {children && <div className="lede mt-6 max-w-xl">{children}</div>}
    </div>
  );
}
