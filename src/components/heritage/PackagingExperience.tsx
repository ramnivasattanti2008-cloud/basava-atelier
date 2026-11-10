"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Award, Feather, Gift, ShieldCheck, Sparkles } from "lucide-react";
import { cx } from "@/lib/format";

const packagingSteps = [
  {
    step: "01",
    title: "100% Pure Cotton Dust Bag",
    tagline: "Keeps Your Leather Fresh",
    desc: "Woven on traditional looms from pure organic cotton. It keeps dust away and lets the real leather breathe naturally without trapping moisture.",
    badge: "Pure Cotton",
  },
  {
    step: "02",
    title: "Artisan Red Wax Seal",
    tagline: "Inspected & Sealed by Hand",
    desc: "Every single piece is individually inspected by the artisan and closed with molten crimson sealing wax, hand-pressed with our atelier crest.",
    badge: "Hand-Stamped",
  },
  {
    step: "03",
    title: "Solid Antique Brass Tag",
    tagline: "Your Personal Keepsake",
    desc: "Accompanied by a heavy, hand-buffed solid brass tag engraved with your unique serial number. It never rusts and stays with your bag forever.",
    badge: "Solid Brass",
  },
  {
    step: "04",
    title: "Hand-Tied Saffron Silk Ribbon",
    tagline: "Ready for Gifting",
    desc: "Finished with a ceremonial South Indian raw silk ribbon. Whether it is for yourself or a gift for someone special, unboxing it feels truly royal.",
    badge: "Pure Raw Silk",
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
          Every Bag Arrives Like a Royal Gift
        </h3>
        <p className="text-xs sm:text-sm text-charcoal/80 mt-2 leading-relaxed">
          The luxury begins the moment you open the box. Packaged by hand with heritage details at no extra charge.
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
                  "w-full text-left p-4 border rounded-xs transition-all duration-300 flex items-start gap-4 cursor-pointer",
                  isSel
                    ? "border-espresso bg-linen/90 ring-1 ring-espresso shadow-sm translate-x-1"
                    : "border-espresso/12 bg-ivory hover:border-espresso/35 hover:bg-ivory/80"
                )}
              >
                <span
                  className={cx(
                    "font-mono text-xs font-bold px-2 py-0.5 rounded-xs shrink-0 transition-colors",
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

        {/* Active Step Feature Box with Silk Smooth Motion */}
        <div className="lg:col-span-7 border border-espresso/15 bg-ivory p-6 sm:p-8 rounded-xs relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-sm">
          {/* Subtle Jaali corner decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-linen/60 to-transparent pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
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
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 pt-4 border-t border-espresso/10 flex items-center justify-between text-xs text-walnut/70">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles size={14} className="text-brass" />
              Included free with every order
            </span>
            <div className="flex gap-2">
              {packagingSteps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  className={cx(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    activeStep === i ? "w-7 bg-espresso" : "w-2.5 bg-espresso/25 hover:bg-espresso/50"
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
