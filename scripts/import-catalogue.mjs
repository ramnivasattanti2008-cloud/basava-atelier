/**
 * One-off catalogue import.
 *
 * Reads the public Basava storefront (basava.store.link) and writes the product
 * facts shown on that page into src/data/products.json. Only fields a shopper
 * can see on the storefront are kept: name, price, size, colour, bag type,
 * material, description, stock, delivery time and image URLs.
 *
 * Nothing is invented here. Where the storefront does not state a value the
 * field is written as null, so the UI can say "not stated" instead of guessing.
 *
 * Run:  node scripts/import-catalogue.mjs
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_URL = "https://basava.store.link/";
const OUT_FILE = resolve(dirname(fileURLToPath(import.meta.url)), "../src/data/products.json");

/**
 * Category assignment follows the seven categories and item counts in the
 * business research report (section E). The storefront's own "bag type" field
 * is kept separately as `listedType`.
 */
const CATEGORY_BY_SLUG = {
  // Totes and carryalls — 11
  "textured-effortlessly-chic-genuine-leather-metallic-blackbindle-carryall": "totes-carryalls",
  "textured-and-versatile-everyday-genuine-leather-black-tote": "totes-carryalls",
  "textured-modern-twist-genuine-leather-metallic-black-tote": "totes-carryalls",
  "textured-stylish-genuine-leather-brown-tote-carryall": "totes-carryalls",
  "textured-modern-twist-genuine-leather-brown-tote": "totes-carryalls",
  "textured-trendy-genuine-leather-tote-shoulder-bag": "totes-carryalls",
  "textured-chic-and-spacious-genuine-leather-grey-tote": "totes-carryalls",
  "textured-chic-fringe-genuine-leather-black-tote": "totes-carryalls",
  "textured-functional-and-fashionable-genuine-leather-brown-tote-companion": "totes-carryalls",
  "textured-chic-and-spacious-genuine-leather-chocolate-tote-companion": "totes-carryalls",
  "textured-stylish-genuine-leather-sand-tote-carryall": "totes-carryalls",
  // Crossbody bags — 5
  "sleek-and-stylish-genuine-leather-black-crossbody-tote": "crossbody-bags",
  "functional-and-fashionable-genuine-leather-black-crossbody-companion": "crossbody-bags",
  "textured-rugged-explorer-genuine-leather-and-canvas-brown-crossbody": "crossbody-bags",
  "textured-effortless-genuine-leather-chic-red-crossbody": "crossbody-bags",
  "solid-safari-explorers-genuine-leather-black-crossbody": "crossbody-bags",
  // Sling bags — 5
  "textured-leather-chic-genuine-brown-sling-bag": "sling-bags",
  "textured-urban-explorer-genuine-leather-sand-sling-bag": "sling-bags",
  "textured-chic-genuine-leather-metallic-black-sling-bag": "sling-bags",
  "solid-fashionable-genuine-leather-black-shoulder-sling-bag": "sling-bags",
  "solid-urban-explorer-genuine-leather-dark-blue-sling-bag": "sling-bags",
  // Shoulder and messenger bags — 2
  "textured-stylish-canvas-and-leather-green-shoulder-messenger-bag": "shoulder-messenger-bags",
  "solid-classic-genuine-leather-grey-shoulder-bag": "shoulder-messenger-bags",
  // Handbags — 4
  "solid-ocean-breeze-genuine-leather-blue-hand-held-bag": "handbags",
  "solid-timeless-beauty-genuine-leather-black-handheld-bag": "handbags",
  "solid-elegant-genuine-leather-black-satchel-handbag": "handbags",
  "chic-and-compact-genuine-leather-black-baguette-bag": "handbags",
  // Envelope bags — 6
  "textured-ethereal-whispers-genuine-leather-pink-envelope-bag": "envelope-bags",
  "textured-pearlescent-dreams-genuine-leather-pink-envelope-bag": "envelope-bags",
  "textured-modern-simplicity-genuine-leather-gold-envelope-bag": "envelope-bags",
  "textured-vintage-elegance-genuine-leather-beige-envelope-bag": "envelope-bags",
  "textured-rustic-romance-genuine-leather-brown-envelope-bag": "envelope-bags",
  "textured-golden-allure-genuine-leather-gold-envelope-bag": "envelope-bags",
  // Wristlets, wallets and purses — 7
  "textured-chic-and-compact-genuine-leather-black-wristlet-purse": "wristlets-wallets",
  "texured-effortlessly-cool-genuine-leather-brown-wrislet-purse": "wristlets-wallets",
  "textured-versatile-genuine-leather-brown-wristlet-wallet": "wristlets-wallets",
  "textured-functional-and-fashionable-genuine-leather-brown-wristlet-companion": "wristlets-wallets",
  "textured-urban-genuine-leather-black-wrislet": "wristlets-wallets",
  "textured-trendy-genuine-leather-metallic-black-wristlet": "wristlets-wallets",
  "textured-functional-and-fashionable-genuine-leather-metallic-black-wristlet-companion": "wristlets-wallets",
};

/** Merchandising choice for the demo homepage. Not a business fact. */
const FEATURED = new Set([
  "textured-stylish-genuine-leather-sand-tote-carryall",
  "textured-chic-fringe-genuine-leather-black-tote",
  "solid-safari-explorers-genuine-leather-black-crossbody",
  "textured-urban-explorer-genuine-leather-sand-sling-bag",
  "solid-classic-genuine-leather-grey-shoulder-bag",
  "solid-elegant-genuine-leather-black-satchel-handbag",
  "textured-effortless-genuine-leather-chic-red-crossbody",
  "textured-versatile-genuine-leather-brown-wristlet-wallet",
]);

/** "L-8, W-7,D-1.5" -> { length: 8, width: 7, depth: 1.5 } */
function parseDimensions(raw) {
  if (!raw || typeof raw !== "string") return null;
  const grab = (letters) => {
    const m = raw.match(new RegExp(`(?:^|[\\s,])(?:${letters})\\s*-\\s*([0-9]+(?:\\.[0-9]+)?)`, "i"));
    return m ? Number(m[1]) : null;
  };
  const length = grab("L");
  const width = grab("W");
  const depth = grab("B|D");
  if (length === null && width === null && depth === null) return null;
  return {
    length,
    width,
    depth,
    // The storefront does not state a unit of measure.
    unit: null,
    asListed: raw.replace(/\s+/g, " ").trim(),
  };
}

function clean(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).replace(/\s+/g, " ").trim();
  return s.length ? s : null;
}

async function main() {
  const res = await fetch(SOURCE_URL, {
    headers: { "user-agent": "kris-designs-demo-catalogue-import/1.0", accept: "text/html" },
  });
  if (!res.ok) throw new Error(`Storefront responded ${res.status}`);
  const html = await res.text();

  const m = html.match(/<script id="vite-plugin-ssr_pageContext"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error("Could not find the storefront's product data in the page.");
  const ctx = JSON.parse(m[1]);
  const fallback = ctx.pageContext?.fallback ?? {};
  const key = Object.keys(fallback).find((k) => k.includes("/products"));
  const listed = key ? fallback[key].flat() : [];
  if (!listed.length) throw new Error("No products found in the storefront data.");

  const unknown = [];
  const products = listed.map((item, index) => {
    const variant = item.variants?.[0] ?? {};
    const props = variant.properties ?? {};
    const value = variant.value ?? {};
    const slug = item.slug;
    const category = CATEGORY_BY_SLUG[slug];
    if (!category) unknown.push(slug);

    const firstImage = (variant.images ?? [])[0] ?? "";
    const skuMatch = firstImage.match(/-([a-z]{2,4}\d{3}[a-z]{2}\d{2})_\d+/i);
    const stock = typeof variant.stock === "number" ? variant.stock : null;
    const colour = clean(value.color ?? props.color);

    return {
      id: `kd-${String(index + 1).padStart(3, "0")}`,
      sku: skuMatch ? skuMatch[1].toUpperCase() : null,
      name: clean(item.name),
      slug,
      category: category ?? "uncategorised",
      listedType: clean(value["bag-type"] ?? props["bag-type"]),
      priceINR: typeof variant.price === "number" ? variant.price : null,
      description: clean(variant.description),
      images: (variant.images ?? []).filter((u) => typeof u === "string" && u.startsWith("https://")),
      colours: colour ? [colour] : [],
      material: clean(value.material ?? props.material),
      leatherGrade: null,
      stock: {
        quantity: stock,
        status: stock === null ? "unknown" : stock > 0 ? "in_stock" : "out_of_stock",
      },
      dimensions: parseDimensions(value.size ?? (Array.isArray(props.size) ? props.size.join(",") : props.size)),
      careInstructions: clean(props["care-instructions"]),
      deliveryTime: clean(props["delivery-time"]),
      featured: FEATURED.has(slug),
      customisable: null,
      visible: variant.availability ? variant.availability === "Show" : true,
      source: {
        origin: "basava.store.link",
        listedBrand: clean(props.brand),
        variantCount: item.variants?.length ?? 0,
      },
    };
  });

  if (unknown.length) {
    console.warn(`\n${unknown.length} product(s) have no category mapping:\n  ${unknown.join("\n  ")}\n`);
  }

  const payload = {
    meta: {
      source: SOURCE_URL,
      importedAt: new Date().toISOString().slice(0, 10),
      productCount: products.length,
      currency: "INR",
      note: "Names, prices, stock and specifications are copied as listed on the public storefront and have not been reconfirmed with the owner. Treat as demo data.",
    },
    products,
  };

  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8");

  const prices = products.map((p) => p.priceINR).filter((n) => typeof n === "number").sort((a, b) => a - b);
  const mid = prices.length / 2;
  const median = prices.length % 2 ? prices[Math.floor(mid)] : (prices[mid - 1] + prices[mid]) / 2;
  const byCat = products.reduce((acc, p) => ((acc[p.category] = (acc[p.category] ?? 0) + 1), acc), {});
  console.log(`Wrote ${products.length} products to ${OUT_FILE}`);
  console.log(`Price range ₹${prices[0]}–₹${prices.at(-1)}, median ₹${median}, mean ₹${Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)}`);
  console.log("By category:", byCat);
  console.log("Out of stock:", products.filter((p) => p.stock.status === "out_of_stock").map((p) => p.name));
  console.log("Images:", products.reduce((n, p) => n + p.images.length, 0));
  console.log("Stock quantities:", products.map((p) => p.stock.quantity).join(","));
  console.log("Colours:", [...new Set(products.flatMap((p) => p.colours))].join(" | "));
  console.log("Materials:", [...new Set(products.map((p) => p.material))].join(" | "));
  console.log("Delivery:", [...new Set(products.map((p) => p.deliveryTime))].join(" | "));
  console.log("Care:", [...new Set(products.map((p) => p.careInstructions))].join(" | "));
  console.log("Variants per product:", [...new Set(products.map((p) => p.source.variantCount))].join(","));
  console.log("Descriptions distinct:", new Set(products.map((p) => p.description)).size);
  console.log("SKUs missing:", products.filter((p) => !p.sku).length, "| visible false:", products.filter((p) => !p.visible).length);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
