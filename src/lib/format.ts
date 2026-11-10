import type { Dimensions, OrderStatus, EnquiryStatus, Product } from "./types";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatINR(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "Price on request";
  return `₹${inr.format(value)}`;
}

export function formatNumber(value: number): string {
  return inr.format(value);
}

/** "L 13 × W 7.5 × D 7.5" — the unit is appended only if the data states one. */
export function formatDimensions(d: Dimensions | null): string | null {
  if (!d) return null;
  const parts: string[] = [];
  if (d.length !== null) parts.push(`L ${d.length}`);
  if (d.width !== null) parts.push(`W ${d.width}`);
  if (d.depth !== null) parts.push(`D ${d.depth}`);
  if (!parts.length) return d.asListed;
  return parts.join(" × ") + (d.unit ? ` ${d.unit}` : "");
}

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFmt.format(d);
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateTimeFmt.format(d);
}

export const orderStatusLabel: Record<OrderStatus, string> = {
  placed: "Placed",
  paid: "Paid",
  packed: "Packed",
  dispatched: "Dispatched",
  delivered: "Delivered",
  returned: "Returned",
  cancelled: "Cancelled",
};

export const enquiryStatusLabel: Record<EnquiryStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  quoted: "Quoted",
  in_progress: "In progress",
  completed: "Completed",
  declined: "Declined",
};

export function stockLabel(product: Pick<Product, "stock">): string {
  const { status, quantity } = product.stock;
  if (status === "out_of_stock") return "Out of stock";
  if (status === "unknown") return "Availability on request";
  if (quantity === 1) return "In stock · one piece";
  if (typeof quantity === "number") return `In stock · ${quantity} pieces`;
  return "In stock";
}

export function isPurchasable(product: Pick<Product, "stock" | "priceINR" | "visible">): boolean {
  return product.visible && product.stock.status === "in_stock" && typeof product.priceINR === "number";
}

/** Largest quantity a shopper may add for a product. */
export function maxQuantity(product: Pick<Product, "stock">): number {
  if (product.stock.status !== "in_stock") return 0;
  return typeof product.stock.quantity === "number" ? Math.max(0, product.stock.quantity) : 10;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
