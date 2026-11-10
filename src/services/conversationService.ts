import type {
  BespokeDesignConfig,
  DesignMessage,
  BagType,
  LeatherMaterial,
  HardwareFinish,
  StrapOption,
  StudioAdminOptions,
} from "@/lib/studio-types";
import { defaultStudioOptions } from "@/data/studio-defaults";
import { DesignConfigurationService } from "./designConfigurationService";

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
    history: DesignMessage[],
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

    // Local Expert Consultation Engine
    return this.localConsultationEngine(userText, currentConfig, history, options);
  }

  private static async callGeminiAssistant(
    apiKey: string,
    userText: string,
    currentConfig: BespokeDesignConfig,
    history: DesignMessage[],
    options: StudioAdminOptions
  ): Promise<ConversationTurnResult> {
    const systemPrompt = `You are "The Bespoke Designer", the master leather product consultant at BASAVA, an Indian luxury bespoke leathercraft atelier in Bengaluru, Bharat.
Your voice is warm, sophisticated, knowledgeable, and polite.
You speak like a master leather artisan, not a generic robot.

STRICT OPERATING RULES:
1. Understand the customer's intent from their natural language message.
2. Ask only ONE useful follow-up question at a time to avoid overwhelming them.
3. Recommend compatible design options and explain leathercraft reasoning (e.g. why full-grain ages better, or why rolled handles are comfortable).
4. Never invent material availability or prices. Pricing and manufacturing feasibility must remain "Pending business approval" until the owner reviews the request.
5. If the customer requests a design modification (e.g. "make it darker", "add gold foil initials RN", "make it a laptop bag"), extract a structured patch.
6. Provide 2 to 3 quick interactive suggestion chips the customer can tap.

CURRENT BAG CONFIGURATION:
${JSON.stringify(currentConfig, null, 2)}

RESPONSE FORMAT:
Respond with a strict JSON object matching this schema:
{
  "reply": "Warm, consultative 2-3 sentence response guiding the customer.",
  "patch": { /* optional partial changes to BespokeDesignConfig */ },
  "suggestedActions": [
    { "label": "Short label", "action": "action_code", "patch": { /* optional */ } }
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
        temperature: 0.3,
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

  private static localConsultationEngine(
    text: string,
    current: BespokeDesignConfig,
    history: DesignMessage[],
    options: StudioAdminOptions
  ): ConversationTurnResult {
    const lower = text.toLowerCase();
    const patch: Partial<BespokeDesignConfig> = {};
    let shouldRegenerate = false;

    // 1. Detect Bag Type
    let detectedType: BagType | null = null;
    if (lower.includes("laptop") || lower.includes("office") || lower.includes("work bag") || lower.includes("briefcase")) {
      detectedType = "laptop";
    } else if (lower.includes("sling") || lower.includes("chest bag")) {
      detectedType = "sling";
    } else if (lower.includes("crossbody") || lower.includes("cross body")) {
      detectedType = "crossbody";
    } else if (lower.includes("tote") || lower.includes("carryall") || lower.includes("shopper")) {
      detectedType = "tote";
    } else if (lower.includes("clutch") || lower.includes("evening")) {
      detectedType = "clutch";
    } else if (lower.includes("handbag") || lower.includes("satchel")) {
      detectedType = "handbag";
    } else if (lower.includes("backpack") || lower.includes("rucksack")) {
      detectedType = "backpack";
    } else if (lower.includes("travel") || lower.includes("duffle") || lower.includes("weekender")) {
      detectedType = "travel";
    }

    if (detectedType && detectedType !== current.bagType) {
      patch.bagType = detectedType;
      patch.dimensions = DesignConfigurationService.getPresetDimensions(detectedType, "medium");
      shouldRegenerate = true;
    }

    // 2. Detect Colour
    if (lower.includes("black") || lower.includes("onyx")) {
      patch.colourName = "Midnight Onyx Black";
      patch.colourHex = "#1A1A1A";
      shouldRegenerate = true;
    } else if (lower.includes("cognac") || lower.includes("copper") || lower.includes("amber")) {
      patch.colourName = "Mysore Cognac";
      patch.colourHex = "#9E472A";
      shouldRegenerate = true;
    } else if (lower.includes("chocolate") || lower.includes("dark brown") || lower.includes("espresso")) {
      patch.colourName = "Dark Chocolate Brown";
      patch.colourHex = "#3D2314";
      shouldRegenerate = true;
    } else if (lower.includes("saddle") || lower.includes("tan") || lower.includes("brown")) {
      patch.colourName = "Royal Saddle Tan";
      patch.colourHex = "#8A5D3B";
      shouldRegenerate = true;
    } else if (lower.includes("olive") || lower.includes("green")) {
      patch.colourName = "Nilgiri Olive Green";
      patch.colourHex = "#4A5240";
      shouldRegenerate = true;
    } else if (lower.includes("burgundy") || lower.includes("wine") || lower.includes("maroon")) {
      patch.colourName = "Imperial Burgundy";
      patch.colourHex = "#5C1D24";
      shouldRegenerate = true;
    } else if (lower.includes("sand") || lower.includes("beige") || lower.includes("cream")) {
      patch.colourName = "Hampi Sand Beige";
      patch.colourHex = "#C7B299";
      shouldRegenerate = true;
    }

    // 3. Detect Material
    if (lower.includes("full grain") || lower.includes("full-grain")) {
      patch.material = "full-grain";
      shouldRegenerate = true;
    } else if (lower.includes("suede") || lower.includes("roughout")) {
      patch.material = "suede";
      shouldRegenerate = true;
    } else if (lower.includes("canvas")) {
      patch.material = "canvas-leather";
      shouldRegenerate = true;
    } else if (lower.includes("top grain") || lower.includes("top-grain")) {
      patch.material = "top-grain";
      shouldRegenerate = true;
    }

    // 4. Detect Hardware
    if (lower.includes("brass") || lower.includes("antique")) {
      patch.hardware = "antique-brass";
      shouldRegenerate = true;
    } else if (lower.includes("gold")) {
      patch.hardware = "gold";
      shouldRegenerate = true;
    } else if (lower.includes("silver") || lower.includes("nickel")) {
      patch.hardware = "silver";
      shouldRegenerate = true;
    } else if (lower.includes("black hardware") || lower.includes("matte black")) {
      patch.hardware = "matte-black";
      shouldRegenerate = true;
    }

    // 5. Detect Monogram / Initials
    const initialsMatch = text.match(/(?:initials?|monogram|name|stamp|engrave)\s*(?:is|to|as|with)?\s*[:'"]?([A-Za-z.\s]{1,6}|[ॐश्री]{1,3})['"]?/i);
    if (initialsMatch && initialsMatch[1]) {
      const cleanInitials = initialsMatch[1].trim().toUpperCase();
      patch.personalisation = {
        enabled: true,
        text: cleanInitials,
        method: lower.includes("blind") ? "blind-deboss" : "gold-foil",
        placement: "bottom-center",
      };
      shouldRegenerate = true;
    }

    // 6. Detect Laptop Compartment
    if (lower.includes("laptop") || lower.includes("macbook")) {
      patch.interior = {
        ...current.interior,
        laptopSleeve: true,
      };
    }

    // Generate Conversational Reply
    let reply = "";
    const suggestedActions: { label: string; action: string; patch?: Partial<BespokeDesignConfig> }[] = [];

    if (detectedType && patch.colourName) {
      reply = `A splendid choice. I have tailored your design to an ${patch.colourName} ${detectedType} in genuine hide. Shall we complement this with solid antique brass hardware, or would you prefer polished gold?`;
      suggestedActions.push(
        { label: "Antique Brass Hardware", action: "set_hw_brass", patch: { hardware: "antique-brass" } },
        { label: "24K Gold Hardware", action: "set_hw_gold", patch: { hardware: "gold" } },
        { label: "Add Custom Initials", action: "prompt_monogram" }
      );
    } else if (patch.colourName) {
      reply = `I have updated your piece to ${patch.colourName}. Notice how the warm undertones highlight the leather's natural grain. Would you like to add custom debossed initials to make it personal?`;
      suggestedActions.push(
        { label: "Add Gold Initials", action: "add_gold_initials", patch: { personalisation: { enabled: true, text: "BV", method: "gold-foil", placement: "bottom-center" } } },
        { label: "Blind Heat Deboss", action: "add_blind_deboss", patch: { personalisation: { enabled: true, text: "BV", method: "blind-deboss", placement: "bottom-center" } } },
        { label: "Keep It Clean (No Initials)", action: "remove_monogram", patch: { personalisation: { enabled: false, text: "", method: "none", placement: "bottom-center" } } }
      );
    } else if (initialsMatch) {
      reply = `Your initials have been applied in precision hot-stamped gold foil. Would you prefer a zippered top closure for daily security, or an effortless magnetic snap?`;
      suggestedActions.push(
        { label: "Zippered Closure", action: "set_closure_zip", patch: { closure: "zipper" } },
        { label: "Magnetic Snap", action: "set_closure_snap", patch: { closure: "magnetic-snap" } },
        { label: "Review Design Brief", action: "review_brief" }
      );
    } else if (lower.includes("dimension") || lower.includes("size") || lower.includes("larger") || lower.includes("smaller")) {
      const newPreset = lower.includes("larger") || lower.includes("big") ? "large" : "compact";
      patch.dimensions = DesignConfigurationService.getPresetDimensions(current.bagType, newPreset);
      shouldRegenerate = true;
      reply = `I have adjusted the proportions to our ${newPreset} size (${patch.dimensions.width} × ${patch.dimensions.height} × ${patch.dimensions.depth} cm). How does the scale feel for your daily essentials?`;
      suggestedActions.push(
        { label: "Medium Size (Standard)", action: "set_medium", patch: { dimensions: DesignConfigurationService.getPresetDimensions(current.bagType, "medium") } },
        { label: "Add Detachable Strap", action: "add_strap", patch: { straps: [...current.straps, "detachable-crossbody"] as StrapOption[] } },
        { label: "Looks Perfect", action: "confirm_concept" }
      );
    } else {
      reply = `I understand. I have noted your preferences in your design brief. We can refine the strap configuration, add dedicated tech compartments, or proceed to submit this specification to the artisan for quotation. What would you like to explore next?`;
      suggestedActions.push(
        { label: "Add Detachable Shoulder Strap", action: "add_strap", patch: { straps: Array.from(new Set([...current.straps, "detachable-crossbody"])) as StrapOption[] } },
        { label: "Add 15\" Laptop Sleeve", action: "add_laptop_sleeve", patch: { interior: { ...current.interior, laptopSleeve: true } } },
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
