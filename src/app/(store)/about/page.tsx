import Link from "next/link";
import { ArrowRight, Hammer, HeartHandshake, ShieldCheck } from "lucide-react";
import { HeritageSeal } from "@/components/heritage/HeritageSeal";
import { HeritageFlourish } from "@/components/heritage/HeritageFlourish";
import { HeritageAtmosphere } from "@/components/heritage/HeritageAtmosphere";

export default function AboutPage() {
  return (
    <div className="shell py-12 sm:py-20 max-w-4xl">
      {/* Header */}
      <HeritageAtmosphere variant="jali" intensity="subtle">
        <div className="border-b border-espresso/15 pb-10 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-serif text-xs text-brass tracking-wider select-none font-medium">
                ಕೈಯಿಂದ ಮಾಡಿದ · हस्तनिर्मित
              </span>
              <span className="h-1 w-1 rounded-full bg-brass/60" />
              <span className="eyebrow text-saddle-deep">Our Heritage</span>
            </div>
            <h1 className="display-lg mt-1">The BASAVA Story</h1>
            <p className="lede mt-3 max-w-2xl">
              Leather bags and accessories, and bespoke pieces made to order in Bengaluru.
            </p>
          </div>
          <div className="shrink-0 self-center md:self-auto">
            <HeritageSeal size={100} rotating={true} />
          </div>
        </div>
      </HeritageAtmosphere>

      <HeritageFlourish variant="lotus" className="my-8" />

      {/* Main Narrative */}
      <div className="mt-8 space-y-12 text-sm sm:text-base leading-relaxed text-charcoal/85">
        <section className="space-y-4">
          <h2 className="font-display text-3xl text-espresso">The Maker & The Craft</h2>
          <p>
            <strong>BASAVA</strong> makes genuine leather bags and accessories, and takes custom orders for pieces made to a customer’s own brief.
          </p>
          <p>
            From our Bengaluru workshop, we create bespoke pieces tailored directly to customer ideas. Whether it is an everyday tote proportioned to carry a specific sketchbook or a monogrammed travel sling designed for comfort on the road, our process starts with a conversation.
          </p>
        </section>

        {/* Studio Tenets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
          <div className="border border-espresso/15 bg-paper p-6 flex flex-col justify-between">
            <Hammer size={24} className="text-saddle-deep" />
            <div className="mt-6">
              <h3 className="font-display text-xl text-espresso">Hand Assembled</h3>
              <p className="mt-2 text-xs text-charcoal/70 leading-relaxed">
                Each piece is put together by hand in our Bengaluru workshop.
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
          <h2 className="font-display text-3xl text-espresso">The 40-Piece Signature Collection</h2>
          <p>
            Our online storefront presents forty curated designs drawn from the authentic BASAVA catalogue. This range encompasses functional everyday totes, architectural crossbodies, compact clutches, and minimalist wristlets.
          </p>
          <p>
            Each catalogue item reflects the dimensions, colours, and materials documented on the original release, photographed in natural studio clarity. As an independent artisan workshop, we honor these designs while offering full bespoke customization for customers seeking specific tweaks.
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

