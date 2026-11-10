import Link from "next/link";
import { ArrowRight, Hammer, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { brand } from "@/data/brand";
import { HeritageSeal } from "@/components/heritage/HeritageSeal";
import { HeritageFlourish } from "@/components/heritage/HeritageFlourish";

export default function AboutPage() {
  return (
    <div className="shell py-12 sm:py-20 max-w-4xl">
      {/* Header */}
      <div className="border-b border-espresso/15 pb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-serif text-xs text-brass tracking-wider select-none font-medium">
              ಕೈಯಿಂದ ಮಾಡಿದ · हस्तनिर्मित
            </span>
            <span className="h-1 w-1 rounded-full bg-brass/60" />
            <span className="eyebrow text-saddle-deep">Our Heritage</span>
          </div>
          <h1 className="display-lg mt-1">The Kris Designs Story</h1>
          <p className="lede mt-3 max-w-2xl">
            Bespoke leather bags, honest materials, and an enduring commitment to craft made stitch by stitch in Bengaluru.
          </p>
        </div>
        <div className="shrink-0 self-center md:self-auto">
          <HeritageSeal size={100} rotating={true} />
        </div>
      </div>

      <HeritageFlourish variant="lotus" className="my-8" />

      {/* Main Narrative */}
      <div className="mt-8 space-y-12 text-sm sm:text-base leading-relaxed text-charcoal/85">
        <section className="space-y-4">
          <h2 className="font-display text-3xl text-espresso">The Maker & The Craft</h2>
          <p>
            <strong>Kris Designs</strong> began with a single conviction: leather goods should be personal, durable, and free from superficial embellishment. In an era of disposable fashion, we wanted to return to the tactile intimacy of natural hides, saddle stitching, and hand-burnished edges.
          </p>
          <p>
            From our Bengaluru workshop, we create bespoke pieces tailored directly to customer ideas. Whether it is an everyday tote proportioned to carry a specific sketchbook or a monogrammed travel sling designed for comfort on the road, our process starts with a conversation and ends with a piece made to last a lifetime.
          </p>
        </section>

        {/* Indian Tanning Heritage Section */}
        <section className="border border-saddle-deep/25 bg-paper p-6 sm:p-8 rounded-xs space-y-4">
          <span className="eyebrow text-brass">Centuries of South Indian Artistry</span>
          <h2 className="font-display text-2xl text-espresso">The Deccan Plateau & Tanning Traditions</h2>
          <p className="text-sm text-charcoal/80 leading-relaxed">
            South India holds one of the world's oldest and most respected traditions of organic vegetable tanning. Centers like Ranipet, Ambur, and Vaniyambadi have for generations mastered tanning with <em>Acacia arabica</em> (Babul bark) and <em>Terminalia chebula</em> (Myrobalan nuts).
          </p>
          <p className="text-sm text-charcoal/80 leading-relaxed">
            Unlike rapid chemical chrome tanneries, natural vegetable tanning preserves the organic breathability and dense fibrous structure of the hide. Each hide retains its subtle earthen fragrance, absorbs natural sunlight, and deepens into a warm, lustrous patina that tells the story of every journey you take together.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="border border-espresso/10 bg-ivory p-4">
              <h4 className="font-display text-base text-espresso">Pure Beeswax Burnishing</h4>
              <p className="text-xs text-charcoal/70 mt-1">Raw cut edges are hand-sanded and sealed with natural Nilgiris beeswax for smooth, weather-resistant bevels.</p>
            </div>
            <div className="border border-espresso/10 bg-ivory p-4">
              <h4 className="font-display text-base text-espresso">Karnataka Brass Hardware</h4>
              <p className="text-xs text-charcoal/70 mt-1">Fittings, rivets, and buckles crafted from solid cast brass that never flakes or rusts under tropical climates.</p>
            </div>
          </div>
        </section>

        {/* Studio Tenets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
          <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between">
            <Hammer size={24} className="text-saddle-deep" />
            <div className="mt-6">
              <h3 className="font-display text-xl text-espresso">Hand Assembled</h3>
              <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                Hand-cut panels, reinforced stress corners, and solid metal hardware chosen for longevity.
              </p>
            </div>
          </div>
          <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between">
            <ShieldCheck size={24} className="text-saddle-deep" />
            <div className="mt-6">
              <h3 className="font-display text-xl text-espresso">Real Hides</h3>
              <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                Only genuine leather with organic character that softens and patinas naturally over years.
              </p>
            </div>
          </div>
          <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between">
            <HeartHandshake size={24} className="text-saddle-deep" />
            <div className="mt-6">
              <h3 className="font-display text-xl text-espresso">Transparent Heritage</h3>
              <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                Clear origins, honest specifications, and direct communication without corporate intermediaries.
              </p>
            </div>
          </div>
        </div>

        <HeritageFlourish variant="divider" />

        <section className="space-y-4">
          <h2 className="font-display text-3xl text-espresso">The Basava Catalogue</h2>
          <p>
            Our online storefront presents forty curated designs drawn from the <em>{brand.retail.name}</em> collection. This range encompasses functional totes, structured crossbodies, compact clutches, and minimalist wristlets.
          </p>
          <div className="border-l-2 border-saddle-deep bg-linen/40 p-4 text-xs text-charcoal/80 italic">
            "{brand.relationship.publicNote}"
          </div>
          <p>
            Each catalogue item reflects the dimensions, colours, and materials documented on the original release, photographed in studio clarity. As an independent artisan workshop, we honor these designs while offering full bespoke customization for customers seeking specific tweaks.
          </p>
        </section>

        {/* CTA */}
        <div className="border-t border-espresso/15 pt-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl text-espresso">Ready to create something custom?</h3>
            <p className="text-xs text-charcoal/70 mt-1">Explore our bespoke ordering studio or converse with the artisan.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/custom" className="btn btn-solid">
              Launch Custom Studio <ArrowRight size={14} />
            </Link>
            <Link href="/shop" className="btn btn-outline">
              Shop Catalogue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

