"use client";

import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToastStore, type ToastType } from "@/src/store/useToastStore";

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} satisfies Record<ToastType, typeof CheckCircle2>;

const colorMap = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
} satisfies Record<ToastType, string>;

export function Toast() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300 ${colorMap[toast.type]}`}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1 pr-2 text-sm font-medium leading-5">{toast.message}</div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded-md p-1 text-current/70 transition-colors hover:text-current"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
