"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Layers,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { cx, formatINR, formatDate, orderStatusLabel } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { whatsappLink } from "@/lib/whatsapp";
import { LIFECYCLE_STATUS_LABELS } from "@/services/quotationService";

export default function CustomerAccountPage() {
  const orders = useDemoStore((s) => s.orders);
  const bespokeRequests = useDemoStore((s) => s.bespokeRequests);
  const settings = useDemoStore((s) => s.settings);

  const [activeTab, setActiveTab] = useState<"orders" | "bespoke" | "profile">("orders");

  return (
    <div className="shell py-12 sm:py-20 max-w-5xl">
      {/* Header */}
      <div className="border-b border-espresso/15 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow text-saddle-deep">Customer Portal</span>
          <h1 className="display-lg text-espresso mt-1">My Atelier Account</h1>
          <p className="text-xs text-charcoal/70 mt-1">
            Track handcrafted commissions, review bespoke AI design concepts, and manage delivery addresses.
          </p>
        </div>

        <Link
          href="/custom"
          className="btn btn-solid btn-sm self-start sm:self-auto flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles size={13} className="text-sand" />
          <span>New Bespoke Design</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex border-b border-espresso/15 gap-2 text-xs font-semibold uppercase tracking-wider">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={cx(
            "py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2",
            activeTab === "orders"
              ? "border-espresso text-espresso font-bold bg-linen/30"
              : "border-transparent text-charcoal/60 hover:text-espresso"
          )}
        >
          <Package size={14} />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bespoke")}
          className={cx(
            "py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2",
            activeTab === "bespoke"
              ? "border-espresso text-espresso font-bold bg-linen/30"
              : "border-transparent text-charcoal/60 hover:text-espresso"
          )}
        >
          <Sparkles size={14} className="text-saddle-deep" />
          <span>Bespoke Commissions ({bespokeRequests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={cx(
            "py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2",
            activeTab === "profile"
              ? "border-espresso text-espresso font-bold bg-linen/30"
              : "border-transparent text-charcoal/60 hover:text-espresso"
          )}
        >
          <User size={14} />
          <span>Atelier Concierge</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === "orders" && (
        <div className="mt-8 space-y-4">
          {orders.length === 0 ? (
            <div className="border border-espresso/15 bg-paper p-12 text-center rounded-xs space-y-4">
              <Package size={36} className="mx-auto text-charcoal/40" />
              <h2 className="font-display text-xl text-espresso">No Orders Recorded Yet</h2>
              <p className="text-xs text-charcoal/70 max-w-sm mx-auto">
                Explore our 40-piece handcrafted collection or personalize a piece with your gold foil initials.
              </p>
              <Link href="/shop" className="btn btn-solid btn-sm">
                Explore 40 Bags
              </Link>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="border border-espresso/15 bg-paper p-5 sm:p-6 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-espresso/40 transition-all shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-espresso">#{ord.id}</span>
                    <span className="text-[0.625rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-linen text-espresso">
                      {orderStatusLabel[ord.status]}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/70">
                    Placed on {formatDate(ord.createdAt)} · {ord.items.length} {ord.items.length === 1 ? "Item" : "Items"}
                  </p>
                  <p className="text-xs font-semibold text-espresso pt-1">
                    Total: {formatINR(ord.totalINR)} ({ord.paymentMethod.toUpperCase()})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/order-confirmation/${ord.id}`}
                    className="btn btn-outline btn-sm text-xs"
                  >
                    View Invoice
                  </Link>
                  <Link
                    href={`/track-order?id=${ord.id}`}
                    className="btn btn-solid btn-sm text-xs flex items-center gap-1.5"
                  >
                    <span>Track Delivery</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: BESPOKE REQUESTS */}
      {activeTab === "bespoke" && (
        <div className="mt-8 space-y-4">
          {bespokeRequests.length === 0 ? (
            <div className="border border-espresso/15 bg-paper p-12 text-center rounded-xs space-y-4">
              <Sparkles size={36} className="mx-auto text-saddle-deep" />
              <h2 className="font-display text-xl text-espresso">No Bespoke Commissions Yet</h2>
              <p className="text-xs text-charcoal/70 max-w-sm mx-auto">
                Step into the AI Bespoke Studio to customize handle drops, laptop sleeves, and select from 8 Karnataka leather dyes.
              </p>
              <Link href="/custom" className="btn btn-solid btn-sm">
                Launch Bespoke Studio
              </Link>
            </div>
          ) : (
            bespokeRequests.map((req) => {
              const statusMeta = LIFECYCLE_STATUS_LABELS[req.status] || {
                label: req.status,
                colour: "bg-linen text-espresso",
              };
              return (
                <div
                  key={req.id}
                  className="border border-espresso/15 bg-paper p-5 sm:p-6 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-espresso/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xs border border-espresso/15 bg-linen/50 flex items-center justify-center overflow-hidden shrink-0">
                      {req.heroImage ? (
                        <img
                          src={req.heroImage}
                          alt="Concept plate"
                          className="w-full h-full object-contain filter drop-shadow-2xs"
                        />
                      ) : (
                        <span className="text-[0.625rem] text-charcoal/50">Concept</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-espresso">{req.referenceCode}</span>
                        <span className={`text-[0.625rem] font-semibold uppercase px-2 py-0.5 rounded-xs border ${statusMeta.colour}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <h3 className="font-display text-base text-espresso mt-0.5">
                        {req.currentConfig.designName}
                      </h3>
                      <p className="text-xs text-charcoal/70 capitalize mt-0.5">
                        {req.currentConfig.colourName} · {req.currentConfig.material.replace("-", " ")} · Hardware: {req.currentConfig.hardware}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
                    {req.quotedPriceINR ? (
                      <span className="font-mono text-sm font-bold text-espresso">
                        ₹{req.quotedPriceINR.toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="text-[0.6875rem] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-xs font-semibold">
                        Quotation in Progress
                      </span>
                    )}

                    <a
                      href={whatsappLink(
                        settings.whatsappNumber,
                        `Hello! Inquiring on my bespoke design ${req.referenceCode} (${req.currentConfig.designName}).`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm text-xs flex items-center gap-1.5 text-emerald-800 border-emerald-300 hover:bg-emerald-50"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp Atelier</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: CONCIERGE & SUPPORT */}
      {activeTab === "profile" && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-espresso/15 bg-paper p-6 rounded-xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-saddle-deep" />
              <h2 className="font-display text-lg text-espresso font-semibold">Atelier Guarantee</h2>
            </div>
            <p className="text-xs text-charcoal/80 leading-relaxed">
              Every piece leaving our Bengaluru bench carries 100% natural vegetable-tanned hide certification, lifetime seam integrity, and complimentary leather reconditioning.
            </p>
            <div className="pt-2 border-t border-espresso/10 text-xs text-charcoal/70 space-y-1">
              <p>📍 <strong>Workshop:</strong> Bengaluru, Karnataka, Bharat</p>
              <p>📞 <strong>Direct WhatsApp:</strong> +91 89519 89891</p>
              <p>✉️ <strong>Customer Email:</strong> {settings.email}</p>
            </div>
          </div>

          <div className="border border-espresso/15 bg-paper p-6 rounded-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-saddle-deep" />
                <h2 className="font-display text-lg text-espresso font-semibold">Track Delivery</h2>
              </div>
              <p className="text-xs text-charcoal/80 leading-relaxed mt-2">
                Have an existing order number? Check live handcrafted preparation status, dispatch tracking, and estimated delivery dates.
              </p>
            </div>
            <Link href="/track-order" className="btn btn-solid btn-sm text-xs flex items-center justify-center gap-1.5">
              <span>Go to Order Tracker</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
