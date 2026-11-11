"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "@/lib/format";
import { ProductImage } from "@/components/ui/ProductImage";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Product photographs with a soft crossfade between views.
 * - Desktop: move the pointer over the photograph to look closer (the image
 *   scales toward the pointer). Catalogue photographs are 800px, so the zoom
 *   stops at 1.7x where they still hold up.
 * - Touch: swipe left or right. Arrow buttons and arrow keys work everywhere.
 */
export function ProductGallery({ images, name, soldOut }: { images: string[]; name: string; soldOut?: boolean }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const count = images.length;
  const current = Math.min(index, Math.max(0, count - 1));

  const go = (next: number) => {
    if (!count) return;
    setZoom(null);
    setIndex((next + count) % count);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse" || !frame.current) return;
    const rect = frame.current.getBoundingClientRect();
    setZoom({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {count > 1 && (
        <div className="no-scrollbar flex shrink-0 gap-3 overflow-x-auto pb-1 sm:max-h-[620px] sm:w-20 sm:flex-col sm:overflow-y-auto sm:pb-0">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => go(i)}
              aria-label={`View photograph ${i + 1} of ${count}`}
              aria-current={i === current}
              className={cx(
                "photo-tile relative aspect-square h-18 w-18 shrink-0 border transition-[opacity,border-color] duration-200 sm:h-20 sm:w-20",
                i === current ? "border-espresso" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <ProductImage src={img} alt="" sizes="80px" className="p-1" />
            </button>
          ))}
        </div>
      )}

      <div
        ref={frame}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${name} photographs`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(current + 1);
          if (e.key === "ArrowLeft") go(current - 1);
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setZoom(null)}
        className="photo-tile group relative aspect-square w-full flex-1 overflow-hidden sm:cursor-zoom-in"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={images[current] ?? "empty"}
            className="absolute inset-0 touch-pan-y mix-blend-multiply"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(current + 1);
              else if (info.offset.x > 60) go(current - 1);
            }}
          >
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: zoom ? "scale(1.7)" : "scale(1)",
                transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "50% 50%",
              }}
            >
              <ProductImage
                src={images[current]}
                alt={`${name} — photograph ${current + 1}`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                eager={current === 0}
                className="pointer-events-none p-8 sm:p-12"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {soldOut && (
          <span className="absolute left-4 top-4 bg-[#8e2f2a] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Out of stock
          </span>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(current - 1)}
              aria-label="Previous photograph"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-ivory/90 text-espresso transition-opacity duration-200 hover:bg-ivory sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronLeft size={18} strokeWidth={1.5} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              aria-label="Next photograph"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-ivory/90 text-espresso transition-opacity duration-200 hover:bg-ivory sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronRight size={18} strokeWidth={1.5} aria-hidden />
            </button>
            <span className="tabular absolute bottom-3 right-3 bg-ivory/90 px-2 py-1 text-[0.6875rem] font-semibold tracking-wider text-espresso" aria-live="polite">
              {current + 1} / {count}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
