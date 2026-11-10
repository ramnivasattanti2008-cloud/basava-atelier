"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Sparkles, Compass, CheckCircle2, ChevronRight } from "lucide-react";
import { cx } from "@/lib/format";
import { HeritageFlourish } from "./HeritageFlourish";

interface ProvenanceNode {
  id: string;
  region: string;
  kannadaRegion: string;
  craftTitle: string;
  craftSub: string;
  story: string;
  coordinates: { x: number; y: number }; // Percentage for interactive map pin
  materialDetails: string[];
  artisanQuote: string;
}

const PROVENANCE_NODES: ProvenanceNode[] = [
  {
    id: "bengaluru",
    region: "Bengaluru, Karnataka",
    kannadaRegion: "ಬೆಂಗಳೂರು · ಕಾರ್ಯಾಗಾರ",
    craftTitle: "Master Saddlery & Hand-Stitching",
    craftSub: "ಕೈ ಹೊಲಿಗೆ ಮತ್ತು ವಿನ್ಯಾಸ",
    story:
      "In our central Bengaluru atelier, master leather artisans with decades of saddlery experience hand-cut every panel. Using traditional saddler's clam clamps, each seam is sewn with two needles and waxed linen thread at 7 stitches per inch, creating a seam that outlasts machine lockstitches by decades.",
    coordinates: { x: 42, y: 72 },
    materialDetails: [
      "Traditional two-needle hand saddle-stitch",
      "Hand-skived and beveled edges",
      "Hot brass foil 24k gold stamping",
      "Individually numbered atelier inspection tag",
    ],
    artisanQuote:
      "“When you pull both needles through the same awl hole with equal tension, you are locking two lives together. A machine stitches for speed; we stitch for eternity.” — Master Craftsman Shivanna, Bengaluru Atelier",
  },
  {
    id: "tamilnadu",
    region: "Ambur & Vaniyambadi, Tamil Nadu",
    kannadaRegion: "ತಮಿಳುನಾಡು · ಸಸ್ಯಜನ್ಯ ಹದಗೊಳಿಸುವಿಕೆ",
    craftTitle: "Botanical Bark & Nut Tanning",
    craftSub: "ವನಸ್ಪತಿ ಹದಗೊಳಿಸುವಿಕೆ",
    story:
      "South India's river valleys have nurtured botanical tanning for over two centuries. Our hides soak for 45 continuous days in massive wooden drums filled with organic Acacia arabica (Babul) bark and Terminalia chebula (Myrobalan) nuts. Zero toxic chrome salts. The resulting leather breathes, patinas naturally, and smells of dry forest earth.",
    coordinates: { x: 50, y: 76 },
    materialDetails: [
      "100% Chrome-Free Vegetable Tanning",
      "Acacia bark & Myrobalan natural tannins",
      "Full-grain hide with intact dermal epidermis",
      "Biodegradable and eco-conscious circularity",
    ],
    artisanQuote:
      "“The tree bark gives the hide its soul. You cannot rush tree roots, and you cannot rush real leather.”",
  },
  {
    id: "nilgiris",
    region: "Nilgiri Biosphere, Western Ghats",
    kannadaRegion: "ನೀಲಗಿರಿ ಬೆಟ್ಟಗಳು · ಶುದ್ಧ ಜೇನುಮೇಣ",
    craftTitle: "Wild Forest Beeswax Edge Dressing",
    craftSub: "ಜೇನುಮೇಣದ ಹೊಳಪು",
    story:
      "Instead of applying plastic-based chemical edge paints that crack and peel over time, every raw edge of a BASAVA bag is repeatedly smoothed with bone folders and rubbed with raw, unrefined beeswax collected from the shola forests of the Nilgiri hills. Friction melts the wax deep into the leather grain, sealing it against rain and moisture with a natural, glass-like sheen.",
    coordinates: { x: 36, y: 79 },
    materialDetails: [
      "Pure organic Nilgiri mountain forest beeswax",
      "Multi-stage manual friction burnishing",
      "Completely waterproof and peel-resistant edge",
      "Natural warm honey-comb fragrance",
    ],
    artisanQuote:
      "“A good edge should feel like smooth sea glass. Once sealed with forest wax, water simply beads and rolls away.”",
  },
  {
    id: "moradabad",
    region: "Moradabad & Udupi",
    kannadaRegion: "ಉಡುಪಿ ಮತ್ತು ಮೊರಾದಾಬಾದ್ · ಹಿತ್ತಾಳೆ",
    craftTitle: "Sand-Cast Solid Brass Hardware",
    craftSub: "ಹಿತ್ತಾಳೆ ಕರಕುಶಲತೆ",
    story:
      "Every buckle, swivel snap, rivet, and zipper pull on a BASAVA bag is cast from solid virgin brass using ancient sand-casting techniques. Unlike zinc or steel alloy hardware found in fast-fashion bags, our brass is solid metal through-and-through. It never flakes, rusts, or chips, developing a rich antique golden luster alongside your leather.",
    coordinates: { x: 48, y: 28 },
    materialDetails: [
      "100% Solid virgin brass casting",
      "Zero hollow zinc alloy or thin electroplating",
      "High-tensile stress-tested D-rings and clasps",
      "Develops authentic warm antique luster",
    ],
    artisanQuote:
      "“Solid brass carries weight. When you hold it in your hand, you immediately feel the difference between authentic metal and hollow vanity.”",
  },
  {
    id: "mysore",
    region: "Mysore & Kashmir",
    kannadaRegion: "ಮೈಸೂರು ರೇಷ್ಮೆ · ನೈಸರ್ಗಿಕ ಲೈನಿಂಗ್",
    craftTitle: "Mulberry Silk & Heavy Cotton Linings",
    craftSub: "ರೇಷ್ಮೆ ಮತ್ತು ಕ್ಯಾನ್ವಾಸ್ ಲೈನಿಂಗ್",
    story:
      "The interior of a luxury bag deserves equal reverence. For our bespoke bags, we source rich, lustrous mulberry raw silks from Mysore and tightly woven heavy organic cotton canvas. Each lining is soft enough to protect your spectacles, laptop, and valuables, yet engineered to endure decades of daily retrieval without tearing.",
    coordinates: { x: 40, y: 75 },
    materialDetails: [
      "Mysore mulberry raw silk jacquard options",
      "14oz Unbleached organic cotton duck canvas",
      "Reinforced interior zipper pockets",
      "Water-repellent protective treatment",
    ],
    artisanQuote:
      "“Luxury is what you feel when you reach inside in the dark without looking.”",
  },
];

export function IndianArtisanalMap() {
  const [activeNode, setActiveNode] = useState<ProvenanceNode>(PROVENANCE_NODES[0]);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-b border-espresso/15 bg-[#fbf8f2]">
      {/* Background Subtle Sandalwood Tone */}
      <div className="absolute inset-0 opacity-40 jaali-pattern pointer-events-none" />

      <div className="shell relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Compass size={14} className="text-brass animate-spin [animation-duration:30s]" />
            <span className="font-serif text-xs text-brass tracking-widest uppercase font-semibold">
              ಭಾರತೀಯ ಕರಕುಶಲತೆ · The Heritage Provenance
            </span>
            <Compass size={14} className="text-brass animate-spin [animation-duration:30s]" />
          </div>
          <h2 className="display-md text-espresso">
            The Indian Craft Journey
          </h2>
          <p className="mt-3 text-sm text-charcoal/80 leading-relaxed font-sans">
            Every BASAVA bag is born from centuries of Indian artisanal knowledge—spanning the bark-tanning riverbeds of South India, the beeswax of the Nilgiri hills, and our master saddle-makers in Bengaluru.
          </p>
          <HeritageFlourish variant="lotus" className="my-3 text-brass/80" />
        </div>

        {/* Interactive Master Provenance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Subcontinent Craft Nodes */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            <p className="text-[0.68rem] uppercase tracking-wider text-saddle-deep font-semibold mb-1 flex items-center gap-1.5">
              <MapPin size={12} className="text-brass" /> Select An Artisanal Province:
            </p>
            {PROVENANCE_NODES.map((node) => {
              const active = node.id === activeNode.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNode(node)}
                  className={cx(
                    "text-left p-4 rounded-xl border transition-all duration-300 relative group flex items-center justify-between",
                    active
                      ? "bg-espresso text-ivory border-espresso shadow-lg scale-[1.01]"
                      : "bg-paper hover:bg-linen/70 text-charcoal border-espresso/15 hover:border-brass/50 shadow-xs"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cx(
                        "w-9 h-9 rounded-lg flex items-center justify-center font-serif text-sm font-bold border transition-colors",
                        active
                          ? "bg-brass text-espresso border-brass"
                          : "bg-linen text-walnut border-espresso/15 group-hover:border-brass"
                      )}
                    >
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4
                        className={cx(
                          "font-sans text-xs sm:text-sm font-bold tracking-tight",
                          active ? "text-ivory" : "text-espresso"
                        )}
                      >
                        {node.craftTitle}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={cx(
                            "text-[0.72rem]",
                            active ? "text-sand" : "text-charcoal/70"
                          )}
                        >
                          {node.region}
                        </span>
                        <span className="text-[0.65rem] text-brass/90 font-serif">
                          · {node.kannadaRegion}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    size={16}
                    className={cx(
                      "transition-transform duration-300",
                      active ? "text-brass translate-x-1" : "text-charcoal/40 group-hover:text-brass"
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Card on the Selected Node */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl bg-paper border border-espresso/15 p-6 sm:p-10 shadow-xl overflow-hidden"
              >
                {/* Brass Corner Rivets for authentic luggage aesthetic */}
                <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-gradient-to-tr from-[#8d6725] to-[#f7e5b5] shadow-xs" />
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-gradient-to-tr from-[#8d6725] to-[#f7e5b5] shadow-xs" />
                <div className="absolute bottom-4 left-4 h-2 w-2 rounded-full bg-gradient-to-tr from-[#8d6725] to-[#f7e5b5] shadow-xs" />
                <div className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-gradient-to-tr from-[#8d6725] to-[#f7e5b5] shadow-xs" />

                {/* Subtitle & Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[0.68rem] uppercase font-bold tracking-wider bg-brass/15 text-saddle-deep border border-brass/40">
                      {activeNode.region}
                    </span>
                    <span className="font-serif text-xs text-brass font-medium">
                      {activeNode.craftSub}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[0.7rem] text-charcoal/70 font-mono">
                    <Sparkles size={13} className="text-brass" /> Authenticated Origin
                  </div>
                </div>

                <h3 className="display-sm text-espresso mb-3">
                  {activeNode.craftTitle}
                </h3>

                <p className="text-xs sm:text-sm text-charcoal/85 leading-relaxed font-sans mb-6">
                  {activeNode.story}
                </p>

                {/* Verified Material Specs Grid */}
                <div className="bg-linen/60 rounded-xl p-4 sm:p-5 border border-espresso/10 mb-6">
                  <p className="text-[0.68rem] uppercase font-bold tracking-widest text-saddle-deep mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-brass" /> Material & Technique Standards:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeNode.materialDetails.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-espresso/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-brass mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Artisan Quote Box */}
                <blockquote className="border-l-2 border-brass pl-4 sm:pl-5 py-1 text-xs sm:text-sm italic text-walnut font-serif bg-brass/5 rounded-r-lg">
                  {activeNode.artisanQuote}
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

