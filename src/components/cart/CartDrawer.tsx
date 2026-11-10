"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { formatINR, maxQuantity } from "@/lib/format";
import { useCart, type CartEntry } from "@/lib/hooks";
import { useDemoStore } from "@/lib/store";
import { Overlay } from "@/components/ui/Overlay";
import { ProductImage } from "@/components/ui/ProductImage";
import { DemoTag, QuantityStepper } from "@/components/ui/bits";

export function CartLineRow({ entry, onNavigate, compact = false }: { entry: CartEntry; onNavigate?: () => void; compact?: boolean }) {
  const setLineQuantity = useDemoStore((s) => s.setLineQuantity);
  const removeLine = useDemoStore((s) => s.removeLine);
  const { line, product, lineTotal } = entry;
  const unavailable = maxQuantity(product) === 0;

  return (
    <li className="flex gap-4 border-b border-espresso/12 py-5">
      <Link
        href={`/products/${product.slug}`}
        onClick={onNavigate}
        className={`photo-tile relative block shrink-0 ${compact ? "h-24 w-20" : "h-28 w-24 sm:h-36 sm:w-28"}`}
        aria-label={product.name}
      >
        <ProductImage src={product.images[0]} alt="" sizes="112px" className="p-1.5" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/products/${product.slug}`} onClick={onNavigate} className="font-display text-[1.12rem] leading-tight text-espresso hover:underline hover:underline-offset-4">
            {product.name}
          </Link>
          <button
            type="button"
            onClick={() => removeLine(line.key)}
            className="-mr-2 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center text-walnut hover:text-espresso"
            aria-label={`Remove ${product.name} from your bag`}
          >
            <X size={16} strokeWidth={1.4} aria-hidden />
          </button>
        </div>
        {line.colour && <p className="mt-1 text-xs text-charcoal/70">Colour: {line.colour}</p>}
        {unavailable && <p className="mt-1 text-xs font-medium text-[#8e2f2a]">No longer in stock — remove to continue.</p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            max={Math.max(1, maxQuantity(product))}
            onChange={(next) => setLineQuantity(line.key, next)}
            label={`Quantity for ${product.name}`}
          />
          <p className="tabular text-sm font-medium text-espresso">{formatINR(lineTotal)}</p>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const open = useDemoStore((s) => s.cartOpen);
  const setCartOpen = useDemoStore((s) => s.setCartOpen);
  const { entries, count, subtotal } = useCart();
  const close = () => setCartOpen(false);

  return (
    <Overlay open={open} onClose={close} label="Your bag" side="right">
      <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-espresso/15 px-6">
        <p className="font-display text-2xl text-espresso">
          Your bag <span className="tabular align-middle font-sans text-xs font-medium tracking-wider text-saddle-deep">({count})</span>
        </p>
        <button type="button" onClick={close} className="-mr-2 flex h-11 w-11 items-center justify-center" aria-label="Close bag">
          <X size={22} strokeWidth={1.4} aria-hidden />
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-1 flex-col items-start justify-center px-6">
          <p className="display-sm">Nothing here yet.</p>
          <p className="mt-3 max-w-xs text-sm text-charcoal/75">Most pieces in the collection are single items — when you find yours, it will wait here.</p>
          <Link href="/shop" onClick={close} className="btn btn-solid mt-7">
            Explore the collection
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto px-6">
            {entries.map((entry) => (
              <CartLineRow key={entry.line.key} entry={entry} onNavigate={close} compact />
            ))}
          </ul>
          <div className="shrink-0 border-t border-espresso/15 bg-paper px-6 pb-6 pt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-sm uppercase tracking-[0.14em] text-walnut">Subtotal</p>
              <p className="tabular font-display text-2xl text-espresso">{formatINR(subtotal)}</p>
            </div>
            <p className="mt-2 flex items-center gap-2 text-xs text-charcoal/70">
              <DemoTag>Demo</DemoTag> No payment is taken in this demonstration.
            </p>
            <Link href="/checkout" onClick={close} className="btn btn-solid btn-tactile shimmer-badge mt-5 w-full shadow-md hover:shadow-lg">
              Checkout
            </Link>
            <Link href="/cart" onClick={close} className="mt-4 block text-center text-[0.78rem] font-medium uppercase tracking-[0.16em] text-espresso">
              <span className="link-line">View bag</span>
            </Link>
          </div>
        </>
      )}
    </Overlay>
  );
}
