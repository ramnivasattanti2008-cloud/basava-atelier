"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPct = (totalScroll / windowHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrollPct)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (progress <= 0.5) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none transition-all duration-150 ease-out"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#96722d] via-[#e5c98d] to-[#caa359] shadow-[0_0_8px_rgba(202,163,89,0.8)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

