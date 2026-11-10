"use client";

import { useState } from "react";
import { cx } from "@/lib/format";

interface EngravingPreviewProps {
  initials?: string;
  onInitialsChange?: (val: string) => void;
  interactive?: boolean;
  className?: string;
}

export function EngravingPreview({
  initials: controlledInitials,
  onInitialsChange,
  interactive = true,
  className,
}: EngravingPreviewProps) {
  const [internalInitials, setInternalInitials] = useState("K.D");
  const [foilStyle, setFoilStyle] = useState<"blind" | "gold">("blind");

  const initials = controlledInitials !== undefined ? controlledInitials : internalInitials;
  const updateInitials = (val: string) => {
    const cleaned = val.toUpperCase().slice(0, 5);
    if (onInitialsChange) onInitialsChange(cleaned);
    else setInternalInitials(cleaned);
  };

  return (
    <div className={cx("flex flex-col items-center", className)}>
      {/* Leather Tag Visualizer */}
      <div className="relative flex h-36 w-60 sm:h-44 sm:w-72 items-center justify-center rounded-sm bg-gradient-to-br from-[#8a5d3b] via-[#6f4628] to-[#54341b] p-6 shadow-xl ring-1 ring-black/25">
        {/* Leather texture & stitch border */}
        <div className="absolute inset-2 border border-dashed border-[#a77b52]/40 rounded-sm pointer-events-none" />
        
        {/* Brass tag grommet at top */}
        <div className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-[#b8975a] bg-[#755f36] shadow-sm flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-[#3e2714]" />
        </div>

        {/* Embossed / Foil Stamped Monogram */}
        <div className="text-center select-none">
          <p
            className={cx(
              "font-display tracking-[0.3em] font-semibold text-3xl sm:text-4xl transition-all duration-300",
              foilStyle === "gold"
                ? "text-transparent bg-clip-text bg-gradient-to-b from-[#ffe082] via-[#e6c15c] to-[#997728] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                : "text-[#361e10] drop-shadow-[0_1px_0_rgba(255,255,255,0.18)] [text-shadow:_0_-1px_1px_rgba(0,0,0,0.9)]"
            )}
          >
            {initials.trim() ? initials : "•••"}
          </p>
          <p className="mt-1 text-[0.55rem] uppercase tracking-[0.28em] text-[#d9c4a7]/60">
            KRIS HANDMADE
          </p>
        </div>
      </div>

      {interactive && (
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={initials}
              onChange={(e) => updateInitials(e.target.value)}
              placeholder="e.g. K.D"
              maxLength={5}
              className="field-input text-center uppercase tracking-widest text-sm font-semibold !min-h-[2.6rem] !py-1"
              aria-label="Monogram initials preview"
            />
          </div>
          <div className="flex border border-espresso/25 bg-paper">
            <button
              type="button"
              onClick={() => setFoilStyle("blind")}
              className={cx(
                "px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider transition-colors",
                foilStyle === "blind" ? "bg-espresso text-ivory" : "text-walnut hover:text-espresso"
              )}
            >
              Blind
            </button>
            <button
              type="button"
              onClick={() => setFoilStyle("gold")}
              className={cx(
                "px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider transition-colors",
                foilStyle === "gold" ? "bg-[#997728] text-ivory" : "text-walnut hover:text-espresso"
              )}
            >
              Gold Foil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
