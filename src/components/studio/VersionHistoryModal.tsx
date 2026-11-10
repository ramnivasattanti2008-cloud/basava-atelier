"use client";

import { useState } from "react";
import { Check, CheckCircle2, Clock, History, RotateCcw, X, ArrowRight } from "lucide-react";
import { cx } from "@/lib/format";
import type { DesignVersion } from "@/lib/studio-types";

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: DesignVersion[];
  activeVersionNumber: number;
  onRestoreVersion: (version: DesignVersion) => void;
}

export function VersionHistoryModal({
  isOpen,
  onClose,
  versions,
  activeVersionNumber,
  onRestoreVersion,
}: VersionHistoryModalProps) {
  const [selectedVersionNumber, setSelectedVersionNumber] = useState<number>(
    activeVersionNumber || (versions.length > 0 ? versions[versions.length - 1].versionNumber : 1)
  );

  if (!isOpen) return null;

  const selectedVersion =
    versions.find((v) => v.versionNumber === selectedVersionNumber) ||
    versions[versions.length - 1] ||
    null;

  const activeVersion = versions.find((v) => v.versionNumber === activeVersionNumber) || null;

  const handleRestore = (version: DesignVersion) => {
    onRestoreVersion(version);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-paper border border-espresso/20 rounded-xs shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-espresso/15 bg-linen/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-espresso text-ivory flex items-center justify-center">
              <History size={16} className="text-sand" />
            </div>
            <div>
              <h2 className="font-display text-xl text-espresso">Design Version Archive</h2>
              <p className="text-xs text-charcoal/70">
                Compare iterations, review artisan adjustments, and roll back to previous iterations.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-charcoal/60 hover:text-espresso rounded-xs hover:bg-linen transition-colors"
            aria-label="Close version history"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Version List Sidebar (md:col-span-5) */}
          <div className="md:col-span-5 border-r border-espresso/15 bg-linen/20 p-4 space-y-3 overflow-y-auto">
            <p className="eyebrow text-charcoal/60 mb-2">Recorded Iterations ({versions.length})</p>

            {versions.length === 0 ? (
              <p className="text-xs text-charcoal/60 italic py-6 text-center">
                No previous versions recorded yet.
              </p>
            ) : (
              [...versions].reverse().map((v) => {
                const isSelected = v.versionNumber === selectedVersionNumber;
                const isLive = v.versionNumber === activeVersionNumber;

                return (
                  <button
                    key={v.versionNumber}
                    type="button"
                    onClick={() => setSelectedVersionNumber(v.versionNumber)}
                    className={cx(
                      "w-full text-left p-3.5 border rounded-xs transition-all relative flex flex-col gap-1.5 cursor-pointer",
                      isSelected
                        ? "border-espresso bg-paper ring-1 ring-espresso shadow-xs"
                        : "border-espresso/15 bg-paper/70 hover:border-espresso/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-xs bg-espresso text-ivory">
                          v{v.versionNumber}
                        </span>
                        <span className="font-display text-sm text-espresso font-semibold truncate max-w-[140px]">
                          {v.config.designName}
                        </span>
                      </div>
                      {isLive && (
                        <span className="text-[0.625rem] bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded-xs font-semibold">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-charcoal/80 line-clamp-2 mt-0.5">
                      {v.changeSummary || "Custom design snapshot."}
                    </p>

                    <div className="flex items-center gap-3 text-[0.6875rem] text-charcoal/60 pt-1 border-t border-espresso/10">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(v.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{v.config.colourName}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Selected Version Detail Pane (md:col-span-7) */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-6">
            {selectedVersion ? (
              <>
                <div className="flex items-center justify-between border-b border-espresso/15 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-xs bg-saddle-deep text-ivory">
                        v{selectedVersion.versionNumber}
                      </span>
                      <h3 className="font-display text-xl text-espresso">{selectedVersion.config.designName}</h3>
                    </div>
                    <p className="text-xs text-charcoal/70 mt-1">
                      Logged on {new Date(selectedVersion.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })} at{" "}
                      {new Date(selectedVersion.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {selectedVersion.versionNumber === activeVersionNumber ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xs">
                      <CheckCircle2 size={14} /> Currently in Studio
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRestore(selectedVersion)}
                      className="btn btn-solid btn-sm flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <RotateCcw size={13} />
                      Restore Version {selectedVersion.versionNumber}
                    </button>
                  )}
                </div>

                {/* Concept Thumbnail Preview */}
                <div className="relative aspect-16/10 rounded-xs border border-espresso/15 bg-linen/40 flex items-center justify-center overflow-hidden p-4">
                  {selectedVersion.images?.front ? (
                    selectedVersion.images.front.startsWith("data:") ||
                    selectedVersion.images.front.startsWith("/") ||
                    selectedVersion.images.front.startsWith("http") ? (
                      <img
                        src={selectedVersion.images.front}
                        alt={`${selectedVersion.config.designName} v${selectedVersion.versionNumber}`}
                        className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center [&>svg]:max-h-full [&>svg]:w-auto"
                        dangerouslySetInnerHTML={{ __html: selectedVersion.images.front }}
                      />
                    )
                  ) : (
                    <div className="text-center text-charcoal/50 text-xs">
                      Visual concept preserved in state.
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 text-[0.625rem] bg-espresso/80 text-ivory px-2 py-0.5 rounded-xs backdrop-blur-xs">
                    Front Elevation Snapshot
                  </span>
                </div>

                {/* Diff / Changes from Previous */}
                <div className="border border-espresso/15 p-4 rounded-xs bg-ivory/60 space-y-2">
                  <h4 className="font-display text-sm text-espresso font-semibold">Change Rationale</h4>
                  <p className="text-xs text-charcoal/85 leading-relaxed">
                    {selectedVersion.changeSummary || "Initial base creation."}
                  </p>
                </div>

                {/* Specification Grid */}
                <div className="space-y-3">
                  <h4 className="font-display text-sm text-espresso font-semibold">Technical Specifications</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 border border-espresso/10 rounded-xs bg-paper">
                      <span className="text-[0.625rem] text-charcoal/60 uppercase tracking-wider block">Silhouette</span>
                      <span className="font-medium text-espresso capitalize">{selectedVersion.config.bagType} Bag</span>
                    </div>
                    <div className="p-3 border border-espresso/10 rounded-xs bg-paper">
                      <span className="text-[0.625rem] text-charcoal/60 uppercase tracking-wider block">Leather & Shade</span>
                      <span className="font-medium text-espresso capitalize">
                        {selectedVersion.config.colourName} ({selectedVersion.config.material.replace("-", " ")})
                      </span>
                    </div>
                    <div className="p-3 border border-espresso/10 rounded-xs bg-paper">
                      <span className="text-[0.625rem] text-charcoal/60 uppercase tracking-wider block">Dimensions</span>
                      <span className="font-medium text-espresso">
                        {selectedVersion.config.dimensions.width} × {selectedVersion.config.dimensions.height} ×{" "}
                        {selectedVersion.config.dimensions.depth} cm
                      </span>
                    </div>
                    <div className="p-3 border border-espresso/10 rounded-xs bg-paper">
                      <span className="text-[0.625rem] text-charcoal/60 uppercase tracking-wider block">Hardware & Closure</span>
                      <span className="font-medium text-espresso capitalize">
                        {selectedVersion.config.hardware} · {selectedVersion.config.closure}
                      </span>
                    </div>
                    <div className="p-3 border border-espresso/10 rounded-xs bg-paper col-span-2">
                      <span className="text-[0.625rem] text-charcoal/60 uppercase tracking-wider block">Monogram Personalisation</span>
                      <span className="font-medium text-espresso">
                        {selectedVersion.config.personalisation.enabled && selectedVersion.config.personalisation.text
                          ? `"${selectedVersion.config.personalisation.text}" via ${selectedVersion.config.personalisation.method.replace("-", " ")} (${selectedVersion.config.personalisation.placement})`
                          : "None requested"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Rollback Action */}
                {selectedVersion.versionNumber !== activeVersionNumber && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRestore(selectedVersion)}
                      className="btn btn-solid w-full flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <RotateCcw size={14} />
                      Restore Version {selectedVersion.versionNumber} to Studio Canvas
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-charcoal/50 text-xs">
                Select a version on the left to preview details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
