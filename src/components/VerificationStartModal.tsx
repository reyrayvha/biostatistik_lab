"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// VerificationStartModal — Professional Assessment Preparation Interface
//
// UX & Product Design Principles:
// 1. Editorial, product-grade hierarchy: Replaced generic stacked pastel cards
//    with a unified, scannable assessment overview and clean numbered protocols.
// 2. Viewport optimization: Expanded from cramped max-w-lg to an ergonomic
//    max-w-2xl container that breathes comfortably on desktop and scales fluids
//    on mobile without horizontal overflow.
// 3. Information architecture:
//    - Header with context metadata and clear intent.
//    - Compact 3-metric specification bar (Duration, Modules, Questions).
//    - Structured, high-contrast procedural instructions.
//    - Restrained semantic warning callout.
//    - Clear agreement checkbox with comfortable touch-target.
//    - Single confident primary action button with unambiguous disabled state.
// 4. Accessible & compliant: Semantic HTML, focus-visible states, keyboard support.
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
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Focus the checkbox or container for immediate keyboard accessibility
    const timer = window.setTimeout(() => {
      checkboxRef.current?.focus();
    }, 50);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prep-modal-title"
      aria-describedby="prep-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
    >
      {/* Restrained Backdrop */}
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto text-left">
        {/* Header Section */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              Protokol Asesmen Biostatistik
            </span>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              SMART-MATH MEDICS
            </span>
          </div>

          <h2
            id="prep-modal-title"
            className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight"
          >
            Petunjuk Pelaksanaan Asesmen
          </h2>
          <p
            id="prep-modal-desc"
            className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed"
          >
            Sesi asesmen ini menguji pemahaman biostatistik dan penalaran numerik medis Anda secara komprehensif. Harap tinjau ringkasan alokasi waktu dan ketentuan pengerjaan di bawah ini sebelum memulai.
          </p>
        </div>

        {/* Assessment Specification Metric Strip */}
        <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-center py-3.5 px-3 sm:px-6">
          <div className="px-2">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Durasi
            </span>
            <span className="block text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
              74 Menit
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Alokasi kumulatif
            </span>
          </div>

          <div className="px-2">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cakupan Materi
            </span>
            <span className="block text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              6 Kuis + NUMi
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Materi & evaluasi akhir
            </span>
          </div>

          <div className="px-2">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Soal
            </span>
            <span className="block text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
              50 Butir
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              30 Kuis + 20 NUMi
            </span>
          </div>
        </div>

        {/* Content & Rules Section */}
        <div className="px-6 sm:px-8 py-5 space-y-4 max-h-[50vh] sm:max-h-none overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Ketentuan & Alur Pengerjaan
          </h3>

          <div className="space-y-3">
            {/* Rule 1 */}
            <div className="flex items-start gap-3 text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                1
              </span>
              <div className="leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  Waktu Membaca Ringkasan Materi (4 Menit / Kuis):
                </strong>{" "}
                <span className="text-slate-600 dark:text-slate-400">
                  Sebelum setiap kuis dimulai, Anda memiliki 4 menit untuk membaca rangkuman teori dan melakukan eksplorasi interaktif. Saat waktu habis, kuis otomatis dimulai.
                </span>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="flex items-start gap-3 text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                2
              </span>
              <div className="leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  Waktu Pengerjaan Soal (1 Menit / Butir):
                </strong>{" "}
                <span className="text-slate-600 dark:text-slate-400">
                  Setiap butir soal (baik kuis 1–6 maupun ujian akhir NUMi) berdurasi tepat 1 menit. Jika waktu habis, sistem otomatis menyimpan jawaban dan berlanjut ke soal berikutnya.
                </span>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="flex items-start gap-3 text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                3
              </span>
              <div className="leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  Sifat Asesmen Satu Kali Percobaan (Real Exam):
                </strong>{" "}
                <span className="text-slate-600 dark:text-slate-400">
                  Kuis berlangsung riil tanpa sistem remedial atau pengulangan soal. Skor yang Anda peroleh langsung dicatat permanen pada papan skor dan rekap dosen.
                </span>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="flex items-start gap-3 text-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                4
              </span>
              <div className="leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  Integritas Layar & Anti-Multitasking:
                </strong>{" "}
                <span className="text-slate-600 dark:text-slate-400">
                  Sistem mendeteksi jika jendela browser kehilangan fokus. Dilarang berpindah tab browser atau membuka aplikasi lain selama sesi asesmen berlangsung.
                </span>
              </div>
            </div>
          </div>

          {/* Subtle Restrained Semantic Warning Callout */}
          <div className="p-3.5 rounded-lg border border-amber-200/90 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Pastikan koneksi internet stabil dan daya perangkat Anda mencukupi. Begitu tombol konfirmasi ditekan, sesi asesmen akan langsung berjalan.
            </p>
          </div>
        </div>

        {/* Footer: Agreement Checkbox + Primary Action Button */}
        <div className="px-6 sm:px-8 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <input
              ref={checkboxRef}
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-1 accent-blue-600 dark:accent-blue-500 cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-normal group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
              Saya telah membaca seluruh ketentuan asesmen di atas, siap menjaga fokus layar penuh, dan bersedia memulai kuis sekarang.
            </span>
          </label>

          <div className="flex items-center justify-end pt-1">
            <button
              ref={startButtonRef}
              type="button"
              onClick={onConfirm}
              disabled={!isChecked}
              className={`w-full sm:w-auto min-w-[200px] px-6 py-2.5 rounded-lg font-semibold text-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isChecked
                  ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 cursor-pointer shadow-sm"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
              }`}
            >
              Mulai Sesi Asesmen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
