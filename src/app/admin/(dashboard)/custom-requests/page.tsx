"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Compass,
  Eye,
  History,
  Layers,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  User,
  X,
  ExternalLink,
} from "lucide-react";
import type { CustomEnquiry, EnquiryStatus } from "@/lib/types";
import type {
  BespokeQuotationRequest,
  CustomRequestLifecycleStatus,
  ConceptViewType,
} from "@/lib/studio-types";
import { formatDate, enquiryStatusLabel } from "@/lib/format";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { whatsappLink } from "@/lib/whatsapp";
import { Overlay } from "@/components/ui/Overlay";
import {
  LIFECYCLE_STATUS_LABELS,
  QuotationService,
} from "@/services/quotationService";

const classicStatuses: EnquiryStatus[] = [
  "new",
  "reviewing",
  "quoted",
  "in_progress",
  "completed",
  "declined",
];

const bespokeStatuses: CustomRequestLifecycleStatus[] = [
  "NEW",
  "UNDER_REVIEW",
  "FEASIBILITY_CHECK",
  "QUOTATION_PREPARATION",
  "QUOTATION_SENT",
  "CUSTOMER_APPROVAL",
  "APPROVED",
  "IN_PRODUCTION",
  "QUALITY_CHECK",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
];

export default function AdminCustomRequestsPage() {
  const enquiries = useDemoStore((s) => s.enquiries);
  const bespokeRequests = useDemoStore((s) => s.bespokeRequests);
  const updateEnquiry = useDemoStore((s) => s.updateEnquiry);
  const updateBespokeRequest = useDemoStore((s) => s.updateBespokeRequest);
  const settings = useDemoStore((s) => s.settings);
  const showToast = useToast((s) => s.show);

  // Tab: "bespoke" (Bespoke Atelier) vs "classic" (5-Step Brief)
  const [activeTab, setActiveTab] = useState<"bespoke" | "classic">("bespoke");

  // Filters
  const [bespokeFilter, setBespokeFilter] = useState<string>("all");
  const [classicFilter, setClassicFilter] = useState<string>("all");

  // Selected for Drawers
  const [selectedBespoke, setSelectedBespoke] = useState<BespokeQuotationRequest | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomEnquiry | null>(null);

  // Bespoke Editing State in Drawer
  const [quotedPriceINR, setQuotedPriceINR] = useState<string>("");
  const [quotedTimelineDays, setQuotedTimelineDays] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [bespokeStatus, setBespokeStatus] = useState<CustomRequestLifecycleStatus>("NEW");
  const [activeDrawerView, setActiveDrawerView] = useState<ConceptViewType>("front");

  // Classic Editing State
  const [internalNote, setInternalNote] = useState("");

  // Filtered Bespoke Requests
  const filteredBespoke = useMemo(() => {
    if (bespokeFilter === "all") return bespokeRequests;
    return bespokeRequests.filter((r) => r.status === bespokeFilter);
  }, [bespokeRequests, bespokeFilter]);

  // Filtered Classic Enquiries
  const filteredClassic = useMemo(() => {
    if (classicFilter === "all") return enquiries;
    return enquiries.filter((e) => e.status === classicFilter);
  }, [enquiries, classicFilter]);

  // Open Bespoke Drawer
  const openBespokeDrawer = (req: BespokeQuotationRequest) => {
    setSelectedBespoke(req);
    setQuotedPriceINR(req.quotedPriceINR ? String(req.quotedPriceINR) : "");
    setQuotedTimelineDays(req.quotedTimelineDays ? String(req.quotedTimelineDays) : "");
    setAdminNotes(req.adminNotes || "");
    setBespokeStatus(req.status);
    setActiveDrawerView("front");
  };

  // Save Bespoke Updates
  const handleSaveBespoke = () => {
    if (!selectedBespoke) return;

    const priceNum = quotedPriceINR.trim() ? parseFloat(quotedPriceINR) : null;
    const daysNum = quotedTimelineDays.trim() ? parseInt(quotedTimelineDays, 10) : null;

    updateBespokeRequest(selectedBespoke.id, {
      status: bespokeStatus,
      quotedPriceINR: isNaN(priceNum as any) ? null : priceNum,
      quotedTimelineDays: isNaN(daysNum as any) ? null : daysNum,
      adminNotes: adminNotes.trim(),
    });

    setSelectedBespoke((prev) =>
      prev
        ? {
            ...prev,
            status: bespokeStatus,
            quotedPriceINR: isNaN(priceNum as any) ? null : priceNum,
            quotedTimelineDays: isNaN(daysNum as any) ? null : daysNum,
            adminNotes: adminNotes.trim(),
          }
        : null
    );

    showToast(`Updated bespoke order ${selectedBespoke.referenceCode}.`);
  };

  // Open Classic Drawer
  const openClassicDrawer = (enq: CustomEnquiry) => {
    setSelectedEnquiry(enq);
    setInternalNote(enq.internalNote || "");
  };

  // Handle Classic Status Change
  const handleClassicStatusChange = (newStatus: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    updateEnquiry(selectedEnquiry.id, { status: newStatus });
    showToast(`Brief #${selectedEnquiry.id} status changed to ${enquiryStatusLabel[newStatus]}.`);
    setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
  };

  // Handle Classic Save Notes
  const handleClassicSaveNotes = () => {
    if (!selectedEnquiry) return;
    updateEnquiry(selectedEnquiry.id, { internalNote: internalNote.trim() });
    showToast(`Saved notes for #${selectedEnquiry.id}.`);
    setSelectedEnquiry({ ...selectedEnquiry, internalNote: internalNote.trim() });
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-espresso/15 pb-6">
        <div>
          <span className="eyebrow text-saddle-deep">Atelier Custom Pipeline</span>
          <h1 className="font-display text-3xl text-espresso mt-1">
            Custom Commissions Queue
          </h1>
          <p className="text-xs text-charcoal/70 mt-1">
            Review bespoke atelier studio designs, prepare artisan quotes, and manage classic bespoke briefs.
          </p>
        </div>
      </div>

      {/* Primary Pipeline Tabs */}
      <div className="flex border-b border-espresso/20 bg-linen/40 p-1 rounded-xs gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("bespoke")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "bespoke"
              ? "bg-espresso text-ivory shadow-xs"
              : "text-charcoal/70 hover:text-espresso hover:bg-paper"
          }`}
        >
          <Compass size={14} className={activeTab === "bespoke" ? "text-sand" : "text-saddle-deep"} />
          <span>Bespoke Studio Commissions ({bespokeRequests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("classic")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "classic"
              ? "bg-espresso text-ivory shadow-xs"
              : "text-charcoal/70 hover:text-espresso hover:bg-paper"
          }`}
        >
          <span>Classic Briefs ({enquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: BESPOKE REQUESTS */}
      {activeTab === "bespoke" && (
        <div className="space-y-6">
          {/* Status Filter Chips */}
          <div className="flex flex-wrap border border-espresso/15 bg-ivory rounded-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setBespokeFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                bespokeFilter === "all" ? "bg-espresso text-ivory" : "text-charcoal/70 hover:text-espresso"
              }`}
            >
              All ({bespokeRequests.length})
            </button>
            {bespokeStatuses.map((st) => {
              const count = bespokeRequests.filter((r) => r.status === st).length;
              if (count === 0 && bespokeFilter !== st) return null;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setBespokeFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    bespokeFilter === st ? "bg-espresso text-ivory" : "text-charcoal/70 hover:text-espresso"
                  }`}
                >
                  {LIFECYCLE_STATUS_LABELS[st]?.label || st} ({count})
                </button>
              );
            })}
          </div>

          {/* Bespoke Table */}
          <div className="border border-espresso/15 bg-ivory rounded-xs overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-espresso/12 bg-linen/40 text-walnut/70 uppercase tracking-wider text-[0.625rem]">
                    <th className="py-3 px-4">Concept</th>
                    <th className="py-3 px-4">Reference Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Design Specs</th>
                    <th className="py-3 px-4">Monogram</th>
                    <th className="py-3 px-4">Artisan Quote</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/8">
                  {filteredBespoke.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-charcoal/60 italic">
                        No bespoke commissions matching this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBespoke.map((req) => {
                      const statusMeta = LIFECYCLE_STATUS_LABELS[req.status] || {
                        label: req.status,
                        colour: "bg-linen text-espresso",
                      };
                      return (
                        <tr
                          key={req.id}
                          onClick={() => openBespokeDrawer(req)}
                          className="hover:bg-paper cursor-pointer transition-colors"
                        >
                          {/* Thumbnail */}
                          <td className="py-3 px-4">
                            <div className="w-12 h-12 rounded-xs border border-espresso/15 bg-linen/50 flex items-center justify-center overflow-hidden shrink-0">
                              {req.heroImage ? (
                                <img
                                  src={req.heroImage}
                                  alt="Concept plate"
                                  className="w-full h-full object-contain filter drop-shadow-2xs"
                                />
                              ) : (
                                <span className="text-[0.625rem] text-charcoal/50">Concept</span>
                              )}
                            </div>
                          </td>

                          {/* Reference Code & Date */}
                          <td className="py-3 px-4">
                            <p className="font-mono font-bold text-espresso">{req.referenceCode}</p>
                            <p className="text-[0.6875rem] text-charcoal/60 whitespace-nowrap">
                              {formatDate(req.createdAt)}
                            </p>
                          </td>

                          {/* Customer */}
                          <td className="py-3 px-4">
                            <p className="font-semibold text-espresso">{req.customer.name}</p>
                            <p className="text-[0.6875rem] text-charcoal/60">{req.customer.phone}</p>
                            <p className="text-[0.6875rem] text-charcoal/50 truncate max-w-[140px]">
                              {req.customer.email}
                            </p>
                          </td>

                          {/* Specs */}
                          <td className="py-3 px-4">
                            <p className="font-medium text-espresso capitalize">
                              {req.currentConfig.designName || `${req.currentConfig.bagType} Bag`}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                                style={{ backgroundColor: req.currentConfig.colourHex }}
                              />
                              <span className="text-[0.6875rem] text-walnut/80 capitalize">
                                {req.currentConfig.colourName} · {req.currentConfig.material.replace("-", " ")}
                              </span>
                            </div>
                          </td>

                          {/* Monogram */}
                          <td className="py-3 px-4">
                            {req.currentConfig.personalisation.enabled &&
                            req.currentConfig.personalisation.text ? (
                              <span className="font-mono bg-linen px-2 py-0.5 rounded-xs text-saddle-deep font-bold">
                                {req.currentConfig.personalisation.text}
                              </span>
                            ) : (
                              <span className="text-charcoal/40">—</span>
                            )}
                          </td>

                          {/* Quoted Price */}
                          <td className="py-3 px-4">
                            {req.quotedPriceINR ? (
                              <div>
                                <span className="font-medium text-espresso">
                                  ₹{req.quotedPriceINR.toLocaleString("en-IN")}
                                </span>
                                {req.quotedTimelineDays && (
                                  <p className="text-[0.6875rem] text-charcoal/60">
                                    {req.quotedTimelineDays} days
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-[0.6875rem] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-xs font-semibold">
                                Needs Quote
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider rounded-xs border ${statusMeta.colour}`}
                            >
                              {statusMeta.label}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="py-3 px-4 text-right">
                            <span className="text-xs font-semibold uppercase text-saddle-deep inline-flex items-center gap-1">
                              Review <ChevronRight size={12} />
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLASSIC BRIEFS */}
      {activeTab === "classic" && (
        <div className="space-y-6">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap border border-espresso/15 bg-ivory rounded-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setClassicFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                classicFilter === "all" ? "bg-espresso text-ivory" : "text-charcoal/70 hover:text-espresso"
              }`}
            >
              All ({enquiries.length})
            </button>
            {classicStatuses.map((st) => {
              const count = enquiries.filter((e) => e.status === st).length;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setClassicFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    classicFilter === st ? "bg-espresso text-ivory" : "text-charcoal/70 hover:text-espresso"
                  }`}
                >
                  {enquiryStatusLabel[st]} ({count})
                </button>
              );
            })}
          </div>

          {/* Classic Table */}
          <div className="border border-espresso/15 bg-ivory rounded-xs overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-espresso/12 bg-linen/40 text-walnut/70 uppercase tracking-wider text-[0.625rem]">
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Piece & Leather</th>
                    <th className="py-3 px-4">Monogram</th>
                    <th className="py-3 px-4">Target Budget</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/8">
                  {filteredClassic.map((enq) => (
                    <tr
                      key={enq.id}
                      onClick={() => openClassicDrawer(enq)}
                      className="hover:bg-paper cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-espresso">
                        {enq.id}
                        {enq.sample && (
                          <span className="ml-2 font-sans font-normal text-[0.55rem] uppercase text-walnut/60 border border-espresso/20 px-1 py-0.5 rounded-xs">
                            Sample
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-charcoal/70 whitespace-nowrap">
                        {formatDate(enq.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-espresso">{enq.customer.name}</p>
                        <p className="text-[0.6875rem] text-charcoal/60">{enq.customer.phone}</p>
                      </td>
                      <td className="py-3 px-4 text-charcoal/80">
                        <p className="font-medium text-espresso">{enq.productType}</p>
                        <p className="text-[0.6875rem] text-walnut/70">{enq.colour}</p>
                      </td>
                      <td className="py-3 px-4">
                        {enq.engraving && enq.engraving !== "None" ? (
                          <span className="font-mono bg-linen px-2 py-0.5 rounded-xs text-saddle-deep font-bold">
                            {enq.engraving}
                          </span>
                        ) : (
                          <span className="text-charcoal/40">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-espresso">{enq.budget}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider rounded-xs bg-linen text-espresso">
                          {enquiryStatusLabel[enq.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-xs font-semibold uppercase text-saddle-deep inline-flex items-center gap-1">
                          Manage <ChevronRight size={12} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 1: BESPOKE REQUEST INSPECTION & QUOTATION */}
      <Overlay
        open={Boolean(selectedBespoke)}
        onClose={() => setSelectedBespoke(null)}
        label="Bespoke Studio Commission Details"
        side="right"
        className="p-6 sm:p-8"
      >
        {selectedBespoke && (
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-6rem)] pr-1 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-espresso/15 pb-4">
              <div>
                <span className="eyebrow text-saddle-deep">Bespoke Atelier Commission</span>
                <h2 className="font-display text-2xl text-espresso mt-0.5">
                  {selectedBespoke.referenceCode}
                </h2>
                <p className="text-[0.6875rem] text-charcoal/60 mt-0.5">
                  Submitted {formatDate(selectedBespoke.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBespoke(null)}
                className="flex h-8 w-8 items-center justify-center text-espresso/70 hover:text-espresso"
              >
                <X size={18} />
              </button>
            </div>

            {/* Concept Plate Stage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="field-label">Atelier Elevation Concept Plates</span>
                <span className="font-mono text-[0.625rem] text-charcoal/60">
                  {selectedBespoke.versions.length} versions generated
                </span>
              </div>

              {/* View tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-linen/60 rounded-xs border border-espresso/15 text-center text-[0.625rem] font-semibold uppercase tracking-wider">
                {(["front", "angle", "interior", "detail"] as ConceptViewType[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setActiveDrawerView(v)}
                    className={`py-1.5 rounded-xs transition-colors cursor-pointer ${
                      activeDrawerView === v ? "bg-espresso text-ivory" : "hover:text-espresso"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* Concept Image Render */}
              <div className="relative aspect-16/10 rounded-xs border border-espresso/15 bg-gradient-to-b from-[#FAF7F2] to-[#EFE8DE] flex items-center justify-center overflow-hidden p-4">
                {selectedBespoke.additionalViews?.[activeDrawerView] || selectedBespoke.heroImage ? (
                  <img
                    src={
                      selectedBespoke.additionalViews?.[activeDrawerView] || selectedBespoke.heroImage
                    }
                    alt={`${selectedBespoke.referenceCode} concept`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  />
                ) : (
                  <span className="text-charcoal/50 text-xs">Concept visual in archive.</span>
                )}
                <span className="absolute bottom-1 right-2 text-[0.55rem] font-mono text-espresso/80 bg-ivory/80 px-1.5 py-0.5 rounded-xs">
                  ATELIER ELEVATION CONCEPT
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="border border-espresso/15 bg-paper p-4 rounded-xs space-y-2">
              <span className="field-label">Customer Profile</span>
              <p className="font-display text-base text-espresso font-semibold">
                {selectedBespoke.customer.name}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-charcoal/80 pt-1">
                <div>
                  <span className="text-[0.625rem] text-charcoal/50 block">Phone</span>
                  <a
                    href={`tel:${selectedBespoke.customer.phone}`}
                    className="font-mono text-saddle-deep hover:underline"
                  >
                    {selectedBespoke.customer.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[0.625rem] text-charcoal/50 block">Email</span>
                  <a
                    href={`mailto:${selectedBespoke.customer.email}`}
                    className="text-saddle-deep hover:underline truncate block"
                  >
                    {selectedBespoke.customer.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Design Specifications Grid */}
            <div className="border border-espresso/15 bg-paper p-4 rounded-xs space-y-3">
              <span className="field-label">Atelier Specifications</span>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2 border border-espresso/10 rounded-xs bg-ivory">
                  <span className="text-[0.625rem] text-charcoal/60 uppercase block">Silhouette</span>
                  <span className="font-semibold text-espresso capitalize">
                    {selectedBespoke.currentConfig.bagType} Bag
                  </span>
                </div>
                <div className="p-2 border border-espresso/10 rounded-xs bg-ivory">
                  <span className="text-[0.625rem] text-charcoal/60 uppercase block">Leather & Swatch</span>
                  <span className="font-semibold text-espresso capitalize">
                    {selectedBespoke.currentConfig.colourName} ({selectedBespoke.currentConfig.material.replace("-", " ")})
                  </span>
                </div>
                <div className="p-2 border border-espresso/10 rounded-xs bg-ivory">
                  <span className="text-[0.625rem] text-charcoal/60 uppercase block">Dimensions</span>
                  <span className="font-semibold text-espresso">
                    {selectedBespoke.currentConfig.dimensions.width} ×{" "}
                    {selectedBespoke.currentConfig.dimensions.height} ×{" "}
                    {selectedBespoke.currentConfig.dimensions.depth} cm
                  </span>
                </div>
                <div className="p-2 border border-espresso/10 rounded-xs bg-ivory">
                  <span className="text-[0.625rem] text-charcoal/60 uppercase block">Hardware & Closure</span>
                  <span className="font-semibold text-espresso capitalize">
                    {selectedBespoke.currentConfig.hardware} · {selectedBespoke.currentConfig.closure}
                  </span>
                </div>
                <div className="p-2 border border-espresso/10 rounded-xs bg-ivory col-span-2">
                  <span className="text-[0.625rem] text-charcoal/60 uppercase block">Monogramming</span>
                  <span className="font-semibold text-espresso">
                    {selectedBespoke.currentConfig.personalisation.enabled &&
                    selectedBespoke.currentConfig.personalisation.text
                      ? `"${selectedBespoke.currentConfig.personalisation.text}" via ${selectedBespoke.currentConfig.personalisation.method.replace("-", " ")} (${selectedBespoke.currentConfig.personalisation.placement})`
                      : "No personalisation requested"}
                  </span>
                </div>
              </div>

              {selectedBespoke.specialNotes && (
                <div className="pt-2 border-t border-espresso/10">
                  <span className="text-[0.625rem] text-charcoal/60 uppercase block">Customer Notes</span>
                  <p className="text-xs text-charcoal/90 italic mt-0.5">
                    &quot;{selectedBespoke.specialNotes}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Internal Benchmark Guide */}
            {(() => {
              const guide = QuotationService.calculateInternalArtisanGuidance(
                selectedBespoke.currentConfig
              );
              return (
                <div className="border border-saddle-deep/30 bg-linen/50 p-4 rounded-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-espresso font-semibold text-xs">
                    <ShieldCheck size={14} className="text-saddle-deep" />
                    <span>Internal Artisan Benchmark (Guidance Only)</span>
                  </div>
                  <p className="text-[0.6875rem] text-charcoal/80">
                    Recommended baseline: <strong>₹{guide.minRangeINR.toLocaleString("en-IN")} – ₹{guide.maxRangeINR.toLocaleString("en-IN")}</strong> · Estimated craft window: <strong>{guide.estimatedDays} days</strong>.
                  </p>
                </div>
              );
            })()}

            {/* Pricing & Status Form */}
            <div className="border border-espresso/15 bg-paper p-4 rounded-xs space-y-4">
              <span className="field-label">Maker Quotation & Lifecycle</span>

              {/* Status Select */}
              <div className="space-y-1">
                <label className="text-[0.6875rem] text-charcoal/70 uppercase tracking-wider block">
                  Commission Status
                </label>
                <select
                  value={bespokeStatus}
                  onChange={(e) => setBespokeStatus(e.target.value as CustomRequestLifecycleStatus)}
                  className="field-input text-xs font-semibold"
                >
                  {bespokeStatuses.map((st) => (
                    <option key={st} value={st}>
                      {LIFECYCLE_STATUS_LABELS[st]?.label || st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Days Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[0.6875rem] text-charcoal/70 uppercase tracking-wider block">
                    Confirmed Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={quotedPriceINR}
                    onChange={(e) => setQuotedPriceINR(e.target.value)}
                    placeholder="e.g. 5500"
                    className="field-input text-xs font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[0.6875rem] text-charcoal/70 uppercase tracking-wider block">
                    Timeline (Days)
                  </label>
                  <input
                    type="number"
                    value={quotedTimelineDays}
                    onChange={(e) => setQuotedTimelineDays(e.target.value)}
                    placeholder="e.g. 10"
                    className="field-input text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              {/* Maker Notes */}
              <div className="space-y-1">
                <label className="text-[0.6875rem] text-charcoal/70 uppercase tracking-wider block">
                  Internal Workshop Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Full-grain Cognac hide allocated from local tannery. Solid antique brass lock reserved."
                  className="field-input text-xs"
                />
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveBespoke}
                className="btn btn-solid w-full text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check size={14} />
                Save Quotation & Status
              </button>
            </div>

            {/* Direct WhatsApp Response */}
            <div className="border border-emerald-300 bg-emerald-50/70 p-4 rounded-xs space-y-2">
              <span className="text-[0.6875rem] uppercase tracking-wider font-bold text-emerald-900 block">
                Direct WhatsApp Communication
              </span>
              <p className="text-[0.6875rem] text-emerald-800">
                Message customer directly on WhatsApp regarding reference <strong>{selectedBespoke.referenceCode}</strong>:
              </p>
              {(() => {
                const quoteText = quotedPriceINR.trim()
                  ? `Your bespoke price quote is confirmed at ₹${parseFloat(quotedPriceINR).toLocaleString("en-IN")} with a crafting timeline of ${quotedTimelineDays || 10} days.`
                  : "We have reviewed your design concept and would like to confirm your leather choices.";
                const msg = `Hello ${selectedBespoke.customer.name}, regarding your Kris Designs bespoke commission ${selectedBespoke.referenceCode} (${selectedBespoke.currentConfig.bagType}): ${quoteText}`;
                return (
                  <a
                    href={whatsappLink(selectedBespoke.customer.phone, msg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm w-full bg-emerald-800 text-ivory hover:bg-emerald-900 flex items-center justify-center gap-2 mt-2"
                  >
                    <MessageCircle size={14} />
                    Message Customer via WhatsApp
                  </a>
                );
              })()}
            </div>
          </div>
        )}
      </Overlay>

      {/* DRAWER 2: CLASSIC BRIEF MANAGEMENT */}
      <Overlay
        open={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        label="Custom Brief Details"
        side="right"
        className="p-6 sm:p-8"
      >
        {selectedEnquiry && (
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-6rem)] pr-1 text-xs">
            <div className="flex items-center justify-between border-b border-espresso/15 pb-4">
              <div>
                <span className="eyebrow">Classic Bespoke Brief</span>
                <h2 className="font-display text-2xl text-espresso mt-0.5">#{selectedEnquiry.id}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="flex h-8 w-8 items-center justify-center text-espresso/70 hover:text-espresso"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Change */}
            <div className="border border-espresso/15 bg-paper p-4 rounded-xs space-y-2">
              <label className="field-label">Update Status</label>
              <select
                value={selectedEnquiry.status}
                onChange={(e) => handleClassicStatusChange(e.target.value as EnquiryStatus)}
                className="field-input font-semibold text-xs"
              >
                {classicStatuses.map((st) => (
                  <option key={st} value={st}>
                    {enquiryStatusLabel[st]}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Details */}
            <div className="border border-espresso/15 bg-paper p-4 rounded-xs space-y-2">
              <span className="field-label">Customer</span>
              <p className="font-display text-base text-espresso font-semibold">
                {selectedEnquiry.customer.name}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-charcoal/80 pt-1">
                <div>
                  <span className="text-[0.625rem] text-charcoal/50 block">Phone</span>
                  <a
                    href={`tel:${selectedEnquiry.customer.phone}`}
                    className="font-mono text-saddle-deep hover:underline"
                  >
                    {selectedEnquiry.customer.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[0.625rem] text-charcoal/50 block">Email</span>
                  <a
                    href={`mailto:${selectedEnquiry.customer.email}`}
                    className="text-saddle-deep hover:underline truncate block"
                  >
                    {selectedEnquiry.customer.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Brief Specifications */}
            <div className="border border-espresso/15 bg-paper p-4 rounded-xs space-y-3">
              <span className="field-label">Specifications</span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[0.625rem] text-charcoal/50 block">Product Type</span>
                  <span className="font-medium text-espresso">{selectedEnquiry.productType}</span>
                </div>
                <div>
                  <span className="text-[0.625rem] text-charcoal/50 block">Colour & Finish</span>
                  <span className="font-medium text-espresso">{selectedEnquiry.colour}</span>
                </div>
                <div>
                  <span className="text-[0.625rem] text-charcoal/50 block">Monogram</span>
                  <span className="font-medium font-mono text-espresso">
                    {selectedEnquiry.engraving || "None"}
                  </span>
                </div>
                <div>
                  <span className="text-[0.625rem] text-charcoal/50 block">Target Budget</span>
                  <span className="font-medium text-espresso">{selectedEnquiry.budget}</span>
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="border border-espresso/15 bg-paper p-4 rounded-xs space-y-2">
              <label className="field-label">Workshop Notes</label>
              <textarea
                rows={3}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Internal notes on hide availability or discussions..."
                className="field-input text-xs"
              />
              <button
                type="button"
                onClick={handleClassicSaveNotes}
                className="btn btn-solid w-full text-xs"
              >
                Save Notes
              </button>
            </div>
          </div>
        )}
      </Overlay>
    </div>
  );
}
