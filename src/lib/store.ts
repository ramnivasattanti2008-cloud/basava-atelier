"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { defaultContent, defaultSettings } from "@/data/brand";
import { seedProducts, seedVersion } from "@/data/catalogue";
import { seedCategories } from "@/data/categories";
import { buildSampleEnquiries, buildSampleOrders } from "@/data/demo-seed";
import { maxQuantity } from "./format";
import type {
  ActivityEntry,
  Address,
  CartLine,
  Category,
  ContactMessage,
  CustomEnquiry,
  CustomerDetails,
  EnquiryStatus,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  SiteContent,
  SiteSettings,
} from "./types";

/**
 * The demo's "backend".
 *
 * Everything a real deployment would keep in a database — catalogue edits,
 * carts, orders, custom requests, site content — lives in this one store and
 * is persisted to localStorage. Components never touch localStorage directly;
 * they call the actions below. Swapping this file for API calls is the main
 * step in moving from demo to production.
 */

export const STORAGE_KEY = "kris-designs-demo";

interface DemoData {
  seedVersion: string;
  seeded: boolean;
  products: Product[];
  categories: Category[];
  cart: CartLine[];
  orders: Order[];
  enquiries: CustomEnquiry[];
  messages: ContactMessage[];
  content: SiteContent;
  settings: SiteSettings;
  activity: ActivityEntry[];
  orderSeq: number;
  enquirySeq: number;
}

interface DemoUi {
  hydrated: boolean;
  cartOpen: boolean;
  storageWarning: string | null;
}

export interface ActionResult {
  ok: boolean;
  message: string;
}

export interface PlaceOrderInput {
  customer: CustomerDetails;
  address: Address;
  paymentMethod: PaymentMethod;
  note: string;
}

export type EnquiryInput = Omit<CustomEnquiry, "id" | "createdAt" | "status" | "internalNote" | "sample">;

interface DemoActions {
  seedSamples: () => void;
  setCartOpen: (open: boolean) => void;
  addToCart: (productId: string, colour: string | null, quantity: number) => ActionResult;
  setLineQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  placeOrder: (input: PlaceOrderInput) => Order | null;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  submitEnquiry: (input: EnquiryInput) => CustomEnquiry;
  updateEnquiry: (id: string, patch: Partial<Pick<CustomEnquiry, "status" | "internalNote">>) => void;
  submitMessage: (input: Omit<ContactMessage, "id" | "createdAt" | "read">) => ContactMessage;
  setMessageRead: (id: string, read: boolean) => void;
  saveProduct: (product: Product) => void;
  patchProduct: (id: string, patch: Partial<Product>) => void;
  setStock: (id: string, quantity: number | null, status?: Product["stock"]["status"]) => void;
  deleteProduct: (id: string) => void;
  updateCategory: (slug: string, patch: Partial<Omit<Category, "slug">>) => void;
  updateContent: (content: SiteContent) => void;
  updateSettings: (settings: SiteSettings) => void;
  resetDemo: () => void;
}

export type DemoState = DemoData & DemoUi & DemoActions;

function initialData(): DemoData {
  return {
    seedVersion,
    seeded: false,
    products: seedProducts,
    categories: seedCategories,
    cart: [],
    orders: [],
    enquiries: [],
    messages: [],
    content: defaultContent,
    settings: defaultSettings,
    activity: [],
    orderSeq: 10009,
    enquirySeq: 2005,
  };
}

let reportStorageProblem: (message: string) => void = () => {};

const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      reportStorageProblem(
        "This browser's storage is full or unavailable, so recent changes may not be kept after a refresh.",
      );
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      /* nothing to remove */
    }
  },
};

const lineKey = (productId: string, colour: string | null) => `${productId}::${colour ?? ""}`;

function entry(message: string): ActivityEntry {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    message,
  };
}

const withLog = (activity: ActivityEntry[], message: string) => [entry(message), ...activity].slice(0, 60);

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      ...initialData(),
      hydrated: false,
      cartOpen: false,
      storageWarning: null,

      seedSamples: () => {
        const now = Date.now();
        const { products } = get();
        set({
          seeded: true,
          orders: buildSampleOrders(products, now),
          enquiries: buildSampleEnquiries(products, now),
        });
      },

      setCartOpen: (open) => set({ cartOpen: open }),

      addToCart: (productId, colour, quantity) => {
        const { products, cart } = get();
        const product = products.find((p) => p.id === productId);
        if (!product || !product.visible) return { ok: false, message: "This piece is no longer available." };
        if (typeof product.priceINR !== "number") return { ok: false, message: "This piece is priced on request." };
        const limit = maxQuantity(product);
        if (limit <= 0) return { ok: false, message: "This piece is out of stock." };

        const inCart = cart
          .filter((line) => line.productId === productId)
          .reduce((sum, line) => sum + line.quantity, 0);
        const room = limit - inCart;
        if (room <= 0) {
          return {
            ok: false,
            message: limit === 1 ? "There is only one of this piece, and it is already in your bag." : `Only ${limit} available, and they are already in your bag.`,
          };
        }
        const adding = Math.max(1, Math.min(quantity, room));
        const key = lineKey(productId, colour);
        const existing = cart.find((line) => line.key === key);
        set({
          cart: existing
            ? cart.map((line) => (line.key === key ? { ...line, quantity: line.quantity + adding } : line))
            : [...cart, { key, productId, colour, quantity: adding }],
        });
        return {
          ok: true,
          message: adding < quantity ? `Added ${adding}. That is all we have of this piece.` : "Added to your bag.",
        };
      },

      setLineQuantity: (key, quantity) => {
        const { cart, products } = get();
        const line = cart.find((l) => l.key === key);
        if (!line) return;
        const product = products.find((p) => p.id === line.productId);
        const others = cart
          .filter((l) => l.productId === line.productId && l.key !== key)
          .reduce((sum, l) => sum + l.quantity, 0);
        const limit = product ? Math.max(1, maxQuantity(product) - others) : 1;
        const next = Math.max(1, Math.min(Math.round(quantity) || 1, limit));
        set({ cart: cart.map((l) => (l.key === key ? { ...l, quantity: next } : l)) });
      },

      removeLine: (key) => set({ cart: get().cart.filter((line) => line.key !== key) }),

      clearCart: () => set({ cart: [] }),

      placeOrder: ({ customer, address, paymentMethod, note }) => {
        const { cart, products, orderSeq, orders, activity } = get();
        const items: OrderItem[] = [];
        for (const line of cart) {
          const product = products.find((p) => p.id === line.productId);
          if (!product || typeof product.priceINR !== "number") continue;
          const available = maxQuantity(product);
          const quantity = Math.min(line.quantity, available);
          if (quantity <= 0) continue;
          items.push({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0] ?? null,
            colour: line.colour,
            quantity,
            unitPriceINR: product.priceINR,
          });
        }
        if (!items.length) return null;

        const subtotal = items.reduce((sum, item) => sum + item.unitPriceINR * item.quantity, 0);
        const at = new Date().toISOString();
        const order: Order = {
          id: `KD-${orderSeq}`,
          createdAt: at,
          status: "placed",
          customer,
          address,
          items,
          subtotalINR: subtotal,
          shippingINR: 0,
          totalINR: subtotal,
          paymentMethod,
          paymentState: "demo",
          note,
          sample: false,
          history: [{ at, status: "placed" }],
        };

        // Stock is reduced by the order, so the storefront and admin stay in step.
        const sold = new Map<string, number>();
        for (const item of items) sold.set(item.productId, (sold.get(item.productId) ?? 0) + item.quantity);
        const nextProducts = products.map((p) => {
          const taken = sold.get(p.id);
          if (!taken || typeof p.stock.quantity !== "number") return p;
          const quantity = Math.max(0, p.stock.quantity - taken);
          return { ...p, stock: { quantity, status: quantity > 0 ? ("in_stock" as const) : ("out_of_stock" as const) } };
        });

        set({
          orders: [order, ...orders],
          orderSeq: orderSeq + 1,
          cart: [],
          products: nextProducts,
          activity: withLog(activity, `Demo order ${order.id} placed (${items.length} item${items.length > 1 ? "s" : ""}).`),
        });
        return order;
      },

      updateOrderStatus: (id, status) => {
        const { orders, activity } = get();
        const at = new Date().toISOString();
        set({
          orders: orders.map((o) => (o.id === id && o.status !== status ? { ...o, status, history: [...o.history, { at, status }] } : o)),
          activity: withLog(activity, `Order ${id} marked ${status}.`),
        });
      },

      submitEnquiry: (input) => {
        const { enquiries, enquirySeq, activity } = get();
        const enquiry: CustomEnquiry = {
          ...input,
          id: `CR-${enquirySeq}`,
          createdAt: new Date().toISOString(),
          status: "new",
          internalNote: "",
          sample: false,
        };
        set({
          enquiries: [enquiry, ...enquiries],
          enquirySeq: enquirySeq + 1,
          activity: withLog(activity, `Custom request ${enquiry.id} received (${enquiry.productType}).`),
        });
        return enquiry;
      },

      updateEnquiry: (id, patch) => {
        const { enquiries, activity } = get();
        const current = enquiries.find((e) => e.id === id);
        if (!current) return;
        const statusChanged = patch.status !== undefined && patch.status !== current.status;
        set({
          enquiries: enquiries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          activity: statusChanged
            ? withLog(activity, `Custom request ${id} moved to ${(patch.status as EnquiryStatus).replace("_", " ")}.`)
            : activity,
        });
      },

      submitMessage: (input) => {
        const { messages, activity } = get();
        const message: ContactMessage = {
          ...input,
          id: `MSG-${Date.now().toString(36).toUpperCase()}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        set({ messages: [message, ...messages], activity: withLog(activity, `Contact message received (${input.topic}).`) });
        return message;
      },

      setMessageRead: (id, read) => set({ messages: get().messages.map((m) => (m.id === id ? { ...m, read } : m)) }),

      saveProduct: (product) => {
        const { products, activity } = get();
        const existing = products.find((p) => p.id === product.id);
        const notes: string[] = [];
        if (!existing) notes.push(`Product added: ${product.name}.`);
        else {
          if (existing.priceINR !== product.priceINR) notes.push(`Price changed on ${product.name}: ${existing.priceINR ?? "—"} → ${product.priceINR ?? "—"}.`);
          if (existing.stock.quantity !== product.stock.quantity || existing.stock.status !== product.stock.status) notes.push(`Stock updated on ${product.name}.`);
          if (!notes.length) notes.push(`Product edited: ${product.name}.`);
        }
        set({
          products: existing ? products.map((p) => (p.id === product.id ? product : p)) : [product, ...products],
          activity: notes.reduce((log, note) => withLog(log, note), activity),
        });
      },

      patchProduct: (id, patch) => {
        const { products, activity } = get();
        const current = products.find((p) => p.id === id);
        if (!current) return;
        const keys = Object.keys(patch).join(", ");
        set({
          products: products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          activity: withLog(activity, `${current.name}: ${keys} updated.`),
        });
      },

      setStock: (id, quantity, status) => {
        const { products, activity } = get();
        const current = products.find((p) => p.id === id);
        if (!current) return;
        const clean = quantity === null ? null : Math.max(0, Math.round(quantity));
        const nextStatus = status ?? (clean === null ? current.stock.status : clean > 0 ? "in_stock" : "out_of_stock");
        set({
          products: products.map((p) => (p.id === id ? { ...p, stock: { quantity: clean, status: nextStatus } } : p)),
          activity: withLog(
            activity,
            `Stock for ${current.name} set to ${clean === null ? "untracked" : clean} (${nextStatus.replace(/_/g, " ")}).`,
          ),
        });
      },

      deleteProduct: (id) => {
        const { products, cart, activity } = get();
        const current = products.find((p) => p.id === id);
        if (!current) return;
        set({
          products: products.filter((p) => p.id !== id),
          cart: cart.filter((line) => line.productId !== id),
          activity: withLog(activity, `Product removed: ${current.name}.`),
        });
      },

      updateCategory: (slug, patch) => {
        const { categories, activity } = get();
        set({
          categories: categories.map((c) => (c.slug === slug ? { ...c, ...patch } : c)),
          activity: withLog(activity, `Category updated: ${slug}.`),
        });
      },

      updateContent: (content) => set({ content, activity: withLog(get().activity, "Site content updated.") }),

      updateSettings: (settings) => set({ settings, activity: withLog(get().activity, "Settings updated.") }),

      resetDemo: () => {
        const now = Date.now();
        const data = initialData();
        set({
          ...data,
          seeded: true,
          orders: buildSampleOrders(data.products, now),
          enquiries: buildSampleEnquiries(data.products, now),
          activity: [entry("Demo data reset to the imported catalogue.")],
          storageWarning: null,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      skipHydration: true,
      partialize: (state): DemoData => ({
        seedVersion: state.seedVersion,
        seeded: state.seeded,
        products: state.products,
        categories: state.categories,
        cart: state.cart,
        orders: state.orders,
        enquiries: state.enquiries,
        messages: state.messages,
        content: state.content,
        settings: state.settings,
        activity: state.activity,
        orderSeq: state.orderSeq,
        enquirySeq: state.enquirySeq,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<DemoData> | undefined;
        if (!saved) return current;
        // If the seed catalogue has been re-imported, drop the stale browser copy.
        const sameSeed = saved.seedVersion === current.seedVersion;
        return {
          ...current,
          ...saved,
          seedVersion: current.seedVersion,
          products: sameSeed && Array.isArray(saved.products) ? saved.products : current.products,
          categories: sameSeed && Array.isArray(saved.categories) ? saved.categories : current.categories,
          content: { ...current.content, ...(saved.content ?? {}) },
          settings: { ...current.settings, ...(saved.settings ?? {}) },
        };
      },
    },
  ),
);

reportStorageProblem = (message) => {
  if (useDemoStore.getState().storageWarning !== message) useDemoStore.setState({ storageWarning: message });
};
