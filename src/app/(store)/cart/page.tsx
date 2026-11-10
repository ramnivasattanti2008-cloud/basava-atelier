"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { formatINR } from "@/lib/format";
import { useCart } from "@/lib/hooks";
import { useDemoStore } from "@/lib/store";
import { CartLineRow } from "@/components/cart/CartDrawer";

export default function CartPage() {
  const { entries, count, subtotal } = useCart();
  const clearCart = useDemoStore((s) => s.clearCart);

  if (entries.length === 0) {
    return (
      <div className="shell py-20 max-w-xl mx-auto text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linen border border-espresso/20 text-espresso mb-6">
          <ShoppingBag size={28} className="text-saddle-deep" strokeWidth={1.5} />
        </div>
        <h1 className="display-md">Your Bag is Empty</h1>
        <p className="lede mt-3">
          Explore our collection of 40 handcrafted leather pieces and add items to your bag.
        </p>
        <Link href="/shop" className="btn btn-solid mt-8 inline-flex items-center gap-2">
          Browse Collection <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-12 sm:py-20 max-w-4xl">
      <div className="border-b border-espresso/15 pb-8 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <span className="eyebrow">Shopping Bag</span>
          <h1 className="display-lg mt-2">
            Your Bag <span className="tabular font-sans text-base font-semibold text-saddle-deep">({count} items)</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold uppercase tracking-wider text-saddle-deep hover:underline"
        >
          Clear entire bag
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Item List */}
        <div className="lg:col-span-7">
          <ul className="divide-y divide-espresso/15">
            {entries.map((entry) => (
              <CartLineRow key={entry.line.key} entry={entry} />
            ))}
          </ul>

          <div className="mt-8">
            <Link href="/shop" className="text-xs font-semibold uppercase tracking-wider text-espresso inline-flex items-center gap-1.5 hover:underline">
              <ArrowLeft size={13} /> Continue browsing pieces
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-5">
          <div className="border border-espresso/15 bg-paper p-6 sm:p-8 rounded-xs space-y-6">
            <h2 className="font-display text-2xl text-espresso">Order Summary</h2>

            <div className="space-y-3 text-sm border-y border-espresso/12 py-4">
              <div className="flex justify-between text-charcoal/80">
                <span>Subtotal ({count} items)</span>
                <span className="tabular font-medium text-espresso">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal/80">
                <span>Standard Delivery (7–10 days)</span>
                <span className="text-xs uppercase font-semibold text-saddle-deep">Complimentary</span>
              </div>
              <div className="flex justify-between text-charcoal/80">
                <span>Packaging (Cotton Dust-Bag)</span>
                <span className="text-xs uppercase font-semibold text-saddle-deep">Included</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-base font-semibold text-espresso">Estimated Total</span>
              <span className="tabular font-display text-3xl font-bold text-espresso">{formatINR(subtotal)}</span>
            </div>

            <div className="pt-2">
              <Link href="/checkout" className="btn btn-solid w-full flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={15} />
              </Link>
            </div>

            <div className="pt-4 border-t border-espresso/10 flex items-center gap-2.5 text-xs text-charcoal/70">
              <ShieldCheck size={18} className="text-saddle-deep shrink-0" />
              <span>Simulated demo checkout. No financial transactions.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
