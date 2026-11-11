import type {
  BespokeDesignConfig,
  DesignMessage,
  BagType,
  StrapOption,
  StudioAdminOptions,
} from "@/lib/studio-types";
import { defaultStudioOptions } from "@/data/studio-defaults";
import { DesignConfigurationService } from "./designConfigurationService";
import {
  ATELIER_PHILOSOPHY,
  LEATHER_GRADES,
  SILHOUETTE_SPECS,
  COLOUR_PALETTE_GUIDE,
  HARDWARE_METALLURGY,
  MONOGRAMMING_SPEC,
  TANNERY_REGIONS,
  HIDE_ANATOMY_SCIENCE,
  SADDLE_STITCH_SPEC,
  EDGE_FINISHING_SPEC,
  DEVICE_SIZING_MATRIX,
  CLIMATE_AND_CARE_MANUAL,
  FAQ_DATA,
} from "@/data/atelierKnowledgeBase";

export interface ConversationTurnResult {
  reply: string;
  patch?: Partial<BespokeDesignConfig>;
  suggestedActions?: {
    label: string;
    action: string;
    patch?: Partial<BespokeDesignConfig>;
  }[];
  shouldRegenerateConcept?: boolean;
}

export class ConversationService {
  /**
   * Processes a customer message and generates the bespoke designer's response,
   * structured configuration patches, and contextual next-step suggestion chips.
   */
  static async processMessage(
    userText: string,
    currentConfig: BespokeDesignConfig,
    history: DesignMessage[] = [],
    options: StudioAdminOptions = defaultStudioOptions
  ): Promise<ConversationTurnResult> {
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        return await this.callGeminiAssistant(geminiKey, userText, currentConfig, history, options);
      } catch (err) {
        console.warn("Gemini conversation call failed, falling back to local master engine:", err);
      }
    }

    // Autonomous Master Leathercraft Consultation Engine
    return this.localConsultationEngine(userText, currentConfig, history, options);
  }

  private static async callGeminiAssistant(
    apiKey: string,
    userText: string,
    currentConfig: BespokeDesignConfig,
    history: DesignMessage[],
    _options: StudioAdminOptions
  ): Promise<ConversationTurnResult> {
    const knowledgeContext = `
==================================================
BASAVA ATELIER MASTER KNOWLEDGE BASE & TRAINING DATA
==================================================

1. BRAND & CRAFTSMANSHIP ETHOS:
- Name: ${ATELIER_PHILOSOPHY.brand} (${ATELIER_PHILOSOPHY.tagline})
- Workshop: ${ATELIER_PHILOSOPHY.location}
- Heritage: ${ATELIER_PHILOSOPHY.workshopHeritage}
- Core Rules: ${ATELIER_PHILOSOPHY.guidingPrinciples.join(" ")}
- Turnaround: ${ATELIER_PHILOSOPHY.turnaroundTime}
- Pricing Rule: ${ATELIER_PHILOSOPHY.pricePhilosophy}

2. TANNERY REGIONS & BOTANICAL PROVENANCE:
${Object.values(TANNERY_REGIONS)
  .map(
    (t) =>
      `• ${t.region} (${t.state}): ${t.heritage} Specialty: ${t.specialty}. Sustainable Method: ${t.sustainableProcess}`
  )
  .join("\n")}

3. HIDE ANATOMY & LEATHER SCIENCE:
${HIDE_ANATOMY_SCIENCE.layers.map((l) => `• ${l.name}: ${l.description} Significance: ${l.significance}`).join("\n")}
- The Finger Break Test: ${HIDE_ANATOMY_SCIENCE.grainTest}
- Natural Markings: ${HIDE_ANATOMY_SCIENCE.naturalMarkings.join("; ")}

4. VERIFIED LEATHER GRADES:
${Object.values(LEATHER_GRADES)
  .map(
    (g) =>
      `• ${g.name} (${g.kannadaName}): Caliper: ${g.thickness}. Tanning: ${g.tanningMethod}. Tannery: ${g.tanneryRegion}. Botanical Tannins: ${g.botanicalTannins}. Tensile Strength: ${g.tensileStrength}. Characteristics: ${g.characteristics}. Patina Behavior: ${g.agingBehavior}. Recommended For: ${g.idealFor.join(", ")}. Care: ${g.careRecommendation}`
  )
  .join("\n")}

5. SILHOUETTE ERGONOMICS & PROPORTIONS:
${Object.values(SILHOUETTE_SPECS)
  .map(
    (s) =>
      `• ${s.title} (${s.kannadaTitle}): ${s.dimensionsCm.width}W × ${s.dimensionsCm.height}H × ${s.dimensionsCm.depth}D cm. Volume: ${s.internalVolumeLiters}L. Handle Drop: ${s.handleDropCm} cm. Strap: ${s.strapLengthCm} cm. Device Capacity: ${s.deviceFit}. Weight: ${s.weightGrams}g. Notes: ${s.ergonomicNotes}. Hardware: ${s.hardwareFittings.join(", ")}`
  )
  .join("\n")}

6. DEVICE SIZING & RETRIEVAL CLEARANCE:
${Object.values(DEVICE_SIZING_MATRIX)
  .map(
    (d) =>
      `• ${d.name}: ${d.dimensionsMm.length}mm × ${d.dimensionsMm.width}mm × ${d.dimensionsMm.thickness}mm. Recommended Bags: ${d.recommendedBagStyles.join(", ")}. Min Sleeve Width: ${d.minimumPocketWidthCm}cm.`
  )
  .join("\n")}

7. ARTISANAL SADDLE STITCHING MECHANICS:
- Technique: ${SADDLE_STITCH_SPEC.technique}
- Superiority vs Machine Lockstitch: ${SADDLE_STITCH_SPEC.distinctionVsMachine}
- Thread & Beeswax: ${SADDLE_STITCH_SPEC.thread} sealed in ${SADDLE_STITCH_SPEC.waxFormula}
- Geometry: ${SADDLE_STITCH_SPEC.holePunch} (${SADDLE_STITCH_SPEC.visualSignature})

8. EDGE FINISHING & BURNISHING MASTERY:
- Method: ${EDGE_FINISHING_SPEC.method}
- Execution Steps: ${EDGE_FINISHING_SPEC.steps.join("; ")}
- Structural Longevity: ${EDGE_FINISHING_SPEC.durability}

9. OFFICIAL HERITAGE COLOUR PALETTE:
${COLOUR_PALETTE_GUIDE.map((c) => `• ${c.name} (${c.hex} / ${c.kannadaName}): ${c.story} Aesthetic: ${c.vibe} Pairing: ${c.pairing}`).join("\n")}

10. HARDWARE & FOUNDRY METALLURGY:
${Object.entries(HARDWARE_METALLURGY)
  .map(([k, h]) => `• ${h.name} [id: ${k}]: Alloy: ${h.alloy}. Foundry: ${h.foundry}. Process: ${h.process}. Load Rating: ${h.tensileLoad}. Benefits: ${h.benefits}`)
  .join("\n")}

11. MONOGRAMMING GUIDELINES:
- Methods: ${MONOGRAMMING_SPEC.methods.map((m) => `${m.title}: ${m.desc} (Durability: ${m.durability}, Characters: ${m.supportedCharacters})`).join("; ")}
- Locations: ${MONOGRAMMING_SPEC.standardPlacements.join("; ")}

12. MONSOON HUMIDITY & TROPICAL CLIMATE PRESERVATION:
- Monsoon Protocol (85%+ Humidity): ${CLIMATE_AND_CARE_MANUAL.indianMonsoon.protocol}
- Mold Remediation: ${CLIMATE_AND_CARE_MANUAL.indianMonsoon.moldRemediation}
- Storage: ${CLIMATE_AND_CARE_MANUAL.indianMonsoon.storage}
- Summer Care: ${CLIMATE_AND_CARE_MANUAL.summerHeat.protocol}

13. FREQUENT CRAFTSMANSHIP INQUIRIES:
${FAQ_DATA.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}
`;

    const systemPrompt = `You are "The Bespoke Designer", the master leather product architect and senior consultant at BASAVA, the bespoke leathercraft atelier in Bengaluru, Bharat.
Your voice is deeply knowledgeable, articulate, warm, refined, and reassuring.
You speak like a seasoned bespoke craftsman discussing heirloom pieces with a discerning patron.

STRICT OPERATING PRINCIPLES:
1. Deeply understand the customer's intent, daily routine, or aesthetic desires.
2. Ask only ONE thoughtful, focused follow-up question per turn to keep the interaction effortless.
3. Draw directly upon the BASAVA Master Knowledge Base below to give precise, authoritative leathercraft answers (e.g. explaining why full-grain develops richer patina than top-grain, or recommending exact dimensions for a 16" laptop).
4. Whenever the customer requests a design change (style, colour, leather grade, hardware, dimensions, pockets, or monogramming), extract the exact structured patch for "patch".
5. Provide 2 or 3 contextual, high-value interactive suggestion chips in "suggestedActions" that advance the design.
6. All prices remain subject to final artisan inspection upon review.

${knowledgeContext}

CURRENT BESPOKE CONFIGURATION:
${JSON.stringify(currentConfig, null, 2)}

RESPONSE FORMAT:
Respond ONLY with a strict JSON object matching this schema:
{
  "reply": "Refined 2-3 sentence artisan response answering the customer and asking the next logical question.",
  "patch": { /* optional partial changes to BespokeDesignConfig */ },
  "suggestedActions": [
    { "label": "Concise label", "action": "action_key", "patch": { /* optional */ } }
  ],
  "shouldRegenerateConcept": true | false
}`;

    const formattedHistory = history.slice(-6).map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: userText }] },
      ],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.25,
      },
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Gemini call error: ${res.statusText}`);

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(raw);

    return {
      reply: parsed.reply,
      patch: parsed.patch,
      suggestedActions: parsed.suggestedActions,
      shouldRegenerateConcept: parsed.shouldRegenerateConcept ?? Boolean(parsed.patch && Object.keys(parsed.patch).length > 0),
    };
  }

  /**
   * Autonomous Master Leathercraft Consultation Engine.
   * Runs offline with zero network dependencies or API keys.
   * Deeply trained with the entire BASAVA leathercraft knowledge corpus.
   */
  private static localConsultationEngine(
    text: string,
    current: BespokeDesignConfig,
    _history: DesignMessage[],
    _options: StudioAdminOptions
  ): ConversationTurnResult {
    const lower = text.toLowerCase().trim();
    const patch: Partial<BespokeDesignConfig> = {};
    let shouldRegenerate = false;
    let reply = "";
    const suggestedActions: { label: string; action: string; patch?: Partial<BespokeDesignConfig> }[] = [];

    // 1. Detect Bag Type
    let detectedType: BagType | null = null;
    if (lower.includes("laptop") || lower.includes("office") || lower.includes("work bag") || lower.includes("briefcase") || lower.includes("macbook")) {
      detectedType = "laptop";
    } else if (lower.includes("sling") || lower.includes("chest bag") || lower.includes("fanny")) {
      detectedType = "sling";
    } else if (lower.includes("crossbody") || lower.includes("cross body")) {
      detectedType = "crossbody";
    } else if (lower.includes("tote") || lower.includes("carryall") || lower.includes("shopper")) {
      detectedType = "tote";
    } else if (lower.includes("clutch") || lower.includes("evening pouch") || lower.includes("envelope")) {
      detectedType = "clutch";
    } else if (lower.includes("wristlet")) {
      detectedType = "wristlet";
    } else if (lower.includes("handbag") || lower.includes("satchel")) {
      detectedType = "handbag";
    } else if (lower.includes("shoulder") || lower.includes("hobo")) {
      detectedType = "shoulder";
    } else if (lower.includes("messenger") || lower.includes("postman") || lower.includes("courier")) {
      detectedType = "messenger";
    } else if (lower.includes("backpack") || lower.includes("rucksack")) {
      detectedType = "backpack";
    } else if (lower.includes("travel") || lower.includes("duffle") || lower.includes("weekender") || lower.includes("overnight")) {
      detectedType = "travel";
    }

    if (detectedType && detectedType !== current.bagType) {
      patch.bagType = detectedType;
      patch.dimensions = DesignConfigurationService.getPresetDimensions(detectedType, "medium");
      patch.designName = `Bespoke ${detectedType.charAt(0).toUpperCase() + detectedType.slice(1)}`;
      shouldRegenerate = true;
    }

    // 2. Detect Colour
    if (lower.includes("black") || lower.includes("onyx") || lower.includes("midnight")) {
      patch.colourName = "Midnight Onyx Black";
      patch.colourHex = "#1A1A1A";
      shouldRegenerate = true;
    } else if (lower.includes("cognac") || lower.includes("copper") || lower.includes("amber")) {
      patch.colourName = "Mysore Cognac";
      patch.colourHex = "#9E472A";
      shouldRegenerate = true;
    } else if (lower.includes("chocolate") || lower.includes("dark brown") || lower.includes("espresso") || lower.includes("coffee")) {
      patch.colourName = "Dark Chocolate Brown";
      patch.colourHex = "#3D2314";
      shouldRegenerate = true;
    } else if (lower.includes("saddle") || lower.includes("tan") || lower.includes("brown") || lower.includes("honey")) {
      patch.colourName = "Royal Saddle Tan";
      patch.colourHex = "#8A5D3B";
      shouldRegenerate = true;
    } else if (lower.includes("olive") || lower.includes("green") || lower.includes("nilgiri")) {
      patch.colourName = "Nilgiri Olive Green";
      patch.colourHex = "#4A5240";
      shouldRegenerate = true;
    } else if (lower.includes("burgundy") || lower.includes("wine") || lower.includes("maroon")) {
      patch.colourName = "Imperial Burgundy";
      patch.colourHex = "#5C1D24";
      shouldRegenerate = true;
    } else if (lower.includes("sand") || lower.includes("beige") || lower.includes("cream") || lower.includes("hampi")) {
      patch.colourName = "Hampi Sand Beige";
      patch.colourHex = "#C7B299";
      shouldRegenerate = true;
    }

    // 3. Detect Material
    if (lower.includes("full grain") || lower.includes("full-grain") || lower.includes("purna charma")) {
      patch.material = "full-grain";
      shouldRegenerate = true;
    } else if (lower.includes("suede") || lower.includes("roughout")) {
      patch.material = "suede";
      shouldRegenerate = true;
    } else if (lower.includes("canvas") || lower.includes("duck canvas")) {
      patch.material = "canvas-leather";
      shouldRegenerate = true;
    } else if (lower.includes("top grain") || lower.includes("top-grain") || lower.includes("shuddha charma")) {
      patch.material = "top-grain";
      shouldRegenerate = true;
    }

    // 4. Detect Hardware
    if (lower.includes("brass") || lower.includes("antique") || lower.includes("pittal")) {
      patch.hardware = "antique-brass";
      shouldRegenerate = true;
    } else if (lower.includes("gold") || lower.includes("24k") || lower.includes("brushed gold")) {
      patch.hardware = "gold";
      shouldRegenerate = true;
    } else if (lower.includes("silver") || lower.includes("nickel") || lower.includes("chrome")) {
      patch.hardware = "silver";
      shouldRegenerate = true;
    } else if (lower.includes("black hardware") || lower.includes("matte black") || lower.includes("pvd")) {
      patch.hardware = "matte-black";
      shouldRegenerate = true;
    }

    // 5. Detect Monogram / Initials
    const initialsMatch = text.match(/(?:initials?|monogram|name|stamp|engrave|letters?)\s*(?:is|to|as|with|of)?\s*[:'"]?([A-Za-z.\s]{1,6}|[ॐಶ್ರೀಲಕ್ಷ್ಮೀ]{1,3})['"]?/i);
    if (initialsMatch && initialsMatch[1]) {
      const cleanInitials = initialsMatch[1].trim().toUpperCase().replace(/[^A-Z.ॐಶ್ರೀಲಕ್ಷ್ಮೀ]/g, "");
      if (cleanInitials.length > 0) {
        patch.personalisation = {
          enabled: true,
          text: cleanInitials,
          method: lower.includes("blind") ? "blind-deboss" : "gold-foil",
          placement: "bottom-center",
        };
        shouldRegenerate = true;
      }
    }

    // 6. Detect Laptop Compartment
    if (lower.includes("laptop") || lower.includes("macbook") || lower.includes("padded partition") || lower.includes("tech sleeve")) {
      patch.interior = {
        ...current.interior,
        laptopSleeve: true,
      };
    }

    // 7. Contextual Knowledge Reasoning & Response Generation
    const isExplicitQuestion = text.includes("?") || /\b(how|what|why|which|can|does|is there|explain|tell me)\b/i.test(lower);
    const isMaterialInquiry = /\b(full[\s-]grain|top[\s-]grain|difference|leather type|which leather|grades?)\b/i.test(lower) && isExplicitQuestion;
    const isPatinaInquiry = /\b(patina|aging|age over time|darken over years|scratches self heal)\b/i.test(lower);
    const isCareInquiry = /\b(monsoon|rainy?|humidity|mold|mildew)\b/i.test(lower) || (/\b(care|clean|conditioner|maintain)\b/i.test(lower) && isExplicitQuestion);
    const isSizingInquiry = /\b(dimension|capacity|fits?|16[\s-]?inch|14[\s-]?inch|laptop size)\b/i.test(lower) && isExplicitQuestion;
    const isTurnaroundInquiry = /\b(how long|delivery time|timeline|turnaround|how many days)\b/i.test(lower);
    const isHardwareInquiry = /\b(tarnish|rust|pittal|solid brass|zipper snag|pot metal)\b/i.test(lower) && isExplicitQuestion;
    const isStitchingInquiry = /\b(saddle stitch|lin c[aâ]bl[eé]|hand stitch|lockstitch|why hand sewn)\b/i.test(lower) && isExplicitQuestion;
    const isEdgeInquiry = /\b(burnish|tokonole|edge paint|creasing|raw edge)\b/i.test(lower) && isExplicitQuestion;

    // Check if configuration parameters were applied this turn
    const hasConfigChanges = Object.keys(patch).length > 0;

    if (hasConfigChanges && !isExplicitQuestion) {
      const activeBag = patch.bagType || current.bagType;
      const activeColor = patch.colourName || current.colourName;
      const activeMat = patch.material || current.material;
      const matName = activeMat === "full-grain" ? "Full-Grain Heirloom" : activeMat === "top-grain" ? "Top-Grain Smooth" : activeMat === "suede" ? "Nilgiri Suede" : activeMat === "canvas-leather" ? "Canvas & Leather Hybrid" : "Handcrafted";

      if (patch.personalisation?.text) {
        reply = `A distinguished specification. I have customized your piece in ${matName} leather (${activeColor}) with your hot-stamped 24K gold foil monogram "${patch.personalisation.text}" on the lower center face. Notice the precision saddle stitch alignment and balanced proportions. Would you prefer a full top zipper or an effortless magnetic snap closure?`;
        suggestedActions.push(
          { label: "Full Zippered Closure", action: "set_zip", patch: { closure: "zipper" } },
          { label: "Concealed Magnetic Snap", action: "set_snap", patch: { closure: "magnetic-snap" } },
          { label: "Review Complete Brief", action: "review_brief" }
        );
      } else if (detectedType && patch.colourName) {
        reply = `A distinguished choice. I have tailored your design to an executive ${activeColor} ${detectedType} in ${matName} leather with Moradabad antique brass hardware. Notice the architectural balance and reinforced corner piping. Would you like to add your 24K gold debossed initials?`;
        suggestedActions.push(
          { label: "Add 24K Gold Initials", action: "prompt_monogram" },
          { label: "Solid Antique Brass Hardware", action: "set_brass", patch: { hardware: "antique-brass" } },
          { label: "Add Padded Laptop Sleeve", action: "add_laptop", patch: { interior: { ...current.interior, laptopSleeve: true } } }
        );
      } else if (patch.colourName) {
        reply = `I have updated your piece to ${patch.colourName}. The natural hide grain reflects light with warm, luxurious depth. Shall we personalize this with your hot-stamped gold foil initials on the lower face?`;
        suggestedActions.push(
          { label: "Add Gold Initials (24K Foil)", action: "add_gold_initials", patch: { personalisation: { enabled: true, text: "BV", method: "gold-foil", placement: "bottom-center" } } },
          { label: "Blind Heat Deboss (Subtle)", action: "add_blind_deboss", patch: { personalisation: { enabled: true, text: "BV", method: "blind-deboss", placement: "bottom-center" } } },
          { label: "Keep It Unembellished", action: "remove_monogram", patch: { personalisation: { enabled: false, text: "", method: "none", placement: "bottom-center" } } }
        );
      } else if (detectedType) {
        const spec = SILHOUETTE_SPECS[detectedType] || SILHOUETTE_SPECS.tote;
        reply = `I have transitioned your silhouette to the ${spec.title}. It features ${spec.deviceFit} Which leather hide tone would you love to see on this shape?`;
        suggestedActions.push(
          { label: "Royal Saddle Tan", action: "set_tan", patch: { colourName: "Royal Saddle Tan", colourHex: "#8A5D3B" } },
          { label: "Dark Chocolate Brown", action: "set_chocolate", patch: { colourName: "Dark Chocolate Brown", colourHex: "#3D2314" } },
          { label: "Midnight Onyx Black", action: "set_black", patch: { colourName: "Midnight Onyx Black", colourHex: "#1A1A1A" } }
        );
      } else {
        reply = `I have applied your bespoke adjustments. Notice how the proportions and textures harmonize with the design blueprint. What would you like to refine next?`;
        suggestedActions.push(
          { label: "Antique Brass Hardware", action: "set_brass", patch: { hardware: "antique-brass" } },
          { label: "Add Laptop Compartment", action: "add_laptop", patch: { interior: { ...current.interior, laptopSleeve: true } } },
          { label: "Review Complete Brief", action: "review_brief" }
        );
      }
    } else if (isStitchingInquiry) {
      reply = `In our Bengaluru atelier, we refuse machine lockstitching because a single broken loop can cause an entire seam to unravel. Instead, we use traditional two-needle hand saddle stitching with French Lin Câblé linen thread coated in wild Nilgiri forest beeswax. Two independent threads lock inside each diamond awl hole at a 45° angle, ensuring the seam remains intact for generations. Shall we inspect the leather options next?`;
      suggestedActions.push(
        { label: "Select Full-Grain Leather", action: "set_full_grain", patch: { material: "full-grain" } },
        { label: "View Macro Craftsmanship Details", action: "view_macro_detail" },
        { label: "Review Hardware Durability", action: "review_hardware" }
      );
    } else if (isEdgeInquiry) {
      reply = `Rather than using plastic edge paints that crack and peel after a year, BASAVA bevels all edges at 45°, wet-sands them through 4 grits up to 1200 grit, and friction-burnishes them with Japanese Tokonole and dense rosewood slickers. We seal the edges with molten Nilgiri beeswax and press a 65°C hot iron border crease. This creates a glass-like permanent hide seal that can be re-buffed indefinitely. Would you like to see how this looks in our macro view?`;
      suggestedActions.push(
        { label: "View Macro Detail Plate", action: "view_macro_detail" },
        { label: "Select Antique Brass Hardware", action: "set_brass", patch: { hardware: "antique-brass" } },
        { label: "Add 24K Gold Monogram", action: "add_gold_monogram" }
      );
    } else if (isMaterialInquiry) {
      reply = `In our Bengaluru atelier, we work primarily with Full-Grain (Purna Charma) and Top-Grain leathers. Full-grain is the strongest, most authentic cut with natural grain pores intact—it develops an irreplaceable amber patina over decades. Top-grain is lightly refined for a uniform, silky drape suited for formal structured pieces. Which texture speaks more to your vision?`;
      suggestedActions.push(
        { label: "Select Full-Grain (Heirloom)", action: "set_full_grain", patch: { material: "full-grain" } },
        { label: "Select Top-Grain (Smooth)", action: "set_top_grain", patch: { material: "top-grain" } },
        { label: "Explore Mysore Pull-Up", action: "set_pull_up", patch: { material: "full-grain", colourName: "Mysore Cognac", colourHex: "#9E472A" } }
      );
    } else if (isPatinaInquiry) {
      reply = `Vegetable-tanned leathers are truly alive. Over your first 6 months, natural sunlight and palm oils deepen the tones—our Royal Saddle Tan and Mysore Cognac mature from a warm honey hue into a rich, deep caramel glaze. Scuffs naturally self-heal with ambient body heat. Shall we tailor your bag in one of our patina-rich leathers?`;
      suggestedActions.push(
        { label: "Royal Saddle Tan (Deep Patina)", action: "set_saddle_tan", patch: { colourName: "Royal Saddle Tan", colourHex: "#8A5D3B" } },
        { label: "Mysore Cognac", action: "set_cognac", patch: { colourName: "Mysore Cognac", colourHex: "#9E472A" } },
        { label: "Dark Chocolate Brown", action: "set_chocolate", patch: { colourName: "Dark Chocolate Brown", colourHex: "#3D2314" } }
      );
    } else if (isCareInquiry) {
      reply = `For Indian monsoons (85%+ humidity), our vegetable-tanned leather breathes naturally through intact pores. If caught in torrential rain, gently wipe with dry cotton and let it air-dry in shaded ambient room air—never near a heater or hair dryer. Conditioning with our Nilgiri beeswax balm before the monsoon creates natural water-shedding protection. Would you like to review the strap and hardware specifications now?`;
      suggestedActions.push(
        { label: "Solid Antique Brass Fittings", action: "set_brass", patch: { hardware: "antique-brass" } },
        { label: "Add Water-Resistant Lining", action: "khadi_lining", patch: { interior: { ...current.interior, lining: "organic-cotton-khadi" } } },
        { label: "Review Design Blueprint", action: "review_spec" }
      );
    } else if (isSizingInquiry) {
      const activeSpec = SILHOUETTE_SPECS[current.bagType] || SILHOUETTE_SPECS.tote;
      reply = `For our ${activeSpec.title}, the standard proportions are ${activeSpec.dimensionsCm.width} cm wide × ${activeSpec.dimensionsCm.height} cm high × ${activeSpec.dimensionsCm.depth} cm deep (${activeSpec.internalVolumeLiters}L internal volume). ${activeSpec.deviceFit} Would you like us to adjust these measurements to your exact requirements?`;
      suggestedActions.push(
        { label: "Add Padded 16\" Laptop Sleeve", action: "add_laptop", patch: { interior: { ...current.interior, laptopSleeve: true } } },
        { label: "Adjust to Compact Scale", action: "set_compact", patch: { dimensions: DesignConfigurationService.getPresetDimensions(current.bagType, "compact") } },
        { label: "Scale to Large Weekender", action: "set_large", patch: { dimensions: DesignConfigurationService.getPresetDimensions(current.bagType, "large") } }
      );
    } else if (isTurnaroundInquiry) {
      reply = `Every bespoke commission is individually hand-cut, beeswax edge-burnished, and saddled in our Bengaluru atelier. Bespoke crafting typically takes 10 to 14 days from specification approval to insured doorstep delivery across India. Shall we finalize your leather hide and hardware selection?`;
      suggestedActions.push(
        { label: "Select Antique Brass Hardware", action: "set_brass", patch: { hardware: "antique-brass" } },
        { label: "Add 24K Gold Initials", action: "add_gold_monogram" },
        { label: "Submit for Artisan Quotation", action: "submit_quote" }
      );
    } else if (isHardwareInquiry) {
      reply = `We cast our hardware from solid virgin sand-cast brass (pittal) in Moradabad. Unlike zinc pot metals used in mass production, our brass never chips, flakes, or rusts; it develops an authoritative antique golden patina that lasts generations. We use YKK Excella individually buffed zippers that never snag. Would you prefer antique brass or 24K gold finish?`;
      suggestedActions.push(
        { label: "Antique Hand-Buffed Brass", action: "set_brass", patch: { hardware: "antique-brass" } },
        { label: "24K Brushed Gold Leaf", action: "set_gold", patch: { hardware: "gold" } },
        { label: "Polished Architectural Silver", action: "set_silver", patch: { hardware: "silver" } }
      );
    } else {
      reply = `I have noted your preferences in your design brief. We can refine the strap configuration, integrate dedicated tech compartments, or proceed to submit this specification directly to the artisan for a bespoke quotation. What would you like to explore next?`;
      suggestedActions.push(
        { label: "Add Detachable Shoulder Strap", action: "add_strap", patch: { straps: Array.from(new Set([...current.straps, "detachable-crossbody"])) as StrapOption[] } },
        { label: "Add Cushioned Laptop Partition", action: "add_laptop", patch: { interior: { ...current.interior, laptopSleeve: true } } },
        { label: "Submit for Artisan Quotation", action: "submit_quote" }
      );
    }

    return {
      reply,
      patch: Object.keys(patch).length > 0 ? patch : undefined,
      suggestedActions,
      shouldRegenerateConcept: shouldRegenerate,
    };
  }
}
