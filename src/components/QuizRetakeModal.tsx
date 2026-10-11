"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, X } from "lucide-react";

interface QuizRetakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  quizTitle: string;
  isFinalExam?: boolean;
  attemptsUsed: number;
  maxAttempts: number;
  currentScore?: { score: number; total: number } | null;
}

export default function QuizRetakeModal({
  isOpen,
  onClose,
  onConfirm,
  quizTitle,
  isFinalExam = false,
  attemptsUsed,
  maxAttempts,
  currentScore,
}: QuizRetakeModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const nextAttemptNumber = attemptsUsed + 1;
  const remainingAfterThis = Math.max(0, maxAttempts - nextAttemptNumber);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-[2px] transition-opacity"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="retake-modal-title"
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900 transition-all"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <RotateCcw size={20} strokeWidth={2} />
            </div>
            <div>
              <h3
                id="retake-modal-title"
                className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100"
              >
                {isFinalExam ? "Konfirmasi Ulangi Ujian Akhir" : "Konfirmasi Ulangi Kuis"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {quizTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3.5">
          {/* Attempt counter pill */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
            <span>Status Percobaan</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              Percobaan ke-{nextAttemptNumber} dari {maxAttempts}
            </span>
          </div>

          {/* Warning notice box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs md:text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
              <AlertCircle size={16} className="text-slate-600 dark:text-slate-300 shrink-0" />
              <span>Nilai yang Diambil adalah Hasil Terbaru</span>
            </div>
            <p className="leading-relaxed">
              Skor yang akan dicatat dan dihitung dalam evaluasi akhir adalah nilai dari{" "}
              <strong className="text-slate-800 dark:text-slate-100">percobaan terakhir (terbaru)</strong>, bukan nilai tertinggi sebelumnya.
            </p>
            {currentScore && (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Skor tersimpan saat ini:{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {currentScore.score}/{currentScore.total}
                </span>
                . Jika Anda mengulang sekarang, skor tersebut akan digantikan oleh hasil percobaan baru ini.
              </p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/80 dark:border-slate-700/80">
              Sisa kesempatan setelah ini: {remainingAfterThis} kali.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-xs md:text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-xs md:text-sm hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            <span>Ya, Ulangi {isFinalExam ? "Ujian" : "Kuis"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
