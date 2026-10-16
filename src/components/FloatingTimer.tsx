"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";

// ---------------------------------------------------------------------------
// FloatingTimer — floating circular countdown timer
//
// Solusi Masalah Mobile:
// 1. Geometri Lingkaran Sempurna (viewBox 0 0 100 100, padding aman 5px, aspect-square):
//    Menghilangkan efek tepi terpotong / lonjong pada layar mobile ber-DPI tinggi.
// 2. Posisi Strategis di Mobile:
//    - Di Mobile (<768px): Berada di Kanan Atas (top-[74px] right-3, di bawah header),
//      sehingga tidak menghalangi tombol "Selanjutnya" dan opsi question card di bawah.
//    - Di Desktop (>=768px): Tetap di Kanan Bawah (bottom-6 right-6).
// 3. Draggable: Bisa digeser bebas dengan sentuhan jari / mouse ke sudut mana pun.
// 4. Tap-to-Minimize: Ketuk untuk beralih antara lingkaran penuh dan pill mini.
// 5. Warna Asli: Menggunakan palet asli (biru #3b82f6, amber #f59e0b, merah #ef4444).
// ---------------------------------------------------------------------------

interface FloatingTimerProps {
  /** Total duration in seconds (used to calculate progress ring) */
  totalSeconds: number;
  /** Remaining seconds on the countdown */
  remainingSeconds: number;
  /** Small label shown below the circle */
  label?: string;
}

export default function FloatingTimer({
  totalSeconds,
  remainingSeconds,
  label = "Waktu Tersisa",
}: FloatingTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SVG coordinate geometry: 100x100 viewBox
  // r=41 dan stroke=8 menyisakan 5px padding di sekeliling viewBox
  // sehingga stroke tidak terpotong sama sekali di layar mobile.
  const VB = 100;
  const STROKE = 8;
  const RADIUS = 41;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const clampedProgress =
    totalSeconds > 0 ? Math.max(0, Math.min(1, remainingSeconds / totalSeconds)) : 0;
  const offset = CIRCUMFERENCE * (1 - clampedProgress);

  const safeSecs = Math.max(0, remainingSeconds);
  const mins = Math.floor(safeSecs / 60);
  const secs = safeSecs % 60;
  const display = `${mins}:${secs.toString().padStart(2, "0")}`;

  const isLow = safeSecs <= 15 && safeSecs > 5;
  const isCritical = safeSecs <= 5;

  // Warna tema asli
  const ringColor = isCritical ? "#ef4444" : isLow ? "#f59e0b" : "#3b82f6";
  const trackColor = isCritical ? "#fee2e2" : isLow ? "#fef3c7" : "#e2e8f0";

  // Dragging event handlers (Pointer Events untuk touch & mouse)
  const handlePointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: dragOffset?.x ?? 0,
      initialY: dragOffset?.y ?? 0,
      hasMoved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragRef.current.hasMoved = true;
      setIsDragging(true);
      setDragOffset({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy,
      });
    }
  };

  const handlePointerUp = () => {
    if (!dragRef.current) return;
    const wasMoved = dragRef.current.hasMoved;
    dragRef.current = null;
    setIsDragging(false);

    // Jika hanya tap tanpa drag, toggle mode minimize
    if (!wasMoved) {
      setIsMinimized((prev) => !prev);
    }
  };

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`fixed z-[9990] select-none touch-none top-[74px] right-3 md:top-auto md:bottom-6 md:right-6 transition-transform ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${isCritical ? "animate-pulse" : ""}`}
      style={{
        transform: dragOffset
          ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`
          : undefined,
      }}
      title="Geser untuk memindahkan. Ketuk untuk memperbesar/memperkecil."
    >
      {isMinimized ? (
        /* Mode Kompak (Mini Pill) */
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition-all ${
            isCritical
              ? "bg-red-50/95 border-red-200 text-red-600 dark:bg-red-950/80 dark:border-red-800 dark:text-red-400"
              : isLow
                ? "bg-amber-50/95 border-amber-200 text-amber-600 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-400"
                : "bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/30 dark:bg-slate-900/95 dark:border-slate-700 dark:text-slate-100"
          }`}
        >
          <Clock size={14} className={isCritical ? "animate-pulse text-red-600" : isLow ? "text-amber-600" : "text-blue-500"} />
          <span className="font-mono text-xs md:text-sm font-bold tracking-tight">
            {display}
          </span>
        </div>
      ) : (
        /* Mode Lingkaran Penuh — Geometri 1:1 Sempurna */
        <div className="flex flex-col items-center gap-1">
          {/* Wadah Lingkaran dengan aspect-square dan shrink-0 */}
          <div
            className={`relative flex items-center justify-center rounded-full aspect-square shrink-0 shadow-xl backdrop-blur-md transition-all duration-300 ${
              isCritical
                ? "bg-red-50/95 shadow-red-200/40 dark:bg-red-950/80 dark:shadow-red-900/30"
                : isLow
                  ? "bg-amber-50/95 shadow-amber-200/40 dark:bg-amber-950/80 dark:shadow-amber-900/30"
                  : "bg-white/95 shadow-slate-300/30 dark:bg-slate-900/95 dark:shadow-black/40"
            } w-[58px] h-[58px] md:w-[76px] md:h-[76px]`}
          >
            {/* SVG Ring Progress */}
            <svg
              viewBox={`0 0 ${VB} ${VB}`}
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              style={{ overflow: "visible" }}
            >
              {/* Cincin Background */}
              <circle
                cx={VB / 2}
                cy={VB / 2}
                r={RADIUS}
                fill="none"
                stroke={trackColor}
                strokeWidth={STROKE}
                className="dark:stroke-slate-700/60"
              />
              {/* Cincin Progress Waktu */}
              <circle
                cx={VB / 2}
                cy={VB / 2}
                r={RADIUS}
                fill="none"
                stroke={ringColor}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Angka Timer */}
            <span
              className={`relative font-mono font-bold text-xs md:text-sm tracking-tight ${
                isCritical
                  ? "text-red-600 dark:text-red-400"
                  : isLow
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-800 dark:text-slate-100"
              }`}
            >
              {display}
            </span>
          </div>

          {/* Label Pill */}
          <span
            className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-0.5 rounded-full border shadow-sm whitespace-nowrap ${
              isCritical
                ? "text-red-500 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/60 dark:border-red-800"
                : isLow
                  ? "text-amber-500 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/60 dark:border-amber-800"
                  : "text-slate-500 bg-white/90 border-slate-200 dark:text-slate-300 dark:bg-slate-800/90 dark:border-slate-700"
            }`}
          >
            {label}
          </span>
        </div>
      )}
    </div>,
    document.body
  );
}
