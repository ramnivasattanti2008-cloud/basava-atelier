"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDemoStore } from "@/lib/store";

export function AnnouncementBar() {
  const announcements = useDemoStore((s) => s.content.announcements);
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const items = announcements.filter((a) => a.text.trim().length > 0);
  const count = items.length;

  useEffect(() => {
    if (count < 2 || paused || reduceMotion) return;
    const timer = window.setInterval(() => setIndex((i) => i + 1), 5200);
    return () => window.clearInterval(timer);
  }, [count, paused, reduceMotion]);

  if (!count) return null;
  const current = items[index % count];

  return (
    <div
      className="on-dark relative z-50 bg-[#1a0f0a] text-ivory border-b border-[#caa359]/30 shadow-xs"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="shell flex h-10 items-center justify-center overflow-hidden text-center relative">
        {/* Subtle gold leaf gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#caa359]/10 to-transparent pointer-events-none" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index % count}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="truncate text-[0.72rem] font-medium tracking-[0.08em] relative z-10 flex items-center justify-center gap-2"
          >
            <span className="text-ivory/90">{current.text}</span>
            {current.linkLabel && current.href && (
              <>
                <span aria-hidden className="text-[#caa359]">
                  ·
                </span>
                <Link href={current.href} className="link-line text-[#e8cb85] font-semibold hover:text-white transition-colors">
                  {current.linkLabel}
                </Link>
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
