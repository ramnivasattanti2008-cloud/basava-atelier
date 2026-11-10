"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CreditCard, Lock, ShieldCheck, ShoppingBag, Smartphone } from "lucide-react";
import type { PaymentMethod } from "@/lib/types";
import { cx, formatINR } from "@/lib/format";
import { indianStates, isEmail, isFilled, isIndianPhone, isPin } from "@/lib/validation";
import { useCart } from "@/lib/hooks";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { ProductImage } from "@/components/ui/ProductImage";

export default function CheckoutPage() {
  const router = useRouter();
  const { entries, count, subtotal } = useCart();
  const placeOrder = useDemoStore((s) => s.placeOrder);
  const showToast = useToast((s) => s.show);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Karnataka");
  const [pin, setPin] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [note, setNote] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!isFilled(name, 2)) errs.name = "Enter your full name.";
    if (!isEmail(email)) errs.email = "Enter a valid email address.";
    if (!isIndianPhone(phone)) errs.phone = "Enter a valid 10-digit mobile number.";
    if (!isFilled(line1, 4)) errs.line1 = "Enter your street address.";
    if (!isFilled(city, 2)) errs.city = "Enter your city.";
    if (!isPin(pin)) errs.pin = "Enter a valid 6-digit PIN code.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast("Please correct the highlighted fields in your address.", "warn");
      return;
    }

    if (entries.length === 0) {
      showToast("Your bag is empty.", "warn");
      router.push("/shop");
      return;
    }

    setSubmitting(true);
    const order = placeOrder({
      customer: { name, email, phone },
      address: { line1, line2, city, state, pin },
      paymentMethod,
      note,
    });

    if (order) {
      showToast(`Order #${order.id} placed successfully!`);
      router.push(`/order-confirmation/${order.id}`);
    } else {
      setSubmitting(false);
      showToast("Unable to complete order. An item in your bag may be out of stock.", "warn");
    }
  };

  if (entries.length === 0) {
    return (
      <div className="shell py-20 text-center max-w-md mx-auto">
        <h1 className="display-sm">Nothing in Bag</h1>
        <p className="mt-2 text-sm text-charcoal/70">Add an item to your bag before proceeding to checkout.</p>
        <Link href="/shop" className="btn btn-solid btn-sm mt-6">
          View Pieces
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-10 sm:py-16 max-w-5xl">
      <div className="border-b border-espresso/15 pb-6 mb-8 flex items-center justify-between">
        <div>
          <Link href="/cart" className="text-xs text-walnut/70 hover:text-espresso flex items-center gap-1 mb-2">
            <ArrowLeft size={13} /> Back to bag
          </Link>
          <h1 className="display-md">Checkout</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-saddle-deep font-semibold uppercase tracking-wider">
          <Lock size={14} />
          <span>Demo Checkout</span>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div className="border border-saddle-deep/40 bg-linen/50 p-4 mb-8 text-xs text-charcoal/80 flex items-start gap-3 rounded-xs">
        <ShieldCheck size={20} className="text-saddle-deep shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-espresso uppercase tracking-wider text-[0.6875rem]">
            Demonstration Environment
          </p>
          <p className="mt-0.5">
            This is an interactive simulation. No actual payment is collected, and no real card or bank details are required. Placing an order registers a session order and automatically decrements catalogue stock.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact Information */}
          <div className="border border-espresso/15 bg-paper p-6 rounded-xs space-y-4">
            <h2 className="font-display text-xl text-espresso">1. Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="chk-name" className="field-label">Full Name *</label>
                <input
                  id="chk-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ananya Rao"
                  className="field-input"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="chk-email" className="field-label">Email Address *</label>
                <input
                  id="chk-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="field-input"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="chk-phone" className="field-label">Mobile Number *</label>
                <input
                  id="chk-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="field-input"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="border border-espresso/15 bg-paper p-6 rounded-xs space-y-4">
            <h2 className="font-display text-xl text-espresso">2. Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="chk-line1" className="field-label">Street Address *</label>
                <input
                  id="chk-line1"
                  type="text"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="Apartment, building, street address"
                  className="field-input"
                  aria-invalid={Boolean(errors.line1)}
                />
                {errors.line1 && <p className="field-error">{errors.line1}</p>}
              </div>

              <div>
                <label htmlFor="chk-line2" className="field-label">Landmark / Suite (Optional)</label>
                <input
                  id="chk-line2"
                  type="text"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  placeholder="Near landmark or floor"
                  className="field-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="chk-city" className="field-label">City *</label>
                  <input
                    id="chk-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="field-input"
                    aria-invalid={Boolean(errors.city)}
                  />
                  {errors.city && <p className="field-error">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="chk-state" className="field-label">State *</label>
                  <select
                    id="chk-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="field-input"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="chk-pin" className="field-label">PIN Code *</label>
                  <input
                    id="chk-pin"
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="560001"
                    maxLength={6}
                    className="field-input font-mono"
                    aria-invalid={Boolean(errors.pin)}
                  />
                  {errors.pin && <p className="field-error">{errors.pin}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method Simulation */}
          <div className="border border-espresso/15 bg-paper p-6 rounded-xs space-y-4">
            <h2 className="font-display text-xl text-espresso">3. Payment Method (Demo)</h2>
            <div className="space-y-3">
              {[
                { id: "upi", label: "UPI (Google Pay, PhonePe, Paytm)", icon: Smartphone, desc: "Instant zero-fee simulated payment" },
                { id: "card", label: "Credit or Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay (Simulated)" },
                { id: "netbanking", label: "Net Banking", icon: ShieldCheck, desc: "All major Indian retail banks (Simulated)" },
              ].map((m) => {
                const Icon = m.icon;
                const isSel = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={cx(
                      "w-full flex items-center justify-between p-4 border rounded-xs text-left transition-all",
                      isSel
                        ? "border-espresso bg-linen/60 ring-1 ring-espresso"
                        : "border-espresso/15 bg-paper hover:border-espresso/35"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-saddle-deep" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-espresso">{m.label}</p>
                        <p className="text-[0.6875rem] text-charcoal/70">{m.desc}</p>
                      </div>
                    </div>
                    {isSel && <Check size={16} className="text-saddle-deep" />}
                  </button>
                );
              })}
            </div>

            <div>
              <label htmlFor="chk-note" className="field-label mt-4">Order Instructions (Optional)</label>
              <input
                id="chk-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Gate code, gift packaging note, or special delivery timing..."
                className="field-input"
              />
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="border border-espresso/15 bg-paper p-6 rounded-xs sticky top-24 space-y-6">
            <h2 className="font-display text-2xl text-espresso">Order Items ({count})</h2>

            <ul className="divide-y divide-espresso/12 max-h-72 overflow-y-auto pr-1">
              {entries.map(({ line, product, lineTotal }) => (
                <li key={line.key} className="flex items-center gap-3 py-3 text-xs">
                  <div className="photo-tile relative h-14 w-14 shrink-0 rounded-xs bg-linen">
                    <ProductImage src={product.images[0]} alt={product.name} sizes="56px" className="p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm text-espresso truncate">{product.name}</p>
                    <p className="text-charcoal/60">
                      Qty: {line.quantity} {line.colour && `· ${line.colour}`}
                    </p>
                  </div>
                  <span className="tabular font-semibold text-espresso">{formatINR(lineTotal)}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-espresso/12 pt-4 text-xs">
              <div className="flex justify-between text-charcoal/80">
                <span>Subtotal</span>
                <span className="tabular font-medium text-espresso">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal/80">
                <span>Shipping</span>
                <span className="text-saddle-deep font-semibold uppercase">Free</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-espresso/12">
                <span className="font-semibold text-espresso text-sm">Total Due</span>
                <span className="tabular font-display text-2xl font-bold text-espresso">{formatINR(subtotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-solid w-full h-12"
            >
              {submitting ? "Placing Order…" : "Place Demo Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
