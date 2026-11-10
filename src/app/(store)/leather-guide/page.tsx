import Link from "next/link";
import { ArrowRight, Award, Droplets, Leaf, Sun, Wind } from "lucide-react";
import { HeritageFlourish } from "@/components/heritage/HeritageFlourish";

export default function LeatherGuidePage() {
  return (
    <div className="shell py-12 sm:py-20 max-w-4xl">
      {/* Header */}
      <div className="border-b border-espresso/15 pb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-serif text-xs text-brass tracking-wider select-none font-medium">
            ಪ್ರಾಕೃತಿಕ ಚರ್ಮ · प्राकृतिक चमड़ा
          </span>
          <span className="h-1 w-1 rounded-full bg-brass/60" />
          <span className="eyebrow text-saddle-deep">Materials & Craftsmanship</span>
        </div>
        <h1 className="display-lg mt-1">The Plain-English Leather Guide</h1>
        <p className="lede mt-4 max-w-2xl">
          Everything you need to know about leather grades, hide layers, natural patina, and how to care for your pieces so they last decades.
        </p>
      </div>

      <HeritageFlourish variant="lotus" className="my-8" />

      {/* 1. Hide Cross-Section Infographic */}
      <section className="mt-12">
        <h2 className="font-display text-3xl text-espresso">The Hide Cross-Section</h2>
        <p className="mt-2 text-sm text-charcoal/80">
          Animal hide consists of distinct cellular layers. How deep the leather is split determines its strength, breathability, and aging characteristics.
        </p>

        <div className="mt-8 border border-espresso/15 bg-paper p-6 sm:p-8 rounded-xs">
          <div className="space-y-4 font-mono text-xs">
            {/* Full Grain Layer */}
            <div className="border border-[#7d5a3a]/40 bg-[#cdb592]/30 p-4 rounded-xs">
              <div className="flex items-center justify-between font-bold text-espresso">
                <span>FULL-GRAIN LAYER (Epidermis & Dense Corium)</span>
                <span className="text-[0.625rem] bg-[#7d5a3a] text-ivory px-2 py-0.5 uppercase">Highest Grade</span>
              </div>
              <p className="font-sans text-xs text-charcoal/80 mt-1">
                Tightly packed vertical fibers. Completely un-sanded. Retains original pores, natural markings, and water resistance. Ages with deep patina.
              </p>
            </div>

            {/* Top Grain Layer */}
            <div className="border border-[#a77b52]/40 bg-[#d9c4a7]/20 p-4 rounded-xs">
              <div className="flex items-center justify-between font-bold text-espresso">
                <span>TOP-GRAIN LAYER</span>
                <span className="text-[0.625rem] bg-[#a77b52] text-ivory px-2 py-0.5 uppercase">Supple & Uniform</span>
              </div>
              <p className="font-sans text-xs text-charcoal/80 mt-1">
                Top few millimeters lightly sanded to eliminate scars or insect marks. Finished with a protective micro-pigment coat. Flexible and stain-resistant.
              </p>
            </div>

            {/* Split / Genuine Layer */}
            <div className="border border-espresso/20 bg-linen/30 p-4 rounded-xs">
              <div className="flex items-center justify-between font-bold text-espresso">
                <span>CORIUM JUNCTION & SPLIT HIDE (Genuine Leather)</span>
                <span className="text-[0.625rem] bg-walnut text-ivory px-2 py-0.5 uppercase">Functional Everyday</span>
              </div>
              <p className="font-sans text-xs text-charcoal/80 mt-1">
                The lower fibrous layer separated from the grain. Embossed with uniform grain stamping or suede finish. Genuine hide with accessible utility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Grades Breakdown */}
      <section className="mt-16 space-y-8">
        <h2 className="font-display text-3xl text-espresso">The Four Main Grades</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-saddle-deep font-semibold">01 / ULTIMATE</span>
              <h3 className="font-display text-2xl text-espresso mt-2">Full-Grain Leather</h3>
              <p className="mt-3 text-xs text-charcoal/80 leading-relaxed">
                Full-grain hide is the highest standard in leathercraft. Because the natural grain is intact, it breathes freely, repels light moisture, and absorbs oils over time to develop a rich, luminous glow known as patina. It is the strongest leather available.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-espresso/10 text-[0.72rem] text-walnut/70">
              <strong>Best for:</strong> Heritage briefcases, heavy carryalls, heirloom pieces.
            </div>
          </div>

          <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-saddle-deep font-semibold">02 / REFINED</span>
              <h3 className="font-display text-2xl text-espresso mt-2">Top-Grain Leather</h3>
              <p className="mt-3 text-xs text-charcoal/80 leading-relaxed">
                Top-grain leather is shaved to ensure consistent thickness and hand-feel. While slightly less fibrous than full-grain, it is thinner, lighter, and more pliable, making it ideal for elegant structured totes and women's luxury shoulder bags.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-espresso/10 text-[0.72rem] text-walnut/70">
              <strong>Best for:</strong> Everyday luxury totes, crossbodies, structured handbags.
            </div>
          </div>

          <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-saddle-deep font-semibold">03 / PRACTICAL</span>
              <h3 className="font-display text-2xl text-espresso mt-2">Genuine Leather</h3>
              <p className="mt-3 text-xs text-charcoal/80 leading-relaxed">
                The term "Genuine Leather" confirms that the material is 100% natural animal hide, rather than synthetic polyurethane (PU). It represents split layers with an embossed grain, offering real leather character at an accessible price point.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-espresso/10 text-[0.72rem] text-walnut/70">
              <strong>Best for:</strong> Casual slings, envelope bags, wristlets, wallets.
            </div>
          </div>

          <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-saddle-deep font-semibold">04 / TEXTURED</span>
              <h3 className="font-display text-2xl text-espresso mt-2">Suede & Nubuck</h3>
              <p className="mt-3 text-xs text-charcoal/80 leading-relaxed">
                Created by abrading the inner split (suede) or outer surface (nubuck) to produce a velvety nap. Warm, tactile, and visually striking, though requiring dedicated water-repellent conditioning to protect against moisture stains.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-espresso/10 text-[0.72rem] text-walnut/70">
              <strong>Best for:</strong> Accent panels, bag linings, soft pouches.
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 South Indian Botanical Vegetable Tanning */}
      <section className="mt-16 border border-saddle-deep/20 bg-linen/35 p-6 sm:p-8 rounded-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Leaf size={16} className="text-saddle-deep" />
            <span className="eyebrow text-brass">Botanical Tanning Tradition</span>
          </div>
          <h2 className="display-sm mt-1 text-espresso">South India's Organic Vegetable Tannins</h2>
          <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">
            Before industrial chrome solutions became widespread, South Indian master tanners perfected slow pit-tanning with indigenous plant barks, seeds, and leaves. This organic craft creates leather that breathes freely, smells rich, and ages with noble dignity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
          <div className="border border-espresso/12 bg-ivory p-5 rounded-xs flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-saddle-deep font-semibold">BOTANICAL 01</span>
              <h3 className="font-display text-lg text-espresso mt-2">Babul Bark (ಬಾಬುಲ್)</h3>
              <p className="mt-2 text-xs text-charcoal/75 leading-relaxed">
                Extracted from mature <em>Acacia arabica</em> trees across the Deccan. High in catechol tannins, giving leather incredible tensile fiber strength and deep amber tones.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-espresso/10 text-[0.6875rem] text-saddle-deep font-semibold uppercase">
              Heavy Carryalls & Totes
            </div>
          </div>

          <div className="border border-espresso/12 bg-ivory p-5 rounded-xs flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-saddle-deep font-semibold">BOTANICAL 02</span>
              <h3 className="font-display text-lg text-espresso mt-2">Avaram Senna (ಆವಾರಂ)</h3>
              <p className="mt-2 text-xs text-charcoal/75 leading-relaxed">
                Sun-dried golden blossoms and leaves from the dry plains of Karnataka and Tamil Nadu. Produces remarkably soft, pale straw hides prized for supple luxury bags.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-espresso/10 text-[0.6875rem] text-saddle-deep font-semibold uppercase">
              Supple Handbags & Slings
            </div>
          </div>

          <div className="border border-espresso/12 bg-ivory p-5 rounded-xs flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-saddle-deep font-semibold">BOTANICAL 03</span>
              <h3 className="font-display text-lg text-espresso mt-2">Myrobalan (ಅಳಲೆಕಾಯಿ)</h3>
              <p className="mt-2 text-xs text-charcoal/75 leading-relaxed">
                Also known as Haritaki fruit. Pyrogallol tannins clarify the hide, setting dyes deeply and providing natural defense against fungal mold in humid monsoon seasons.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-espresso/10 text-[0.6875rem] text-saddle-deep font-semibold uppercase">
              Monsoon-Resilient Finishing
            </div>
          </div>
        </div>
      </section>

      <HeritageFlourish variant="divider" className="my-12" />

      {/* 3. Care & Maintenance */}
      <section id="care" className="mt-16 border-t border-espresso/15 pt-12 space-y-6">
        <div>
          <span className="eyebrow">Longevity Routine</span>
          <h2 className="display-md mt-2">How to Care for Real Leather</h2>
          <p className="text-sm text-charcoal/80 mt-2">
            Quality leather is organic and resilient. With minimal maintenance, your piece will outlive any synthetic equivalent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="flex items-start gap-3.5 border border-espresso/12 bg-paper p-5">
            <Droplets size={22} className="text-saddle-deep shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display text-lg text-espresso">If Caught in the Rain</h4>
              <p className="mt-1 text-xs text-charcoal/80 leading-relaxed">
                Do not blow-dry or place near heaters; heat hardens and cracks the fibers. Gently dab dry with a clean cotton towel and allow to air-dry at room temperature.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 border border-espresso/12 bg-paper p-5">
            <Award size={22} className="text-saddle-deep shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display text-lg text-espresso">Conditioning Every 6 Months</h4>
              <p className="mt-1 text-xs text-charcoal/80 leading-relaxed">
                Apply a dime-sized amount of natural beeswax or lanolin leather cream in circular motions. Buff off excess after 15 minutes to restore suppleness.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 border border-espresso/12 bg-paper p-5">
            <Wind size={22} className="text-saddle-deep shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display text-lg text-espresso">Breathable Storage</h4>
              <p className="mt-1 text-xs text-charcoal/80 leading-relaxed">
                Never seal genuine leather in plastic bags, as moisture gets trapped and causes mildew. Store in the breathable cotton dust-bag provided with your order.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 border border-espresso/12 bg-paper p-5">
            <Sun size={22} className="text-saddle-deep shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display text-lg text-espresso">Sunlight & Fading</h4>
              <p className="mt-1 text-xs text-charcoal/80 leading-relaxed">
                Prolonged direct sunlight through car windshields or window sills will fade dyed pigments. Store in shaded wardrobe shelves when not in use.
              </p>
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div className="mt-12 text-center">
          <Link href="/shop" className="btn btn-solid">
            Explore the Leather Collection <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

