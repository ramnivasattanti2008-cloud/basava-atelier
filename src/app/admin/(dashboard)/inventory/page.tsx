"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Check, Minus, Plus, Search } from "lucide-react";
import { formatINR } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { ProductImage } from "@/components/ui/ProductImage";

type StockFilter = "all" | "in_stock" | "low" | "out";

export default function AdminInventoryPage() {
  const products = useDemoStore((s) => s.products);
  const setStock = useDemoStore((s) => s.setStock);
  const showToast = useToast((s) => s.show);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StockFilter>("all");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const qty = p.stock.quantity ?? 0;
      if (filter === "out" && (p.stock.status === "out_of_stock" || qty === 0)) return true;
      if (filter === "low" && qty > 0 && qty <= 1) return true;
      if (filter === "in_stock" && p.stock.status === "in_stock" && qty > 0) return true;
      if (filter !== "all" && filter !== "in_stock") return false;

      if (query.trim()) {
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
      }
      return true;
    });
  }, [products, query, filter]);

  const handleAdjust = (id: string, name: string, delta: number, current: number) => {
    const next = Math.max(0, current + delta);
    setStock(id, next);
    showToast(`Stock for ${name} set to ${next}.`);
  };

  const handleSetQuick = (id: string, name: string, target: number) => {
    setStock(id, target);
    showToast(`Stock for ${name} set to ${target}.`);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="border-b border-espresso/15 pb-6">
        <span className="eyebrow">Stockroom Controls</span>
        <h1 className="font-display text-3xl text-espresso mt-1">Inventory Management</h1>
        <p className="text-xs text-charcoal/70 mt-1">
          Adjust available stock quantities inline. Changes reflect immediately across storefront filters and purchase buttons.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex border border-espresso/15 bg-ivory">
          {[
            { id: "all", label: "All Pieces" },
            { id: "in_stock", label: "In Stock" },
            { id: "low", label: "Low Stock (≤1)" },
            { id: "out", label: "Out of Stock" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as StockFilter)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === tab.id
                  ? "bg-espresso text-ivory"
                  : "text-charcoal/70 hover:text-espresso"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name or SKU..."
          className="field-input !min-h-[2.4rem] !py-1 text-xs max-w-xs"
        />
      </div>

      {/* Inventory Table */}
      <div className="border border-espresso/15 bg-ivory rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-espresso/12 bg-linen/40 text-walnut/70 uppercase tracking-wider text-[0.625rem]">
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">Piece Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Inline Adjuster</th>
                <th className="py-3 px-4 text-right">Quick Presets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/8">
              {filtered.map((p) => {
                const qty = p.stock.quantity ?? 0;
                const isOut = p.stock.status === "out_of_stock" || qty === 0;
                return (
                  <tr key={p.id} className="hover:bg-paper transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="photo-tile relative h-10 w-10 rounded-xs bg-linen shrink-0">
                        <ProductImage src={p.images[0]} alt="" sizes="40px" className="p-1" />
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-medium text-espresso min-w-[220px]">
                      {p.name}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[0.6875rem] text-walnut/70">
                      {p.sku || "—"}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-xs text-[0.625rem] font-bold uppercase tracking-wider ${
                          isOut
                            ? "bg-[#8e2f2a]/15 text-[#8e2f2a]"
                            : qty === 1
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {qty} Available
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="inline-flex items-center border border-espresso/25 bg-paper rounded-xs">
                        <button
                          type="button"
                          onClick={() => handleAdjust(p.id, p.name, -1, qty)}
                          disabled={qty <= 0}
                          className="h-7 w-7 flex items-center justify-center text-espresso hover:bg-linen disabled:opacity-30"
                          title="Decrease stock"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="tabular font-mono font-semibold px-2.5 text-xs text-center min-w-[2rem]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAdjust(p.id, p.name, 1, qty)}
                          className="h-7 w-7 flex items-center justify-center text-espresso hover:bg-linen"
                          title="Increase stock"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSetQuick(p.id, p.name, 0)}
                          className="px-2 py-1 text-[0.625rem] font-semibold uppercase border border-espresso/20 hover:bg-[#8e2f2a] hover:text-ivory hover:border-[#8e2f2a] transition-colors rounded-xs"
                        >
                          Mark Sold Out
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetQuick(p.id, p.name, 1)}
                          className="px-2 py-1 text-[0.625rem] font-semibold uppercase border border-espresso/20 hover:bg-espresso hover:text-ivory transition-colors rounded-xs"
                        >
                          Set 1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetQuick(p.id, p.name, 5)}
                          className="px-2 py-1 text-[0.625rem] font-semibold uppercase border border-espresso/20 hover:bg-espresso hover:text-ivory transition-colors rounded-xs"
                        >
                          Set 5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
