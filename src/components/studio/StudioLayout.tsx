"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Layers,
  MessageSquare,
  Eye,
  Sliders,
  RotateCcw,
  Send,
  HelpCircle,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { cx } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import type {
  BespokeDesignConfig,
  ConceptImage,
  ConceptViewType,
  DesignMessage,
  DesignVersion,
} from "@/lib/studio-types";
import {
  defaultBespokeDesign,
  defaultStudioOptions,
} from "@/data/studio-defaults";
import { ImageGenerationService } from "@/services/imageGenerationService";
import { DesignVersionService } from "@/services/designVersionService";
import { DesignConfigurationService } from "@/services/designConfigurationService";
import { ConversationService } from "@/services/conversationService";
import { ReferenceImageService } from "@/services/referenceImageService";

import { AiDesignerChat } from "./AiDesignerChat";
import { BagConceptViewer } from "./BagConceptViewer";
import { CustomisationInspector } from "./CustomisationInspector";
import { VersionHistoryModal } from "./VersionHistoryModal";
import { QuotationModal } from "./QuotationModal";
import { BasavaMark } from "@/components/brand/BasavaLogo";

interface StudioLayoutProps {
  initialReferenceProduct?: string | null;
  onSwitchToClassicWizard?: () => void;
}

export function StudioLayout({
  initialReferenceProduct,
  onSwitchToClassicWizard,
}: StudioLayoutProps) {
  const searchParams = useSearchParams();
  const showToast = useToast((s) => s.show);
  const studioOptions = useDemoStore((s) => s.studioOptions) || defaultStudioOptions;
  const products = useDemoStore((s) => s.products);

  // Initialize design configuration
  const [config, setConfig] = useState<BespokeDesignConfig>(() => {
    const base = JSON.parse(JSON.stringify(defaultBespokeDesign)) as BespokeDesignConfig;
    if (initialReferenceProduct) {
      const match = products.find(
        (p) =>
          p.id === initialReferenceProduct ||
          p.name.toLowerCase().includes(initialReferenceProduct.toLowerCase())
      );
      if (match) {
        base.designName = `Bespoke ${match.name}`;
        base.specialInstructions = `Inspired by catalogue piece: ${match.name} (${match.sku || ""})`;
        if (match.category === "tote") base.bagType = "tote";
        else if (match.category === "sling") base.bagType = "sling";
        else if (match.category === "crossbody") base.bagType = "crossbody";
        else if (match.category === "handbag") base.bagType = "handbag";
        else if (match.category === "clutch") base.bagType = "clutch";
      }
    }
    if (searchParams) {
      const pStyle = searchParams.get("style");
      const pLeather = searchParams.get("leather");
      const pColour = searchParams.get("colour");
      const pHw = searchParams.get("hw");
      const pInitials = searchParams.get("initials");

      if (pStyle) {
        base.bagType = pStyle as any;
        base.designName = `Bespoke ${pStyle.charAt(0).toUpperCase() + pStyle.slice(1)}`;
      }
      if (pLeather) base.material = pLeather as any;
      if (pColour) base.colourName = pColour;
      if (pHw) base.hardware = pHw as any;
      if (pInitials) {
        base.personalisation.enabled = true;
        base.personalisation.text = pInitials.toUpperCase().slice(0, 4);
      }
    }
    return base;
  });

  // Conversation history
  const [messages, setMessages] = useState<DesignMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: initialReferenceProduct
        ? `Namaste and welcome to BASAVA Bespoke Studio. I see you are drawn to our "${initialReferenceProduct}". I can help you tailor its dimensions, choose the leather colour and hardware finish, and add your initials. How would you like to begin?`
        : "Namaste and welcome to BASAVA Bespoke Studio. I am your personal Bespoke Leather Designer. Whether you are looking for a laptop bag, a structured everyday tote, or an original creation from a sketch, tell me what you have in mind or upload a photo to begin.",
      timestamp: new Date().toISOString(),
      suggestedActions: [
        {
          label: "Executive Laptop Briefcase in Espresso",
          action: "preset_laptop",
          patch: {
            bagType: "laptop",
            colourName: "Dark Chocolate Brown",
            colourHex: "#3D2314",
            hardware: "antique-brass",
            interior: {
              ...defaultBespokeDesign.interior,
              laptopSleeve: true,
            },
          },
        },
        {
          label: "Everyday Crossbody in Mysore Cognac",
          action: "preset_crossbody",
          patch: {
            bagType: "crossbody",
            colourName: "Mysore Cognac",
            colourHex: "#9E472A",
            hardware: "antique-brass",
          },
        },
        {
          label: "Classic Heritage Tote with Monogram",
          action: "preset_tote",
          patch: {
            bagType: "tote",
            colourName: "Royal Saddle Tan",
            colourHex: "#8A5D3B",
            personalisation: {
              enabled: true,
              text: "BV",
              method: "gold-foil",
              placement: "bottom-center",
            },
          },
        },
      ],
    },
  ]);

  // Concept views
  const [views, setViews] = useState<Record<ConceptViewType, ConceptImage>>({
    front: {
      id: "init-front",
      view: "front",
      label: "Front Elevation",
      url: "",
      provider: "studio-engine",
      generatedAt: new Date().toISOString(),
      disclaimer: "BESPOKE DESIGN SPECIFICATION · HANDCRAFTED IN BENGALURU.",
    },
    angle: {
      id: "init-angle",
      view: "angle",
      label: "3/4 Perspective",
      url: "",
      provider: "studio-engine",
      generatedAt: new Date().toISOString(),
      disclaimer: "BESPOKE DESIGN SPECIFICATION · HANDCRAFTED IN BENGALURU.",
    },
    interior: {
      id: "init-interior",
      view: "interior",
      label: "Interior Layout",
      url: "",
      provider: "studio-engine",
      generatedAt: new Date().toISOString(),
      disclaimer: "BESPOKE DESIGN SPECIFICATION · HANDCRAFTED IN BENGALURU.",
    },
    detail: {
      id: "init-detail",
      view: "detail",
      label: "Macro Detail",
      url: "",
      provider: "studio-engine",
      generatedAt: new Date().toISOString(),
      disclaimer: "BESPOKE DESIGN SPECIFICATION · HANDCRAFTED IN BENGALURU.",
    },
  });

  // Version management
  const [versions, setVersions] = useState<DesignVersion[]>([]);
  const [activeVersionNumber, setActiveVersionNumber] = useState(1);

  // Loading states
  const [isThinking, setIsThinking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modals
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // Mobile navigation tabs: "chat" | "concept" | "inspector"
  const [activeMobileTab, setActiveMobileTab] = useState<"chat" | "concept" | "inspector">("concept");

  // Generate initial concept views and version 1 on mount
  useEffect(() => {
    let isCancelled = false;

    async function loadInitialConcept() {
      setIsGenerating(true);
      try {
        const generatedViews = await ImageGenerationService.generateConceptViews(config);
        if (isCancelled) return;

        setViews(generatedViews);

        const v1: DesignVersion = {
          versionNumber: 1,
          createdAt: new Date().toISOString(),
          changeSummary: "Initial bespoke canvas created.",
          config: JSON.parse(JSON.stringify(config)),
          images: {
            front: generatedViews.front.url,
            angle: generatedViews.angle.url,
            interior: generatedViews.interior.url,
            detail: generatedViews.detail.url,
          },
        };

        setVersions([v1]);
        setActiveVersionNumber(1);
      } catch (err) {
        console.error("Failed to generate initial concept:", err);
      } finally {
        if (!isCancelled) setIsGenerating(false);
      }
    }

    loadInitialConcept();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Internal trigger to regenerate concept plates and register new version
  const triggerConceptRegeneration = useCallback(
    async (nextConfig: BespokeDesignConfig, changeSummary?: string) => {
      setIsGenerating(true);
      try {
        const nextViews = await ImageGenerationService.generateConceptViews(nextConfig);
        setViews(nextViews);

        // Record new version
        const { versions: updatedVersions, newVersion } = DesignVersionService.createVersion(
          versions,
          nextConfig,
          {
            front: nextViews.front.url,
            angle: nextViews.angle.url,
            interior: nextViews.interior.url,
            detail: nextViews.detail.url,
          },
          changeSummary
        );

        setVersions(updatedVersions);
        setActiveVersionNumber(newVersion.versionNumber);
      } catch (err) {
        console.error("Concept generation error:", err);
        showToast("Concept render delayed; using studio canvas fallback.");
      } finally {
        setIsGenerating(false);
      }
    },
    [versions, showToast]
  );

  // Handler: User modifies a setting in the Inspector (Right Pane)
  const handleConfigChange = useCallback(
    (patch: Partial<BespokeDesignConfig>) => {
      setConfig((prev) => {
        const next = { ...prev, ...patch };

        // Auto update title if type or colour changed
        if (patch.bagType || patch.colourName) {
          next.designName = DesignConfigurationService.generateAutoTitle(next);
        }

        // Trigger concept plate re-render with computed diff summary
        const diffSummary = DesignVersionService.computeDiffSummary(prev, next);
        triggerConceptRegeneration(next, diffSummary);

        return next;
      });
    },
    [triggerConceptRegeneration]
  );

  // Handler: User sends message or uploads image in Atelier Chat (Left Pane)
  const handleSendMessage = async (text: string, referenceImage?: string) => {
    const userMsgId = `usr-${Date.now()}`;
    const userMessage: DesignMessage = {
      id: userMsgId,
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
      referenceImage,
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setIsThinking(true);

    try {
      let turnResult: {
        reply: string;
        patch?: Partial<BespokeDesignConfig>;
        suggestedActions?: {
          label: string;
          action: string;
          patch?: Partial<BespokeDesignConfig>;
        }[];
        shouldRegenerateConcept?: boolean;
      };

      // If user attached an image, first analyze it
      if (referenceImage) {
        try {
          const imageAnalysis = await ReferenceImageService.analyzeReferenceImage(referenceImage, text);
          turnResult = {
            reply: `${imageAnalysis.artisanAssessment} Identified features: ${imageAnalysis.featuresIdentified.join(", ")}. Would you like me to adapt these suggestions into your bespoke design canvas?`,
            patch: imageAnalysis.suggestedPatch,
            suggestedActions: [
              {
                label: "Apply Reference Style to Canvas",
                action: "apply_image_style",
                patch: imageAnalysis.suggestedPatch,
              },
              {
                label: "Keep Current Silhouette, Use Color Only",
                action: "apply_color_only",
                patch: {
                  colourName: imageAnalysis.suggestedPatch?.colourName,
                  colourHex: imageAnalysis.suggestedPatch?.colourHex,
                },
              },
            ],
            shouldRegenerateConcept: true,
          };
        } catch (imgErr) {
          console.warn("Reference image analysis fallback:", imgErr);
          turnResult = await ConversationService.processMessage(text, config, nextHistory, studioOptions);
        }
      } else {
        // Normal conversation turn
        try {
          const res = await fetch("/api/studio/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: text,
              currentConfig: config,
              history: nextHistory,
            }),
          });
          if (res.ok) {
            turnResult = await res.json();
          } else {
            turnResult = await ConversationService.processMessage(text, config, nextHistory, studioOptions);
          }
        } catch {
          turnResult = await ConversationService.processMessage(text, config, nextHistory, studioOptions);
        }
      }

      // Add assistant response to messages
      const assistantMessage: DesignMessage = {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        text: turnResult.reply,
        timestamp: new Date().toISOString(),
        suggestedActions: turnResult.suggestedActions,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If the turn produced a configuration patch, apply it and regenerate concept
      if (turnResult.patch && Object.keys(turnResult.patch).length > 0) {
        setConfig((prev) => {
          const merged = { ...prev, ...turnResult.patch };
          if (turnResult.patch?.bagType || turnResult.patch?.colourName) {
            merged.designName = DesignConfigurationService.generateAutoTitle(merged);
          }
          triggerConceptRegeneration(merged, `Consultation refinement: ${text}`);
          return merged;
        });
      }
    } catch (err) {
      console.error("Chat turn error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          sender: "assistant",
          text: "I experienced a brief connectivity ripple with our atelier engine, but your current design is fully preserved. You can continue speaking with me or refine options on the right.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // Handler: User clicks a suggestion action chip in chat
  const handleApplyAction = (action: {
    label: string;
    action: string;
    patch?: Partial<BespokeDesignConfig>;
  }) => {
    if (action.patch) {
      handleConfigChange(action.patch);
      setMessages((prev) => [
        ...prev,
        {
          id: `usr-act-${Date.now()}`,
          sender: "user",
          text: action.label,
          timestamp: new Date().toISOString(),
        },
        {
          id: `asst-act-${Date.now()}`,
          sender: "assistant",
          text: `Certainly. I have updated the design canvas with "${action.label}". Inspect the 3D elevation on the canvas or customize further.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  // Handler: Version restoration from modal
  const handleRestoreVersion = (version: DesignVersion) => {
    setConfig(version.config);
    setActiveVersionNumber(version.versionNumber);

    // Update views from restored version snapshots
    setViews((prev) => ({
      front: { ...prev.front, url: version.images.front },
      angle: { ...prev.angle, url: version.images.angle },
      interior: { ...prev.interior, url: version.images.interior },
      detail: { ...prev.detail, url: version.images.detail },
    }));

    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: "system",
        text: `Design canvas restored to Version v${version.versionNumber}: "${version.config.designName}".`,
        timestamp: new Date().toISOString(),
      },
    ]);

    showToast(`Restored to Version v${version.versionNumber}.`);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#FAF7F2] text-charcoal">
      {/* Top Heritage Utility Bar */}
      <header className="border-b border-espresso/15 bg-paper/90 backdrop-blur-xs px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="BASAVA Home" className="flex items-center gap-2.5 group">
            <BasavaMark size={24} className="transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-display font-medium tracking-[0.22em] text-espresso text-sm leading-none">BASAVA</span>
              <span className="text-[0.45rem] font-medium tracking-[0.16em] uppercase text-saddle-deep leading-tight">Bespoke Studio</span>
            </div>
          </Link>
          <span className="hidden sm:inline text-xs text-charcoal/40">|</span>
          <p className="hidden sm:block text-xs text-charcoal/75">
            Your personal bag designer · Bengaluru Atelier
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onSwitchToClassicWizard && (
            <button
              type="button"
              onClick={onSwitchToClassicWizard}
              className="hidden sm:inline text-xs text-charcoal/70 hover:text-espresso underline transition-colors px-2 py-1"
            >
              Use the simple form instead
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsVersionModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-espresso/20 bg-ivory text-xs font-semibold uppercase tracking-wider text-espresso rounded-xs hover:border-espresso transition-colors cursor-pointer"
          >
            <Layers size={13} className="text-saddle-deep" />
            <span className="hidden sm:inline">Versions</span> ({versions.length})
          </button>

          <button
            type="button"
            onClick={() => setIsQuoteModalOpen(true)}
            className="btn btn-solid btn-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Compass size={13} className="text-sand" />
            <span className="whitespace-nowrap">Send for a quote</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher (<lg) */}
      <div className="lg:hidden grid grid-cols-3 border-b border-espresso/15 bg-linen/70 text-xs font-semibold uppercase tracking-wider">
        <button
          type="button"
          onClick={() => setActiveMobileTab("chat")}
          className={cx(
            "py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors",
            activeMobileTab === "chat"
              ? "border-espresso text-espresso bg-paper font-bold"
              : "border-transparent text-charcoal/60 hover:text-espresso"
          )}
        >
          <MessageSquare size={14} />
          <span>Designer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab("concept")}
          className={cx(
            "py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors",
            activeMobileTab === "concept"
              ? "border-espresso text-espresso bg-paper font-bold"
              : "border-transparent text-charcoal/60 hover:text-espresso"
          )}
        >
          <Eye size={14} />
          <span>Your design</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab("inspector")}
          className={cx(
            "py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors",
            activeMobileTab === "inspector"
              ? "border-espresso text-espresso bg-paper font-bold"
              : "border-transparent text-charcoal/60 hover:text-espresso"
          )}
        >
          <Sliders size={14} />
          <span>Options</span>
        </button>
      </div>

      {/* 3-Pane Desktop Layout & Tabbed Mobile Layout */}
      <main className="flex-1 p-2 sm:p-4 overflow-hidden min-h-0">
        <div className="h-[calc(100vh-140px)] min-h-[580px] max-h-[920px] grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Pane 1: The Bespoke Designer (Left: 3.5 cols on desktop) */}
          <div
            className={cx(
              "h-full lg:col-span-4 xl:col-span-3.5 flex flex-col min-h-0",
              activeMobileTab === "chat" ? "block" : "hidden lg:flex"
            )}
          >
            <AiDesignerChat
              messages={messages}
              isThinking={isThinking}
              onSendMessage={handleSendMessage}
              onApplyAction={handleApplyAction}
              className="h-full"
            />
          </div>

          {/* Pane 2: Concept Viewer Stage (Center: 5 cols on desktop) */}
          <div
            className={cx(
              "h-full lg:col-span-5 xl:col-span-5.5 flex flex-col min-h-0",
              activeMobileTab === "concept" ? "block" : "hidden lg:flex"
            )}
          >
            <BagConceptViewer
              config={config}
              views={views}
              isGenerating={isGenerating}
              activeVersionNumber={activeVersionNumber}
              versions={versions}
              onRegenerate={() => triggerConceptRegeneration(config, "Manual canvas regeneration")}
              onOpenVersions={() => setIsVersionModalOpen(true)}
              className="h-full"
            />
          </div>

          {/* Pane 3: Customisation Inspector (Right: 3 cols on desktop) */}
          <div
            className={cx(
              "h-full lg:col-span-3 xl:col-span-3 flex flex-col min-h-0",
              activeMobileTab === "inspector" ? "block" : "hidden lg:flex"
            )}
          >
            <CustomisationInspector
              config={config}
              onChange={handleConfigChange}
              onSubmitQuote={() => setIsQuoteModalOpen(true)}
              options={studioOptions}
              className="h-full"
            />
          </div>
        </div>
      </main>

      {/* Quotation & Spec Modal */}
      <QuotationModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        config={config}
        heroImage={views.front?.url || ""}
        versions={versions}
      />

      {/* Version History Archive Modal */}
      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        versions={versions}
        activeVersionNumber={activeVersionNumber}
        onRestoreVersion={handleRestoreVersion}
      />
    </div>
  );
}
