"use client";

import { useMemo, useState } from "react";
import { Edit2, Plus, Search, Trash2, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, stockLabel } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { Overlay } from "@/components/ui/Overlay";
import { ProductImage } from "@/components/ui/ProductImage";

export default function AdminProductsPage() {
  const products = useDemoStore((s) => s.products);
  const categories = useDemoStore((s) => s.categories);
  const patchProduct = useDemoStore((s) => s.patchProduct);
  const saveProduct = useDemoStore((s) => s.saveProduct);
  const deleteProduct = useDemoStore((s) => s.deleteProduct);
  const showToast = useToast((s) => s.show);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form State for Edit Drawer
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stockQty, setStockQty] = useState<number>(1);
  const [category, setCategory] = useState("totes-carryalls");
  const [material, setMaterial] = useState("Genuine Leather");
  const [featured, setFeatured] = useState(false);
  const [visible, setVisible] = useState(true);
  const [description, setDescription] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${p.name} ${p.sku ?? ""} ${p.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, query, selectedCategory]);

  const openEdit = (p: Product) => {
    setIsNew(false);
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.priceINR ?? 0);
    setStockQty(p.stock.quantity ?? 1);
    setCategory(p.category);
    setMaterial(p.material ?? "Genuine Leather");
    setFeatured(p.featured);
    setVisible(p.visible);
    setDescription(p.description ?? "");
  };

  const openNew = () => {
    setIsNew(true);
    const newProd: Product = {
      id: `kd-custom-${Date.now()}`,
      sku: `KD-NEW-${Date.now().toString().slice(-4)}`,
      name: "",
      slug: `custom-product-${Date.now()}`,
      category: "totes-carryalls",
      listedType: "Bespoke Tote",
      priceINR: 3500,
      description: "",
      images: [
        "https://cdn.store.link/products/basava/fkv6v4-bbn601bk01_1.jpg?versionId=mMiN2HP5yXaOgwzCC5gJUBu4v6P7oT5.",
      ],
      colours: ["Black"],
      material: "Genuine Leather",
      leatherGrade: "Top-Grain",
      stock: { quantity: 1, status: "in_stock" },
      dimensions: { length: 12, width: 10, depth: 4, unit: "in", asListed: "L-12, W-10, D-4" },
      careInstructions: "Wipe clean with a dry cloth",
      deliveryTime: "7–10 days",
      featured: false,
      customisable: true,
      visible: true,
      source: null,
    };
    setEditingProduct(newProd);
    setName("");
    setPrice(3500);
    setStockQty(1);
    setCategory("totes-carryalls");
    setMaterial("Genuine Leather");
    setFeatured(false);
    setVisible(true);
    setDescription("");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!name.trim()) {
      showToast("Product name cannot be empty.", "warn");
      return;
    }

    const updated: Product = {
      ...editingProduct,
      name: name.trim(),
      priceINR: Number(price),
      category,
      material,
      featured,
      visible,
      description: description.trim(),
      stock: {
        quantity: Number(stockQty),
        status: Number(stockQty) > 0 ? "in_stock" : "out_of_stock",
      },
    };

    if (isNew) {
      saveProduct(updated);
      showToast(`Added new product: ${updated.name}`);
    } else {
      patchProduct(editingProduct.id, updated);
      showToast(`Updated product: ${updated.name}`);
    }
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso/15 pb-6">
        <div>
          <span className="eyebrow">Inventory Catalog</span>
          <h1 className="font-display text-3xl text-espresso mt-1">Products ({products.length})</h1>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="btn btn-solid btn-sm inline-flex items-center gap-1.5"
        >
          <Plus size={15} />
          <span>Add Piece</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 max-w-xs w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, SKU..."
            className="field-input !min-h-[2.4rem] !py-1 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="cat-filter" className="text-xs text-walnut/70 uppercase tracking-wider font-semibold">
            Category:
          </label>
          <select
            id="cat-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="field-input !min-h-[2.4rem] !py-1 !text-xs !w-48"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="border border-espresso/15 bg-ivory rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-espresso/12 bg-linen/40 text-walnut/70 uppercase tracking-wider text-[0.625rem]">
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">Product Name & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center">Visible</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-espresso/8">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-paper transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="photo-tile relative h-12 w-12 rounded-xs bg-linen shrink-0">
                      <ProductImage src={p.images[0]} alt="" sizes="48px" className="p-1" />
                    </div>
                  </td>
                  <td className="py-2.5 px-4 min-w-[200px]">
                    <p className="font-semibold text-espresso">{p.name}</p>
                    <p className="font-mono text-[0.625rem] text-walnut/70">{p.sku || p.id}</p>
                  </td>
                  <td className="py-2.5 px-4 capitalize text-charcoal/80">
                    {categories.find((c) => c.slug === p.category)?.name || p.category}
                  </td>
                  <td className="py-2.5 px-4 tabular font-semibold text-espresso">
                    {formatINR(p.priceINR)}
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-xs text-[0.625rem] font-semibold uppercase ${
                        p.stock.status === "in_stock"
                          ? "bg-linen text-espresso"
                          : "bg-[#8e2f2a]/15 text-[#8e2f2a]"
                      }`}
                    >
                      {p.stock.quantity ?? 0} in stock
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => patchProduct(p.id, { featured: !p.featured })}
                      className={`px-2 py-0.5 text-[0.625rem] font-bold uppercase rounded-xs transition-colors ${
                        p.featured ? "bg-espresso text-ivory" : "bg-paper text-charcoal/40 hover:text-espresso"
                      }`}
                    >
                      {p.featured ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => patchProduct(p.id, { visible: !p.visible })}
                      className={`px-2 py-0.5 text-[0.625rem] font-bold uppercase rounded-xs transition-colors ${
                        p.visible ? "bg-emerald-800 text-ivory" : "bg-linen text-charcoal/50"
                      }`}
                    >
                      {p.visible ? "Live" : "Hidden"}
                    </button>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="p-1 text-walnut hover:text-espresso"
                        title="Edit product"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete piece "${p.name}"?`)) {
                            deleteProduct(p.id);
                            showToast(`Deleted ${p.name}`);
                          }
                        }}
                        className="p-1 text-walnut/60 hover:text-[#8e2f2a]"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Drawer Overlay */}
      <Overlay
        open={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        label="Edit Product"
        side="right"
        className="p-6 sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-espresso/15 pb-4 mb-6">
          <h2 className="font-display text-xl text-espresso">
            {isNew ? "Add New Piece" : "Edit Piece"}
          </h2>
          <button
            type="button"
            onClick={() => setEditingProduct(null)}
            className="flex h-8 w-8 items-center justify-center text-espresso/70 hover:text-espresso"
          >
            <X size={18} />
          </button>
        </div>

        {editingProduct && (
          <form onSubmit={handleSave} className="space-y-4 overflow-y-auto max-h-[calc(100vh-10rem)] pr-1">
            <div>
              <label className="field-label">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-input text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Price (INR) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="field-input font-mono"
                  required
                />
              </div>

              <div>
                <label className="field-label">Stock Quantity *</label>
                <input
                  type="number"
                  value={stockQty}
                  onChange={(e) => setStockQty(Number(e.target.value))}
                  className="field-input font-mono"
                  min={0}
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="field-input text-xs"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="field-input text-xs"
              />
            </div>

            <div className="flex gap-6 border-y border-espresso/12 py-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Feature on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Visible on Store</span>
              </label>
            </div>

            <div>
              <label className="field-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="field-input text-xs"
                rows={3}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-solid btn-sm"
              >
                Save Piece
              </button>
            </div>
          </form>
        )}
      </Overlay>
    </div>
  );
}

