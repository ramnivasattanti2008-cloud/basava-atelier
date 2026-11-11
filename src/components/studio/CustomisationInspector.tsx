"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  MessageCircle,
  Package,
  Send,
  Sliders,
} from "lucide-react";
import { cx } from "@/lib/format";
import type {
  BespokeDesignConfig,
  BagType,
  LeatherMaterial,
  HardwareFinish,
  ClosureType,
  StrapOption,
  PersonalisationMethod,
  StudioAdminOptions,
} from "@/lib/studio-types";
import { defaultStudioOptions } from "@/data/studio-defaults";
import { DesignConfigurationService } from "@/services/designConfigurationService";
import { whatsappLink } from "@/lib/whatsapp";
import { useDemoStore } from "@/lib/store";

interface CustomisationInspectorProps {
  config: BespokeDesignConfig;
  onChange: (patch: Partial<BespokeDesignConfig>) => void;
  onSubmitQuote: () => void;
  options?: StudioAdminOptions;
  className?: string;
}

export function CustomisationInspector({
  config,
  onChange,
  onSubmitQuote,
  options = defaultStudioOptions,
  className,
}: CustomisationInspectorProps) {
  const settings = useDemoStore((s) => s.settings);

  // Accordion section collapse state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    shape: true,
    leather: true,
    dimensions: false,
    straps: false,
    hardware: false,
    interior: false,
    personalisation: true,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const issues = DesignConfigurationService.validateConfiguration(config, options);

  const handleTypeChange = (type: BagType) => {
    const defaultDims = DesignConfigurationService.getPresetDimensions(type, config.dimensions.preset);
    onChange({ bagType: type, dimensions: defaultDims });
  };

  const handlePresetDimensions = (preset: "compact" | "medium" | "large") => {
    const dims = DesignConfigurationService.getPresetDimensions(config.bagType, preset);
    onChange({ dimensions: dims });
  };

  const handleToggleStrap = (st: StrapOption) => {
    const current = config.straps;
    const next = current.includes(st) ? current.filter((s) => s !== st) : [...current, st];
    onChange({ straps: next });
  };

  return (
    <div className={cx("flex flex-col h-full bg-paper border border-espresso/15 rounded-xs overflow-hidden shadow-xs", className)}>
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-espresso/15 bg-linen/70 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-saddle-deep" />
          <h3 className="font-display text-base text-espresso leading-none">Design Specifications</h3>
        </div>
        <span className="text-[0.6875rem] font-semibold text-walnut/70">
          Live Configuration
        </span>
      </div>

      {/* Validation / Compatibility Banners */}
      {issues.length > 0 && (
        <div className="p-3 bg-amber-50/80 border-b border-amber-200 text-xs text-amber-900 space-y-1">
          {issues.map((iss, i) => (
            <div key={i} className="flex items-start gap-1.5 leading-snug">
              <Info size={13} className="shrink-0 mt-0.5 text-amber-700" />
              <span>{iss.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Scrollable Accordion Controls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 1. BAG SILHOUETTE */}
        <div className="border border-espresso/12 bg-ivory rounded-xs overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("shape")}
            className="w-full px-4 py-2.5 bg-linen/40 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-espresso cursor-pointer hover:bg-linen/70 transition-colors"
          >
            <span>1. Bag Silhouette ({options.bagTypes.find(b => b.id === config.bagType)?.name})</span>
            {openSections.shape ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openSections.shape && (
            <div className="p-3 grid grid-cols-2 gap-2 text-xs">
              {options.bagTypes.map((b) => {
                const isSel = config.bagType === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    disabled={!b.available}
                    onClick={() => handleTypeChange(b.id as BagType)}
                    className={cx(
                      "btn-tactile p-2.5 text-left border rounded-xs transition-all relative flex flex-col justify-between cursor-pointer active:scale-95",
                      isSel
                        ? "border-espresso bg-linen/80 ring-1 ring-espresso shadow-2xs font-bold text-espresso"
                        : b.available
                        ? "border-espresso/15 bg-paper hover:border-espresso/35 text-charcoal/80"
                        : "opacity-40 cursor-not-allowed border-dashed bg-zinc-100"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{b.name}</span>
                      {isSel && <Check size={12} className="text-saddle-deep shrink-0" />}
                    </div>
                    {b.tag && (
                      <span className="text-[0.55rem] font-medium text-saddle-deep uppercase tracking-wider mt-1">
                        {b.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. LEATHER MATERIAL & COLOUR */}
        <div className="border border-espresso/12 bg-ivory rounded-xs overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("leather")}
            className="w-full px-4 py-2.5 bg-linen/40 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-espresso cursor-pointer hover:bg-linen/70 transition-colors"
          >
            <span>2. Leather & Colour ({config.colourName})</span>
            {openSections.leather ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openSections.leather && (
            <div className="p-3 space-y-3 text-xs">
              {/* Colour Palette Swatches */}
              <div>
                <label className="field-label mb-1.5 block">Leather Colour Palette</label>
                <div className="grid grid-cols-2 gap-2">
                  {options.colours.map((c) => {
                    const isSel = config.colourName === c.name;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onChange({ colourName: c.name, colourHex: c.hex || "#8A5D3B" })}
                        className={cx(
                          "btn-tactile flex items-center gap-2 p-2 border rounded-xs transition-all cursor-pointer text-left active:scale-95",
                          isSel
                            ? "border-espresso bg-linen/80 ring-1 ring-espresso font-bold"
                            : "border-espresso/15 bg-paper hover:border-espresso/40 text-charcoal/80"
                        )}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/25 shrink-0 shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="truncate text-[0.6875rem]">{c.name.replace(/(Royal |Mysore |Dark |Midnight |Imperial |Nilgiri |Hampi |Bengaluru )/g, "")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Material Grain */}
              <div>
                <label className="field-label mb-1.5 block">Leather Grade / Material</label>
                <div className="grid grid-cols-2 gap-2">
                  {options.materials.map((m) => {
                    const isSel = config.material === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onChange({ material: m.id as LeatherMaterial })}
                        className={cx(
                          "btn-tactile p-2 text-left border rounded-xs transition-all cursor-pointer active:scale-95",
                          isSel
                            ? "border-espresso bg-linen/80 ring-1 ring-espresso font-bold"
                            : "border-espresso/15 bg-paper hover:border-espresso/35 text-charcoal/80"
                        )}
                      >
                        <span className="truncate block text-[0.6875rem]">{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. DIMENSIONS & ERGONOMICS */}
        <div className="border border-espresso/12 bg-ivory rounded-xs overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("dimensions")}
            className="w-full px-4 py-2.5 bg-linen/40 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-espresso cursor-pointer hover:bg-linen/70 transition-colors"
          >
            <span>3. Dimensions ({config.dimensions.width}×{config.dimensions.height}×{config.dimensions.depth} cm)</span>
            {openSections.dimensions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openSections.dimensions && (
            <div className="p-3 space-y-3 text-xs">
              {/* Presets */}
              <div className="grid grid-cols-3 gap-2">
                {(["compact", "medium", "large"] as const).map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => handlePresetDimensions(pr)}
                    className={cx(
                      "py-1.5 text-center uppercase tracking-wider text-[0.6875rem] rounded-xs border cursor-pointer capitalize",
                      config.dimensions.preset === pr
                        ? "bg-espresso text-ivory border-espresso font-bold"
                        : "bg-paper border-espresso/15 hover:border-espresso/40"
                    )}
                  >
                    {pr}
                  </button>
                ))}
              </div>

              {/* Number controls */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <span className="text-[0.625rem] text-walnut/70 uppercase font-semibold">Width</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      type="number"
                      value={config.dimensions.width}
                      onChange={(e) =>
                        onChange({
                          dimensions: {
                            ...config.dimensions,
                            width: Math.max(10, parseInt(e.target.value) || 20),
                            preset: "custom",
                          },
                        })
                      }
                      className="w-full bg-paper border border-espresso/20 p-1.5 rounded-xs text-xs font-mono text-center"
                    />
                    <span className="text-[0.625rem] text-walnut/60">cm</span>
                  </div>
                </div>
                <div>
                  <span className="text-[0.625rem] text-walnut/70 uppercase font-semibold">Height</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      type="number"
                      value={config.dimensions.height}
                      onChange={(e) =>
                        onChange({
                          dimensions: {
                            ...config.dimensions,
                            height: Math.max(10, parseInt(e.target.value) || 20),
                            preset: "custom",
                          },
                        })
                      }
                      className="w-full bg-paper border border-espresso/20 p-1.5 rounded-xs text-xs font-mono text-center"
                    />
                    <span className="text-[0.625rem] text-walnut/60">cm</span>
                  </div>
                </div>
                <div>
                  <span className="text-[0.625rem] text-walnut/70 uppercase font-semibold">Depth</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      type="number"
                      value={config.dimensions.depth}
                      onChange={(e) =>
                        onChange({
                          dimensions: {
                            ...config.dimensions,
                            depth: Math.max(2, parseInt(e.target.value) || 10),
                            preset: "custom",
                          },
                        })
                      }
                      className="w-full bg-paper border border-espresso/20 p-1.5 rounded-xs text-xs font-mono text-center"
                    />
                    <span className="text-[0.625rem] text-walnut/60">cm</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. STRAPS & HARDWARE */}
        <div className="border border-espresso/12 bg-ivory rounded-xs overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("hardware")}
            className="w-full px-4 py-2.5 bg-linen/40 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-espresso cursor-pointer hover:bg-linen/70 transition-colors"
          >
            <span>4. Hardware & Closure ({config.hardware})</span>
            {openSections.hardware ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openSections.hardware && (
            <div className="p-3 space-y-3 text-xs">
              {/* Hardware finish */}
              <div>
                <label className="field-label mb-1.5 block">Hardware Metal Finish</label>
                <div className="grid grid-cols-2 gap-2">
                  {options.hardware.map((h) => {
                    const isSel = config.hardware === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => onChange({ hardware: h.id as HardwareFinish })}
                        className={cx(
                          "btn-tactile p-2 text-left border rounded-xs transition-all cursor-pointer active:scale-95",
                          isSel
                            ? "border-espresso bg-linen/80 ring-1 ring-espresso font-bold"
                            : "border-espresso/15 bg-paper hover:border-espresso/35 text-charcoal/80"
                        )}
                      >
                        <span className="truncate block text-[0.6875rem]">{h.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Closure */}
              <div>
                <label className="field-label mb-1.5 block">Bag Closure</label>
                <div className="grid grid-cols-2 gap-2">
                  {options.closures.map((c) => {
                    const isSel = config.closure === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onChange({ closure: c.id as ClosureType })}
                        className={cx(
                          "btn-tactile p-2 text-left border rounded-xs transition-all cursor-pointer active:scale-95",
                          isSel
                            ? "border-espresso bg-linen/80 ring-1 ring-espresso font-bold"
                            : "border-espresso/15 bg-paper hover:border-espresso/35 text-charcoal/80"
                        )}
                      >
                        <span className="truncate block text-[0.6875rem]">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. INTERIOR ORGANIZER */}
        <div className="border border-espresso/12 bg-ivory rounded-xs overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("interior")}
            className="w-full px-4 py-2.5 bg-linen/40 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-espresso cursor-pointer hover:bg-linen/70 transition-colors"
          >
            <span>5. Interior Compartments</span>
            {openSections.interior ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openSections.interior && (
            <div className="p-3 space-y-2 text-xs">
              {[
                { key: "laptopSleeve", label: "Cushioned Tech / Laptop Sleeve" },
                { key: "zipperPocket", label: "Interior Zippered Valuables Pocket" },
                { key: "phonePocket", label: "Slip Pockets for Phone & Passport" },
                { key: "cardSlots", label: "Four Integrated Card Slots" },
                { key: "keyLeash", label: "Key Leash / Swivel Hook" },
              ].map((item) => {
                const val = (config.interior as any)[item.key];
                return (
                  <label
                    key={item.key}
                    className="flex items-center gap-2 p-2 bg-paper border border-espresso/10 rounded-xs cursor-pointer hover:bg-linen/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(val)}
                      onChange={(e) =>
                        onChange({
                          interior: {
                            ...config.interior,
                            [item.key]: e.target.checked,
                          },
                        })
                      }
                      className="accent-espresso w-3.5 h-3.5"
                    />
                    <span className="text-[0.6875rem] font-medium text-espresso">{item.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. PERSONALISATION & MONOGRAM */}
        <div className="border border-espresso/12 bg-ivory rounded-xs overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("personalisation")}
            className="w-full px-4 py-2.5 bg-linen/40 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-espresso cursor-pointer hover:bg-linen/70 transition-colors"
          >
            <span>
              6. Monogram & Initials (
              {config.personalisation.enabled && config.personalisation.text
                ? config.personalisation.text
                : "None"}
              )
            </span>
            {openSections.personalisation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {openSections.personalisation && (
            <div className="p-3 space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-espresso">
                <input
                  type="checkbox"
                  checked={config.personalisation.enabled}
                  onChange={(e) =>
                    onChange({
                      personalisation: {
                        ...config.personalisation,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="accent-espresso w-3.5 h-3.5"
                />
                <span>Enable Custom Monogram / Initials</span>
              </label>

              {config.personalisation.enabled && (
                <div className="space-y-2.5 pt-1">
                  <div>
                    <label className="field-label mb-1 block">Your Initials / Name (Max 6 chars)</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={config.personalisation.text}
                      onChange={(e) =>
                        onChange({
                          personalisation: {
                            ...config.personalisation,
                            text: e.target.value.toUpperCase(),
                          },
                        })
                      }
                      placeholder="e.g. RN, BV, ॐ"
                      className="w-full bg-paper border border-espresso/20 px-3 py-1.5 rounded-xs font-display text-lg tracking-widest text-center text-espresso"
                    />
                  </div>

                  <div>
                    <label className="field-label mb-1 block">Debossing Method</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "gold-foil", label: "Gold Foil" },
                        { id: "blind-deboss", label: "Blind Heat" },
                        { id: "brass-tag", label: "Metal Tag" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() =>
                            onChange({
                              personalisation: {
                                ...config.personalisation,
                                method: m.id as PersonalisationMethod,
                              },
                            })
                          }
                          className={cx(
                            "py-1.5 text-center text-[0.625rem] font-semibold uppercase tracking-wider rounded-xs border cursor-pointer truncate",
                            config.personalisation.method === m.id
                              ? "bg-espresso text-ivory border-espresso"
                              : "bg-paper border-espresso/15 hover:border-espresso/35"
                          )}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="p-4 border-t border-espresso/15 bg-linen/70 space-y-2 shrink-0">
        <button
          type="button"
          onClick={onSubmitQuote}
          className="btn btn-solid btn-tactile shimmer-badge w-full flex items-center justify-center gap-2 shadow-md hover:shadow-xl py-3 text-xs sm:text-sm font-bold tracking-wider"
        >
          <Send size={15} />
          Submit for Artisan Quotation
        </button>

        <a
          href={whatsappLink(
            settings.whatsappNumber,
            `Hello ${settings.makerName}, I am customizing ${config.designName} in your Bespoke Atelier Studio and would like to consult with the artisan.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-tactile w-full flex items-center justify-center gap-2 text-xs py-2 hover:bg-ivory/60 hover:border-espresso hover:-translate-y-0.5"
        >
          <MessageCircle size={14} />
          Direct WhatsApp Chat
        </a>
      </div>
    </div>
  );
}

