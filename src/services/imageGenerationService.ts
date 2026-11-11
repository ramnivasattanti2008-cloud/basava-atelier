import type {
  BespokeDesignConfig,
  ConceptViewType,
  ConceptImage,
} from "@/lib/studio-types";
import { defaultBespokeDesign } from "@/data/studio-defaults";
import { IMAGE_GENERATION_TRAINING_SPEC } from "@/data/atelierKnowledgeBase";
import productsData from "@/data/products.json";

export const CONCEPT_DISCLAIMER =
  "BESPOKE ATELIER SPECIFICATION · HANDCRAFTED IN BENGALURU";

export class ImageGenerationService {
  /**
   * Safely normalizes partial or undefined config parameters with defaults.
   */
  public static normalizeConfig(incoming?: Partial<BespokeDesignConfig>): BespokeDesignConfig {
    const base = { ...defaultBespokeDesign, ...(incoming || {}) };
    return {
      ...base,
      dimensions: {
        ...defaultBespokeDesign.dimensions,
        ...(incoming?.dimensions || {}),
      },
      interior: {
        ...defaultBespokeDesign.interior,
        ...(incoming?.interior || {}),
      },
      personalisation: {
        ...defaultBespokeDesign.personalisation,
        ...(incoming?.personalisation || {}),
      },
      straps: incoming?.straps || defaultBespokeDesign.straps,
    };
  }

  /**
   * Generates all 4 studio views (front, angle, interior, detail) for a bespoke bag configuration.
   */
  static async generateConceptViews(
    config: BespokeDesignConfig
  ): Promise<Record<ConceptViewType, ConceptImage>> {
    const safeConfig = this.normalizeConfig(config);
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let provider: ConceptImage["provider"] = "studio-engine";
    if (geminiKey) {
      provider = "gemini";
    } else if (openaiKey) {
      provider = "openai";
    }

    const timestamp = new Date().toISOString();

    const [front, angle, interior, detail] = await Promise.all([
      this.renderView(safeConfig, "front", provider, geminiKey, openaiKey, timestamp),
      this.renderView(safeConfig, "angle", provider, geminiKey, openaiKey, timestamp),
      this.renderView(safeConfig, "interior", provider, geminiKey, openaiKey, timestamp),
      this.renderView(safeConfig, "detail", provider, geminiKey, openaiKey, timestamp),
    ]);

    return { front, angle, interior, detail };
  }

  /**
   * Renders a specific view using the active AI provider or our photorealistic studio engine.
   */
  private static async renderView(
    config: BespokeDesignConfig,
    view: ConceptViewType,
    provider: ConceptImage["provider"],
    geminiKey: string | undefined,
    openaiKey: string | undefined,
    timestamp: string
  ): Promise<ConceptImage> {
    const prompt = this.constructLuxuryPrompt(config, view);
    const blueprintUrl = this.generateStudioConceptSVG(config, view);
    let imageUrl = "";

    // 1. Try Google Gemini Imagen if API key is configured
    if (geminiKey) {
      try {
        const aiUrl = await this.generateWithGeminiImagen(geminiKey, prompt);
        if (aiUrl) imageUrl = aiUrl;
      } catch (err) {
        console.warn(`Gemini Imagen generation failed for ${view}, falling back to studio renderer:`, err);
      }
    }

    // 2. Try OpenAI DALL-E 3 if API key is configured
    if (!imageUrl && openaiKey) {
      try {
        const aiUrl = await this.generateWithOpenAI(openaiKey, prompt);
        if (aiUrl) imageUrl = aiUrl;
      } catch (err) {
        console.warn(`OpenAI DALL-E generation failed for ${view}, falling back to studio renderer:`, err);
      }
    }

    // 3. Fallback: Atelier Master Photorealistic Studio Photography Engine
    if (!imageUrl) {
      imageUrl = this.getPhotorealisticStudioImage(config, view);
    }

    const labels: Record<ConceptViewType, string> = {
      front: "Front Elevation Studio Portrait",
      angle: "3/4 Perspective Profile",
      interior: "Interior Architecture & Lining",
      detail: "Craftsmanship & 24K Monogram Macro",
    };

    return {
      id: `img-${view}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      view,
      label: labels[view],
      url: imageUrl,
      blueprintUrl,
      prompt,
      provider: imageUrl.startsWith("https://") ? "studio-engine" : (imageUrl.startsWith("data:image/svg+xml") ? "studio-engine" : provider),
      generatedAt: timestamp,
      disclaimer: CONCEPT_DISCLAIMER,
    };
  }

  /**
   * Master Atelier Photorealistic Studio Photography Engine.
   * Maps every bespoke bag configuration to authentic high-resolution studio photography
   * calibrated strictly to the patron's chosen silhouette AND leather colourway.
   */
  private static getPhotorealisticStudioImage(
    config: BespokeDesignConfig,
    view: ConceptViewType
  ): string {
    const bagType = config.bagType || "tote";
    const colorName = config.colourName || "Royal Saddle Tan";
    const lowerColor = colorName.toLowerCase();
    const hex = (config.colourHex || "").toLowerCase();

    // 1. Resolve exact colorway family
    let colorFamily: "black" | "tan" | "brown" | "cognac" | "olive" | "burgundy" | "sand" = "tan";
    if (lowerColor.includes("black") || lowerColor.includes("onyx") || hex === "#1a1a1a") {
      colorFamily = "black";
    } else if (lowerColor.includes("chocolate") || lowerColor.includes("espresso") || hex === "#3d2314") {
      colorFamily = "brown";
    } else if (lowerColor.includes("cognac") || lowerColor.includes("copper") || lowerColor.includes("amber") || hex === "#9e472a") {
      colorFamily = "cognac";
    } else if (lowerColor.includes("olive") || lowerColor.includes("green") || lowerColor.includes("nilgiri") || hex === "#4a5240") {
      colorFamily = "olive";
    } else if (lowerColor.includes("burgundy") || lowerColor.includes("wine") || lowerColor.includes("maroon") || lowerColor.includes("red") || hex === "#5c1d24") {
      colorFamily = "burgundy";
    } else if (lowerColor.includes("sand") || lowerColor.includes("beige") || lowerColor.includes("cream") || lowerColor.includes("hampi") || hex === "#c7b299") {
      colorFamily = "sand";
    } else {
      colorFamily = "tan";
    }

    // 2. High-Fidelity Color-True Editorial Photography Matrix
    const COLOR_STUDIO_SETS: Record<string, Record<ConceptViewType, string>> = {
      black: {
        front: "https://cdn.store.link/products/basava/4qeasr-bsh601bk02_1.jpg?versionId=xQkRvxKj9n7qEF4m6PmT8.G9t8tN9_PE",
        angle: "https://cdn.store.link/products/basava/1x0odb-bsh601bk02_2.jpg?versionId=37RS.pe9MrcEGQ10AGA9I1544cenjYlw",
        interior: "https://cdn.store.link/products/basava/trzch1-bsh601bk01_3.jpg?versionId=TGyeDjN5Kqx_IxaEqxeO80AHXNGOkY_v",
        detail: "https://cdn.store.link/products/basava/yn3qgr-bsh601bk02_5.jpg?versionId=R22yrrMvEZgNjlPazUhWPFcbPnWwPFL2",
      },
      tan: {
        front: "https://cdn.store.link/products/basava/li8fmr-btt601br02_1.jpg?versionId=cP_ukunXujglgdCD3ckq2CLCKt1E8C19",
        angle: "https://cdn.store.link/products/basava/e3gpfj-btt601br02_2.jpg?versionId=mlS8qVnpSxLlcEKYefvkFmfNumP4k3sm",
        interior: "https://cdn.store.link/products/basava/6c-21y-btt601br02_3.jpg?versionId=0waMf5.ItuyLcqW94R7DNVQGTQOG_8NF",
        detail: "https://cdn.store.link/products/basava/3om4td-btt601br02_5.jpg?versionId=QHs_CQolem_qr3fx9__V.V1z8RpbWosG",
      },
      cognac: {
        front: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
        angle: "https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=1200&q=85",
        interior: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
        detail: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
      },
      brown: {
        front: "https://cdn.store.link/products/basava/kt12t5-btt601ch01_1.jpg?versionId=xKjUPjAdDXJ8IiDKEeXtJ8CMURrRb2Ee",
        angle: "https://cdn.store.link/products/basava/yk4e7c-btt601ch01_2.jpg?versionId=w5rG.G.53Nmg0k8UvH2wGnZaqR9X2zQz",
        interior: "https://cdn.store.link/products/basava/vu-5of-btt601ch01_3.jpg?versionId=tLJ4AyOk9IIrQJpvjsoewWkIgNLJDPPQ",
        detail: "https://cdn.store.link/products/basava/10vxvv-btt601ch01_5.jpg?versionId=wyRojled7LbarjFx7TRlVWbqmKM0wHh4",
      },
      sand: {
        front: "https://cdn.store.link/products/basava/q1c-sh-btt601sa01_1.jpg?versionId=d_CePr5tYIBXXp46oBheNrclvfbhbg9H",
        angle: "https://cdn.store.link/products/basava/x3bvb0-btt601sa01_2.jpg?versionId=Ec_IDSPVWfra5Id.0Cei_RJcNvX9fs5k",
        interior: "https://cdn.store.link/products/basava/-vexzu-btt601sa01_3.jpg?versionId=pO.tvLAm28D_9xyySx9fsGD6GM0YWMeA",
        detail: "https://cdn.store.link/products/basava/g4w3uv-btt601sa01_5.jpg?versionId=YoduA3pKVQik.AhEkgBpaoY2SiuPLrxN",
      },
      olive: {
        front: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85",
        angle: "https://cdn.store.link/products/basava/g505-6-bsh601gr02_1.jpg?versionId=rUeXU25Xg40Q1a1c97Nf795h38h5H.f.",
        interior: "https://cdn.store.link/products/basava/3jeb9o-bsh601gr02_3.jpg?versionId=LqPzG18f_1u6Qe7rN6M_h21.05M7aK4_",
        detail: "https://cdn.store.link/products/basava/y0g17l-bsh601gr02_5.jpg?versionId=kQ92.o9r17f1A4e6a8G_320Mh12h.f3.",
      },
      burgundy: {
        front: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
        angle: "https://cdn.store.link/products/basava/q14n6y-bcb601rd01_1.jpg?versionId=BYVSGOlUyImJtW4lHTHlGIx6ejLoKZ0l",
        interior: "https://cdn.store.link/products/basava/833a21-bcb601rd01_3.jpg?versionId=3RBLBaJfljRd3mEXOK73QSFuQk8y.CfB",
        detail: "https://cdn.store.link/products/basava/1h8zio-bcb601rd01_5.jpg?versionId=R2iWmleZbL2m69mDr0GfPmwD8AuhWJaq",
      },
    };

    // 3. Silhouette-Specific Photography Library
    if (bagType === "laptop") {
      const laptopSets: Record<string, Record<ConceptViewType, string>> = {
        black: {
          front: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
          angle: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85",
          interior: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
          detail: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
        },
        brown: {
          front: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
          angle: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
          interior: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85",
          detail: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
        },
        tan: {
          front: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
          angle: "https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=1200&q=85",
          interior: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
          detail: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
        },
        cognac: {
          front: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
          angle: "https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=1200&q=85",
          interior: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
          detail: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
        },
      };
      const set = laptopSets[colorFamily] || laptopSets.tan;
      if (view === "detail" && config.personalisation?.enabled && config.personalisation?.text?.trim()) {
        return this.renderPersonalisedMacroPlate(config, set.detail);
      }
      return set[view];
    }

    if (bagType === "backpack") {
      const backpackSets: Record<string, Record<ConceptViewType, string>> = {
        black: {
          front: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=1200&q=85",
          angle: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
          interior: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
          detail: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
        },
        tan: {
          front: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
          angle: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
          interior: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85",
          detail: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
        },
      };
      const set = backpackSets[colorFamily] || backpackSets.tan;
      if (view === "detail" && config.personalisation?.enabled && config.personalisation?.text?.trim()) {
        return this.renderPersonalisedMacroPlate(config, set.detail);
      }
      return set[view];
    }

    if (bagType === "travel") {
      const travelSets: Record<string, Record<ConceptViewType, string>> = {
        black: {
          front: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
          angle: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85",
          interior: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
          detail: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
        },
        tan: {
          front: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
          angle: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
          interior: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85",
          detail: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
        },
      };
      const set = travelSets[colorFamily] || travelSets.tan;
      if (view === "detail" && config.personalisation?.enabled && config.personalisation?.text?.trim()) {
        return this.renderPersonalisedMacroPlate(config, set.detail);
      }
      return set[view];
    }

    // 4. Check for direct catalog category match
    const catMap: Record<string, string> = {
      tote: "totes-carryalls",
      crossbody: "crossbody-bags",
      sling: "sling-bags",
      handbag: "handbags",
      shoulder: "shoulder-messenger-bags",
      messenger: "shoulder-messenger-bags",
      clutch: "envelope-bags",
      wristlet: "wristlets-wallets",
    };

    const category = catMap[bagType];
    if (category) {
      const categoryProducts = (productsData?.products || []).filter(
        (p: any) => p.category === category
      );

      const matchingProduct = categoryProducts.find((p: any) =>
        p.colours?.some((c: string) => {
          const cLow = c.toLowerCase();
          if (colorFamily === "black") return cLow.includes("black");
          if (colorFamily === "brown") return cLow.includes("chocolate") || cLow.includes("brown");
          if (colorFamily === "sand") return cLow.includes("sand") || cLow.includes("beige");
          if (colorFamily === "olive") return cLow.includes("green");
          if (colorFamily === "burgundy") return cLow.includes("red") || cLow.includes("pink");
          if (colorFamily === "cognac" || colorFamily === "tan") return cLow.includes("brown") || cLow.includes("tan");
          return false;
        })
      );

      if (matchingProduct?.images && matchingProduct.images.length >= 4) {
        const imgs = matchingProduct.images;
        if (view === "front") return imgs[0];
        if (view === "angle") return imgs[1] || imgs[0];
        if (view === "interior") return imgs[2] || imgs[1];
        if (view === "detail") {
          if (config.personalisation?.enabled && config.personalisation?.text?.trim()) {
            return this.renderPersonalisedMacroPlate(config, imgs[4] || imgs[1]);
          }
          return imgs[4] || imgs[3] || imgs[1];
        }
      }
    }

    // 5. Fall back to the color-true studio set
    const fallbackSet = COLOR_STUDIO_SETS[colorFamily] || COLOR_STUDIO_SETS.tan;
    if (view === "detail" && config.personalisation?.enabled && config.personalisation?.text?.trim()) {
      return this.renderPersonalisedMacroPlate(config, fallbackSet.detail);
    }
    return fallbackSet[view] || this.generateStudioConceptSVG(config, view);
  }

  /**
   * Generates a photorealistic macro craftsmanship plate with the patron's 24K gold foil monogram
   * debossed directly into authentic high-resolution leather grain photography.
   */
  private static renderPersonalisedMacroPlate(
    config: BespokeDesignConfig,
    baseMacroPhotoUrl: string
  ): string {
    const rawInitials = (config.personalisation?.text || "BV").trim().toUpperCase();
    const initials = rawInitials
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const method = config.personalisation?.method === "blind-deboss" ? "BLIND HEAT DEBOSS" : "24K GOLD LEAF FOIL";
    const textFill = config.personalisation?.method === "blind-deboss" ? "rgba(35,22,14,0.85)" : "url(#goldFoilGrad)";

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 650" width="100%" height="100%">
  <defs>
    <linearGradient id="goldFoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF2" />
      <stop offset="25%" stop-color="#F5D77F" />
      <stop offset="65%" stop-color="#B38728" />
      <stop offset="85%" stop-color="#FBF5B7" />
      <stop offset="100%" stop-color="#AA771C" />
    </linearGradient>
    <filter id="debossDepth" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.8" flood-color="#000000" flood-opacity="0.8" />
      <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="0.8" flood-color="#FFFFFF" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- High-Resolution Real Macro Leather Photography -->
  <image href="${baseMacroPhotoUrl}" width="800" height="650" preserveAspectRatio="xMidYMid slice" />

  <!-- Subtle Studio Vignette -->
  <rect width="800" height="650" fill="rgba(20,15,10,0.18)" />

  <!-- Hot-Stamped 24K Gold Monogram Crest -->
  <g transform="translate(400, 325)">
    <rect x="-120" y="-55" width="240" height="110" rx="8" fill="rgba(25,18,12,0.42)" stroke="url(#goldFoilGrad)" stroke-width="1.2" />
    <text x="0" y="16" text-anchor="middle" fill="${textFill}" font-family="'Playfair Display', Georgia, serif" font-size="52" font-weight="700" letter-spacing="0.16em" filter="url(#debossDepth)">${initials}</text>
    <text x="0" y="40" text-anchor="middle" fill="#F4E2B8" font-family="'Manrope', sans-serif" font-size="9" font-weight="700" letter-spacing="0.22em">${method} · BENGALURU</text>
  </g>

  <!-- Official Atelier Specification Badge -->
  <g transform="translate(32, 612)">
    <rect x="0" y="-18" width="480" height="24" rx="2" fill="rgba(30,22,17,0.92)" stroke="rgba(202,163,89,0.4)" stroke-width="0.8" />
    <text x="12" y="-2" fill="#F4E2B8" font-family="'Manrope', sans-serif" font-size="9.5" font-weight="700" letter-spacing="0.14em">
      ${CONCEPT_DISCLAIMER} · ${config.colourName.toUpperCase().replace(/&/g, "&amp;")}
    </text>
  </g>
</svg>`.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  /**
   * Google Gemini Imagen 3 Generation with Diffusion Optics Conditioning.
   */
  private static async generateWithGeminiImagen(apiKey: string, prompt: string): Promise<string | null> {
    const candidateModels = ["imagen-3.0-generate-002"];
    for (const model of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`;
      const payload = {
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "4:3",
          outputMimeType: "image/jpeg",
          personGeneration: "dont_allow",
        },
      };

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(3500),
        });

        if (res.ok) {
          const data = await res.json();
          const b64 = data.predictions?.[0]?.bytesBase64Encoded;
          if (b64) {
            return `data:image/jpeg;base64,${b64}`;
          }
        }
      } catch {
        // continue to studio renderer fallback
      }
    }
    return null;
  }

  /**
   * OpenAI DALL-E 3 Generation with Natural Commercial Styling.
   */
  private static async generateWithOpenAI(apiKey: string, prompt: string): Promise<string | null> {
    try {
      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1024x1024",
          quality: "hd",
          style: "natural",
          response_format: "b64_json",
        }),
        signal: AbortSignal.timeout(4000),
      });

      if (!res.ok) return null;
      const data = await res.json();
      const b64 = data.data?.[0]?.b64_json;
      return b64 ? `data:image/jpeg;base64,${b64}` : null;
    } catch {
      return null;
    }
  }

  /**
   * Advanced Diffusion Optics Prompt Synthesizer.
   * Generates deep photographic instructions calibrated to Hasselblad medium-format optics,
   * natural leather pore rendering, Moradabad sand-cast brass reflections, and genuine saddle stitch mechanics.
   */
  public static constructLuxuryPrompt(config: BespokeDesignConfig, view: ConceptViewType): string {
    const bagTypeDesc: Record<string, string> = {
      tote: "classic flared luxury leather carryall tote bag with dual hand-rolled handles, wide structured base, and solid brass bridge rivets",
      laptop: "executive bespoke leather briefcase laptop carrier with dual rolled handles, solid brass #8 YKK Excella zipper collar, front document slip pocket, and luggage trolley strap",
      crossbody: "timeless structured leather crossbody bag with front curved flap, Moradabad sand-cast brass turn-lock clasp, and 7-hole adjustable roller buckle strap",
      sling: "minimalist urban explorer chest sling leather bag with ergonomic contoured shape, heavy diagonal brass zipper, and cast swivel clip",
      handbag: "sculptural architectural top-handle handbag with solid brass handle arch anchors, dome purse feet, and structured silhouette",
      shoulder: "relaxed curved crescent leather shoulder hobo bag with wide integrated shoulder strap and brass side O-rings",
      messenger: "heritage postman saddle leather messenger satchel with front dual flap straps, solid brass roller buckles, and padded shoulder rest",
      clutch: "sleek envelope leather clutch with clean geometric fold-over flap and miniature brass wristlet D-ring",
      wristlet: "compact leather zip wristlet wallet with solid brass #5 zipper and detachable wrist strap",
      travel: "luxurious 45-liter cylindrical leather weekender duffle bag with dual wrap-around top handles, luggage tag, and 6 base brass feet",
      backpack: "minimalist executive leather backpack with contoured dome silhouette, dual brass zip pulls, and padded shoulder straps",
      custom: "bespoke artisanal leather bag with hand-saddled linen stitching and glass-burnished beeswax edges",
    };

    const materialDesc: Record<string, string> = {
      "full-grain": "authentic 2.0mm Full-Grain Heirloom Leather (Purna Charma) showing intact natural hair follicle pores, subtle pastoral growth wrinkles, and rich vegetable tannin oil glow",
      "top-grain": "refined 1.5mm Top-Grain Leather with uniform silky smooth grain, subtle satin sheen, and clean architectural drape",
      "corrected-grain": "resilient corrected-grain leather with consistent architectural pebble embossing and water-resistant protective finish",
      "suede": "plush Nilgiri Velvet Suede / Roughout with a rich velvety matte nap and deep light absorption",
      "split-leather": "supple split leather with light vegetable wax conditioning and flexible hand-feel",
      "canvas-leather": "heavyweight 18oz waterproof paraffin-waxed duck canvas body paired with thick 3.5mm full-grain bridle leather straps and corner reinforcements",
    };

    const typeStr = bagTypeDesc[config.bagType] || "bespoke luxury leather bag";
    const matStr = materialDesc[config.material] || `${config.material} genuine vegetable-tanned leather`;
    const colStr = `${config.colourName} (${config.colourHex})`;
    const hwStr = `${(config.hardware || "antique-brass").replace("-", " ")} solid sand-cast brass fittings, rivets, and buckles from Moradabad`;
    const monoStr = config.personalisation?.enabled && config.personalisation?.text
      ? `personalized with hot-stamped 24K gold foil debossed monogram initials '${config.personalisation.text}' pressed 1.2mm deep into the hide grain with crisp Caslon serif typography`
      : "clean unembellished exterior";

    const cameraDirectives = `${IMAGE_GENERATION_TRAINING_SPEC.cameraOptics.cameraBody}, ${IMAGE_GENERATION_TRAINING_SPEC.cameraOptics.lens}, ${IMAGE_GENERATION_TRAINING_SPEC.cameraOptics.aperture}, ${IMAGE_GENERATION_TRAINING_SPEC.cameraOptics.lighting}, ${IMAGE_GENERATION_TRAINING_SPEC.cameraOptics.colorGrading}`;
    const negativeDirectives = `Negative prompt: ${IMAGE_GENERATION_TRAINING_SPEC.negativePromptRules.join(", ")}`;

    const viewDescriptions: Record<ConceptViewType, string> = {
      front: `Award-winning commercial product photography of a ${typeStr}, mastercrafted from ${matStr} in ${colStr}, adorned with ${hwStr}, ${monoStr}. Orthographic front elevation, perfectly symmetrical rolled handles, crisp 45-degree hand saddle stitching with French Lin Câblé linen thread, clean welted perimeter, volumetric floor drop shadow, ${cameraDirectives}. ${negativeDirectives}`,
      angle: `Three-quarters (3/4) perspective product photography of a ${typeStr}, showing 3D structural depth, side gusset thickness, shoulder strap drape with cast brass D-rings, ${colStr} ${matStr}, elegant ambient drop shadow, ${cameraDirectives}. ${negativeDirectives}`,
      interior: `Overhead 60-degree top-down open interior view looking into a ${typeStr}, revealing unbleached 240 GSM organic handspun Khadi cotton lining, cushioned 16-inch laptop compartment with leather snap, solid brass zippered pocket, leather card sleeves and brass swivel key leash, perfectly illuminated interior, ${cameraDirectives}. ${negativeDirectives}`,
      detail: `Extreme 1:1 macro close-up product photograph focusing on the glass-burnished beeswax edge, Lin Câblé #532 waxed linen saddle stitches piercing authentic awl puncture holes at a 45-degree angle, solid sand-cast brass rivet, and ${monoStr}, extreme surface resolution showing natural leather pores and hide texture, ${cameraDirectives}. ${negativeDirectives}`,
    };

    return viewDescriptions[view];
  }

  /**
   * Generates a photorealistic SVG concept plate matching the exact customer specifications.
   * Features physical bump-mapping lighting, material-specific surface shaders, 3D volumetric shading,
   * authentic stitch punch holes, cast brass metallurgy, and hot-stamped 24K gold foil debossing.
   */
  public static generateStudioConceptSVG(config: BespokeDesignConfig, view: ConceptViewType): string {
    const hex = config.colourHex || "#8A5D3B";
    const hwColor = config.hardware === "gold"
      ? "#E5C168"
      : config.hardware === "silver"
      ? "#C0C5CE"
      : config.hardware === "matte-black"
      ? "#2B2B2B"
      : "#C5A059";

    const rawInitials = (config.personalisation?.enabled && config.personalisation?.text?.trim()) || "BV";
    const initials = rawInitials
      .toUpperCase()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Tailor noise frequency and specularity to chosen leather grade
    const mat = config.material;
    const isPullUp = config.colourName.toLowerCase().includes("cognac") || config.colourName.toLowerCase().includes("pull-up");
    const baseFreq = mat === "full-grain" ? (isPullUp ? "0.04" : "0.052") : mat === "suede" ? "0.08" : "0.035";
    const octaves = mat === "full-grain" ? "5" : mat === "suede" ? "6" : "4";
    const specScale = mat === "full-grain" ? (isPullUp ? "3.2" : "2.6") : mat === "suede" ? "0.5" : "2.0";
    const specExponent = mat === "suede" ? "8" : isPullUp ? "35" : "25";

    let svgBody = "";

    if (view === "front") {
      svgBody = this.renderFrontSvg(config, hex, hwColor, initials);
    } else if (view === "angle") {
      svgBody = this.renderAngleSvg(config, hex, hwColor, initials);
    } else if (view === "interior") {
      svgBody = this.renderInteriorSvg(config, hex, hwColor);
    } else {
      svgBody = this.renderDetailSvg(config, hex, hwColor, initials);
    }

    const fullSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 650" width="100%" height="100%">
  <defs>
    <!-- Studio Ambient Radial Vignette Background -->
    <radialGradient id="studioLighting" cx="50%" cy="38%" r="65%">
      <stop offset="0%" stop-color="#FAF7F2" />
      <stop offset="55%" stop-color="#ECE3D4" />
      <stop offset="100%" stop-color="#DACBB7" />
    </radialGradient>

    <!-- 3-Tier Volumetric Pedestal Floor Shadows -->
    <radialGradient id="tightContactShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(25,16,10,0.58)" />
      <stop offset="50%" stop-color="rgba(25,16,10,0.18)" />
      <stop offset="100%" stop-color="rgba(25,16,10,0)" />
    </radialGradient>
    <radialGradient id="ambientFloorShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(48,37,30,0.28)" />
      <stop offset="65%" stop-color="rgba(48,37,30,0.06)" />
      <stop offset="100%" stop-color="rgba(48,37,30,0)" />
    </radialGradient>

    <!-- Material-Specific Physical 3D Leather Bump-Mapping & Surface Lighting Filter -->
    <filter id="leatherRealisticTexture" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="${octaves}" result="noise" />
      <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" in="noise" result="mono" />
      <feDiffuseLighting in="mono" lighting-color="#FFF9ED" surfaceScale="2.2" result="diffuse">
        <fePointLight x="360" y="160" z="280" />
      </feDiffuseLighting>
      <feBlend mode="multiply" in="SourceGraphic" in2="diffuse" result="textured" />
      <feSpecularLighting in="mono" surfaceScale="${specScale}" specularConstant="0.4" specularExponent="${specExponent}" lighting-color="#FFFFFF" result="specular">
        <fePointLight x="360" y="160" z="280" />
      </feSpecularLighting>
      <feComposite in="specular" in2="SourceGraphic" operator="in" result="specularCut" />
      <feBlend mode="screen" in="textured" in2="specularCut" />
    </filter>

    <!-- Volumetric Leather Body Shading Gradient -->
    <linearGradient id="volumetricShine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.22" />
      <stop offset="25%" stop-color="#FFFFFF" stop-opacity="0.06" />
      <stop offset="65%" stop-color="#000000" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.42" />
    </linearGradient>

    <!-- Cylindrical Handle Shading Gradient -->
    <linearGradient id="handleCylinder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.32" />
      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.05" />
      <stop offset="80%" stop-color="#000000" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.55" />
    </linearGradient>

    <!-- Sand-Cast Solid Brass / Metallurgy Gradient -->
    <linearGradient id="brassMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF9E0" />
      <stop offset="30%" stop-color="${hwColor}" />
      <stop offset="70%" stop-color="#6E4D1B" />
      <stop offset="85%" stop-color="${hwColor}" />
      <stop offset="100%" stop-color="#FFF9E0" />
    </linearGradient>

    <!-- 24K Gold Leaf Foil Hot-Stamp Gradient -->
    <linearGradient id="goldFoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF2" />
      <stop offset="30%" stop-color="#F5D77F" />
      <stop offset="70%" stop-color="#B38728" />
      <stop offset="90%" stop-color="#FBF5B7" />
      <stop offset="100%" stop-color="#AA771C" />
    </linearGradient>

    <!-- Khadi Organic Cotton Weave Pattern -->
    <pattern id="khadiWeave" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#F4EFE6" />
      <path d="M 0 4 L 8 4 M 4 0 L 4 8" stroke="#D8CEBD" stroke-width="0.8" />
      <path d="M 2 2 L 6 6 M 6 2 L 2 6" stroke="#E6DDCF" stroke-width="0.5" />
    </pattern>
  </defs>

  <!-- Studio Stage Background -->
  <rect width="800" height="650" fill="url(#studioLighting)" />

  <!-- Pedestal Floor Shadows -->
  <ellipse cx="400" cy="570" rx="340" ry="38" fill="url(#ambientFloorShadow)" />
  <ellipse cx="400" cy="565" rx="220" ry="20" fill="url(#tightContactShadow)" />

  <!-- The Volumetric Handcrafted Bag -->
  ${svgBody}

  <!-- Watermark & Official Atelier Specification Badge -->
  <g transform="translate(32, 612)">
    <rect x="0" y="-18" width="460" height="24" rx="2" fill="rgba(30,22,17,0.85)" stroke="rgba(202,163,89,0.3)" stroke-width="0.8" />
    <text x="12" y="-2" fill="#F4E2B8" font-family="'Manrope', sans-serif" font-size="9.5" font-weight="700" letter-spacing="0.14em">
      ${CONCEPT_DISCLAIMER} · ${config.colourName.toUpperCase().replace(/&/g, "&amp;")}
    </text>
  </g>

  <!-- View Angle Indicator -->
  <g transform="translate(640, 42)">
    <rect x="-10" y="-16" width="140" height="24" rx="2" fill="rgba(30,22,17,0.08)" stroke="rgba(30,22,17,0.25)" stroke-width="0.8" />
    <text x="60" y="0" fill="#30251E" font-family="'Manrope', sans-serif" font-size="10.5" font-weight="700" text-anchor="middle" letter-spacing="0.14em">
      ${view.toUpperCase()} VIEW
    </text>
  </g>
</svg>
`;

    // Plain SVG needs hyphenated attribute names; the React-style spellings
    // (stopColor, stopOpacity) are ignored by browsers and render as black.
    const validSvg = fullSvg
      .replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, "&amp;")
      .replace(/([^\s>])stop-color=/g, "$1 stop-color=")
      .replace(/([^\s>])stop-opacity=/g, "$1 stop-opacity=")
      .replace(/\s*stopColor=/g, " stop-color=")
      .replace(/\s*stopOpacity=/g, " stop-opacity=");
    return `data:image/svg+xml;utf8,${encodeURIComponent(validSvg)}`;
  }

  /**
   * Renders the front elevation for ALL 12 bag silhouettes.
   */
  private static renderFrontSvg(config: BespokeDesignConfig, hex: string, hwColor: string, initials: string): string {
    const type = config.bagType;

    // 1. Envelope Clutch
    if (type === "clutch") {
      return `
        <!-- Envelope Clutch Body -->
        <g transform="translate(200, 230)">
          <rect x="0" y="0" width="400" height="250" rx="8" fill="${hex}" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.32))" />
          <rect x="0" y="0" width="400" height="250" rx="8" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <rect x="0" y="0" width="400" height="250" rx="8" fill="url(#volumetricShine)" />
          <rect x="8" y="8" width="384" height="234" rx="6" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.4" stroke-dasharray="5 3" />
          
          <!-- Geometric Fold-Over Flap -->
          <path d="M 0 0 L 200 135 L 400 0 Z" fill="${hex}" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.22))" />
          <path d="M 0 0 L 200 135 L 400 0 Z" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <path d="M 0 0 L 200 135 L 400 0 Z" fill="url(#volumetricShine)" />
          <path d="M 8 5 L 200 126 L 392 5" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.4" stroke-dasharray="5 3" />

          <!-- Center Solid Sand-Cast Brass Lock Clasp -->
          <circle cx="200" cy="135" r="16" fill="url(#brassMetalGrad)" stroke="#4A3416" stroke-width="1.2" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.35))" />
          <circle cx="200" cy="135" r="12" fill="none" stroke="#6E4D1B" stroke-width="0.8" stroke-dasharray="2 2" />
          <rect x="194" y="126" width="12" height="18" rx="2" fill="#20150B" />

          <!-- 24K Hot-Stamped Gold Monogram -->
          ${config.personalisation?.enabled ? `
            <g transform="translate(200, 212)">
              <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="28" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.75))">
                ${initials}
              </text>
            </g>
          ` : ""}
        </g>
      `;
    }

    // 2. Artisanal Zip Wristlet
    if (type === "wristlet") {
      return `
        <!-- Artisanal Zip Wristlet -->
        <g transform="translate(230, 240)">
          <!-- Wrist Loop Strap -->
          <path d="M -35 25 C -75 25, -75 140, -35 140" fill="none" stroke="${hex}" stroke-width="14" stroke-linecap="round" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.25))" />
          <path d="M -35 25 C -75 25, -75 140, -35 140" fill="none" stroke="${hex}" stroke-width="14" stroke-linecap="round" filter="url(#leatherRealisticTexture)" />
          <circle cx="-35" cy="25" r="7" fill="url(#brassMetalGrad)" />

          <!-- Main Body -->
          <rect x="0" y="0" width="340" height="210" rx="14" fill="${hex}" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.32))" />
          <rect x="0" y="0" width="340" height="210" rx="14" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <rect x="0" y="0" width="340" height="210" rx="14" fill="url(#volumetricShine)" />
          <rect x="10" y="10" width="320" height="190" rx="10" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="1.3" stroke-dasharray="5 3" />

          <!-- Top Brass Zipper Track -->
          <line x1="15" y1="12" x2="325" y2="12" stroke="url(#brassMetalGrad)" stroke-width="4" />
          <circle cx="28" cy="12" r="5" fill="url(#brassMetalGrad)" />

          <!-- Monogram -->
          ${config.personalisation?.enabled ? `
            <g transform="translate(170, 135)">
              <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="28" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.75))">
                ${initials}
              </text>
              <text x="0" y="16" font-family="'Manrope', sans-serif" font-size="7.5" font-weight="600" fill="#E8CB85" text-anchor="middle" letter-spacing="0.2em">
                BENGALURU
              </text>
            </g>
          ` : ""}
        </g>
      `;
    }

    // 3. Urban Explorer Chest Sling
    if (type === "sling") {
      return `
        <!-- Urban Explorer Chest Sling -->
        <g transform="translate(250, 140)">
          <!-- Wide Leather Cross-Body Harness Strap -->
          <path d="M 20 -40 C 60 -110, 220 -90, 260 20" fill="none" stroke="${hex}" stroke-width="42" stroke-linecap="round" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.25))" />
          <path d="M 20 -40 C 60 -110, 220 -90, 260 20" fill="none" stroke="${hex}" stroke-width="42" stroke-linecap="round" filter="url(#leatherRealisticTexture)" />
          <path d="M 20 -40 C 60 -110, 220 -90, 260 20" fill="none" stroke="url(#handleCylinder)" stroke-width="42" stroke-linecap="round" />
          <path d="M 20 -40 C 60 -110, 220 -90, 260 20" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-dasharray="5 3" />

          <!-- Ergonomic Contoured Main Body -->
          <rect x="0" y="40" width="300" height="400" rx="36" fill="${hex}" filter="drop-shadow(0 25px 35px rgba(0,0,0,0.32))" />
          <rect x="0" y="40" width="300" height="400" rx="36" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <rect x="0" y="40" width="300" height="400" rx="36" fill="url(#volumetricShine)" />
          <rect x="14" y="54" width="272" height="372" rx="26" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="1.4" stroke-dasharray="5 4" />

          <!-- Asymmetric Solid Brass Zipper Track -->
          <path d="M 25 180 L 275 110" stroke="url(#brassMetalGrad)" stroke-width="8" stroke-linecap="round" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))" />
          <circle cx="255" cy="116" r="9" fill="url(#brassMetalGrad)" />
          <rect x="253" y="116" width="4" height="28" rx="2" fill="${hex}" stroke="#1E1610" stroke-width="0.8" />

          <!-- 24K Gold Debossed Initials -->
          ${config.personalisation?.enabled ? `
            <g transform="translate(150, 320)">
              <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="32" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.75))">
                ${initials}
              </text>
              <text x="0" y="16" font-family="'Manrope', sans-serif" font-size="7.5" font-weight="600" fill="#E8CB85" text-anchor="middle" letter-spacing="0.25em" opacity="0.85">
                BENGALURU ATELIER
              </text>
            </g>
          ` : ""}
        </g>
      `;
    }

    // 4. Structured Everyday Crossbody
    if (type === "crossbody") {
      return `
        <!-- Structured Everyday Crossbody -->
        <g transform="translate(230, 120)">
          <!-- Long Adjustable Shoulder Strap -->
          <path d="M 60 130 C 60 -60, 280 -60, 280 130" fill="none" stroke="${hex}" stroke-width="22" stroke-linecap="round" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.22))" />
          <path d="M 60 130 C 60 -60, 280 -60, 280 130" fill="none" stroke="${hex}" stroke-width="22" stroke-linecap="round" filter="url(#leatherRealisticTexture)" />
          <path d="M 60 130 C 60 -60, 280 -60, 280 130" fill="none" stroke="url(#handleCylinder)" stroke-width="22" stroke-linecap="round" />
          <path d="M 60 130 C 60 -60, 280 -60, 280 130" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-dasharray="5 3" />

          <!-- Main Structured Body Box -->
          <rect x="20" y="110" width="300" height="340" rx="18" fill="${hex}" filter="drop-shadow(0 25px 35px rgba(0,0,0,0.32))" />
          <rect x="20" y="110" width="300" height="340" rx="18" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <rect x="20" y="110" width="300" height="340" rx="18" fill="url(#volumetricShine)" />

          <!-- Front Curved Flap with Welted Edge -->
          <path d="M 20 110 L 320 110 L 320 280 C 320 320, 20 320, 20 280 Z" fill="${hex}" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.25))" />
          <path d="M 20 110 L 320 110 L 320 280 C 320 320, 20 320, 20 280 Z" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <path d="M 20 110 L 320 110 L 320 280 C 320 320, 20 320, 20 280 Z" fill="url(#volumetricShine)" />
          <path d="M 30 115 L 310 115 L 310 275 C 310 305, 30 305, 30 275 Z" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="1.4" stroke-dasharray="5 4" />

          <!-- Solid Sand-Cast Brass Turn-Lock Clasp -->
          <rect x="155" y="275" width="30" height="42" rx="4" fill="url(#brassMetalGrad)" stroke="#4A3416" stroke-width="1.2" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.35))" />
          <ellipse cx="170" cy="296" rx="6" ry="12" fill="#20150B" />
          <rect x="165" y="293" width="10" height="6" rx="1.5" fill="url(#brassMetalGrad)" />

          <!-- Monogram -->
          ${config.personalisation?.enabled ? `
            <g transform="translate(170, 395)">
              <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="28" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.75))">
                ${initials}
              </text>
            </g>
          ` : ""}
        </g>
      `;
    }

    // 5. Executive Laptop Briefcase
    if (type === "laptop") {
      return `
        <!-- Executive Laptop Briefcase -->
        <g transform="translate(190, 85)">
          <path d="M 120 130 C 120 -20, 300 -20, 300 130" fill="none" stroke="${hex}" stroke-width="22" stroke-linecap="round" filter="drop-shadow(0 12px 18px rgba(0,0,0,0.25))" />
          <path d="M 120 130 C 120 -20, 300 -20, 300 130" fill="none" stroke="${hex}" stroke-width="22" stroke-linecap="round" filter="url(#leatherRealisticTexture)" />
          <path d="M 120 130 C 120 -20, 300 -20, 300 130" fill="none" stroke="url(#handleCylinder)" stroke-width="22" stroke-linecap="round" />
          <path d="M 120 130 C 120 -20, 300 -20, 300 130" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.4" stroke-dasharray="5 3" />

          <rect x="20" y="110" width="380" height="360" rx="12" fill="${hex}" filter="drop-shadow(0 25px 38px rgba(0,0,0,0.35))" />
          <rect x="20" y="110" width="380" height="360" rx="12" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <rect x="20" y="110" width="380" height="360" rx="12" fill="url(#volumetricShine)" />
          <rect x="32" y="122" width="356" height="336" rx="8" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.6" stroke-dasharray="5 4" />

          <!-- Top Brass Zipper Collar Track -->
          <rect x="24" y="104" width="372" height="18" rx="3" fill="#1C130D" opacity="0.75" />
          <line x1="30" y1="113" x2="390" y2="113" stroke="url(#brassMetalGrad)" stroke-width="3" />

          <!-- Front Document Slip Pocket -->
          <path d="M 32 230 L 388 230 L 388 440 L 32 440 Z" fill="${hex}" filter="drop-shadow(0 5px 10px rgba(0,0,0,0.2))" />
          <path d="M 32 230 L 388 230 L 388 440 L 32 440 Z" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <path d="M 32 230 L 388 230 L 388 440 L 32 440 Z" fill="url(#volumetricShine)" />
          <line x1="32" y1="230" x2="388" y2="230" stroke="rgba(0,0,0,0.3)" stroke-width="1.5" />
          <rect x="42" y="240" width="336" height="190" rx="6" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" stroke-dasharray="5 4" />

          <!-- Handle Anchors with Sand-Cast Brass Studs -->
          <g transform="translate(110, 110)">
            <path d="M -5 0 L 25 0 L 20 45 L 0 45 Z" fill="${hex}" stroke="rgba(0,0,0,0.3)" stroke-width="1" />
            <circle cx="10" cy="22" r="6" fill="url(#brassMetalGrad)" stroke="#4A3416" stroke-width="1" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.4))" />
          </g>
          <g transform="translate(290, 110)">
            <path d="M -5 0 L 25 0 L 20 45 L 0 45 Z" fill="${hex}" stroke="rgba(0,0,0,0.3)" stroke-width="1" />
            <circle cx="10" cy="22" r="6" fill="url(#brassMetalGrad)" stroke="#4A3416" stroke-width="1" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.4))" />
          </g>

          <!-- 24K Hot-Stamped Gold Monogram -->
          ${config.personalisation?.enabled ? `
            <g transform="translate(210, 350)">
              <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="34" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.8))">
                ${initials}
              </text>
              <text x="0" y="18" font-family="'Manrope', sans-serif" font-size="8" font-weight="600" fill="#E8CB85" text-anchor="middle" letter-spacing="0.3em" opacity="0.9">
                BENGALURU · ATELIER
              </text>
            </g>
          ` : ""}

          <!-- 4 Bottom Base Feet -->
          <circle cx="50" cy="466" r="5" fill="url(#brassMetalGrad)" stroke="#3E270A" stroke-width="1" />
          <circle cx="370" cy="466" r="5" fill="url(#brassMetalGrad)" stroke="#3E270A" stroke-width="1" />
        </g>
      `;
    }

    // 6. Sculptural Architectural Top-Handle Handbag / Satchel
    if (type === "handbag") {
      return `
        <!-- Architectural Top-Handle Satchel -->
        <g transform="translate(220, 110)">
          <!-- Rigid Arching Leather Top Handle -->
          <path d="M 120 120 C 120 20, 240 20, 240 120" fill="none" stroke="${hex}" stroke-width="22" stroke-linecap="round" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.25))" />
          <path d="M 120 120 C 120 20, 240 20, 240 120" fill="none" stroke="${hex}" stroke-width="22" stroke-linecap="round" filter="url(#leatherRealisticTexture)" />
          <path d="M 120 120 C 120 20, 240 20, 240 120" fill="none" stroke="url(#handleCylinder)" stroke-width="22" stroke-linecap="round" />

          <!-- Trapezoidal Rigid Body -->
          <path d="M 40 120 L 320 120 L 340 430 L 20 430 Z" fill="${hex}" filter="drop-shadow(0 25px 35px rgba(0,0,0,0.32))" />
          <path d="M 40 120 L 320 120 L 340 430 L 20 430 Z" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <path d="M 40 120 L 320 120 L 340 430 L 20 430 Z" fill="url(#volumetricShine)" />
          <path d="M 50 130 L 310 130 L 328 418 L 32 418 Z" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="1.4" stroke-dasharray="5 4" />

          <!-- Solid Brass Handle Anchors -->
          <rect x="110" y="112" width="20" height="26" rx="4" fill="url(#brassMetalGrad)" />
          <rect x="230" y="112" width="20" height="26" rx="4" fill="url(#brassMetalGrad)" />

          <!-- Front Center Brass Clasp -->
          <rect x="165" y="220" width="30" height="38" rx="4" fill="url(#brassMetalGrad)" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.35))" />
          <circle cx="180" cy="239" r="6" fill="#20150B" />

          <!-- Monogram -->
          ${config.personalisation?.enabled ? `
            <g transform="translate(180, 360)">
              <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="30" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.75))">
                ${initials}
              </text>
            </g>
          ` : ""}
          <circle cx="45" cy="430" r="4.5" fill="url(#brassMetalGrad)" />
          <circle cx="315" cy="430" r="4.5" fill="url(#brassMetalGrad)" />
        </g>
      `;
    }

    // 7. Relaxed Contoured Shoulder Hobo
    if (type === "shoulder") {
      return `
        <!-- Relaxed Curved Shoulder Hobo -->
        <g transform="translate(210, 100)">
          <!-- Integrated Wide Curved Shoulder Strap -->
          <path d="M 50 140 C 50 -20, 330 -20, 330 140" fill="none" stroke="${hex}" stroke-width="34" stroke-linecap="round" filter="drop-shadow(0 12px 18px rgba(0,0,0,0.22))" />
          <path d="M 50 140 C 50 -20, 330 -20, 330 140" fill="none" stroke="${hex}" stroke-width="34" stroke-linecap="round" filter="url(#leatherRealisticTexture)" />
          <path d="M 50 140 C 50 -20, 330 -20, 330 140" fill="none" stroke="url(#handleCylinder)" stroke-width="34" stroke-linecap="round" />

          <!-- Crescent Slouch Body -->
          <path d="M 30 140 Q 190 200 350 140 Q 380 430 190 440 Q 0 430 30 140 Z" fill="${hex}" filter="drop-shadow(0 25px 35px rgba(0,0,0,0.32))" />
          <path d="M 30 140 Q 190 200 350 140 Q 380 430 190 440 Q 0 430 30 140 Z" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <path d="M 30 140 Q 190 200 350 140 Q 380 430 190 440 Q 0 430 30 140 Z" fill="url(#volumetricShine)" />

          <!-- Solid Brass Side Rings -->
          <circle cx="45" cy="140" r="14" fill="none" stroke="url(#brassMetalGrad)" stroke-width="5" />
          <circle cx="335" cy="140" r="14" fill="none" stroke="url(#brassMetalGrad)" stroke-width="5" />

          <!-- Monogram -->
          ${config.personalisation?.enabled ? `
            <g transform="translate(190, 340)">
              <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="32" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.75))">
                ${initials}
              </text>
            </g>
          ` : ""}
        </g>
      `;
    }

    // 8. Heritage Postman Messenger Satchel
    if (type === "messenger") {
      return `
        <!-- Heritage Messenger Satchel -->
        <g transform="translate(200, 110)">
          <!-- Top Grab Handle -->
          <path d="M 140 110 C 140 50, 260 50, 260 110" fill="none" stroke="${hex}" stroke-width="18" stroke-linecap="round" />
          <path d="M 140 110 C 140 50, 260 50, 260 110" fill="none" stroke="url(#handleCylinder)" stroke-width="18" stroke-linecap="round" />

          <!-- Main Box Body -->
          <rect x="20" y="110" width="360" height="340" rx="14" fill="${hex}" filter="drop-shadow(0 25px 35px rgba(0,0,0,0.32))" />
          <rect x="20" y="110" width="360" height="340" rx="14" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <rect x="20" y="110" width="360" height="340" rx="14" fill="url(#volumetricShine)" />

          <!-- Full Flap Over Face -->
          <path d="M 18 110 L 382 110 L 382 320 L 18 320 Z" fill="${hex}" filter="drop-shadow(0 8px 14px rgba(0,0,0,0.25))" />
          <path d="M 18 110 L 382 110 L 382 320 L 18 320 Z" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <path d="M 18 110 L 382 110 L 382 320 L 18 320 Z" fill="url(#volumetricShine)" />
          <rect x="28" y="118" width="344" height="192" rx="6" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.4" stroke-dasharray="5 4" />

          <!-- Dual Front Bridle Leather Straps & Brass Roller Buckles -->
          <g transform="translate(90, 110)">
            <rect x="0" y="0" width="22" height="270" rx="4" fill="#20150B" opacity="0.8" />
            <rect x="0" y="0" width="22" height="270" rx="4" fill="${hex}" filter="url(#leatherRealisticTexture)" />
            <rect x="-4" y="200" width="30" height="22" rx="3" fill="url(#brassMetalGrad)" stroke="#4A3416" stroke-width="1" />
          </g>
          <g transform="translate(290, 110)">
            <rect x="0" y="0" width="22" height="270" rx="4" fill="#20150B" opacity="0.8" />
            <rect x="0" y="0" width="22" height="270" rx="4" fill="${hex}" filter="url(#leatherRealisticTexture)" />
            <rect x="-4" y="200" width="30" height="22" rx="3" fill="url(#brassMetalGrad)" stroke="#4A3416" stroke-width="1" />
          </g>

          <!-- Monogram -->
          ${config.personalisation?.enabled ? `
            <g transform="translate(200, 245)">
              <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="30" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.75))">
                ${initials}
              </text>
            </g>
          ` : ""}
        </g>
      `;
    }

    // 9. 45-Litre Artisanal Weekender Duffle
    if (type === "travel") {
      return `
        <!-- Artisanal 45-Litre Weekender Duffle -->
        <g transform="translate(150, 130)">
          <!-- Dual Heavy Rolled Wrap-Around Handles -->
          <path d="M 180 120 C 180 0, 320 0, 320 120" fill="none" stroke="${hex}" stroke-width="24" stroke-linecap="round" filter="drop-shadow(0 12px 18px rgba(0,0,0,0.25))" />
          <path d="M 180 120 C 180 0, 320 0, 320 120" fill="none" stroke="${hex}" stroke-width="24" stroke-linecap="round" filter="url(#leatherRealisticTexture)" />
          <path d="M 180 120 C 180 0, 320 0, 320 120" fill="none" stroke="url(#handleCylinder)" stroke-width="24" stroke-linecap="round" />

          <!-- Barrel Cylindrical Main Body -->
          <rect x="20" y="120" width="460" height="300" rx="40" fill="${hex}" filter="drop-shadow(0 28px 40px rgba(0,0,0,0.35))" />
          <rect x="20" y="120" width="460" height="300" rx="40" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <rect x="20" y="120" width="460" height="300" rx="40" fill="url(#volumetricShine)" />

          <!-- Top Heavy Brass Zipper Collar Track -->
          <line x1="40" y1="126" x2="460" y2="126" stroke="url(#brassMetalGrad)" stroke-width="5" />

          <!-- Wrap-Around Harness Straps -->
          <rect x="140" y="120" width="26" height="300" fill="#20150B" opacity="0.65" />
          <rect x="140" y="120" width="26" height="300" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <rect x="334" y="120" width="26" height="300" fill="#20150B" opacity="0.65" />
          <rect x="334" y="120" width="26" height="300" fill="${hex}" filter="url(#leatherRealisticTexture)" />

          <!-- Hanging Luggage Tag -->
          <g transform="translate(345, 160)">
            <line x1="0" y1="0" x2="-8" y2="50" stroke="#2E1C0A" stroke-width="3" />
            <rect x="-24" y="50" width="32" height="52" rx="4" fill="${hex}" stroke="#2E1C0A" stroke-width="1" />
            <circle cx="-8" cy="58" r="3" fill="url(#brassMetalGrad)" />
          </g>

          <!-- Monogram -->
          ${config.personalisation?.enabled ? `
            <g transform="translate(250, 320)">
              <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="34" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.8))">
                ${initials}
              </text>
              <text x="0" y="18" font-family="'Manrope', sans-serif" font-size="8" font-weight="600" fill="#E8CB85" text-anchor="middle" letter-spacing="0.3em" opacity="0.9">
                BASAVA · BENGALURU
              </text>
            </g>
          ` : ""}

          <!-- 6 Protective Base Brass Feet -->
          <circle cx="50" cy="420" r="5" fill="url(#brassMetalGrad)" />
          <circle cx="150" cy="420" r="5" fill="url(#brassMetalGrad)" />
          <circle cx="350" cy="420" r="5" fill="url(#brassMetalGrad)" />
          <circle cx="450" cy="420" r="5" fill="url(#brassMetalGrad)" />
        </g>
      `;
    }

    // 10. Executive Minimalist Backpack
    if (type === "backpack") {
      return `
        <!-- Executive Minimalist Backpack -->
        <g transform="translate(230, 85)">
          <!-- Top Grab Loop -->
          <path d="M 120 100 C 120 40, 220 40, 220 100" fill="none" stroke="${hex}" stroke-width="16" stroke-linecap="round" />
          <path d="M 120 100 C 120 40, 220 40, 220 100" fill="none" stroke="url(#handleCylinder)" stroke-width="16" stroke-linecap="round" />

          <!-- Dome Curved Main Body -->
          <path d="M 30 200 C 30 90, 310 90, 310 200 L 310 450 C 310 470, 30 470, 30 450 Z" fill="${hex}" filter="drop-shadow(0 25px 38px rgba(0,0,0,0.35))" />
          <path d="M 30 200 C 30 90, 310 90, 310 200 L 310 450 C 310 470, 30 470, 30 450 Z" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <path d="M 30 200 C 30 90, 310 90, 310 200 L 310 450 C 310 470, 30 470, 30 450 Z" fill="url(#volumetricShine)" />

          <!-- Two-Way Curved Brass Zipper Arc -->
          <path d="M 45 200 C 45 110, 295 110, 295 200" fill="none" stroke="url(#brassMetalGrad)" stroke-width="4.5" />
          <circle cx="170" cy="116" r="6" fill="url(#brassMetalGrad)" />

          <!-- Front Gusseted Utility Pocket -->
          <rect x="55" y="270" width="230" height="170" rx="14" fill="${hex}" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.22))" />
          <rect x="55" y="270" width="230" height="170" rx="14" fill="${hex}" filter="url(#leatherRealisticTexture)" />
          <rect x="55" y="270" width="230" height="170" rx="14" fill="url(#volumetricShine)" />
          <line x1="65" y1="285" x2="275" y2="285" stroke="url(#brassMetalGrad)" stroke-width="3.5" />

          <!-- Monogram -->
          ${config.personalisation?.enabled ? `
            <g transform="translate(170, 365)">
              <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="30" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.8))">
                ${initials}
              </text>
              <text x="0" y="16" font-family="'Manrope', sans-serif" font-size="7.5" font-weight="600" fill="#E8CB85" text-anchor="middle" letter-spacing="0.25em">
                BENGALURU
              </text>
            </g>
          ` : ""}
        </g>
      `;
    }

    // 11 & 12. Signature Flared Heritage Tote (Default & Custom)
    return `
      <!-- Signature Flared Heritage Tote -->
      <g transform="translate(200, 85)">
        <path d="M 110 130 C 110 -35, 290 -35, 290 130" fill="none" stroke="${hex}" stroke-width="21" stroke-linecap="round" filter="drop-shadow(0 12px 18px rgba(0,0,0,0.22))" />
        <path d="M 110 130 C 110 -35, 290 -35, 290 130" fill="none" stroke="${hex}" stroke-width="21" stroke-linecap="round" filter="url(#leatherRealisticTexture)" />
        <path d="M 110 130 C 110 -35, 290 -35, 290 130" fill="none" stroke="url(#handleCylinder)" stroke-width="21" stroke-linecap="round" />
        <path d="M 110 130 C 110 -35, 290 -35, 290 130" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.3" stroke-dasharray="5 3" />

        <path d="M 15 110 L 385 110 L 350 465 L 50 465 Z" fill="${hex}" filter="drop-shadow(0 28px 40px rgba(0,0,0,0.35))" />
        <path d="M 15 110 L 385 110 L 350 465 L 50 465 Z" fill="${hex}" filter="url(#leatherRealisticTexture)" />
        <path d="M 15 110 L 385 110 L 350 465 L 50 465 Z" fill="url(#volumetricShine)" />

        <path d="M 28 122 L 372 122 L 340 452 L 60 452 Z" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-dasharray="5 4" />

        <!-- Top Rim Collar Binding -->
        <rect x="20" y="105" width="360" height="15" rx="3" fill="#1C130D" opacity="0.6" />
        <line x1="25" y1="112" x2="375" y2="112" stroke="url(#brassMetalGrad)" stroke-width="2.5" />

        <!-- Handle Anchors with Hand-Hammered Brass Rivets -->
        <g transform="translate(100, 110)">
          <path d="M 0 0 L 22 0 L 17 38 L 5 38 Z" fill="${hex}" stroke="rgba(0,0,0,0.25)" stroke-width="1" />
          <circle cx="11" cy="20" r="5.5" fill="url(#brassMetalGrad)" stroke="#4A3416" stroke-width="0.8" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))" />
        </g>
        <g transform="translate(280, 110)">
          <path d="M 0 0 L 22 0 L 17 38 L 5 38 Z" fill="${hex}" stroke="rgba(0,0,0,0.25)" stroke-width="1" />
          <circle cx="11" cy="20" r="5.5" fill="url(#brassMetalGrad)" stroke="#4A3416" stroke-width="0.8" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))" />
        </g>

        <!-- Hanging Artisan Cast Brass Medallion -->
        <g transform="translate(295, 148)">
          <line x1="0" y1="0" x2="-8" y2="65" stroke="#3A2111" stroke-width="3" />
          <circle cx="-8" cy="78" r="18" fill="url(#brassMetalGrad)" stroke="#5A3F18" stroke-width="1.2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.38))" />
          <circle cx="-8" cy="78" r="14" fill="none" stroke="#7A5826" stroke-width="0.8" stroke-dasharray="2 2" />
          <text x="-8" y="82" font-family="'Cormorant Garamond', serif" font-size="11" font-weight="700" fill="#2E1C0A" text-anchor="middle">
            BV
          </text>
        </g>

        <!-- 24K Hot-Stamped Gold Monogram -->
        ${config.personalisation?.enabled ? `
          <g transform="translate(200, 365)">
            <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="34" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.8))">
              ${initials}
            </text>
            <text x="0" y="18" font-family="'Manrope', sans-serif" font-size="8" font-weight="600" fill="#E8CB85" text-anchor="middle" letter-spacing="0.3em" opacity="0.9">
              BENGALURU · ATELIER
            </text>
          </g>
        ` : ""}

        <!-- Reinforced Bottom Base Corner Studs -->
        <circle cx="65" cy="457" r="4.5" fill="url(#brassMetalGrad)" stroke="#3E270A" stroke-width="1" />
        <circle cx="335" cy="457" r="4.5" fill="url(#brassMetalGrad)" stroke="#3E270A" stroke-width="1" />
      </g>
    `;
  }

  /**
   * Renders the 3/4 perspective angle view.
   */
  private static renderAngleSvg(config: BespokeDesignConfig, hex: string, hwColor: string, initials: string): string {
    return `
      <!-- 3/4 Perspective Angle View -->
      <g transform="translate(190, 105)">
        <!-- Rear Handle in Depth -->
        <path d="M 130 90 C 140 -15, 290 -15, 300 90" fill="none" stroke="#26170E" stroke-width="19" stroke-linecap="round" />
        
        <!-- Volumetric Side Gusset (Depth Profile) -->
        <polygon points="45,110 115,75 115,420 45,460" fill="#1C1008" />
        <polygon points="45,110 115,75 115,420 45,460" fill="${hex}" opacity="0.85" filter="url(#leatherRealisticTexture)" />
        <polygon points="45,110 115,75 115,420 45,460" fill="url(#volumetricShine)" opacity="0.5" />
        
        <!-- Gusset Saddler Stitching -->
        <line x1="55" y1="116" x2="108" y2="88" stroke="rgba(255,255,255,0.25)" stroke-width="1.3" stroke-dasharray="4 3" />
        <line x1="108" y1="88" x2="108" y2="410" stroke="rgba(255,255,255,0.25)" stroke-width="1.3" stroke-dasharray="4 3" />

        <!-- Side D-Ring & Flowing Leather Crossbody Strap -->
        <g transform="translate(80, 165)">
          <path d="M -4 0 L 8 0 L 6 24 L -2 24 Z" fill="${hex}" stroke="#1E1610" stroke-width="1" />
          <circle cx="2" cy="24" r="10" fill="none" stroke="url(#brassMetalGrad)" stroke-width="4.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
          <path d="M 2 34 C 6 90, -25 200, -50 280" fill="none" stroke="${hex}" stroke-width="18" filter="drop-shadow(0 12px 18px rgba(0,0,0,0.32))" />
          <path d="M 2 34 C 6 90, -25 200, -50 280" fill="none" stroke="${hex}" stroke-width="18" filter="url(#leatherRealisticTexture)" />
          <path d="M 2 34 C 6 90, -25 200, -50 280" fill="none" stroke="url(#handleCylinder)" stroke-width="18" />
          <path d="M 2 34 C 6 90, -25 200, -50 280" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-dasharray="5 3" />
        </g>

        <!-- Front Main Face in Perspective -->
        <polygon points="115,75 445,95 385,450 115,420" fill="${hex}" filter="drop-shadow(0 28px 40px rgba(0,0,0,0.38))" />
        <polygon points="115,75 445,95 385,450 115,420" fill="${hex}" filter="url(#leatherRealisticTexture)" />
        <polygon points="115,75 445,95 385,450 115,420" fill="url(#volumetricShine)" />

        <!-- Angle Perimeter Stitching -->
        <polygon points="126,88 432,106 376,438 126,410" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-dasharray="5 4" />

        <!-- Front Handle Arching in Perspective -->
        <path d="M 190 92 C 200 -25, 345 -15, 365 98" fill="none" stroke="${hex}" stroke-width="20" stroke-linecap="round" filter="drop-shadow(0 14px 20px rgba(0,0,0,0.28))" />
        <path d="M 190 92 C 200 -25, 345 -15, 365 98" fill="none" stroke="${hex}" stroke-width="20" stroke-linecap="round" filter="url(#leatherRealisticTexture)" />
        <path d="M 190 92 C 200 -25, 345 -15, 365 98" fill="none" stroke="url(#handleCylinder)" stroke-width="20" stroke-linecap="round" />
        <path d="M 190 92 C 200 -25, 345 -15, 365 98" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.3" stroke-dasharray="5 3" />

        <!-- Perspective 24K Gold Monogram -->
        ${config.personalisation?.enabled ? `
          <g transform="translate(265, 345) skewY(3.5)">
            <text x="0" y="0" font-family="'Cormorant Garamond', serif" font-size="32" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.25em" filter="drop-shadow(0 1.5px 2px rgba(0,0,0,0.8))">
              ${initials}
            </text>
          </g>
        ` : ""}
      </g>
    `;
  }

  /**
   * Renders the detailed interior layout view.
   */
  private static renderInteriorSvg(config: BespokeDesignConfig, hex: string, hwColor: string): string {
    return `
      <!-- Interior Top-Down Anatomical Layout View -->
      <g transform="translate(140, 75)">
        <!-- Outer Leather Edge Rim with Depth Shadow -->
        <rect x="0" y="0" width="520" height="440" rx="22" fill="${hex}" filter="drop-shadow(0 25px 35px rgba(0,0,0,0.32))" />
        <rect x="0" y="0" width="520" height="440" rx="22" fill="${hex}" filter="url(#leatherRealisticTexture)" />

        <!-- Organic Handspun Khadi Cotton Interior Base Lining -->
        <rect x="14" y="14" width="492" height="412" rx="16" fill="url(#khadiWeave)" stroke="#B39369" stroke-width="1.2" />

        <!-- Padded Laptop Compartment Sleeve (Up to 16" MacBook Pro) -->
        <rect x="34" y="34" width="452" height="125" rx="8" fill="#E8DEC9" stroke="#9E805E" stroke-width="1.5" />
        <path d="M 34 159 Q 260 178 486 159" fill="none" stroke="#684D35" stroke-width="2.5" />
        <text x="260" y="88" font-family="'Manrope', sans-serif" font-size="12" font-weight="700" fill="#472E19" text-anchor="middle" letter-spacing="0.1em">
          CUSHIONED LAPTOP SLEEVE (UP TO 16" MACBOOK PRO)
        </text>
        <circle cx="260" cy="115" r="7" fill="url(#brassMetalGrad)" stroke="#4A3416" stroke-width="1" />

        <!-- Central Main Storage Compartment -->
        <text x="260" y="230" font-family="'Cormorant Garamond', serif" font-size="22" font-weight="600" fill="#7D5D3B" text-anchor="middle" font-style="italic">
          Spacious Main Hold — Unbleached Handspun Khadi Cotton Lining
        </text>

        <!-- Lower Interior Organizer Pockets -->
        <g transform="translate(34, 280)">
          <!-- Zippered Valuables Pocket with Solid Brass Track -->
          <rect x="0" y="0" width="240" height="120" rx="6" fill="#E8DEC9" stroke="#9E805E" stroke-width="1.2" />
          <line x1="20" y1="24" x2="220" y2="24" stroke="url(#brassMetalGrad)" stroke-width="3.5" />
          <circle cx="215" cy="24" r="6" fill="url(#brassMetalGrad)" />
          <text x="120" y="70" font-family="'Manrope', sans-serif" font-size="10.5" font-weight="700" fill="#472E19" text-anchor="middle">
            ZIPPERED VALUABLES COMPARTMENT
          </text>

          <!-- Smartphone, Cards & Fountain Pen Organizer -->
          <rect x="260" y="0" width="192" height="120" rx="6" fill="#E8DEC9" stroke="#9E805E" stroke-width="1.2" />
          <rect x="275" y="16" width="162" height="28" rx="3" fill="#D8CCA8" stroke="#8A6E4B" stroke-width="0.8" />
          <rect x="275" y="50" width="162" height="28" rx="3" fill="#D8CCA8" stroke="#8A6E4B" stroke-width="0.8" />
          <text x="356" y="102" font-family="'Manrope', sans-serif" font-size="9.5" font-weight="700" fill="#472E19" text-anchor="middle">
            PHONE &amp; CARD SLOTS
          </text>
        </g>

        <!-- Solid Brass Swivel Key Leash -->
        <g transform="translate(450, 195)">
          <path d="M 0 0 C 18 20, 18 50, 0 70" fill="none" stroke="${hex}" stroke-width="6" />
          <circle cx="0" cy="76" r="8" fill="url(#brassMetalGrad)" stroke="#4A3416" stroke-width="1" />
          <text x="-18" y="94" font-family="'Manrope', sans-serif" font-size="9" font-weight="700" fill="#472E19">
            KEY LEASH
          </text>
        </g>
      </g>
    `;
  }

  /**
   * Renders the macro craftsmanship & monogram view.
   */
  private static renderDetailSvg(config: BespokeDesignConfig, hex: string, hwColor: string, initials: string): string {
    return `
      <!-- Extreme Macro Craftsmanship & Monogram Detail View -->
      <g transform="translate(90, 45)">
        <!-- Giant High-Definition Leather Platter with Natural Pores -->
        <rect x="0" y="0" width="620" height="490" rx="14" fill="${hex}" filter="drop-shadow(0 28px 45px rgba(0,0,0,0.38))" />
        <rect x="0" y="0" width="620" height="490" rx="14" fill="${hex}" filter="url(#leatherRealisticTexture)" />
        <rect x="0" y="0" width="620" height="490" rx="14" fill="url(#volumetricShine)" />

        <!-- Authentic Dual-Needle Saddlers' Seam with Perforated Holes -->
        <g transform="translate(55, 0)">
          <line x1="0" y1="0" x2="0" y2="490" stroke="#1A0D06" stroke-width="2.5" />
          ${[30, 68, 106, 144, 182, 220, 258, 296, 334, 372, 410, 448].map(
            (y) => `
              <!-- Pricked Stitch Hole Impression -->
              <circle cx="-10" cy="${y - 14}" r="2.5" fill="#120803" />
              <circle cx="10" cy="${y + 14}" r="2.5" fill="#120803" />
              <!-- Waxed Linen Thread Segment at 45° Angle -->
              <line x1="-9" y1="${y - 13}" x2="9" y2="${y + 13}" stroke="#FFF6E0" stroke-width="5" stroke-linecap="round" filter="drop-shadow(0 2.5px 3.5px rgba(0,0,0,0.55))" />
            `
          ).join("")}
        </g>

        <!-- Solid Hand-Cast Brass Rivet Close-Up -->
        <g transform="translate(140, 85)">
          <circle cx="0" cy="0" r="26" fill="url(#brassMetalGrad)" stroke="#382107" stroke-width="2.5" filter="drop-shadow(0 5px 10px rgba(0,0,0,0.5))" />
          <circle cx="0" cy="0" r="20" fill="none" stroke="#664619" stroke-width="1.4" stroke-dasharray="3 3" />
          <circle cx="0" cy="0" r="9" fill="#2E1B07" opacity="0.65" />
        </g>

        <!-- Large 24K Hot-Stamped Gold Foil Deboss Plate -->
        <g transform="translate(355, 235)">
          <rect x="-150" y="-85" width="300" height="180" rx="10" fill="#000000" opacity="0.14" filter="blur(4px)" />
          
          <text x="0" y="24" font-family="'Cormorant Garamond', serif" font-size="82" font-weight="700" fill="url(#goldFoilGrad)" text-anchor="middle" letter-spacing="0.32em" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.9))">
            ${initials}
          </text>
          
          <line x1="-90" y1="52" x2="90" y2="52" stroke="url(#goldFoilGrad)" stroke-width="1.2" />
          <circle cx="0" cy="52" r="3" fill="url(#goldFoilGrad)" />

          <text x="0" y="80" font-family="'Manrope', sans-serif" font-size="12" font-weight="700" fill="#F4E2B8" text-anchor="middle" letter-spacing="0.38em" opacity="0.95">
            BASAVA · BENGALURU
          </text>
          <text x="0" y="100" font-family="'Manrope', sans-serif" font-size="9.5" font-weight="600" fill="#D9C4A7" text-anchor="middle" letter-spacing="0.28em" opacity="0.8">
            24K GOLD LEAF FOIL DEBOSS · HAND-STAMPED
          </text>
        </g>

        <!-- Nilgiri Honeybee Wax Burnished Edge Ribbon -->
        <rect x="608" y="0" width="12" height="490" fill="#1C0E07" />
        <line x1="608" y1="0" x2="608" y2="490" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
      </g>
    `;
  }
}
