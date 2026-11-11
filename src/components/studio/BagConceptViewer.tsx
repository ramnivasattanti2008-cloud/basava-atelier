"use client";

import { useState, useEffect } from "react";
import { Download, Eye, History, Layers, Maximize2, RefreshCw, Share2, X, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cx } from "@/lib/format";
import { useToast } from "@/lib/toast";
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
  const [displayMode, setDisplayMode] = useState<"photo" | "blueprint">("photo");
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const showToast = useToast((s) => s.show);

  const currentImage = views[activeView] || views.front;

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [activeView, currentImage?.url]);
  const isPhotoAvailable = Boolean(currentImage?.url && !currentImage.url.startsWith("data:image/svg"));
  const activeSrc =
    displayMode === "blueprint" || imgError || !currentImage?.url
      ? currentImage?.blueprintUrl || currentImage?.url
      : currentImage?.url;

  const viewTabs: { id: ConceptViewType; label: string; icon: string }[] = [
    { id: "front", label: "Front Elevation", icon: "✦" },
    { id: "angle", label: "3/4 Perspective", icon: "❖" },
    { id: "interior", label: "Interior Layout", icon: "⌗" },
    { id: "detail", label: "Macro Detail", icon: "🔍" },
  ];

  const handleShare = () => {
    const params = new URLSearchParams({
      style: config.bagType,
      leather: config.material,
      colour: config.colourName,
      hw: config.hardware,
    });
    if (config.personalisation.enabled && config.personalisation.text) {
      params.set("initials", config.personalisation.text);
    }
    const shareUrl = `${window.location.origin}/custom?${params.toString()}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${config.designName} — BASAVA Bespoke Atelier`,
          text: `Review my bespoke bag configuration: ${config.designName} in ${config.colourName} ${config.material}.`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast("Bespoke specification link copied to clipboard.");
    }
  };

  const handleDownload = () => {
    if (!activeSrc) return;
    const isSvg = activeSrc.startsWith("data:image/svg+xml") || displayMode === "blueprint";
    const a = document.createElement("a");
    a.href = activeSrc;
    a.download = `${config.designName.toLowerCase().replace(/\s+/g, "-")}-${activeView}-${isSvg ? "blueprint.svg" : "studio.jpg"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={cx("flex flex-col h-full bg-paper border border-espresso/15 rounded-xs overflow-hidden shadow-xs", className)}>
      {/* Top Bar: Title, Mode Toggle & Version Pill */}
      <div className="px-5 py-3 border-b border-espresso/15 bg-linen/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow text-saddle-deep">Bespoke Design Studio</span>
            <span className="font-mono text-[0.625rem] bg-espresso text-ivory px-2 py-0.5 rounded-xs font-semibold">
              v{activeVersionNumber}
            </span>
            {currentImage?.provider === "flux" && (
              <span className="font-mono text-[0.625rem] bg-brass/20 text-walnut px-2 py-0.5 rounded-xs font-semibold border border-brass/30">
                Flux Realism
              </span>
            )}
          </div>
          <h2 className="font-display text-xl sm:text-2xl text-espresso leading-snug mt-0.5 truncate max-w-md">
            {config.designName}
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Selector: Photorealistic Studio vs CAD Blueprint */}
          <div className="flex items-center bg-paper border border-espresso/20 rounded-xs p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setDisplayMode("photo");
                setImgError(false);
              }}
              className={cx(
                "px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wider rounded-2xs transition-all cursor-pointer flex items-center gap-1",
                displayMode === "photo" && !imgError
                  ? "bg-espresso text-ivory shadow-2xs"
                  : "text-espresso/70 hover:text-espresso"
              )}
            >
              <span>✦ Studio Render</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode("blueprint")}
              className={cx(
                "px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wider rounded-2xs transition-all cursor-pointer flex items-center gap-1",
                displayMode === "blueprint" || imgError
                  ? "bg-espresso text-ivory shadow-2xs"
                  : "text-espresso/70 hover:text-espresso"
              )}
            >
              <span>📐 Blueprint</span>
            </button>
          </div>

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
        {/* Concept Image / Instant Blueprint Stage */}
        <div className="relative w-full h-full max-h-[500px] flex items-center justify-center">
          {currentImage?.url || currentImage?.blueprintUrl ? (
            <>
              {/* Soft Ambient Brass Lighting Aura */}
              <div className="absolute inset-16 rounded-full bg-gradient-to-tr from-[#caa359]/15 via-transparent to-transparent blur-3xl pointer-events-none pulse-aura" />

          {/* Subtle Atelier CAD Crosshair Guidelines */}
          <div className="absolute inset-x-8 top-1/2 h-[1px] bg-brass/10 pointer-events-none" />
          <div className="absolute inset-y-8 left-1/2 w-[1px] bg-brass/10 pointer-events-none" />

          {/* Dynamic Animated View Stage */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 1. Underlying Instant Architectural Blueprint (Zero Latency) */}
            {currentImage?.blueprintUrl && (
              <img
                src={currentImage.blueprintUrl}
                alt={`${config.designName} architectural blueprint`}
                className={cx(
                  "absolute inset-0 m-auto max-h-full max-w-full object-contain filter drop-shadow-md select-none transition-opacity duration-300",
                  displayMode === "photo" && imgLoaded && !imgError ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
              />
            )}

            {/* 2. Photorealistic Studio Plate (Fades in over blueprint when ready) */}
            {displayMode === "photo" && !imgError && currentImage?.url && !currentImage.url.startsWith("data:image/svg") && (
              <img
                key={`${currentImage.url}-${activeView}`}
                src={currentImage.url}
                alt={`${config.designName} — ${activeView} view`}
                onLoad={() => setImgLoaded(true)}
                onError={() => {
                  setImgError(true);
                  setImgLoaded(true);
                }}
                className={cx(
                  "max-h-full max-w-full object-contain filter drop-shadow-2xl select-none transition-all duration-700 hover:scale-105 rounded-xs",
                  imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-98"
                )}
              />
            )}
          </div>

          {/* Floating Live Rendering Status Pill */}
          {(isGenerating || (displayMode === "photo" && !imgLoaded && !imgError)) && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1 rounded-full bg-espresso/90 text-[#f5d77f] text-[0.6875rem] font-mono shadow-xl border border-[#caa359]/40 backdrop-blur-xs z-20 select-none">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-[#caa359] border-t-transparent animate-spin shrink-0" />
              <span>✦ Rendering Photorealistic Studio Visual…</span>
            </div>
          )}

          {/* Dimensions Spec Tag on Corner */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 bg-ivory/80 backdrop-blur-xs border border-espresso/15 rounded-xs text-[0.625rem] font-mono text-walnut">
            <Compass size={11} className="text-brass" />
            <span>{config.dimensions.width}&quot;W × {config.dimensions.height}&quot;H × {config.dimensions.depth}&quot;D</span>
          </div>

          {/* Floating Controls Overlay */}
          <div className="absolute top-2 right-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 bg-ivory/90 hover:bg-ivory border border-espresso/20 text-espresso rounded-xs shadow-xs transition-colors cursor-pointer"
                  title="Share bespoke specification link"
                  aria-label="Share specification link"
                >
                  <Share2 size={15} />
                </button>
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
                  title="Download concept card"
                  aria-label="Download image"
                >
                  <Download size={15} />
                </button>
              </div>
            </>
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
                  "btn-tactile flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold uppercase tracking-wider rounded-xs border transition-all cursor-pointer truncate active:scale-95",
                  isSelected
                    ? "bg-espresso text-ivory border-espresso shadow-xs"
                    : "bg-ivory/90 border-espresso/15 text-charcoal/80 hover:border-espresso/40 hover:bg-ivory hover:-translate-y-0.5"
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
              src={activeSrc}
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

