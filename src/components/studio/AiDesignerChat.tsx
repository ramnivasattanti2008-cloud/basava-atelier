"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowUp, Compass, ImagePlus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cx } from "@/lib/format";
import { useIsClient } from "@/lib/hooks";
import type { DesignMessage, BespokeDesignConfig } from "@/lib/studio-types";
import { BasavaMark } from "@/components/brand/BasavaLogo";

interface AiDesignerChatProps {
  messages: DesignMessage[];
  isThinking: boolean;
  onSendMessage: (text: string, referenceImage?: string) => void;
  onApplyAction: (action: { label: string; action: string; patch?: Partial<BespokeDesignConfig> }) => void;
  className?: string;
}

export function AiDesignerChat({
  messages,
  isThinking,
  onSendMessage,
  onApplyAction,
  className,
}: AiDesignerChatProps) {
  const [input, setInput] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Times use the visitor locale, so they are only drawn in the browser.
  const isClient = useIsClient();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text && !attachedImage) return;

    onSendMessage(text || "Please analyze my uploaded reference photo.", attachedImage || undefined);
    setInput("");
    setAttachedImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid JPG, PNG, or WebP image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setAttachedImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className={cx("flex flex-col h-full bg-paper border border-espresso/15 rounded-xs overflow-hidden shadow-xs", className)}>
      {/* Consultant Header */}
      <div className="px-4 py-3.5 border-b border-espresso/15 bg-linen/70 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-espresso text-[#f3e5c8] flex items-center justify-center p-1 shadow-xs border border-brass/30">
              <BasavaMark size={18} invert={true} />
            </div>
          </div>
          <div>
            <h3 className="font-display text-base text-espresso leading-none">The Bespoke Designer</h3>
            <p className="text-[0.6875rem] text-walnut/75 mt-0.5 font-medium">BASAVA Studio · Bengaluru</p>
          </div>
        </div>

        <span className="text-[0.625rem] bg-sand/40 border border-espresso/10 text-espresso font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs">
          Design Studio
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Messages already on screen at load are shown at once; only new ones animate in. */}
        <AnimatePresence initial={false}>
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cx("flex flex-col", isUser ? "items-end" : "items-start")}
            >
              <div
                className={cx(
                  "max-w-[88%] rounded-xs p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs",
                  isUser
                    ? "bg-espresso text-ivory rounded-br-none"
                    : "bg-ivory border border-espresso/12 text-charcoal rounded-bl-none"
                )}
              >
                {/* Uploaded Reference Thumbnail if present */}
                {m.referenceImage && (
                  <div className="mb-2 relative rounded-xs overflow-hidden border border-white/20 max-w-[200px]">
                    <img src={m.referenceImage} alt="Uploaded reference" className="w-full h-auto object-cover max-h-32" />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[0.55rem] px-1.5 py-0.5 uppercase tracking-wider rounded-2xs">
                      Reference Photo
                    </span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>

              {/* Timestamp */}
              <span className="text-[0.625rem] text-walnut/60 mt-1 px-1">
                {isClient ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "\u00a0"}
              </span>

              {/* Action Chips from Assistant */}
              {!isUser && m.suggestedActions && m.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                  {m.suggestedActions.map((action, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      onClick={() => onApplyAction(action)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      whileTap={{ scale: 0.97 }}
                      className="text-[0.6875rem] font-semibold bg-linen hover:bg-sand/40 border border-espresso/20 text-espresso px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer text-left flex items-center gap-1.5"
                    >
                      <Compass size={11} className="text-brass shrink-0" />
                      <span>{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              key="typing"
              role="status"
              aria-label="Working on your design"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex w-fit items-center gap-1.5 rounded-xs border border-espresso/12 bg-ivory px-3.5 py-3"
            >
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="block h-1.5 w-1.5 rounded-full bg-walnut"
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: dot * 0.16, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Tray */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-espresso/15 bg-ivory">
        {/* Attached image preview */}
        {attachedImage && (
          <div className="mb-2 flex items-center justify-between p-2 bg-linen/60 border border-espresso/15 rounded-xs">
            <div className="flex items-center gap-2">
              <img src={attachedImage} alt="Reference thumbnail" className="w-9 h-9 object-cover rounded-2xs border border-espresso/20" />
              <span className="text-xs text-charcoal/80 font-medium">Reference attached</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachedImage(null)}
              className="text-walnut/70 hover:text-espresso p-1"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload bag sketch or reference photo"
            className="p-2.5 text-walnut/80 hover:text-espresso hover:bg-linen rounded-xs border border-espresso/15 transition-colors cursor-pointer"
          >
            <ImagePlus size={16} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell us what to change, e.g. make it darker"
            className="flex-1 bg-paper border border-espresso/20 px-3.5 py-2 text-xs sm:text-sm text-espresso rounded-xs focus:outline-none focus:border-espresso focus:ring-1 focus:ring-espresso placeholder:text-charcoal/50"
          />

          <button
            type="submit"
            disabled={!input.trim() && !attachedImage}
            className="p-2.5 bg-espresso text-ivory rounded-xs hover:bg-walnut disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
            aria-label="Send message"
          >
            <ArrowUp size={16} />
          </button>
        </div>

        <p className="text-[0.625rem] text-charcoal/60 mt-2 text-center">
          Ask a question, change a colour, or add a photo of a bag you like.
        </p>
      </form>
    </div>
  );
}

