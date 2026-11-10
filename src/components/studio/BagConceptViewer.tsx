"use client";

import { useState } from "react";
import { Download, Eye, History, Layers, Maximize2, RefreshCw, Sparkles, X, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cx } from "@/lib/format";
import type { BespokeDesignConfig, ConceptImage, ConceptViewType, DesignVersion } from "@/lib/studio-types";

interface BagConceptViewerProps {
  config: BespokeDesignConfig;
  views: Record<ConceptViewType, ConceptImage>;
  isGenerating: boolean;
  activeVersionNumber: number;
  versions: DesignVersion[];
  onRegenerate: () => void;
  onOpenVersions: () => void;
  className?: string;
}

export function BagConceptViewer({
  config,
  views,
  isGenerating,
  activeVersionNumber,
  versions,
  onRegenerate,
  onOpenVersions,
  className,
}: BagConceptViewerProps) {
  const [activeView, setActiveView] = useState<ConceptViewType>("front");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const currentImage = views[activeView] || views.front;

  const viewTabs: { id: ConceptViewType; label: string; icon: string }[] = [
    { id: "front", label: "Front Elevation", icon: "✦" },
    { id: "angle", label: "3/4 Perspective", icon: "❖" },
    { id: "interior", label: "Interior Layout", icon: "⌗" },
    { id: "detail", label: "Macro Detail", icon: "🔍" },
  ];

  const handleDownload = () => {
    if (!currentImage?.url) return;
    const a = document.createElement("a");
    a.href = currentImage.url;
    a.download = `${config.designName.toLowerCase().replace(/\s+/g, "-")}-${activeView}-concept.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={cx("flex flex-col h-full bg-paper border border-espresso/15 rounded-xs overflow-hidden shadow-xs", className)}>
      {/* Top Bar: Title & Version Pill */}
      <div className="px-5 py-3 border-b border-espresso/15 bg-linen/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow text-saddle-deep">Bespoke Design Concept</span>
            <span className="font-mono text-[0.625rem] bg-espresso text-ivory px-2 py-0.5 rounded-xs font-semibold">
              v{activeVersionNumber}
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl text-espresso leading-snug mt-0.5 truncate max-w-md">
            {config.designName}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Version History Button */}
          <button
            type="button"
            onClick={onOpenVersions}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-espresso/20 bg-ivory text-xs font-semibold uppercase tracking-wider text-espresso rounded-xs hover:border-espresso transition-colors cursor-pointer"
            title="View & compare previous design versions"
          >
            <History size={13} className="text-saddle-deep" />
            <span>History ({versions.length})</span>
          </button>

          {/* Regenerate Concept Button */}
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-espresso text-ivory text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-walnut disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw size={13} className={cx(isGenerating && "animate-spin text-sand")} />
            <span>{isGenerating ? "Rendering…" : "Regenerate"}</span>
          </button>
        </div>
      </div>

      {/* Main Concept Stage */}
      <div className="relative flex-1 bg-gradient-to-b from-[#FAF7F2] to-[#EFE8DE] flex items-center justify-center p-4 sm:p-6 overflow-hidden min-h-[380px]">
        {/* Concept Image / SVG */}
        <div className="relative w-full h-full max-h-[500px] flex items-center justify-center">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full border-2 border-espresso/20 border-t-espresso animate-spin mb-4" />
              <p className="font-display text-lg text-espresso">Rendering bespoke leather visual…</p>
              <p className="text-xs text-charcoal/70 mt-1">
                Applying {config.colourName} hide texture, {config.hardware} fittings, and hand-stitching.
              </p>
            </div>
          ) : currentImage?.url ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Subtle Atelier CAD Crosshair Guidelines */}
              <div className="absolute inset-x-8 top-1/2 h-[1px] bg-brass/10 pointer-events-none" />
              <div className="absolute inset-y-8 left-1/2 w-[1px] bg-brass/10 pointer-events-none" />

              {/* Dynamic Animated View Stage */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeView}-${activeVersionNumber}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <img
                    src={currentImage.url}
                    alt={`${config.designName} — ${activeView} view`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xl select-none transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Dimensions Spec Tag on Corner */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 bg-ivory/80 backdrop-blur-xs border border-espresso/15 rounded-xs text-[0.625rem] font-mono text-walnut">
                <Compass size={11} className="text-brass" />
                <span>{config.dimensions.width}&quot;W × {config.dimensions.height}&quot;H × {config.dimensions.depth}&quot;D</span>
              </div>

              {/* Floating Controls Overlay */}
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="p-2 bg-ivory/90 hover:bg-ivory border border-espresso/20 text-espresso rounded-xs shadow-xs transition-colors cursor-pointer"
                  title="Expand full screen"
                  aria-label="Expand image"
                >
                  <Maximize2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-2 bg-ivory/90 hover:bg-ivory border border-espresso/20 text-espresso rounded-xs shadow-xs transition-colors cursor-pointer"
                  title="Download concept vector card"
                  aria-label="Download image"
                >
                  <Download size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 text-charcoal/70">
              <p className="font-display text-lg">No concept image available.</p>
              <button
                type="button"
                onClick={onRegenerate}
                className="btn btn-sm btn-solid mt-3"
              >
                Generate Concept Now
              </button>
            </div>
          )}
        </div>

        {/* Atelier Craftsmanship Specification Badge */}
        <div className="absolute bottom-3 left-4 right-4 flex justify-center pointer-events-none">
          <div className="bg-espresso/90 backdrop-blur-xs text-[#F4E2B8] text-[0.625rem] sm:text-[0.6875rem] font-semibold tracking-wider px-3 py-1 rounded-2xs border border-sand/30 shadow-md text-center max-w-lg">
            BESPOKE ATELIER SPECIFICATION · HANDCRAFTED IN BENGALURU
          </div>
        </div>
      </div>

      {/* Bottom Multi-View Tab Switcher */}
      <div className="p-2 border-t border-espresso/15 bg-linen/60 shrink-0">
        <div className="grid grid-cols-4 gap-2">
          {viewTabs.map((tab) => {
            const isSelected = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveView(tab.id)}
                className={cx(
                  "flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold uppercase tracking-wider rounded-xs border transition-all cursor-pointer truncate",
                  isSelected
                    ? "bg-espresso text-ivory border-espresso shadow-xs"
                    : "bg-ivory/90 border-espresso/15 text-charcoal/80 hover:border-espresso/40 hover:bg-ivory"
                )}
              >
                <span className="text-[0.65rem] opacity-75">{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 p-2.5 text-ivory hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            aria-label="Close fullscreen"
          >
            <X size={22} />
          </button>

          <div className="max-w-4xl max-h-[85vh] w-full flex items-center justify-center p-2">
            <img
              src={currentImage.url}
              alt={currentImage.label}
              className="max-h-full max-w-full object-contain rounded-xs shadow-2xl"
            />
          </div>

          <div className="mt-4 text-center text-ivory/80 text-xs">
            <p className="font-display text-xl text-ivory">{config.designName} — {currentImage.label}</p>
            <p className="mt-1 font-mono text-[0.6875rem] text-sand/80">
              BESPOKE ARCHITECTURAL ELEVATION · HANDCRAFTED COMMISSION SPECIFICATION
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

