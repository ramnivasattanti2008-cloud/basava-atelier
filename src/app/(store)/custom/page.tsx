"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, MessageCircle, Sparkles, Upload, X } from "lucide-react";
import { cx } from "@/lib/format";
import { isEmail, isFilled, isIndianPhone } from "@/lib/validation";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { EngravingPreview } from "@/components/custom/EngravingPreview";
import { StudioLayout } from "@/components/studio/StudioLayout";

const productTypes = [
  { id: "tote", name: "Tote or Carryall", desc: "Everyday carry with spacious compartments and reinforced handles." },
  { id: "crossbody", name: "Crossbody Bag", desc: "Hands-free silhouette with adjustable shoulder strap and secure zip." },
  { id: "sling", name: "Sling Bag", desc: "Compact, minimalist travel pouch worn across the chest or over the shoulder." },
  { id: "handbag", name: "Handbag / Satchel", desc: "Structured architectural shape with top handle and fine hardware." },
  { id: "clutch", name: "Envelope Clutch", desc: "Flat, elegant fold-over pouch for dinners and essentials." },
  { id: "wallet", name: "Wristlet / Wallet", desc: "Pocket-sized everyday companion with card slots and wrist strap." },
  { id: "sleeve", name: "Laptop / Tech Sleeve", desc: "Tailored to your exact device dimensions with protective lining." },
  { id: "custom", name: "Completely Custom Idea", desc: "Bring an original sketch, a vintage design, or a bespoke concept." },
];

const leatherGrains = [
  { id: "full-grain", name: "Full-Grain Leather", desc: "Natural unbuffed hide that develops deep vintage patina." },
  { id: "top-grain", name: "Top-Grain Leather", desc: "Smooth, uniform, supple feel with protective finish." },
  { id: "textured", name: "Textured / Pebble Leather", desc: "Durable pebbled grain resistant to everyday scratches." },
  { id: "suede", name: "Suede / Roughout Accent", desc: "Velvety nap for contrasting panels and interior linings." },
];

const colourPalette = [
  { name: "Classic Black", hex: "#1c1917" },
  { name: "Espresso Brown", hex: "#472b1e" },
  { name: "Saddle Tan", hex: "#8a5d3b" },
  { name: "Desert Sand", hex: "#cdb592" },
  { name: "Olive Green", hex: "#56634b" },
  { name: "Navy Blue", hex: "#1f2f4a" },
  { name: "Wine Red", hex: "#8e2f2a" },
  { name: "Charcoal Grey", hex: "#63605a" },
];

function CustomStudioContent() {
  const searchParams = useSearchParams();
  const refProduct = searchParams.get("ref") || "";
  const submitEnquiry = useDemoStore((s) => s.submitEnquiry);
  const settings = useDemoStore((s) => s.settings);
  const showToast = useToast((s) => s.show);

  const [step, setStep] = useState(1);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"ai-studio" | "classic">("ai-studio");

  // Form State
  const [productType, setProductType] = useState(refProduct ? "tote" : "tote");
  const [grain, setGrain] = useState("top-grain");
  const [colour, setColour] = useState("Saddle Tan");
  const [monogramInitials, setMonogramInitials] = useState("");
  const [foilChoice, setFoilChoice] = useState<"none" | "blind" | "gold">("blind");
  const [dimensions, setDimensions] = useState("");
  const [hardware, setHardware] = useState("Antique Brass");
  const [features, setFeatures] = useState<string[]>(["Laptop Sleeve"]);
  const [notes, setNotes] = useState(refProduct ? `Based on catalogue piece: ${refProduct}` : "");
  const [budget, setBudget] = useState("₹3,000 – ₹6,000");

  // Contact State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reference photos
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setUploadedImages((prev) => [...prev.slice(0, 2), event.target!.result as string]);
      }
    };
    reader.readAsDataURL(files[0]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep5 = () => {
    const errs: Record<string, string> = {};
    if (!isFilled(name, 2)) errs.name = "Please provide your full name.";
    if (!isEmail(email)) errs.email = "Please provide a valid email address.";
    if (!isIndianPhone(phone)) errs.phone = "Please enter a valid 10-digit phone number.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep5()) return;

    const enquiry = submitEnquiry({
      productType: productTypes.find((p) => p.id === productType)?.name || productType,
      referenceProduct: refProduct || null,
      colour: `${colour} (${grain})`,
      material: `${grain}, hardware: ${hardware}, features: ${features.join(", ")}`,
      engraving: monogramInitials.trim() ? `${monogramInitials} (${foilChoice})` : "None",
      dimensions: dimensions.trim() || "Standard proportions",
      quantity: 1,
      budget,
      requirements: notes.trim(),
      images: uploadedImages,
      customer: { name, email, phone },
    });

    setSubmittedId(enquiry.id);
    showToast(`Bespoke enquiry ${enquiry.id} submitted successfully.`);
  };

  const toggleFeature = (f: string) => {
    setFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  if (submittedId) {
    const pTypeName = productTypes.find((p) => p.id === productType)?.name || productType;
    const whatsappMsg = `Hello ${settings.makerName}, I have submitted custom request #${submittedId} on your website for a ${pTypeName} in ${colour} leather.`;
    return (
      <div className="shell py-16 sm:py-24 max-w-2xl mx-auto text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linen border border-espresso/20 text-espresso mb-6">
          <CheckCircle2 size={32} className="text-saddle-deep" />
        </div>
        <p className="eyebrow">Enquiry Received</p>
        <h1 className="display-md mt-2">Your Bespoke Brief Is Set</h1>
        <p className="mt-2 font-mono text-sm font-semibold tracking-wider text-saddle-deep">
          Reference ID: {submittedId}
        </p>
        <p className="lede mt-4">
          Thank you, <strong>{name}</strong>. We have logged your bespoke leather request. We will review your measurements, material choices, and personalization before preparing a confirmed price quote and crafting timeline.
        </p>

        {/* WhatsApp Fast Track Button */}
        <div className="mt-8 border border-saddle-deep/30 bg-paper p-6 rounded-xs text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-espresso">
            Fast Track via Direct Chat
          </p>
          <p className="mt-1 text-xs text-charcoal/80">
            For rapid confirmation, discuss hardware swatches, or send additional inspiration photos directly:
          </p>
          <a
            href={whatsappLink(settings.whatsappNumber, whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-solid w-full mt-4 flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            Continue on WhatsApp with #{submittedId}
          </a>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/shop" className="btn btn-outline btn-sm">
            Explore Collection
          </Link>
          <button
            type="button"
            onClick={() => {
              setSubmittedId(null);
              setStep(1);
            }}
            className="btn btn-sm btn-outline"
          >
            Submit Another Brief
          </button>
        </div>
      </div>
    );
  }

  if (mode === "ai-studio") {
    return (
      <div className="w-full">
        <StudioLayout
          initialReferenceProduct={refProduct || null}
          onSwitchToClassicWizard={() => setMode("classic")}
        />
      </div>
    );
  }

  return (
    <div className="shell py-10 sm:py-16 max-w-4xl">
      {/* AI Studio Switcher Banner */}
      <div className="mb-8 p-4 sm:p-5 border border-espresso/20 bg-linen/70 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <p className="font-display text-lg text-espresso font-semibold">
              The Bespoke Designer (AI Studio)
            </p>
          </div>
          <p className="text-xs text-charcoal/80 mt-1 max-w-xl">
            Prefer a conversational experience? Talk to our AI leather architect, test live 3D elevation concept plates, and refine leather swatches with instant rendering.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMode("ai-studio")}
          className="btn btn-solid btn-sm shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Sparkles size={13} className="text-sand" />
          <span>Launch AI Studio</span>
        </button>
      </div>

      {/* Studio Header */}
      <div className="border-b border-espresso/15 pb-8 text-center sm:text-left">
        <span className="eyebrow">Bespoke Workshop</span>
        <h1 className="display-lg mt-2">Custom Studio</h1>
        <p className="lede mt-3 max-w-2xl">
          Create a leather piece made precisely to your specifications. Select silhouettes, leather grades, dimensions, and monogram personalisations.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mt-8 border-b border-espresso/12 pb-6">
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { n: 1, label: "Silhouette" },
            { n: 2, label: "Leather" },
            { n: 3, label: "Monogram" },
            { n: 4, label: "Specs" },
            { n: 5, label: "Review" },
          ].map((s) => (
            <button
              key={s.n}
              type="button"
              onClick={() => s.n < step && setStep(s.n)}
              className={cx(
                "flex flex-col items-center py-2 transition-colors",
                step === s.n
                  ? "border-b-2 border-espresso font-bold text-espresso"
                  : step > s.n
                  ? "text-saddle-deep hover:text-espresso"
                  : "text-charcoal/40 pointer-events-none"
              )}
            >
              <span className="font-mono text-[0.6875rem]">0{s.n}</span>
              <span className="hidden sm:inline text-[0.75rem] uppercase tracking-wider">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Forms */}
      <div className="mt-10">
        {/* STEP 1: Silhouette */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-espresso">Choose Your Piece Type</h2>
              <p className="text-xs text-charcoal/70 mt-1">Select the foundational shape for your custom piece.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productTypes.map((pt) => {
                const isSel = productType === pt.id;
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setProductType(pt.id)}
                    className={cx(
                      "flex flex-col text-left p-5 border transition-all rounded-xs",
                      isSel
                        ? "border-espresso bg-linen/60 ring-1 ring-espresso shadow-xs"
                        : "border-espresso/15 bg-paper hover:border-espresso/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl text-espresso">{pt.name}</span>
                      {isSel && <Check size={16} className="text-saddle-deep" />}
                    </div>
                    <p className="mt-2 text-xs text-charcoal/75 leading-relaxed">{pt.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-solid"
              >
                Continue to Leather & Colour <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Leather & Colour */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl text-espresso">Select Leather & Colour Palette</h2>
              <p className="text-xs text-charcoal/70 mt-1">Each hide has its own distinctive hand-feel and aging properties.</p>
            </div>

            {/* Grains */}
            <div>
              <p className="field-label">Leather Finish / Grain</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {leatherGrains.map((g) => {
                  const isSel = grain === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGrain(g.id)}
                      className={cx(
                        "p-4 text-left border rounded-xs transition-all",
                        isSel
                          ? "border-espresso bg-linen/60 ring-1 ring-espresso"
                          : "border-espresso/15 bg-paper hover:border-espresso/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-espresso uppercase tracking-wider">{g.name}</span>
                        {isSel && <Check size={14} className="text-saddle-deep" />}
                      </div>
                      <p className="mt-1 text-xs text-charcoal/70">{g.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colours */}
            <div>
              <p className="field-label">Leather Colour</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {colourPalette.map((c) => {
                  const isSel = colour === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColour(c.name)}
                      className={cx(
                        "flex items-center gap-2.5 p-3 border rounded-xs transition-all text-left",
                        isSel
                          ? "border-espresso bg-linen/60 ring-1 ring-espresso font-semibold"
                          : "border-espresso/15 bg-paper hover:border-espresso/40 text-charcoal"
                      )}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs truncate">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-outline"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn btn-solid"
              >
                Continue to Monogram <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Monogram / Personalisation */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl text-espresso">Personalisation & Initials</h2>
              <p className="text-xs text-charcoal/70 mt-1">
                Add an understated debossed monogram or gold foil stamp.
              </p>
            </div>

            {/* Interactive Preview Widget */}
            <div className="border border-espresso/15 bg-paper p-8 rounded-xs flex flex-col items-center">
              <span className="eyebrow mb-2">Live Monogram Preview</span>
              <EngravingPreview
                initials={monogramInitials}
                onInitialsChange={setMonogramInitials}
              />
              <p className="mt-4 text-xs text-charcoal/60 text-center max-w-sm">
                Initials will be hand-embossed onto a dedicated leather fob or directly onto the bag front.
              </p>
            </div>

            {/* Foil style options */}
            <div className="space-y-3">
              <p className="field-label">Embossing Method</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "blind", label: "Blind Deboss", desc: "Heat-pressed into hide without foil; subtle, natural texture." },
                  { id: "gold", label: "Gold Foil Stamp", desc: "Classic hot-foil in bright metallic brass." },
                  { id: "none", label: "No Personalisation", desc: "Keep the piece clean without any initials." },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFoilChoice(f.id as any);
                      if (f.id === "none") setMonogramInitials("");
                    }}
                    className={cx(
                      "p-3.5 text-left border rounded-xs transition-all",
                      foilChoice === f.id
                        ? "border-espresso bg-linen/60 ring-1 ring-espresso"
                        : "border-espresso/15 bg-paper hover:border-espresso/40"
                    )}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-espresso">{f.label}</p>
                    <p className="mt-1 text-[0.6875rem] text-charcoal/70 leading-relaxed">{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-outline"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn btn-solid"
              >
                Continue to Dimensions <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Dimensions & Hardware Specs */}
        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl text-espresso">Dimensions & Functional Details</h2>
              <p className="text-xs text-charcoal/70 mt-1">Specify custom measurements or unique pocket configurations.</p>
            </div>

            <div>
              <label htmlFor="dim-input" className="field-label">
                Custom Dimensions (Optional)
              </label>
              <input
                id="dim-input"
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. Length 14 in, Width 12 in, Depth 4 in (or Laptop size: 14-inch MacBook Pro)"
                className="field-input"
              />
              <p className="field-hint">Leave blank if you prefer our studio standard proportions for this shape.</p>
            </div>

            {/* Hardware Finish */}
            <div>
              <p className="field-label">Hardware Finish</p>
              <div className="grid grid-cols-3 gap-3">
                {["Antique Brass", "Polished Nickel", "Matte Gunmetal"].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHardware(h)}
                    className={cx(
                      "p-3 text-center border rounded-xs text-xs font-medium uppercase tracking-wider transition-all",
                      hardware === h
                        ? "border-espresso bg-espresso text-ivory"
                        : "border-espresso/15 bg-paper text-charcoal hover:border-espresso/40"
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Functional Features */}
            <div>
              <p className="field-label">Interior Features & Layout</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "Laptop Sleeve",
                  "Zip Divider",
                  "Phone Pocket",
                  "Key Leash",
                  "Card Slots",
                  "Luggage Strap",
                  "Reinforced Bottom",
                  "Detachable Strap",
                ].map((feat) => {
                  const active = features.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      className={cx(
                        "p-2.5 text-xs text-left border rounded-xs transition-all flex items-center justify-between",
                        active
                          ? "border-espresso bg-linen/60 font-semibold text-espresso"
                          : "border-espresso/15 bg-paper text-charcoal/70 hover:border-espresso/40"
                      )}
                    >
                      <span className="truncate">{feat}</span>
                      {active && <Check size={12} className="text-saddle-deep" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Expectation */}
            <div>
              <p className="field-label">Budget Tier</p>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="field-input"
              >
                <option value="Under ₹3,000">Under ₹3,000 (Small accessories, wallets, straps)</option>
                <option value="₹3,000 – ₹6,000">₹3,000 – ₹6,000 (Crossbodies, slings, standard totes)</option>
                <option value="₹6,000 – ₹10,000">₹6,000 – ₹10,000 (Heavy-duty carryalls, full-grain briefcases)</option>
                <option value="Above ₹10,000">Above ₹10,000 (Elaborate custom designs, exotic finishes)</option>
              </select>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn btn-outline"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="btn btn-solid"
              >
                Review & Contact Info <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Contact Submission */}
        {step === 5 && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="font-display text-2xl text-espresso">Review & Contact Details</h2>
              <p className="text-xs text-charcoal/70 mt-1">
                Provide your details so our artisan can send a confirmed pricing quote and sample photos.
              </p>
            </div>

            {/* Order Specification Summary Card */}
            <div className="border border-espresso/15 bg-paper p-6 rounded-xs space-y-3 text-xs">
              <p className="font-semibold text-espresso uppercase tracking-wider text-[0.6875rem]">
                Custom Configuration Summary
              </p>
              <div className="grid grid-cols-2 gap-2 text-charcoal/80 pt-2 border-t border-espresso/10">
                <div>
                  <span className="text-walnut/70">Silhouette:</span>{" "}
                  <strong className="text-espresso">
                    {productTypes.find((p) => p.id === productType)?.name}
                  </strong>
                </div>
                <div>
                  <span className="text-walnut/70">Leather & Colour:</span>{" "}
                  <strong className="text-espresso">{colour} ({grain})</strong>
                </div>
                <div>
                  <span className="text-walnut/70">Monogram:</span>{" "}
                  <strong className="text-espresso">{monogramInitials || "None"} ({foilChoice})</strong>
                </div>
                <div>
                  <span className="text-walnut/70">Hardware:</span>{" "}
                  <strong className="text-espresso">{hardware}</strong>
                </div>
                {features.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-walnut/70">Selected Features:</span>{" "}
                    <span className="text-espresso">{features.join(", ")}</span>
                  </div>
                )}
                {dimensions && (
                  <div className="col-span-2">
                    <span className="text-walnut/70">Dimensions:</span>{" "}
                    <span className="text-espresso">{dimensions}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-walnut/70">Target Budget:</span>{" "}
                  <span className="font-semibold text-espresso">{budget}</span>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="field-label">
                Additional Instructions / Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any specific pocket placements, strap lengths, or links to inspiration..."
                className="field-input"
                rows={3}
              />
            </div>

            {/* Image upload */}
            <div>
              <p className="field-label">Reference Image / Sketch (Optional)</p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative h-20 w-20 border border-espresso/20 rounded-xs overflow-hidden">
                    <img src={img} alt="Reference preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-espresso text-ivory p-0.5 rounded-full"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {uploadedImages.length < 3 && (
                  <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center border border-dashed border-espresso/30 bg-paper text-walnut hover:border-espresso hover:text-espresso">
                    <Upload size={18} />
                    <span className="text-[0.6875rem] mt-1 font-medium">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Customer Contact Information */}
            <div className="border-t border-espresso/15 pt-6 space-y-4">
              <p className="eyebrow">Your Contact Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cust-name" className="field-label">Full Name *</label>
                  <input
                    id="cust-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ananya Rao"
                    className="field-input"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="cust-email" className="field-label">Email Address *</label>
                  <input
                    id="cust-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@example.com"
                    className="field-input"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="cust-phone" className="field-label">Phone / WhatsApp *</label>
                  <input
                    id="cust-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="field-input"
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && <p className="field-error">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn btn-outline"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="submit"
                className="btn btn-solid"
              >
                Submit Bespoke Brief <Sparkles size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CustomStudioPage() {
  return (
    <Suspense fallback={<div className="shell py-20 text-center"><p className="font-display text-2xl">Loading Custom Studio…</p></div>}>
      <CustomStudioContent />
    </Suspense>
  );
}

