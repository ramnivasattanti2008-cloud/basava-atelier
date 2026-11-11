"use client";

import Link from "next/link";
import { ArrowRight, Compass, HeartHandshake, Layers, ShieldCheck, PenTool } from "lucide-react";
import { HeritageSeal } from "@/components/heritage/HeritageSeal";
import { RevealText } from "@/components/motion/RevealText";
import { BlockPrintPattern } from "@/components/motion/BlockPrintPattern";

export function DiscoverBasavaSection() {
  return (
    <section className="relative py-20 sm:py-28 bg-[#FAF7F2] border-b border-espresso/15 overflow-hidden">
      {/* 1. Traditional Woodblock Print Geometric Motif */}
      <BlockPrintPattern tone="parchment" density="sparse" />

      <div className="shell relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Authentic Brand Narrative */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-4">
            <HeritageSeal size={74} rotating={false} className="shrink-0" />
            <div>
              <p className="eyebrow text-saddle-deep tracking-[0.2em]">The Bengaluru Bench</p>
              <RevealText as="h2" className="display-lg text-espresso mt-1">
                Real Leather. Made by Hand.
              </RevealText>
            </div>
          </div>

          <div className="text-charcoal/85 text-sm sm:text-base leading-relaxed space-y-4 font-sans">
            <p>
              Every piece in the BASAVA collection is made from genuine leather, one at a time, at our workshop in Bengaluru.
            </p>
            <p>
              Real leather softens, shines, and deepens in colour the more it is carried. We never use cheap plastic bonding or synthetic vinyl fillers. If you want to know exactly which leather a piece uses or how it will age, ask us and we will tell you plainly.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-semibold uppercase tracking-wider text-espresso">
            <Link href="/about" className="link-line inline-flex items-center gap-1.5 hover:text-saddle-deep transition-colors">
              <span>Read Our Full Story</span>
              <ArrowRight size={13} />
            </Link>
            <Link href="/leather-guide" className="link-line inline-flex items-center gap-1.5 hover:text-saddle-deep transition-colors">
              <span>Leather Care Guide</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right Column: 4 Foundational Pillars */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-espresso/15 bg-ivory p-6 rounded-xs flex flex-col justify-between hover:border-espresso/40 hover:shadow-md transition-all">
            <ShieldCheck size={26} className="text-saddle-deep" strokeWidth={1.5} />
            <div className="mt-6">
              <h4 className="font-display text-lg text-espresso font-semibold">100% Genuine Hides</h4>
              <p className="mt-1.5 text-xs text-charcoal/70 leading-relaxed">
                Listed as genuine leather in the catalogue; two pieces pair full-grain leather with heavy canvas.
              </p>
            </div>
          </div>

          <div className="border border-espresso/15 bg-ivory p-6 rounded-xs flex flex-col justify-between hover:border-espresso/40 hover:shadow-md transition-all">
            <Layers size={26} className="text-saddle-deep" strokeWidth={1.5} />
            <div className="mt-6">
              <h4 className="font-display text-lg text-espresso font-semibold">One Piece at a Time</h4>
              <p className="mt-1.5 text-xs text-charcoal/70 leading-relaxed">
                Most pieces are curated single items, so what you see in the catalogue is the exact piece delivered.
              </p>
            </div>
          </div>

          <div className="border border-espresso/15 bg-ivory p-6 rounded-xs flex flex-col justify-between hover:border-espresso/40 hover:shadow-md transition-all">
            <Compass size={26} className="text-saddle-deep" strokeWidth={1.5} />
            <div className="mt-6">
              <h4 className="font-display text-lg text-espresso font-semibold">Bengaluru Studio</h4>
              <p className="mt-1.5 text-xs text-charcoal/70 leading-relaxed">
                Handcrafted locally with direct updates from our workshop bench directly to your phone.
              </p>
            </div>
          </div>

          <div className="border border-espresso/15 bg-ivory p-6 rounded-xs flex flex-col justify-between hover:border-espresso/40 hover:shadow-md transition-all">
            <PenTool size={26} className="text-saddle-deep" strokeWidth={1.5} />
            <div className="mt-6">
              <h4 className="font-display text-lg text-espresso font-semibold">Made for You</h4>
              <p className="mt-1.5 text-xs text-charcoal/70 leading-relaxed">
                Ask for your initials, laptop dimensions, or special strap lengths to be added when ordering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
