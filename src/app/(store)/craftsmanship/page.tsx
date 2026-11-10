"use client";

import Link from "next/link";
import {
  Check,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { HeritageSeal } from "@/components/heritage/HeritageSeal";
import { HeritageFlourish } from "@/components/heritage/HeritageFlourish";
import { PackagingExperience } from "@/components/heritage/PackagingExperience";
import { useDemoStore } from "@/lib/store";
import { whatsappLink } from "@/lib/whatsapp";

export default function CraftsmanshipPage() {
  const settings = useDemoStore((s) => s.settings);

  const stages = [
    {
      num: "01",
      title: "Sustainable Plant Bark Tanning",
      desc: "Unlike fast-fashion factories that bathe hides in toxic chromium salts, our leather is slowly steeped in natural extracts of babul tree bark, myrobalan, and acacia nuts. The process takes weeks, yielding an earthen aroma and a hide that ages with a glowing amber patina.",
      tag: "Organic & Biodegradable",
    },
    {
      num: "02",
      title: "Hide Inspection & Dense Cut Selection",
      desc: "Every hide is unrolled and inspected by hand under natural daylight. We inspect grain density, thickness, and natural character. Only the densest bend and butt portions are selected for high-stress straps and bag bottoms.",
      tag: "Zero Synthetic Fillers",
    },
    {
      num: "03",
      title: "Pattern Drafting & Hand Cutting",
      desc: "We do not use high-speed automated laser cutters that singe leather fibers. Every panel is hand-marked with traditional brass scoring compasses and carved with razor-sharp round knives, following the natural grain direction.",
      tag: "Individual Alignment",
    },
    {
      num: "04",
      title: "Traditional Hand Saddle-Stitching",
      desc: "The hallmark of heirloom leathercraft. Two blunted needles pass simultaneously through every single hand-punched awl hole using waxed bonded thread. Even if one thread is severed after decades, the adjoining stitches will never unravel.",
      tag: "Lifetime Seam Integrity",
    },
    {
      num: "05",
      title: "Edge Burnishing with Nilgiri Beeswax",
      desc: "Raw cut edges are carefully beveled, moistened, and vigorously rubbed with hardwood slickers using pure organic beeswax from the Nilgiri hills. Natural friction heat melts the wax into the grain fibers, creating a glass-smooth waterproof seal.",
      tag: "Natural Edge Protection",
    },
    {
      num: "06",
      title: "Solid Cast Brass & 24K Gold Monogram",
      desc: "Hardware is hand-cast in solid brass with an antique brushed patina that resists coastal and tropical corrosion. Your chosen initials are impressed into the hide with a heated brass die and 24K gold foil.",
      tag: "Cast Brass & Real Gold",
    },
  ];

  return (
    <div className="shell py-12 sm:py-20 space-y-16 sm:space-y-24">
      {/* Editorial Header */}
      <div className="max-w-3xl border-b border-espresso/15 pb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-serif text-[0.82rem] text-brass tracking-wider select-none font-medium">
            ಕೈಯಿಂದ ಮಾಡಿದ ಕರಕುಶಲತೆ
          </span>
          <span className="h-1 w-1 rounded-full bg-brass/60" />
          <span className="eyebrow text-saddle-deep">BASAVA Atelier Standards</span>
        </div>
        <h1 className="display-lg text-espresso mt-2">
          The Art of Making<br />
          <span className="italic font-normal">the Old-Fashioned Way.</span>
        </h1>
        <p className="lede mt-4 text-charcoal/80 leading-relaxed">
          In an era of mass-produced plastic shortcuts and throwaway consumerism, BASAVA builds bags designed to outlive trends. Here is our exact, step-by-step master artisan pipeline.
        </p>
      </div>

      {/* Craftsmanship Hero Banner with Heritage Seal */}
      <div className="relative border border-espresso/20 bg-paper p-8 sm:p-14 rounded-xs shadow-md grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8 space-y-4">
          <span className="eyebrow text-saddle-deep">Material Integrity</span>
          <h2 className="display-md text-espresso">Why Real Leather Matters</h2>
          <p className="text-sm text-charcoal/85 leading-relaxed">
            Most modern &quot;vegan&quot; bags are actually synthetic Polyurethane (PU) and PVC plastics derived from petroleum. They degrade within 12–18 months, begin peeling at the handles, and sit in landfills for centuries.
          </p>
          <p className="text-sm text-charcoal/85 leading-relaxed">
            Real vegetable-tanned leather is a durable byproduct of agricultural farming. It breathes, absorbs natural oils from your hands, develops rich depth of colour, and can be repaired, conditioned, and cherished for decades.
          </p>
        </div>
        <div className="lg:col-span-4 flex justify-center">
          <HeritageSeal size={130} rotating={true} />
        </div>
      </div>

      {/* 6-Stage Master Pipeline */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="eyebrow text-saddle-deep">Handmade in Bengaluru</span>
          <h2 className="display-md text-espresso mt-1">The 6-Stage Atelier Method</h2>
          <p className="text-xs text-charcoal/70 mt-2">
            Every BASAVA bag requires 18 to 28 hours of concentrated artisan bench work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {stages.map((st) => (
            <div
              key={st.num}
              className="border border-espresso/15 bg-paper p-6 sm:p-8 rounded-xs flex flex-col justify-between hover:border-espresso hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b border-espresso/10 pb-4">
                  <span className="font-mono text-2xl font-bold text-saddle-deep">{st.num}</span>
                  <span className="text-[0.625rem] font-bold uppercase tracking-wider bg-linen text-espresso px-2 py-0.5 rounded-xs">
                    {st.tag}
                  </span>
                </div>
                <h3 className="font-display text-xl text-espresso mt-4">{st.title}</h3>
                <p className="text-xs text-charcoal/80 leading-relaxed mt-2.5">{st.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-espresso/8 flex items-center gap-1.5 text-[0.6875rem] font-semibold text-saddle-deep">
                <Check size={13} className="text-emerald-700" />
                <span>Verified Handcraft Step</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Royal Packaging Experience Component */}
      <div className="border-t border-espresso/15 pt-16">
        <HeritageFlourish variant="lotus" className="mb-6" />
        <PackagingExperience />
      </div>

      {/* Direct WhatsApp & AI Studio Callout */}
      <div className="border border-espresso/20 bg-linen/60 p-8 sm:p-12 rounded-xs flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="eyebrow text-saddle-deep">Bespoke Commissions</span>
          <h2 className="display-sm text-espresso mt-1">Ready to Create an Original Piece?</h2>
          <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">
            Talk to our AI Bespoke Designer to customize your leather hide, proportions, and monogram, or message our master craftsman on WhatsApp.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <Link href="/custom" className="btn btn-solid flex items-center gap-2 shadow-md">
            <Sparkles size={14} className="text-sand" />
            <span>Launch Bespoke Studio</span>
          </Link>
          <a
            href={whatsappLink(settings.whatsappNumber, "Hello! I am reading your craftsmanship guide and want to consult on a custom piece.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline flex items-center gap-2"
          >
            <MessageCircle size={15} />
            <span>WhatsApp Craftsman</span>
          </a>
        </div>
      </div>
    </div>
  );
}
