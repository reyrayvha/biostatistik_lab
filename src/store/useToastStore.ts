"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

type ToastStore = {
  toasts: ToastItem[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
};

const makeToastId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type, duration = 3000) => {
    const id = makeToastId();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }].slice(-3),
    }));

    if (duration > 0) {
      window.setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clearAllToasts: () => set({ toasts: [] }),
}));
