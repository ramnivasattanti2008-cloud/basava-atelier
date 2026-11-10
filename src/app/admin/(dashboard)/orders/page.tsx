"use client";

import { useMemo, useState } from "react";
import { Check, ChevronRight, MessageCircle, Package, Truck, X } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import { formatDate, formatDateTime, formatINR, orderStatusLabel } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { whatsappLink } from "@/lib/whatsapp";
import { Overlay } from "@/components/ui/Overlay";
import { ProductImage } from "@/components/ui/ProductImage";

const allStatuses: OrderStatus[] = [
  "placed",
  "paid",
  "packed",
  "dispatched",
  "delivered",
  "returned",
  "cancelled",
];

export default function AdminOrdersPage() {
  const orders = useDemoStore((s) => s.orders);
  const updateOrderStatus = useDemoStore((s) => s.updateOrderStatus);
  const showToast = useToast((s) => s.show);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus);
    showToast(`Order #${selectedOrder.id} status changed to ${orderStatusLabel[newStatus]}.`);
    setSelectedOrder({ ...selectedOrder, status: newStatus });
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso/15 pb-6">
        <div>
          <span className="eyebrow">Fulfillment Log</span>
          <h1 className="font-display text-3xl text-espresso mt-1">Orders ({orders.length})</h1>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap border border-espresso/15 bg-ivory">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            statusFilter === "all" ? "bg-espresso text-ivory" : "text-charcoal/70 hover:text-espresso"
          }`}
        >
          All ({orders.length})
        </button>
        {allStatuses.map((st) => {
          const count = orders.filter((o) => o.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === st ? "bg-espresso text-ivory" : "text-charcoal/70 hover:text-espresso"
              }`}
            >
              {orderStatusLabel[st]} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="border border-espresso/15 bg-ivory rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-espresso/12 bg-linen/40 text-walnut/70 uppercase tracking-wider text-[0.625rem]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/8">
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className="hover:bg-paper cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-espresso">
                    {o.id}
                    {o.sample && (
                      <span className="ml-2 font-sans font-normal text-[0.55rem] uppercase text-walnut/60 border border-espresso/20 px-1 py-0.5 rounded-xs">
                        Sample
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-charcoal/70 whitespace-nowrap">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-espresso">{o.customer.name}</p>
                    <p className="text-[0.6875rem] text-charcoal/60">{o.customer.email}</p>
                  </td>
                  <td className="py-3 px-4 text-charcoal/80">
                    {o.items.length} piece{o.items.length > 1 ? "s" : ""}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider rounded-xs bg-linen text-espresso">
                      {orderStatusLabel[o.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right tabular font-semibold text-espresso">
                    {formatINR(o.totalINR)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-semibold uppercase text-saddle-deep inline-flex items-center gap-1">
                      Manage <ChevronRight size={12} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      <Overlay
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        label="Order Details"
        side="right"
        className="p-6 sm:p-8"
      >
        {selectedOrder && (
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-6rem)] pr-1 text-xs">
            <div className="flex items-center justify-between border-b border-espresso/15 pb-4">
              <div>
                <span className="eyebrow">Order Reference</span>
                <h2 className="font-display text-2xl text-espresso mt-0.5">#{selectedOrder.id}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-8 w-8 items-center justify-center text-espresso/70 hover:text-espresso"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Change Selector */}
            <div className="border border-espresso/15 bg-paper p-4 rounded-xs space-y-2">
              <label className="field-label">Update Status</label>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                className="field-input font-semibold text-xs"
              >
                {allStatuses.map((st) => (
                  <option key={st} value={st}>
                    {orderStatusLabel[st]}
                  </option>
                ))}
              </select>
            </div>

            {/* Direct WhatsApp to Customer */}
            <div>
              <a
                href={whatsappLink(
                  selectedOrder.customer.phone,
                  `Hello ${selectedOrder.customer.name}, updating you regarding your Kris Designs order #${selectedOrder.id}. Current status: ${orderStatusLabel[selectedOrder.status]}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm w-full flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} />
                WhatsApp Customer ({selectedOrder.customer.phone})
              </a>
            </div>

            {/* Items */}
            <div className="border-t border-espresso/12 pt-4">
              <p className="field-label mb-3">Ordered Pieces</p>
              <ul className="divide-y divide-espresso/8">
                {selectedOrder.items.map((it, idx) => (
                  <li key={idx} className="flex items-center gap-3 py-2.5">
                    <div className="photo-tile relative h-12 w-12 rounded-xs bg-linen shrink-0">
                      <ProductImage src={it.image} alt="" sizes="48px" className="p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-espresso truncate">{it.name}</p>
                      <p className="text-[0.6875rem] text-charcoal/60">
                        Qty: {it.quantity} {it.colour && `· ${it.colour}`}
                      </p>
                    </div>
                    <span className="tabular font-semibold text-espresso">
                      {formatINR(it.unitPriceINR * it.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destination Address */}
            <div className="border-t border-espresso/12 pt-4 space-y-1">
              <p className="field-label">Delivery Address</p>
              <p className="font-semibold text-espresso">{selectedOrder.customer.name}</p>
              <p className="text-charcoal/80">{selectedOrder.address.line1}</p>
              {selectedOrder.address.line2 && <p className="text-charcoal/80">{selectedOrder.address.line2}</p>}
              <p className="text-charcoal/80">
                {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pin}
              </p>
              <p className="text-charcoal/70 pt-1">Email: {selectedOrder.customer.email}</p>
            </div>

            {/* Financial summary */}
            <div className="border-t border-espresso/12 pt-4 space-y-1.5">
              <div className="flex justify-between text-charcoal/80">
                <span>Subtotal:</span>
                <span className="tabular">{formatINR(selectedOrder.subtotalINR)}</span>
              </div>
              <div className="flex justify-between text-charcoal/80">
                <span>Shipping:</span>
                <span className="tabular">₹0</span>
              </div>
              <div className="flex justify-between font-bold text-espresso text-sm pt-1 border-t border-espresso/8">
                <span>Total:</span>
                <span className="tabular font-display text-lg">{formatINR(selectedOrder.totalINR)}</span>
              </div>
            </div>

            {/* Audit History */}
            {selectedOrder.history && (
              <div className="border-t border-espresso/12 pt-4 space-y-2">
                <p className="field-label">Status History</p>
                <div className="space-y-1.5">
                  {selectedOrder.history.map((h, i) => (
                    <div key={i} className="flex justify-between text-[0.6875rem] text-charcoal/60">
                      <span className="uppercase font-semibold text-espresso">{orderStatusLabel[h.status]}</span>
                      <span>{formatDateTime(h.at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Overlay>
    </div>
  );
}

