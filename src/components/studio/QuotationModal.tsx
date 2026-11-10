"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, Send, ShieldCheck, Sparkles, X } from "lucide-react";
import { cx } from "@/lib/format";
import { isEmail, isFilled, isIndianPhone } from "@/lib/validation";
import { whatsappLink } from "@/lib/whatsapp";
import { useDemoStore } from "@/lib/store";
import type { BespokeDesignConfig, BespokeQuotationRequest, ConceptImage, DesignVersion } from "@/lib/studio-types";

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BespokeDesignConfig;
  heroImage: string;
  versions: DesignVersion[];
}

export function QuotationModal({
  isOpen,
  onClose,
  config,
  heroImage,
  versions,
}: QuotationModalProps) {
  const submitBespokeRequest = useDemoStore((s) => s.submitBespokeRequest);
  const settings = useDemoStore((s) => s.settings);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [targetBudget, setTargetBudget] = useState("₹3,500 – ₹6,000");
  const [neededByDate, setNeededByDate] = useState("");
  const [specialNotes, setSpecialNotes] = useState(config.specialInstructions || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedRequest, setSubmittedRequest] = useState<BespokeQuotationRequest | null>(null);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!isFilled(name, 2)) errs.name = "Please provide your full name.";
    if (!isEmail(email)) errs.email = "Please provide a valid email address.";
    if (!isIndianPhone(phone)) errs.phone = "Please enter a valid 10-digit Indian phone number.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const request = submitBespokeRequest({
      status: "NEW",
      customer: { name, email, phone },
      quantity,
      targetBudget,
      neededByDate: neededByDate || undefined,
      specialNotes: specialNotes.trim() || undefined,
      currentConfig: config,
      versions,
      messages: [],
      referenceImages: [],
      heroImage,
      additionalViews: {},
      quotedPriceINR: null,
      quotedTimelineDays: null,
      adminNotes: "",
    });

    setSubmittedRequest(request);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-paper border border-espresso/20 rounded-xs shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-walnut/70 hover:text-espresso rounded-full transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {submittedRequest ? (
          /* Success Screen */
          <div className="p-8 sm:p-12 text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-linen border border-espresso/20 text-espresso flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} className="text-saddle-deep" />
            </div>

            <span className="eyebrow text-saddle-deep">Quotation Request Logged</span>
            <h2 className="font-display text-2xl sm:text-3xl text-espresso mt-1">
              Your Bespoke Specification Is Set
            </h2>
            <p className="mt-2 font-mono text-sm font-bold text-saddle-deep">
              Reference Code: {submittedRequest.referenceCode}
            </p>

            <p className="text-xs sm:text-sm text-charcoal/80 max-w-md mx-auto mt-3 leading-relaxed">
              Thank you, <strong>{name}</strong>. Our master artisan in Bengaluru has received your design brief for <strong>{config.designName}</strong>. We will review hide availability, pattern scaling, and prepare your confirmed quote.
            </p>

            {/* WhatsApp Fast Track */}
            <div className="mt-6 p-4 border border-saddle-deep/30 bg-linen/50 rounded-xs text-left max-w-md mx-auto">
              <div className="flex items-center gap-2 text-espresso font-semibold text-xs">
                <Sparkles size={14} className="text-brass" />
                <span>Fast-Track with the Maker</span>
              </div>
              <p className="text-xs text-charcoal/75 mt-1 leading-relaxed">
                Connect directly with our workshop to discuss leather swatches, custom strap lengths, or target delivery dates:
              </p>

              <a
                href={whatsappLink(
                  settings.whatsappNumber,
                  `Hello ${settings.makerName}, I have submitted bespoke design brief #${submittedRequest.referenceCode} (${config.designName}) on your AI Studio. I would like to discuss the quote and timeline.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-solid w-full mt-3 flex items-center justify-center gap-2 text-xs py-2.5"
              >
                <MessageCircle size={15} />
                Continue on WhatsApp with #{submittedRequest.referenceCode}
              </a>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline text-xs px-6 py-2"
              >
                Back to Studio
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-espresso/15 bg-linen/60 shrink-0">
              <span className="eyebrow text-saddle-deep">Artisan Quotation Request</span>
              <h2 className="font-display text-2xl text-espresso mt-0.5">Submit Your Bespoke Brief</h2>
              <p className="text-xs text-charcoal/70 mt-1">
                Zero payment required now. Our master leather artisan will verify feasibility and return a confirmed quotation.
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Summary Card */}
              <div className="flex items-center gap-4 p-3.5 bg-ivory border border-espresso/15 rounded-xs">
                <div className="w-16 h-16 shrink-0 bg-linen border border-espresso/15 rounded-2xs overflow-hidden flex items-center justify-center">
                  <img src={heroImage} alt={config.designName} className="w-full h-full object-contain p-1" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-display text-base text-espresso truncate">{config.designName}</h4>
                  <p className="text-xs text-charcoal/75 mt-0.5">
                    {config.colourName} · {config.material} · {config.dimensions.width}×{config.dimensions.height}×{config.dimensions.depth} cm
                  </p>
                  {config.personalisation.enabled && config.personalisation.text && (
                    <p className="text-[0.6875rem] text-saddle-deep font-semibold mt-0.5">
                      Monogram: '{config.personalisation.text}' ({config.personalisation.method})
                    </p>
                  )}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="field-label mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full bg-paper border border-espresso/20 p-2.5 rounded-xs text-xs sm:text-sm focus:border-espresso focus:outline-none"
                  />
                  {errors.name && <p className="text-rose-600 text-[0.6875rem] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="field-label mb-1 block">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. radhika@example.com"
                    className="w-full bg-paper border border-espresso/20 p-2.5 rounded-xs text-xs sm:text-sm focus:border-espresso focus:outline-none"
                  />
                  {errors.email && <p className="text-rose-600 text-[0.6875rem] mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="field-label mb-1 block">10-Digit Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9845012345"
                    className="w-full bg-paper border border-espresso/20 p-2.5 rounded-xs text-xs sm:text-sm focus:border-espresso focus:outline-none"
                  />
                  {errors.phone && <p className="text-rose-600 text-[0.6875rem] mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="field-label mb-1 block">Target Budget Range</label>
                  <select
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(e.target.value)}
                    className="w-full bg-paper border border-espresso/20 p-2.5 rounded-xs text-xs sm:text-sm focus:border-espresso focus:outline-none"
                  >
                    <option value="₹2,500 – ₹4,000">₹2,500 – ₹4,000 (Slings / Small bags)</option>
                    <option value="₹3,500 – ₹6,000">₹3,500 – ₹6,000 (Standard Totes / Crossbodies)</option>
                    <option value="₹6,000 – ₹10,000">₹6,000 – ₹10,000 (Executive Briefs / Duffles)</option>
                    <option value="Above ₹10,000">Above ₹10,000 (Exotic / Heirloom work)</option>
                  </select>
                </div>

                <div>
                  <label className="field-label mb-1 block">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-paper border border-espresso/20 p-2.5 rounded-xs text-xs sm:text-sm focus:border-espresso focus:outline-none"
                  />
                </div>

                <div>
                  <label className="field-label mb-1 block">Desired Delivery Date (Optional)</label>
                  <input
                    type="date"
                    value={neededByDate}
                    onChange={(e) => setNeededByDate(e.target.value)}
                    className="w-full bg-paper border border-espresso/20 p-2 rounded-xs text-xs focus:border-espresso focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="field-label mb-1 block">Special Crafting Notes / Requests</label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Needs to fit a 15.6-inch ThinkPad; prefer extra wide shoulder strap..."
                  className="w-full bg-paper border border-espresso/20 p-2.5 rounded-xs text-xs sm:text-sm focus:border-espresso focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-[0.6875rem] text-charcoal/70 bg-linen/40 p-2.5 rounded-xs border border-espresso/10">
                <ShieldCheck size={14} className="text-saddle-deep shrink-0" />
                <span>
                  No payment moves now. You receive an official confirmed quote from the artisan before production begins.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-espresso/15 bg-linen/60 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-solid text-xs px-6 py-2.5 flex items-center gap-2 shadow-xs"
              >
                <Send size={14} />
                Submit Specification
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

