"use client";

import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
  tone: "ok" | "warn";
}

interface ToastState {
  toast: Toast | null;
  show: (message: string, tone?: Toast["tone"]) => void;
  clear: () => void;
}

export const useToast = create<ToastState>((set) => ({
  toast: null,
  show: (message, tone = "ok") => set({ toast: { id: Date.now(), message, tone } }),
  clear: () => set({ toast: null }),
}));
