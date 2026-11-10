"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { STORAGE_KEY, useDemoStore } from "@/lib/store";

/**
 * Loads the saved demo state after hydration (so server and client markup
 * match), seeds the sample admin records once, and keeps tabs in step — edit
 * a price in the admin tab and the storefront tab updates.
 */
export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await useDemoStore.persist.rehydrate();
      if (cancelled) return;
      const state = useDemoStore.getState();
      if (!state.seeded) state.seedSamples();
      useDemoStore.setState({ hydrated: true });
    };
    void load();

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) void useDemoStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
