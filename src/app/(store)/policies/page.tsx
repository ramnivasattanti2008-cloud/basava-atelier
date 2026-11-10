import Link from "next/link";
import { brand } from "@/data/brand";

export default function PoliciesPage() {
  return (
    <div className="shell py-12 sm:py-20 max-w-3xl">
      <div className="border-b border-espresso/15 pb-8">
        <span className="eyebrow">Store Policies</span>
        <h1 className="display-lg mt-3">Delivery & Terms</h1>
        <p className="lede mt-3">
          Transparent operational principles for catalogue orders and bespoke commissions.
        </p>
      </div>

      <div className="mt-12 space-y-16 text-sm text-charcoal/85 leading-relaxed">
        {/* Delivery */}
        <section id="delivery" className="scroll-mt-28 space-y-4">
          <h2 className="font-display text-2xl text-espresso">1. Delivery & Dispatch</h2>
          <p>
            Standard catalogue orders are packaged within 2 business days and delivered across India within <strong>7 to 10 business days</strong> via tracked courier services.
          </p>
          <p>
            Each leather bag is packaged in a breathable cotton dust-bag and boxed with protective padding. Bespoke custom commissions typically require <strong>14 to 21 business days</strong> to account for pattern cutting, hide preparation, and hand assembly.
          </p>
        </section>

        {/* Returns */}
        <section id="returns" className="scroll-mt-28 space-y-4 border-t border-espresso/12 pt-8">
          <h2 className="font-display text-2xl text-espresso">2. Returns & Exchanges</h2>
          <p>
            Because our collection comprises limited handcrafted pieces (many of which are single, unique items), returns are accepted within <strong>7 calendar days</strong> of delivery if the item remains unused, in original condition with tags and dust-bag intact.
          </p>
          <p>
            <em>Custom & Personalised Pieces:</em> Bags engraved with personal initials or constructed to custom dimensions cannot be returned unless a manufacturing defect or stitching defect is identified upon arrival.
          </p>
        </section>

        {/* Privacy */}
        <section id="privacy" className="scroll-mt-28 space-y-4 border-t border-espresso/12 pt-8">
          <h2 className="font-display text-2xl text-espresso">3. Privacy Policy</h2>
          <p>
            We collect only the essential personal details required to process your order, arrange courier dispatch, or respond to your custom brief (name, delivery address, email, phone number).
          </p>
          <p>
            We never sell, rent, or share customer contact data with third-party advertisers. All demonstration data on this site is stored locally in your browser session.
          </p>
        </section>

        {/* Terms */}
        <section id="terms" className="scroll-mt-28 space-y-4 border-t border-espresso/12 pt-8">
          <h2 className="font-display text-2xl text-espresso">4. Terms of Sale & Demonstration Notice</h2>
          <div className="border border-saddle-deep/40 bg-linen/50 p-4 text-xs text-charcoal/80 space-y-2">
            <p className="font-semibold text-espresso uppercase tracking-wider">
              {brand.demo.label}
            </p>
            <p>{brand.demo.disclaimer}</p>
          </div>
          <p>
            Prices are listed in Indian Rupees (₹). Product images depict authentic catalogue items from {brand.retail.name}. Natural variations in leather grain, minor creases, and organic character are intrinsic qualities of natural hides and not defects.
          </p>
        </section>
      </div>
    </div>
  );
}
