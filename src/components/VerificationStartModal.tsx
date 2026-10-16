"use client";

import { useState } from "react";
import { Clock, BookOpen, FileQuestion, AlertTriangle } from "lucide-react";

// ---------------------------------------------------------------------------
// VerificationStartModal — shown once after login before quiz begins
// ---------------------------------------------------------------------------

interface VerificationStartModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export default function VerificationStartModal({
  isOpen,
  onConfirm,
}: VerificationStartModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
            <Clock size={28} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Sebelum Memulai Quiz
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pastikan Anda memahami ketentuan waktu berikut
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-4 space-y-3">
          {/* Rule 1: Summary */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">
                Membaca Materi
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Waktu{" "}
                <strong className="text-slate-700">4 menit</strong> untuk
                membaca rangkuman dan eksplorasi interaktif per quiz.
              </p>
            </div>
          </div>

          {/* Rule 2: Questions */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <FileQuestion size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">
                Mengerjakan Soal
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Setiap soal diberi waktu{" "}
                <strong className="text-slate-700">1 menit</strong>. Jika waktu
                habis, soal otomatis dilanjutkan ke soal berikutnya.
              </p>
            </div>
          </div>

          {/* Rule 3: Total Time */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
            <div className="w-8 h-8 rounded-lg bg-blue-200 flex items-center justify-center shrink-0 mt-0.5">
              <Clock size={16} className="text-blue-700" />
            </div>
            <div>
              <p className="font-semibold text-blue-800 text-sm">
                Total Waktu: 74 Menit
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                6 Materi (24 mnt) + 6 Quiz × 5 soal (30 mnt) + NUMi 20 soal
                (20 mnt)
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle
              size={16}
              className="text-amber-600 shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700">
              Quiz bersifat <strong>real</strong> — tidak ada pengulangan.
              Pastikan Anda siap sebelum memulai.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 space-y-3">
          {/* Checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span className="text-sm text-slate-700">
              Saya memahami ketentuan waktu dan siap memulai quiz
            </span>
          </label>

          {/* Button */}
          <button
            onClick={onConfirm}
            disabled={!isChecked}
            className={`w-full py-3 rounded-xl font-semibold text-base transition-all tracking-wide ${
              isChecked
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            }`}
          >
            Saya Siap, Mulai Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
