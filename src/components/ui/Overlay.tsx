"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { cx } from "@/lib/format";
import { useIsClient } from "@/lib/hooks";

type Side = "right" | "left" | "bottom" | "center" | "top";

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  side?: Side;
  className?: string;
  children: React.ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const panelMotion: Record<Side, { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition }> = {
  right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
  left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
  bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  top: { initial: { y: -24, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -16, opacity: 0 } },
  center: { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 } },
};

const framePosition: Record<Side, string> = {
  right: "justify-end",
  left: "justify-start",
  bottom: "items-end",
  top: "items-start",
  center: "items-center justify-center p-4 sm:p-8",
};

const panelSize: Record<Side, string> = {
  right: "h-dvh w-full max-w-[28rem]",
  left: "h-dvh w-full max-w-[26rem]",
  bottom: "max-h-[88dvh] w-full",
  top: "w-full max-h-dvh",
  center: "max-h-full w-full max-w-4xl",
};

/**
 * Modal surface used for the cart drawer, mobile navigation, filter sheet,
 * search and quick view. Traps focus, closes on Escape and backdrop click,
 * locks page scroll, and returns focus to whatever opened it.
 */
export function Overlay({ open, onClose, label, side = "right", className, children }: OverlayProps) {
  const isClient = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  // If the page this overlay belongs to is hidden by a navigation, close it
  // so it is not waiting open when the visitor comes back.
  useLayoutEffect(() => () => closeRef.current(), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    const prevOverflow = root.style.overflow;
    const prevPadding = root.style.paddingRight;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;

    const focusFirst = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const target =
        panel.querySelector<HTMLElement>("[data-autofocus]") ?? panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel;
      target.focus({ preventScroll: true });
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.cancelAnimationFrame(focusFirst);
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      root.style.paddingRight = prevPadding;
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!isClient) return null;

  const motionProps = panelMotion[side];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cx("fixed inset-0 z-[70] flex", framePosition[side])} key="overlay">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-espresso/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className={cx(
              "relative flex flex-col overflow-hidden bg-ivory text-charcoal outline-none",
              panelSize[side],
              className,
            )}
            initial={motionProps.initial}
            animate={motionProps.animate}
            exit={motionProps.exit}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
