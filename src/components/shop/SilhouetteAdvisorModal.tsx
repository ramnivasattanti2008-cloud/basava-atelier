"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Compass, Sparkles, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cx, formatINR } from "@/lib/format";
import { useStorefrontProducts } from "@/lib/hooks";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Product } from "@/lib/types";

interface SilhouetteAdvisorModalProps {
  open: boolean;
  onClose: () => void;
}

interface PurposeOption {
  id: string;
  title: string;
  desc: string;
  icon: string;
  categoryFilter: string[];
  bagStyle: string;
}

const purposes: PurposeOption[] = [
  {
    id: "tech-work",
    title: "Executive Work & Tech",
    desc: "14–16\" laptop, charger, documents, stationery, structured daily carry.",
    icon: "💼",
    categoryFilter: ["totes-carryalls"],
    bagStyle: "laptop",
  },
  {
    id: "daily-handsfree",
    title: "Minimalist Everyday",
    desc: "Phone, cardholder, keys, sunglasses. Compact hands-free freedom.",
    icon: "✨",
    categoryFilter: ["crossbody", "slings"],
    bagStyle: "crossbody",
  },
  {
    id: "weekend-travel",
    title: "Overnight & Getaways",
    desc: "Spacious compartments, durable reinforced straps for 2–3 day journeys.",
    icon: "✈️",
    categoryFilter: ["totes-carryalls"],
    bagStyle: "travel",
  },
  {
    id: "evening-ceremony",
    title: "Ceremonial & Dinners",
    desc: "Architectural elegance, heirloom brass clasp, compact silhouette.",
    icon: "✦",
    categoryFilter: ["handbags", "clutches-wristlets"],
    bagStyle: "clutch",
  },
];

const colourTones = [
  { id: "tan", label: "Saddle Tan", hex: "#8A5D3B", note: "A warm mid-brown" },
  { id: "espresso", label: "Deep Espresso", hex: "#3D2314", note: "Rich dark chocolate brown with formal executive depth" },
  { id: "cognac", label: "Cognac", hex: "#9E472A", note: "Vibrant warm amber undertones with visible grain" },
  { id: "black", label: "Obsidian Black", hex: "#1C1917", note: "Timeless contemporary versatility" },
];

const hardwareFinishes = [
  { id: "antique-brass", label: "Antique Hand-Buffed Brass", note: "Aged golden glow, resists fingerprints" },
  { id: "24k-gold", label: "Gold Tone", note: "A bright warm finish" },
  { id: "silver", label: "Polished Silver / Nickel", note: "Crisp architectural contrast" },
];

export function SilhouetteAdvisorModal({ open, onClose }: SilhouetteAdvisorModalProps) {
  const router = useRouter();
  const products = useStorefrontProducts();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeOption>(purposes[0]);
  const [selectedTone, setSelectedTone] = useState(colourTones[0]);
  const [selectedHw, setSelectedHw] = useState(hardwareFinishes[0]);

  if (!open) return null;

  // Filter recommendations based on selections
  const matchingProducts: Product[] = products
    .filter((p) => {
      const catMatch = selectedPurpose.categoryFilter.includes(p.category);
      return catMatch;
    })
    .slice(0, 3);

  const handleApplyFilter = () => {
    onClose();
    const cat = selectedPurpose.categoryFilter[0];
    router.push(`/shop?category=${encodeURIComponent(cat)}`);
  };

  const bespokeUrl = `/custom?style=${encodeURIComponent(selectedPurpose.bagStyle)}&colour=${encodeURIComponent(
    selectedTone.label
  )}&hw=${encodeURIComponent(selectedHw.id)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-paper border border-espresso/20 rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-linen/60 border-b border-espresso/15 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.625rem] bg-[#caa359] text-espresso font-bold uppercase tracking-widest px-2 py-0.5 rounded-2xs">
              Atelier Advisor
            </span>
            <span className="text-xs text-charcoal/70">Step {step} of 4</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-espresso/70 hover:text-espresso rounded-xs hover:bg-espresso/5 transition-colors cursor-pointer"
            aria-label="Close advisor"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Stage */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-2xl text-espresso">How do you intend to carry?</h3>
                  <p className="text-xs text-charcoal/70 mt-1">
                    Select your primary daily routine to find the perfect ergonomic leather proportions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {purposes.map((p) => {
                    const isSelected = selectedPurpose.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPurpose(p)}
                        className={cx(
                          "btn-tactile p-4 text-left border rounded-xs transition-all cursor-pointer flex flex-col",
                          isSelected
                            ? "border-espresso bg-ivory shadow-xs ring-1 ring-espresso"
                            : "border-espresso/15 bg-linen/30 hover:border-espresso/40 hover:bg-ivory"
                        )}
                      >
                        <span className="text-2xl mb-2">{p.icon}</span>
                        <span className="font-display text-base text-espresso font-bold">{p.title}</span>
                        <span className="text-[0.6875rem] text-charcoal/75 mt-1 leading-relaxed">{p.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-2xl text-espresso">Choose your leather patina tone</h3>
                  <p className="text-xs text-charcoal/70 mt-1">
                    Leather deepens in colour with use.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {colourTones.map((tone) => {
                    const isSelected = selectedTone.id === tone.id;
                    return (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setSelectedTone(tone)}
                        className={cx(
                          "btn-tactile p-3.5 text-left border rounded-xs transition-all cursor-pointer flex items-center gap-3.5",
                          isSelected
                            ? "border-espresso bg-ivory shadow-xs ring-1 ring-espresso"
                            : "border-espresso/15 bg-linen/30 hover:border-espresso/40 hover:bg-ivory"
                        )}
                      >
                        <div
                          className="w-9 h-9 rounded-full border border-espresso/20 shadow-xs shrink-0"
                          style={{ backgroundColor: tone.hex }}
                        />
                        <div className="flex-1">
                          <p className="font-display text-base text-espresso font-bold">{tone.label}</p>
                          <p className="text-[0.6875rem] text-charcoal/75">{tone.note}</p>
                        </div>
                        {isSelected && <Check size={16} className="text-espresso shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-2xl text-espresso">Select your metal hardware finish</h3>
                  <p className="text-xs text-charcoal/70 mt-1">
                    Hardware finish is confirmed with you before making.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {hardwareFinishes.map((hw) => {
                    const isSelected = selectedHw.id === hw.id;
                    return (
                      <button
                        key={hw.id}
                        type="button"
                        onClick={() => setSelectedHw(hw)}
                        className={cx(
                          "btn-tactile p-4 text-left border rounded-xs transition-all cursor-pointer flex items-center justify-between",
                          isSelected
                            ? "border-espresso bg-ivory shadow-xs ring-1 ring-espresso"
                            : "border-espresso/15 bg-linen/30 hover:border-espresso/40 hover:bg-ivory"
                        )}
                      >
                        <div>
                          <p className="font-display text-base text-espresso font-bold">{hw.label}</p>
                          <p className="text-[0.6875rem] text-charcoal/75 mt-0.5">{hw.note}</p>
                        </div>
                        {isSelected && <Check size={16} className="text-espresso" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <span className="eyebrow text-saddle-deep">Your Tailored Profile</span>
                  <h3 className="font-display text-2xl text-espresso mt-1">Recommended Handcrafted Pieces</h3>
                  <p className="text-xs text-charcoal/70 mt-1">
                    Based on <strong>{selectedPurpose.title}</strong> in <strong>{selectedTone.label}</strong> with{" "}
                    <strong>{selectedHw.label}</strong>:
                  </p>
                </div>

                {/* Recommended Pieces from Catalogue */}
                <div className="grid grid-cols-3 gap-3">
                  {matchingProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      onClick={onClose}
                      className="group border border-espresso/15 bg-ivory p-2.5 rounded-xs hover:border-[#caa359] transition-all flex flex-col"
                    >
                      <div className="aspect-square bg-linen relative overflow-hidden mb-2">
                        <ProductImage
                          src={p.images[0]}
                          alt={p.name}
                          sizes="200px"
                          className="object-contain p-2 group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-[0.6875rem] font-semibold text-espresso line-clamp-1 group-hover:underline">
                        {p.name}
                      </p>
                      <p className="text-[0.625rem] text-saddle-deep font-mono mt-auto">{formatINR(p.priceINR)}</p>
                    </Link>
                  ))}
                </div>

                {/* Bespoke Studio Direct Link Option */}
                <div className="p-4 bg-espresso text-ivory rounded-xs border border-sand/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#F4E2B8]">Prefer an Exact Custom Piece?</p>
                    <p className="text-[0.6875rem] text-sand/80 mt-0.5">
                      Open your selected silhouette & {selectedTone.label} leather directly in our Bespoke Studio.
                    </p>
                  </div>
                  <Link
                    href={bespokeUrl}
                    onClick={onClose}
                    className="btn bg-[#caa359] hover:bg-[#b89146] text-espresso font-bold text-xs py-2 px-3.5 rounded-xs whitespace-nowrap shadow-xs"
                  >
                    Open in Bespoke Studio →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-4 bg-linen/60 border-t border-espresso/15 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={13} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="btn btn-solid btn-sm text-xs flex items-center gap-1.5 cursor-pointer"
            >
              Next <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApplyFilter}
              className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 cursor-pointer"
            >
              Filter Catalogue <ShoppingBag size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

