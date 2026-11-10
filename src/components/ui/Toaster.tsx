"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useToast } from "@/lib/toast";

export function Toaster() {
  const toast = useToast((s) => s.toast);
  const clear = useToast((s) => s.clear);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(clear, 3600);
    return () => window.clearTimeout(timer);
  }, [toast, clear]);

  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-auto max-w-md border px-5 py-3 text-sm ${
              toast.tone === "warn"
                ? "border-[#8e2f2a] bg-paper text-[#7a2622]"
                : "on-dark border-espresso bg-espresso text-ivory"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
