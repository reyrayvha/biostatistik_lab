"use client";

import { useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// FocusWarningModal — professional, calm anti-multitasking reminder
//
// UX Decisions:
// 1. Proportional, calm, non-alarmist: Uses a restrained semantic badge and clean
//    typography rather than a giant pulsating warning icon or fatal error style.
// 2. Restrained backdrop: bg-slate-900/40 with subtle backdrop-blur-xs so the
//    user retains orientation without heavy visual disruption.
// 3. Clear information hierarchy: Left-aligned headline, concise explanatory text,
//    and a single focused primary action button.
// 4. Robust Accessibility (a11y):
//    - role="dialog", aria-modal="true", aria-labelledby, aria-describedby.
//    - Auto-focuses the action button upon mount.
//    - Traps keyboard focus within the dialog.
//    - Supports Escape and Enter keys.
//    - Restores focus to the previous active element when dismissed.
// ---------------------------------------------------------------------------

interface FocusWarningModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export function FocusWarningModal({ isOpen, onDismiss }: FocusWarningModalProps) {
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore later upon dismissal
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Move focus to action button after render
    const timer = window.setTimeout(() => {
      actionButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        onDismiss();
        return;
      }

      // Trap Tab key inside the single-action dialog
      if (e.key === "Tab") {
        e.preventDefault();
        actionButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      // Restore focus to previous element when modal closes
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="focus-warning-title"
      aria-describedby="focus-warning-desc"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Restrained Backdrop: subtle dark overlay, calm blur */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onDismiss}
        aria-hidden="true"
      />

      {/* Dialog Card: Product-focused, restrained editorial layout */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          {/* Restrained semantic indicator */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60 shrink-0 mt-0.5">
            <AlertCircle size={18} strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              id="focus-warning-title"
              className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight"
            >
              Fokus Layar Kuis Terinterupsi
            </h3>
            <p
              id="focus-warning-desc"
              className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed"
            >
              Sistem mendeteksi jendela kuis sempat tidak aktif atau berpindah tab. Harap tetap berada pada halaman kuis ini tanpa multitasking agar sesi asesmen Anda terekam dengan lancar.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                ref={actionButtonRef}
                type="button"
                onClick={onDismiss}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 shadow-sm cursor-pointer"
              >
                Kembali ke Kuis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusWarningModal;
