"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cx } from "@/lib/format";

interface EngravingPreviewProps {
  initials?: string;
  onInitialsChange?: (val: string) => void;
  interactive?: boolean;
  className?: string;
}

type FinishStyle = "gold" | "brass" | "blind";
type LeatherTone = "tan" | "rosewood" | "indigo" | "terracotta";

const leatherTones: Record<LeatherTone, { label: string; grad: string; border: string }> = {
  tan: {
    label: "Royal Saddle Tan",
    grad: "from-[#8a5d3b] via-[#6f4628] to-[#54341b]",
    border: "border-[#a77b52]/40",
  },
  rosewood: {
    label: "Mysore Rosewood",
    grad: "from-[#4a2620] via-[#331713] to-[#220d0a]",
    border: "border-[#b8786d]/30",
  },
  indigo: {
    label: "Nilam Royal Indigo",
    grad: "from-[#253957] via-[#1a283f] to-[#111b2c]",
    border: "border-[#5c7da8]/35",
  },
  terracotta: {
    label: "Hampi Terracotta",
    grad: "from-[#9c4d3f] via-[#7d392e] to-[#5a231a]",
    border: "border-[#d8897b]/35",
  },
};

export function EngravingPreview({
  initials: controlledInitials,
  onInitialsChange,
  interactive = true,
  className,
}: EngravingPreviewProps) {
  const [internalInitials, setInternalInitials] = useState("K.D");
  const [finish, setFinish] = useState<FinishStyle>("gold");
  const [tone, setTone] = useState<LeatherTone>("tan");

  const initials = controlledInitials !== undefined ? controlledInitials : internalInitials;

  const updateInitials = (val: string) => {
    const cleaned = val.slice(0, 6);
    if (onInitialsChange) onInitialsChange(cleaned);
    else setInternalInitials(cleaned);
  };

  const currentLeather = leatherTones[tone];

  return (
    <div className={cx("flex flex-col items-center select-none", className)}>
      {/* 3D Realistic Leather Fob Container with Shadow */}
      <div className="relative pt-6 pb-2">
        {/* Leather strap loop & brass hanging grommet */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <div className="h-6 w-3 bg-[#4a2e18] rounded-t-xs shadow-inner" />
          <div className="h-5 w-5 -mt-1 rounded-full border-2 border-[#b8975a] bg-gradient-to-tr from-[#7c6332] via-[#d4b068] to-[#634f26] shadow-sm flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#20150b] shadow-inner" />
          </div>
        </div>

        {/* The Heritage Leather Tag */}
        <div
          className={cx(
            "relative flex h-40 w-64 sm:h-48 sm:w-80 items-center justify-center rounded-sm bg-gradient-to-br p-6 shadow-2xl ring-1 ring-black/35 transition-all duration-500",
            currentLeather.grad
          )}
        >
          {/* Authentic Hand-Stitch Perforation Border */}
          <div
            className={cx(
              "absolute inset-2.5 border border-dashed rounded-xs pointer-events-none",
              currentLeather.border
            )}
          />

          {/* Decorative Corner Filigree Pins */}
          <div className="absolute top-3 left-3 h-1 w-1 rounded-full bg-[#c5a059]/70 shadow-xs" />
          <div className="absolute top-3 right-3 h-1 w-1 rounded-full bg-[#c5a059]/70 shadow-xs" />
          <div className="absolute bottom-3 left-3 h-1 w-1 rounded-full bg-[#c5a059]/70 shadow-xs" />
          <div className="absolute bottom-3 right-3 h-1 w-1 rounded-full bg-[#c5a059]/70 shadow-xs" />

          {/* Rendered Monogram Impression */}
          <div className="text-center px-4">
            {/* 1. 24K Gold Leaf Foil */}
            {finish === "gold" && (
              <p className="font-display tracking-[0.3em] font-bold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-[#fff3cc] via-[#e5c168] to-[#997728] drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)] filter contrast-125">
                {initials.trim() ? initials : "•••"}
              </p>
            )}

            {/* 2. Solid Brass Plate */}
            {finish === "brass" && (
              <div className="px-5 py-2.5 rounded-xs bg-gradient-to-r from-[#8e6e30] via-[#e8cb85] to-[#8e6e30] border border-[#fbf3d5] shadow-md">
                <p className="font-display tracking-[0.25em] font-extrabold text-2xl sm:text-3xl text-[#2a1b0c] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                  {initials.trim() ? initials : "•••"}
                </p>
              </div>
            )}

            {/* 3. Deep Blind Deboss */}
            {finish === "blind" && (
              <p className="font-display tracking-[0.3em] font-bold text-3xl sm:text-4xl text-[#1a0f07] drop-shadow-[0_1px_0_rgba(255,255,255,0.18)] [text-shadow:_0_-1px_1px_rgba(0,0,0,0.95)]">
                {initials.trim() ? initials : "•••"}
              </p>
            )}

            <p className="mt-2 text-[0.55rem] uppercase tracking-[0.3em] font-semibold text-[#d9c4a7]/75">
              KRIS DESIGNS · BENGALURU
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Customization Dashboard */}
      {interactive && (
        <div className="mt-6 flex flex-col items-center gap-4 w-full max-w-md">
          {/* Initials Input with quick Indic symbols */}
          <div className="w-full space-y-1.5">
            <label className="field-label text-center">Your Monogram Initials</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={initials}
                onChange={(e) => updateInitials(e.target.value)}
                placeholder="e.g. K.D or ॐ or RN"
                maxLength={6}
                className="field-input text-center text-base font-bold uppercase tracking-widest !min-h-[2.8rem]"
                aria-label="Monogram initials"
              />
              <div className="flex gap-1 shrink-0">
                {["ॐ", "श्री", "K.D"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateInitials(preset)}
                    className="px-2.5 py-1 text-xs font-semibold border border-espresso/20 bg-paper hover:bg-linen rounded-xs"
                    title={`Use ${preset}`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Finish & Leather Selection Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* Finish */}
            <div>
              <p className="text-[0.6875rem] font-semibold text-walnut uppercase tracking-wider mb-1.5">
                Stamping Technique
              </p>
              <div className="flex border border-espresso/20 bg-paper rounded-xs overflow-hidden">
                {[
                  { id: "gold", label: "24K Gold Foil" },
                  { id: "brass", label: "Brass Tag" },
                  { id: "blind", label: "Blind Deboss" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFinish(f.id as FinishStyle)}
                    className={cx(
                      "flex-1 py-1.5 text-[0.625rem] font-semibold uppercase tracking-wider transition-colors",
                      finish === f.id
                        ? "bg-espresso text-ivory font-bold"
                        : "text-charcoal/70 hover:text-espresso"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Leather Tone */}
            <div>
              <p className="text-[0.6875rem] font-semibold text-walnut uppercase tracking-wider mb-1.5">
                Leather Hide
              </p>
              <div className="flex border border-espresso/20 bg-paper rounded-xs overflow-hidden">
                {(["tan", "rosewood", "indigo", "terracotta"] as LeatherTone[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={cx(
                      "flex-1 py-1.5 text-[0.625rem] font-semibold uppercase tracking-wider capitalize transition-colors",
                      tone === t
                        ? "bg-espresso text-ivory font-bold"
                        : "text-charcoal/70 hover:text-espresso"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
