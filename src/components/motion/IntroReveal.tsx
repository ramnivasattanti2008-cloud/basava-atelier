"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SKIP_KEY = "basava-intro-skip"; // visitor chose "Skip intro": never show again
const SEEN_KEY = "basava-intro-seen"; // already played in this browser session

const EASE = [0.22, 1, 0.36, 1] as const;
const LETTERS = "BASAVA".split("");

const subscribe = () => () => {};

function shouldPlay(): boolean {
  try {
    return !window.localStorage.getItem(SKIP_KEY) && !window.sessionStorage.getItem(SEEN_KEY);
  } catch {
    return false;
  }
}

/**
 * Opening sequence: the official mark rises, the name is set letter by letter,
 * a brass rule draws, then the curtain lifts to the page. About 2.4 seconds,
 * once per visit. "Skip intro" ends it at once and is remembered.
 */
export function IntroReveal() {
  const eligible = useSyncExternalStore(subscribe, shouldPlay, () => false);
  const reduceMotion = useReducedMotion();
  const [done, setDone] = useState(false);
  const open = eligible && !reduceMotion && !done;

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const timer = window.setTimeout(() => finish(false), 1100);
    return () => {
      window.clearTimeout(timer);
      root.style.overflow = previous;
    };
  }, [open]);

  function finish(remember: boolean) {
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
      if (remember) window.localStorage.setItem(SKIP_KEY, "1");
    } catch {
      /* storage unavailable: the intro simply plays again next visit */
    }
    const root = document.documentElement;
    root.style.overflow = "";
    setDone(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          onClick={() => finish(true)}
          className="on-dark fixed inset-0 z-[90] flex flex-col items-center justify-center bg-espresso text-ivory cursor-pointer"
          initial={{ y: 0 }}
          exit={{ y: "-100%", opacity: 0.8 }}
          transition={{ duration: 0.45, ease: EASE }}
          role="dialog"
          aria-label="BASAVA"
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Image
              src="/images/basava-logo-ivory-4x.png"
              alt="BASAVA Brand Mark"
              width={76}
              height={64}
              priority
              className="h-16 w-auto object-contain select-none"
            />
          </motion.div>

          <p className="mt-5 flex overflow-hidden font-display text-4xl font-medium uppercase tracking-[0.32em] sm:text-5xl" aria-hidden>
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.03, ease: EASE }}
              >
                {letter}
              </motion.span>
            ))}
          </p>

          <motion.span
            aria-hidden
            className="mt-5 block h-px w-36 origin-left bg-brass"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.45, delay: 0.45, ease: EASE }}
          />

          <motion.p
            className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-sand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.6 }}
          >
            Leather · Bengaluru
          </motion.p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              finish(true);
            }}
            className="absolute bottom-8 right-6 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-sand underline-offset-4 hover:underline sm:right-10"
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
