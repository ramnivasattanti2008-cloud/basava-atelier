"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, CheckCircle2, Clock, MessageCircle, Package, Search, Truck } from "lucide-react";
import type { OrderStatus } from "@/lib/types";
import { cx, formatDate, formatINR, orderStatusLabel } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { ProductImage } from "@/components/ui/ProductImage";

const steps: Array<{ key: OrderStatus; label: string; desc: string }> = [
  { key: "placed", label: "Placed", desc: "Order registered in studio" },
  { key: "paid", label: "Paid", desc: "Payment verified" },
  { key: "packed", label: "Packed", desc: "Wrapped in protective cotton" },
  { key: "dispatched", label: "Dispatched", desc: "Handed over to courier" },
  { key: "delivered", label: "Delivered", desc: "Arrived at destination" },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [orderId, setOrderId] = useState(initialId);
  const [searchedId, setSearchedId] = useState(initialId);

  const orders = useDemoStore((s) => s.orders);
  const settings = useDemoStore((s) => s.settings);

  const foundOrder = orders.find(
    (o) => o.id.toLowerCase() === searchedId.trim().toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(orderId.trim());
  };

  const currentStepIndex = foundOrder ? steps.findIndex((s) => s.key === foundOrder.status) : -1;

  return (
    <div className="shell py-12 sm:py-20 max-w-3xl">
      <div className="border-b border-espresso/15 pb-8 text-center sm:text-left">
        <span className="eyebrow">Shipment Lookup</span>
        <h1 className="display-lg mt-3">Track Your Order</h1>
        <p className="lede mt-3">
          Enter your order reference code (e.g. <strong>KD-10001</strong>) to view real-time packaging and dispatch updates.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="mt-8 flex gap-3 max-w-md">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID (e.g. KD-10001)"
          className="field-input uppercase"
          required
        />
        <button type="submit" className="btn btn-solid shrink-0">
          <Search size={15} />
          Track
        </button>
      </form>

      {/* Suggested demo IDs */}
      {!searchedId && (
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-charcoal/70">
          <span className="text-walnut/70">Try sample order:</span>
          {["KD-10001", "KD-10004", "KD-10008"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setOrderId(id);
                setSearchedId(id);
              }}
              className="font-mono bg-paper border border-espresso/20 px-2 py-0.5 rounded-xs hover:border-espresso text-espresso"
            >
              {id}
            </button>
          ))}
        </div>
      )}

      {/* Result Display */}
      {searchedId && (
        <div className="mt-12">
          {foundOrder ? (
            <div className="border border-espresso/15 bg-paper p-6 sm:p-8 rounded-xs space-y-8">
              {/* Order Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-espresso/10 pb-6">
                <div>
                  <span className="eyebrow">Status: {orderStatusLabel[foundOrder.status]}</span>
                  <h2 className="font-display text-2xl text-espresso mt-1">Order #{foundOrder.id}</h2>
                  <p className="text-xs text-charcoal/70 mt-1">Placed on {formatDate(foundOrder.createdAt)}</p>
                </div>
                <div className="text-right">
                  <span className="tabular text-xl font-bold text-espresso">{formatINR(foundOrder.totalINR)}</span>
                  <p className="text-[0.6875rem] text-walnut/70 capitalize">Paid via {foundOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Progress Stepper */}
              <div>
                <p className="field-label mb-6">Delivery Progress</p>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {steps.map((st, idx) => {
                    const isPassed = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;
                    return (
                      <div key={st.key} className="flex flex-col items-center">
                        <div
                          className={cx(
                            "flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors",
                            isPassed
                              ? "border-espresso bg-espresso text-ivory font-bold"
                              : "border-espresso/25 bg-paper text-charcoal/40"
                          )}
                        >
                          {isPassed ? <Check size={14} /> : idx + 1}
                        </div>
                        <span className={cx("mt-2 text-[0.6875rem] uppercase tracking-wider font-semibold", isCurrent ? "text-espresso" : "text-charcoal/60")}>
                          {st.label}
                        </span>
                        <span className="hidden sm:inline text-[0.625rem] text-charcoal/50 mt-0.5">
                          {st.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              <div className="border-t border-espresso/10 pt-6">
                <p className="field-label mb-4">Included Items</p>
                <ul className="divide-y divide-espresso/10">
                  {foundOrder.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4 py-3">
                      <div className="photo-tile relative h-14 w-14 shrink-0 rounded-xs bg-linen">
                        <ProductImage src={item.image} alt={item.name} sizes="56px" className="p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.slug}`} className="font-display text-base text-espresso hover:underline truncate block">
                          {item.name}
                        </Link>
                        {item.colour && <p className="text-xs text-charcoal/60">Colour: {item.colour}</p>}
                      </div>
                      <div className="text-right text-xs">
                        <p className="tabular font-semibold text-espresso">{formatINR(item.unitPriceINR * item.quantity)}</p>
                        <p className="text-charcoal/60">Qty: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Address */}
              <div className="border-t border-espresso/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="eyebrow mb-1">Destination Address</p>
                  <p className="font-semibold text-espresso">{foundOrder.customer.name}</p>
                  <p className="text-charcoal/80">{foundOrder.address.line1}</p>
                  {foundOrder.address.line2 && <p className="text-charcoal/80">{foundOrder.address.line2}</p>}
                  <p className="text-charcoal/80">
                    {foundOrder.address.city}, {foundOrder.address.state} - {foundOrder.address.pin}
                  </p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Contact Details</p>
                  <p className="text-charcoal/80">Email: {foundOrder.customer.email}</p>
                  <p className="text-charcoal/80">Phone: {foundOrder.customer.phone}</p>
                </div>
              </div>

              {/* WhatsApp Support Action */}
              <div className="border-t border-espresso/10 pt-6 flex items-center justify-between">
                <span className="text-xs text-charcoal/70">Need to amend your delivery address?</span>
                <a
                  href={whatsappLink(settings.whatsappNumber, whatsappMessages.order(foundOrder.id))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline inline-flex items-center gap-1.5"
                >
                  <MessageCircle size={14} />
                  WhatsApp Support
                </a>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-espresso/20 p-10 text-center rounded-xs">
              <p className="font-display text-xl text-espresso">Order Reference "{searchedId}" Not Found</p>
              <p className="mt-2 text-xs text-charcoal/70">
                Please double check the ID format. Demo orders follow the format <code>KD-10001</code>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="shell py-20 text-center"><p className="font-display text-2xl">Loading tracking…</p></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

