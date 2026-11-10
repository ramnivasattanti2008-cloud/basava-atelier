"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  ShoppingBag,
  Compass,
} from "lucide-react";
import { formatDate, formatINR, orderStatusLabel } from "@/lib/format";
import { useDemoStore } from "@/lib/store";

export default function AdminOverviewPage() {
  const products = useDemoStore((s) => s.products);
  const orders = useDemoStore((s) => s.orders);
  const enquiries = useDemoStore((s) => s.enquiries);

  // Compute metrics
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalINR, 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => ["placed", "paid", "packed", "dispatched"].includes(o.status)).length;
  }, [orders]);

  const openEnquiriesCount = useMemo(() => {
    return enquiries.filter((e) => ["new", "reviewing", "quoted", "in_progress"].includes(e.status)).length;
  }, [enquiries]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock.status === "out_of_stock" || (typeof p.stock.quantity === "number" && p.stock.quantity <= 1)).length;
  }, [products]);

  // Compute 14-day revenue series
  const chartData = useMemo(() => {
    const days: Array<{ label: string; dateStr: string; total: number }> = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86_400_000);
      const dateStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      days.push({ label, dateStr, total: 0 });
    }

    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const orderDate = o.createdAt.slice(0, 10);
      const match = days.find((d) => d.dateStr === orderDate);
      if (match) match.total += o.totalINR;
    });

    const max = Math.max(...days.map((d) => d.total), 5000);
    return { days, max };
  }, [orders]);

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso/15 pb-6">
        <div>
          <span className="eyebrow">Studio Overview</span>
          <h1 className="font-display text-3xl text-espresso mt-1">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="btn btn-solid btn-sm">
            Manage Products
          </Link>
          <Link href="/admin/orders" className="btn btn-outline btn-sm">
            View All Orders
          </Link>
        </div>
      </div>

      {/* 1. Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="border border-espresso/15 bg-ivory p-5 rounded-xs space-y-2">
          <div className="flex items-center justify-between text-walnut/70">
            <span className="text-xs font-semibold uppercase tracking-wider">Demo Revenue</span>
            <DollarSign size={16} className="text-saddle-deep" />
          </div>
          <p className="tabular font-display text-3xl font-bold text-espresso">
            {formatINR(totalRevenue)}
          </p>
          <p className="text-[0.6875rem] text-walnut/70">{orders.length} total orders recorded</p>
        </div>

        {/* Active Orders */}
        <div className="border border-espresso/15 bg-ivory p-5 rounded-xs space-y-2">
          <div className="flex items-center justify-between text-walnut/70">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Orders</span>
            <ShoppingBag size={16} className="text-saddle-deep" />
          </div>
          <p className="tabular font-display text-3xl font-bold text-espresso">
            {activeOrdersCount}
          </p>
          <p className="text-[0.6875rem] text-walnut/70">Orders pending fulfillment</p>
        </div>

        {/* Open Bespoke Enquiries */}
        <div className="border border-espresso/15 bg-ivory p-5 rounded-xs space-y-2">
          <div className="flex items-center justify-between text-walnut/70">
            <span className="text-xs font-semibold uppercase tracking-wider">Custom Requests</span>
            <Compass size={16} className="text-saddle-deep" />
          </div>
          <p className="tabular font-display text-3xl font-bold text-espresso">
            {openEnquiriesCount}
          </p>
          <p className="text-[0.6875rem] text-walnut/70">{enquiries.length} total briefs logged</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="border border-espresso/15 bg-ivory p-5 rounded-xs space-y-2">
          <div className="flex items-center justify-between text-walnut/70">
            <span className="text-xs font-semibold uppercase tracking-wider">Stock Alerts</span>
            <AlertTriangle size={16} className="text-[#8e2f2a]" />
          </div>
          <p className="tabular font-display text-3xl font-bold text-espresso">
            {lowStockCount}
          </p>
          <p className="text-[0.6875rem] text-[#8e2f2a]">Pieces with ≤ 1 item in stock</p>
        </div>
      </div>

      {/* 2. 14-Day Revenue Chart */}
      <div className="border border-espresso/15 bg-ivory p-6 sm:p-8 rounded-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-espresso">Daily Sales Activity</h2>
            <p className="text-xs text-charcoal/70 mt-0.5">Simulated order revenue over the last 14 days</p>
          </div>
          <span className="eyebrow text-saddle-deep">Live Store Telemetry</span>
        </div>

        {/* Responsive Hand-Crafted SVG Bar Chart */}
        <div className="pt-6">
          <div className="h-44 w-full flex items-end gap-2 sm:gap-3 border-b border-espresso/20 pb-2">
            {chartData.days.map((d, idx) => {
              const heightPct = Math.max(4, Math.round((d.total / chartData.max) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-espresso text-ivory text-[0.625rem] px-2 py-1 rounded-xs pointer-events-none whitespace-nowrap z-20 shadow-md">
                    {d.label}: {formatINR(d.total)}
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full rounded-xs transition-all duration-300 group-hover:brightness-110"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: d.total > 0 ? "#7d5a3a" : "#d9c4a7",
                    }}
                  />
                  <span className="mt-2 text-[0.55rem] sm:text-[0.625rem] text-charcoal/60 truncate w-full text-center">
                    {idx % 2 === 0 ? d.label.split(" ")[0] : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Recent Orders & Custom Requests Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-7 border border-espresso/15 bg-ivory p-6 rounded-xs space-y-4">
          <div className="flex items-center justify-between border-b border-espresso/10 pb-4">
            <h3 className="font-display text-lg text-espresso">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-semibold text-saddle-deep hover:underline">
              View All ({orders.length}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-espresso/10 text-walnut/70 uppercase tracking-wider text-[0.625rem]">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/8">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-paper">
                    <td className="py-3 font-mono font-medium text-espresso">
                      <Link href="/admin/orders" className="hover:underline">
                        {o.id}
                      </Link>
                    </td>
                    <td className="py-3 text-charcoal/80">
                      <p className="font-medium text-espresso">{o.customer.name}</p>
                      <p className="text-[0.6875rem] text-charcoal/60">{o.address.city}</p>
                    </td>
                    <td className="py-3">
                      <span className="inline-block px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider rounded-xs bg-linen text-espresso">
                        {orderStatusLabel[o.status]}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-espresso tabular">
                      {formatINR(o.totalINR)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bespoke Briefs */}
        <div className="lg:col-span-5 border border-espresso/15 bg-ivory p-6 rounded-xs space-y-4">
          <div className="flex items-center justify-between border-b border-espresso/10 pb-4">
            <h3 className="font-display text-lg text-espresso">Custom Briefs</h3>
            <Link href="/admin/custom-requests" className="text-xs font-semibold text-saddle-deep hover:underline">
              View All ({enquiries.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {enquiries.slice(0, 4).map((enq) => (
              <div key={enq.id} className="border border-espresso/10 bg-paper p-3.5 rounded-xs text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-espresso">{enq.id}</span>
                  <span className="bg-linen px-2 py-0.5 text-[0.625rem] uppercase font-semibold text-saddle-deep">
                    {enq.status}
                  </span>
                </div>
                <p className="font-semibold text-espresso">{enq.productType} · {enq.colour}</p>
                <p className="text-[0.6875rem] text-charcoal/70 truncate">From: {enq.customer.name} ({enq.customer.phone})</p>
                {enq.engraving && enq.engraving !== "None" && (
                  <p className="text-[0.6875rem] text-saddle-deep font-medium">Monogram: {enq.engraving}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
