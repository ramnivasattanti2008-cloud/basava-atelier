"use client";

import Link from "next/link";
import { CheckCircle2, MessageCircle, Package, Printer, Truck } from "lucide-react";
import { formatDate, formatINR } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { ProductImage } from "@/components/ui/ProductImage";

export default function OrderConfirmationView({ orderId }: { orderId: string }) {
  const orders = useDemoStore((s) => s.orders);
  const settings = useDemoStore((s) => s.settings);

  const order = orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());

  if (!order) {
    return (
      <div className="shell py-20 text-center max-w-md mx-auto">
        <h1 className="display-sm">Order Not Found</h1>
        <p className="mt-2 text-sm text-charcoal/70">
          We could not locate reference #{orderId} in this session.
        </p>
        <Link href="/shop" className="btn btn-solid btn-sm mt-6">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-12 sm:py-20 max-w-3xl">
      <div className="border border-espresso/15 bg-paper p-8 sm:p-12 rounded-xs space-y-8">
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linen border border-espresso/20 text-espresso">
            <CheckCircle2 size={36} className="text-saddle-deep" />
          </div>
          <span className="eyebrow">Order Confirmed</span>
          <h1 className="display-md">Thank You, {order.customer.name.split(" ")[0]}</h1>
          <p className="font-mono text-sm font-semibold tracking-wider text-saddle-deep">
            Order Reference: #{order.id}
          </p>
          <p className="text-xs text-charcoal/70">
            A confirmation has been logged for {order.customer.email}.
          </p>
        </div>

        {/* Demo Notice */}
        <div className="border border-saddle-deep/40 bg-linen/50 p-4 text-xs text-charcoal/80 rounded-xs">
          <strong>Demo Order Completed:</strong> Stock counts have been updated in your local browser store. No actual payment was processed.
        </div>

        {/* Delivery Timeline info */}
        <div className="flex items-center gap-3 border border-espresso/12 bg-ivory p-4 rounded-xs text-xs">
          <Truck size={20} className="text-saddle-deep shrink-0" />
          <div>
            <p className="font-semibold text-espresso">Estimated Delivery: 7–10 Business Days</p>
            <p className="text-charcoal/70 mt-0.5">Your piece is being inspected and packed in our Bengaluru studio.</p>
          </div>
        </div>

        {/* Items Summary */}
        <div className="border-t border-espresso/12 pt-6">
          <p className="field-label mb-4">Purchased Pieces</p>
          <ul className="divide-y divide-espresso/10">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex items-center gap-4 py-3 text-xs">
                <div className="photo-tile relative h-16 w-16 shrink-0 rounded-xs bg-linen">
                  <ProductImage src={item.image} alt={item.name} sizes="64px" className="p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base text-espresso truncate">{item.name}</p>
                  <p className="text-charcoal/70">
                    Qty: {item.quantity} {item.colour && `· Colour: ${item.colour}`}
                  </p>
                </div>
                <span className="tabular font-semibold text-espresso">
                  {formatINR(item.unitPriceINR * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total & Address */}
        <div className="border-t border-espresso/12 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <p className="eyebrow mb-2">Shipping Destination</p>
            <p className="font-semibold text-espresso">{order.customer.name}</p>
            <p className="text-charcoal/80">{order.address.line1}</p>
            {order.address.line2 && <p className="text-charcoal/80">{order.address.line2}</p>}
            <p className="text-charcoal/80">
              {order.address.city}, {order.address.state} - {order.address.pin}
            </p>
            <p className="text-charcoal/70 mt-1">Phone: {order.customer.phone}</p>
          </div>

          <div className="space-y-2 border-t sm:border-t-0 sm:border-l sm:border-espresso/12 sm:pl-6 pt-4 sm:pt-0">
            <p className="eyebrow mb-2">Payment Summary</p>
            <div className="flex justify-between text-charcoal/80">
              <span>Subtotal</span>
              <span className="tabular font-medium">{formatINR(order.subtotalINR)}</span>
            </div>
            <div className="flex justify-between text-charcoal/80">
              <span>Courier Delivery</span>
              <span className="font-semibold text-saddle-deep uppercase">Free</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-espresso/10">
              <span className="font-semibold text-espresso">Total</span>
              <span className="tabular font-display text-xl font-bold text-espresso">{formatINR(order.totalINR)}</span>
            </div>
            <p className="text-[0.6875rem] text-walnut/70 capitalize pt-1">Method: {order.paymentMethod} (Simulated)</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-espresso/12 pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/track-order?id=${order.id}`}
              className="btn btn-outline btn-sm inline-flex items-center gap-2 btn-tactile"
            >
              <Package size={14} />
              Track Order Status
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-outline btn-sm inline-flex items-center gap-2 btn-tactile cursor-pointer"
              title="Print official atelier receipt"
            >
              <Printer size={14} />
              Print Receipt
            </button>
          </div>

          <a
            href={whatsappLink(settings.whatsappNumber, whatsappMessages.order(order.id))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-solid btn-sm inline-flex items-center gap-2 btn-tactile shimmer-badge"
          >
            <MessageCircle size={14} />
            Confirm on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

