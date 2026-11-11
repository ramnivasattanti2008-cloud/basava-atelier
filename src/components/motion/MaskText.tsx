"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Editorial headline entrance: each line rises from behind its own mask.
 * Pass one string or node per line. Plays once when scrolled into view.
 */
export function MaskText({
  lines,
  className,
  delay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  /** Seconds before the first line starts. */
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  // The wrapper is what gets observed: the lines themselves start outside
  // their masks, so they would never count as "in view" on their own.
  return (
    <motion.span
      className={className}
      style={{ display: "block" }}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className="block will-change-transform"
            variants={{
              hidden: reduceMotion ? { opacity: 0 } : { y: "105%" },
              shown: reduceMotion ? { opacity: 1 } : { y: 0 },
            }}
            transition={{ duration: 0.9, delay: delay + i * 0.12, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Wraps one item of a grid so the items arrive one after another, row by row.
 * `index` is the item's position; the delay repeats every `columns` items so
 * long grids never keep a visitor waiting.
 */
export function StaggerItem({
  index,
  columns = 4,
  children,
  className,
}: {
  index: number;
  columns?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.7, delay: (index % columns) * 0.07, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
