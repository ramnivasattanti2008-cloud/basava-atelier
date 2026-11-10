"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { brand } from "@/data/brand";
import { isEmail, isFilled, isIndianPhone } from "@/lib/validation";
import { useDemoStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export default function ContactPage() {
  const settings = useDemoStore((s) => s.settings);
  const submitMessage = useDemoStore((s) => s.submitMessage);
  const showToast = useToast((s) => s.show);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("General Question");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!isFilled(name, 2)) errs.name = "Please provide your full name.";
    if (!isEmail(email)) errs.email = "Please provide a valid email.";
    if (!isFilled(message, 10)) errs.message = "Please write a message (at least 10 characters).";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    submitMessage({
      name,
      email,
      phone: phone || "Not provided",
      topic,
      message,
    });

    setSent(true);
    showToast("Your message has been dispatched to our studio.");
  };

  return (
    <div className="shell py-12 sm:py-20 max-w-4xl">
      <div className="border-b border-espresso/15 pb-10">
        <span className="eyebrow">Direct Communication</span>
        <h1 className="display-lg mt-3">Contact & Consultations</h1>
        <p className="lede mt-4 max-w-2xl">
          Orders, bespoke commissions, and leather questions have always started with a personal conversation. Reach out through WhatsApp, email, or our studio form.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left: Direct Channels */}
        <div className="md:col-span-5 space-y-6">
          <div className="border border-espresso/15 bg-paper p-6 rounded-xs">
            <div className="flex items-center gap-3 text-espresso">
              <MessageCircle size={22} className="text-saddle-deep" />
              <h3 className="font-display text-xl">WhatsApp Direct</h3>
            </div>
            <p className="mt-2 text-xs text-charcoal/80 leading-relaxed">
              Fastest response for piece availability, custom monogram quotes, or video consultations.
            </p>
            <a
              href={whatsappLink(settings.whatsappNumber, whatsappMessages.general(settings.makerName))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid btn-sm mt-5 w-full flex items-center justify-center gap-2"
            >
              <span>Message on WhatsApp</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="border border-espresso/15 bg-paper p-6 rounded-xs space-y-4 text-xs">
            <div>
              <p className="eyebrow">Studio Email</p>
              <a href={`mailto:${settings.email}`} className="mt-1 font-semibold text-espresso hover:underline block text-sm">
                {settings.email}
              </a>
            </div>

            <div className="border-t border-espresso/10 pt-4">
              <p className="eyebrow">Phone Display</p>
              <p className="mt-1 font-semibold text-espresso text-sm">
                {settings.phoneDisplay}
              </p>
              <p className="mt-1 text-[0.6875rem] text-walnut/70">
                {brand.contact.source}
              </p>
            </div>

            <div className="border-t border-espresso/10 pt-4">
              <p className="eyebrow">Instagram Channels</p>
              <div className="mt-2 space-y-1">
                <a
                  href={settings.instagramMaker}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line text-espresso font-semibold block"
                >
                  {brand.maker.handle} (Maker & Bespoke Studio)
                </a>
                <a
                  href={settings.instagramRetail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line text-walnut/80 block"
                >
                  {brand.retail.handle} (Retail Catalogue)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="md:col-span-7">
          {sent ? (
            <div className="border border-espresso/15 bg-linen/50 p-8 rounded-xs text-center space-y-4">
              <CheckCircle2 size={36} className="text-saddle-deep mx-auto" />
              <h3 className="font-display text-2xl text-espresso">Message Delivered</h3>
              <p className="text-xs text-charcoal/80 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Your note has been received in our studio message queue. We typically reply within 24 business hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setMessage("");
                }}
                className="btn btn-outline btn-sm mt-4"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border border-espresso/15 bg-paper p-6 sm:p-8 rounded-xs space-y-5">
              <h3 className="font-display text-2xl text-espresso">Send a Direct Message</h3>

              <div>
                <label htmlFor="c-name" className="field-label">Your Name *</label>
                <input
                  id="c-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kavya Nair"
                  className="field-input"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-email" className="field-label">Email Address *</label>
                  <input
                    id="c-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kavya@example.com"
                    className="field-input"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="c-phone" className="field-label">Phone (Optional)</label>
                  <input
                    id="c-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="field-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="c-topic" className="field-label">Topic / Enquiry Type</label>
                <select
                  id="c-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="field-input"
                >
                  <option value="General Question">General Question</option>
                  <option value="Catalogue Piece Availability">Catalogue Piece Availability</option>
                  <option value="Custom Bespoke Order">Custom Bespoke Order</option>
                  <option value="Leather Care & Refurbishing">Leather Care & Refurbishing</option>
                  <option value="Corporate / Bulk Gifting">Corporate / Bulk Gifting</option>
                </select>
              </div>

              <div>
                <label htmlFor="c-msg" className="field-label">Your Message *</label>
                <textarea
                  id="c-msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what piece or custom idea you're inquiring about..."
                  className="field-input"
                  rows={4}
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && <p className="field-error">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="btn btn-solid w-full flex items-center justify-center gap-2"
              >
                <Send size={14} />
                Send Studio Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

