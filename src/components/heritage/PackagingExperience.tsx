"use client";

import { useState } from "react";
import { Award, Feather, Gift, ShieldCheck, Sparkles } from "lucide-react";
import { cx } from "@/lib/format";

const packagingSteps = [
  {
    step: "01",
    title: "Unbleached Khadi Dust Bag",
    tagline: "Eco-Conscious Preservation",
    desc: "Woven on traditional Karnataka looms from 100% pure organic cotton. The breathable weave allows the leather to age and breathe naturally without trapping destructive humidity.",
    badge: "100% Pure Cotton",
  },
  {
    step: "02",
    title: "Crimson Artisan Wax Seal",
    tagline: "Hand-Struck Authenticity",
    desc: "Every order is individually inspected and closed with molten crimson sealing wax, hand-pressed with our atelier's brass insignia. It certifies the piece has met our strict finishing standards.",
    badge: "Atelier Certified",
  },
  {
    step: "03",
    title: "Solid Brass Keepsake Tag",
    tagline: "Engraved Heirloom Fitting",
    desc: "Accompanied by a heavy, hand-buffed solid brass fob engraved with your unique serial number and custom initials. Resistant to tarnish and designed to be kept forever.",
    badge: "Solid Antique Brass",
  },
  {
    step: "04",
    title: "Hand-Tied Saffron Silk Ribbon",
    tagline: "The Royal Touch",
    desc: "Finished with a ceremonial saffron raw silk ribbon, honoring the vibrant textile history of South India. Ready to present as a timeless gift or treasured personal possession.",
    badge: "Handloom Finished",
  },
];

export function PackagingExperience() {
  const [activeStep, setActiveStep] = useState(0);
  const current = packagingSteps[activeStep];

  return (
    <div className="border border-espresso/15 bg-paper p-6 sm:p-10 rounded-xs shadow-xs">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="eyebrow text-saddle-deep">The Unboxing Ritual</span>
        <h3 className="font-display text-2xl sm:text-3xl text-espresso mt-1">
          Presented in Royal Packaging
        </h3>
        <p className="text-xs text-charcoal/75 mt-2 leading-relaxed">
          The luxury experience begins the moment you open the box. Every order arrives prepared as an heirloom gift.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Step Selector List */}
        <div className="lg:col-span-5 space-y-2.5">
          {packagingSteps.map((st, idx) => {
            const isSel = activeStep === idx;
            return (
              <button
                key={st.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={cx(
                  "w-full text-left p-4 border rounded-xs transition-all flex items-start gap-4",
                  isSel
                    ? "border-espresso bg-linen/70 ring-1 ring-espresso shadow-xs"
                    : "border-espresso/12 bg-ivory hover:border-espresso/35"
                )}
              >
                <span
                  className={cx(
                    "font-mono text-xs font-bold px-2 py-0.5 rounded-xs shrink-0",
                    isSel ? "bg-espresso text-ivory" : "bg-linen text-walnut"
                  )}
                >
                  {st.step}
                </span>
                <div className="min-w-0">
                  <h4 className="font-display text-base text-espresso leading-snug">{st.title}</h4>
                  <p className="text-[0.6875rem] text-saddle-deep font-semibold uppercase tracking-wider mt-0.5">
                    {st.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Feature Box */}
        <div className="lg:col-span-7 border border-espresso/15 bg-ivory p-6 sm:p-8 rounded-xs relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          {/* Subtle Jaali corner decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-linen/60 to-transparent pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-saddle-deep font-bold tracking-widest">
                STAGE {current.step} OF 04
              </span>
              <span className="bg-linen px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider text-espresso border border-espresso/15">
                {current.badge}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-espresso mt-4">
              {current.title}
            </h3>
            <p className="eyebrow text-saddle-deep mt-1">{current.tagline}</p>

            <p className="text-sm text-charcoal/85 leading-relaxed mt-4">
              {current.desc}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-espresso/10 flex items-center justify-between text-xs text-walnut/70">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-brass" />
              Complimentary on all collection pieces
            </span>
            <div className="flex gap-1.5">
              {packagingSteps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  className={cx(
                    "h-2 rounded-full transition-all",
                    activeStep === i ? "w-6 bg-espresso" : "w-2 bg-espresso/25"
                  )}
                  aria-label={`Go to unboxing step ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
