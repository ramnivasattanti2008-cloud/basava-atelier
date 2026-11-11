"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Check, Compass, Layers, PenTool, ShieldCheck, Sparkles } from "lucide-react";
import { StitchLine } from "@/components/motion/StitchLine";
import { BrassBorderHighlight } from "@/components/motion/BrassBorderHighlight";
import { RevealText } from "@/components/motion/RevealText";
import { BlockPrintPattern } from "@/components/motion/BlockPrintPattern";

interface CraftStep {
  number: string;
  kannadaNum: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  spec: string;
}

const CRAFT_STEPS: CraftStep[] = [
  {
    number: "01",
    kannadaNum: "ಹಂತ ೦೧",
    title: "Hide Curation & Hand-Cutting",
    subtitle: "Panels aligned along natural grain lines",
    description: "Every panel is selected individually from 100% botanical tree-bark tanned hides. We inspect natural growth marks, stretch density, and pore uniformity before cutting panels with curved carbon-steel skiving blades.",
    tag: "Bengaluru Bench",
    spec: "Zero synthetic fillers · 1.6mm–2.0mm hide caliper",
  },
  {
    number: "02",
    kannadaNum: "ಹಂತ ೦೨",
    title: "Two-Needle Saddle Stitching",
    subtitle: "French Lin Câblé waxed linen thread",
    description: "French diamond awls punch holes at an exact 45° angle (7 stitches per inch). Two harness needles pass through each hole under opposing tension. Unlike machine chain-stitches, saddle stitching will never run or unravel.",
    tag: "Hand Saddle-Stitched",
    spec: "Lin Câblé #532 natural flax thread · 45° awl pitch",
  },
  {
    number: "03",
    kannadaNum: "ಹಂತ ೦೩",
    title: "Sand-Cast Moradabad Brass",
    subtitle: "100% solid virgin CuZn35 copper-zinc alloy",
    description: "No cheap zamak zinc or electroplated plastic. Our D-rings, buckles, and rivets are poured into green sand molds in Moradabad. Load-tested to 85 kg, solid golden brass through and through.",
    tag: "Moradabad Foundry",
    spec: "Non-magnetic solid alloy · 830 N tensile strength",
  },
  {
    number: "04",
    kannadaNum: "ಹಂತ ೦೪",
    title: "Nilgiri Forest Beeswax Dressing",
    subtitle: "Glass-burnished multi-stage edge seal",
    description: "Plastic edge paint dries and peels in Indian monsoons. Instead, our edges are beveled at 45°, wet-sanded to 1200 grit, and hand-rubbed with unrefined wild forest beeswax from Nilgiri tribal communities.",
    tag: "Wild Nilgiri Wax",
    spec: "Zero peeling synthetic acrylic · Self-buffing finish",
  },
];

export function TheArtOfCraftSection() {
  return (
    <section className="relative py-20 sm:py-28 bg-[#18100A] text-[#FAF7F2] overflow-hidden border-b border-[#C5A059]/25">
      {/* 1. Indian Hand-Block Print Geometric Background Accent */}
      <BlockPrintPattern tone="dark-heritage" density="sparse" />

      {/* 2. Top Specular Sand-Cast Brass Hairline */}
      <BrassBorderHighlight position="top" glow={true} />

      {/* 3. Animated Saddle Stitch Line Running Across Section Top */}
      <div className="mb-10">
        <StitchLine tone="brass" />
      </div>

      <div className="shell relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-serif text-xs text-[#F5D77F] tracking-widest uppercase">
              ಕರಕುಶಲ ಪರಂಪರೆ · THE ATELIER STANDARD
            </span>
          </div>
          <RevealText as="h2" className="display-lg sm:display-xl text-[#FAF7F2] font-display">
            The Art of Handcrafting
          </RevealText>
          <p className="mt-4 text-sm sm:text-base text-[#D8CEBD]/85 leading-relaxed font-sans">
            We reject the shortcuts of industrial assembly lines. Every BASAVA bag is handcrafted one at a time in our Bengaluru workshop using four foundational tenets of traditional saddlery.
          </p>
        </div>

        {/* 4 Craft Tenet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CRAFT_STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group border border-[#C5A059]/25 bg-[#1F140D]/80 p-6 sm:p-7 rounded-xs flex flex-col justify-between hover:border-[#C5A059]/60 hover:bg-[#251810] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Subtle Corner Stitch Notch */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#C5A059]/40 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between border-b border-[#C5A059]/15 pb-4 text-xs font-mono">
                  <span className="font-bold text-lg text-[#F5D77F] tracking-wider">{step.number}</span>
                  <span className="text-[0.625rem] text-[#D8CEBD]/60 uppercase tracking-widest">{step.kannadaNum}</span>
                </div>

                <div className="mt-4">
                  <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/15 px-2 py-0.5 rounded-2xs inline-block mb-2">
                    {step.tag}
                  </span>
                  <h3 className="font-display text-xl text-[#FAF7F2] group-hover:text-[#F5D77F] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#E8CB85]/80 font-serif italic mt-0.5">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-[#D8CEBD]/80 mt-3 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#C5A059]/15 text-[0.6875rem] font-mono text-[#F5D77F]/90">
                <span>{step.spec}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated Stitch Line Divider */}
        <div className="my-14">
          <StitchLine tone="brass" />
        </div>

        {/* Bottom Editorial Callout */}
        <div className="border border-[#C5A059]/30 bg-[#24170E]/70 p-8 sm:p-10 rounded-xs flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xs">
          <div className="max-w-2xl">
            <span className="eyebrow text-[#F5D77F]">Heirloom Longevity</span>
            <h3 className="font-display text-2xl text-[#FAF7F2] mt-1">
              Constructed to Outlive Mass-Manufactured Goods
            </h3>
            <p className="text-xs sm:text-sm text-[#D8CEBD]/85 mt-2 leading-relaxed">
              When a thread wears down on ordinary factory bags, the entire lockstitch unravels. With BASAVA saddle-stitching and solid sand-cast brass, your bag can be conditioned, repaired, and passed down across generations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/craftsmanship"
              className="btn btn-light btn-tactile text-xs font-bold tracking-widest text-espresso bg-[#FAF7F2] hover:bg-[#EADFCB] flex items-center gap-2"
            >
              <span>Explore Workshop Guide</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
