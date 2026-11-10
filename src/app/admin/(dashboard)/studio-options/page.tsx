"use client";

import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Cpu,
  Layers,
  Palette,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Compass,
  ToggleLeft,
  ToggleRight,
  XCircle,
} from "lucide-react";
import { cx } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { defaultStudioOptions } from "@/data/studio-defaults";
import type { StudioAdminOptions, StudioOptionItem } from "@/lib/studio-types";

type OptionCategoryKey =
  | "materials"
  | "bagTypes"
  | "colours"
  | "hardware"
  | "closures"
  | "straps"
  | "personalisationMethods";

export default function AdminStudioOptionsPage() {
  const studioOptions = useDemoStore((s) => s.studioOptions) || defaultStudioOptions;
  const updateStudioOptions = useDemoStore((s) => s.updateStudioOptions);
  const showToast = useToast((s) => s.show);

  const [activeTab, setActiveTab] = useState<OptionCategoryKey>("materials");

  const categoryMetadata: Record<
    OptionCategoryKey,
    { label: string; description: string; icon: string }
  > = {
    materials: {
      label: "Leather Materials",
      description: "Manage verified tannery hides and textile combinations currently available for bespoke crafting.",
      icon: "◈",
    },
    bagTypes: {
      label: "Bag Silhouettes",
      description: "Select which foundational patterns can be commissioned in the Bespoke Studio.",
      icon: "❖",
    },
    colours: {
      label: "Leather Colours",
      description: "Configure available dyed aniline and vegetable-tanned leather shades.",
      icon: "✦",
    },
    hardware: {
      label: "Hardware Finishes",
      description: "Manage metallic fittings, rivets, buckles, and custom brass castings.",
      icon: "⌗",
    },
    closures: {
      label: "Closures",
      description: "Available zip grades, magnetic locks, and buckle assemblies.",
      icon: "▪",
    },
    straps: {
      label: "Handles & Straps",
      description: "Ergonomic strap types offered for hand, shoulder, and crossbody carry.",
      icon: "▫",
    },
    personalisationMethods: {
      label: "Personalisation",
      description: "Hot-stamping, debossing, and brass plate engraving methods.",
      icon: "✧",
    },
  };

  const handleToggleItem = (category: OptionCategoryKey, itemId: string) => {
    const currentList = studioOptions[category] as StudioOptionItem[];
    const updatedList = currentList.map((item) =>
      item.id === itemId ? { ...item, available: !item.available } : item
    );

    updateStudioOptions({ [category]: updatedList });

    const toggled = updatedList.find((i) => i.id === itemId);
    showToast(
      `${toggled?.name} is now ${toggled?.available ? "AVAILABLE" : "DISABLED"} in Bespoke Studio.`
    );
  };

  const handleProviderChange = (provider: StudioAdminOptions["imageProvider"]) => {
    updateStudioOptions({ imageProvider: provider });
    showToast(`Atelier concept generation engine set to ${provider.toUpperCase()}.`);
  };

  const handleTogglePublicRequests = () => {
    const nextVal = !studioOptions.allowPublicRequests;
    updateStudioOptions({ allowPublicRequests: nextVal });
    showToast(`Bespoke commission submissions are now ${nextVal ? "OPEN" : "PAUSED"}.`);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all Bespoke Studio options to factory atelier defaults?")) {
      updateStudioOptions(defaultStudioOptions);
      showToast("Reset bespoke studio options to defaults.");
    }
  };

  const currentItems = (studioOptions[activeTab] as StudioOptionItem[]) || [];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso/15 pb-6">
        <div>
          <span className="eyebrow text-saddle-deep">Atelier Administration</span>
          <h1 className="font-display text-3xl text-espresso mt-1">Bespoke Studio Options</h1>
          <p className="text-xs text-charcoal/70 mt-1 max-w-2xl">
            Control which materials, colours, silhouettes, and hardware finishes are presented to customers in The Bespoke Designer. Changes reflect immediately in the customer studio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-espresso/20 bg-ivory text-xs font-semibold text-charcoal/75 rounded-xs hover:text-espresso hover:border-espresso transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Global Studio Settings Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Concept Generation Engine */}
        <div className="border border-espresso/15 bg-paper p-5 rounded-xs space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-saddle-deep" />
            <h3 className="font-display text-base text-espresso font-semibold">
              Concept Generation Engine
            </h3>
          </div>
          <p className="text-xs text-charcoal/75 leading-relaxed">
            Select the rendering pipeline for multi-angle concept plates. In standard deployment, the dedicated studio engine creates ultra-high-definition, exact-hex vector plates with zero API latency.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            {(
              [
                { id: "auto", name: "Auto Detect (Recommended)" },
                { id: "studio-engine", name: "Studio Vector Engine" },
                { id: "gemini", name: "Google Gemini 2.5" },
                { id: "openai", name: "OpenAI DALL-E" },
              ] as const
            ).map((p) => {
              const isSel = studioOptions.imageProvider === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProviderChange(p.id)}
                  className={cx(
                    "p-2.5 border rounded-xs text-left transition-all cursor-pointer",
                    isSel
                      ? "border-espresso bg-espresso text-ivory font-semibold shadow-xs"
                      : "border-espresso/15 bg-ivory text-charcoal/80 hover:border-espresso/40"
                  )}
                >
                  <span className="block text-xs leading-tight">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio Acceptance Status */}
        <div className="border border-espresso/15 bg-paper p-5 rounded-xs space-y-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-saddle-deep" />
            <h3 className="font-display text-base text-espresso font-semibold">
              Public Commission Submissions
            </h3>
          </div>
          <p className="text-xs text-charcoal/75 leading-relaxed">
            When enabled, visitors can build designs and submit bespoke quotation requests. When disabled, customers can experiment with designs but new submissions are paused.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleTogglePublicRequests}
              className={cx(
                "w-full p-3 border rounded-xs flex items-center justify-between text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer",
                studioOptions.allowPublicRequests
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                  : "border-amber-300 bg-amber-50 text-amber-900"
              )}
            >
              <div className="flex items-center gap-2">
                {studioOptions.allowPublicRequests ? (
                  <ShieldCheck size={18} className="text-emerald-700" />
                ) : (
                  <ShieldAlert size={18} className="text-amber-700" />
                )}
                <span>
                  {studioOptions.allowPublicRequests
                    ? "Commissions Open (Accepting Requests)"
                    : "Commissions Paused (Atelier Full)"}
                </span>
              </div>
              <span className="underline text-[0.6875rem]">Toggle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-espresso/15">
        <div className="flex flex-wrap gap-1">
          {(Object.keys(categoryMetadata) as OptionCategoryKey[]).map((key) => {
            const meta = categoryMetadata[key];
            const isSel = activeTab === key;
            const items = studioOptions[key] as StudioOptionItem[];
            const availableCount = items?.filter((i) => i.available).length || 0;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={cx(
                  "px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2",
                  isSel
                    ? "border-espresso text-espresso bg-linen/50 font-bold"
                    : "border-transparent text-charcoal/60 hover:text-espresso hover:bg-linen/20"
                )}
              >
                <span>{meta.label}</span>
                <span className="font-mono text-[0.625rem] bg-espresso/10 text-espresso px-1.5 py-0.5 rounded-xs">
                  {availableCount}/{items?.length || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Description */}
      <div className="bg-linen/30 border border-espresso/10 p-4 rounded-xs flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg text-espresso">{categoryMetadata[activeTab].label}</h2>
          <p className="text-xs text-charcoal/70 mt-0.5">{categoryMetadata[activeTab].description}</p>
        </div>
        <span className="text-xs font-mono text-saddle-deep font-semibold">
          Click toggle to update client availability
        </span>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentItems.map((item) => {
          return (
            <div
              key={item.id}
              className={cx(
                "p-4 border rounded-xs transition-all flex items-start justify-between gap-4",
                item.available
                  ? "border-espresso/20 bg-paper shadow-2xs"
                  : "border-espresso/10 bg-paper/50 opacity-60"
              )}
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Optional Swatch preview for colours */}
                {item.hex && (
                  <span
                    className="w-8 h-8 rounded-full border border-black/20 shrink-0 mt-0.5 shadow-2xs"
                    style={{ backgroundColor: item.hex }}
                  />
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base text-espresso font-semibold truncate">
                      {item.name}
                    </h3>
                    {item.tag && (
                      <span className="text-[0.55rem] font-bold uppercase tracking-wider bg-saddle-deep text-ivory px-1.5 py-0.5 rounded-xs">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal/75 leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => handleToggleItem(activeTab, item.id)}
                className={cx(
                  "shrink-0 px-3 py-1.5 rounded-xs text-[0.6875rem] font-semibold uppercase tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer",
                  item.available
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                    : "bg-zinc-100 border-zinc-300 text-zinc-600 hover:bg-zinc-200"
                )}
                title={`Click to mark ${item.available ? "unavailable" : "available"}`}
              >
                {item.available ? (
                  <>
                    <CheckCircle2 size={13} className="text-emerald-700" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <XCircle size={13} className="text-zinc-500" />
                    <span>Disabled</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

