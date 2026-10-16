"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------------
// FloatingTimer — floating circular countdown timer
// Uses React Portal into document.body to ensure its fixed viewport coordinates
// remain 100% stable regardless of ancestor CSS transforms or animations.
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const SIZE = 84;
  const STROKE = 4;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const clampedProgress = totalSeconds > 0 ? Math.max(0, Math.min(1, remainingSeconds / totalSeconds)) : 0;
  const offset = CIRCUMFERENCE * (1 - clampedProgress);

  const safeSecs = Math.max(0, remainingSeconds);
  const mins = Math.floor(safeSecs / 60);
  const secs = safeSecs % 60;
  const display = `${mins}:${secs.toString().padStart(2, "0")}`;

  const isLow = safeSecs <= 15 && safeSecs > 5;
  const isCritical = safeSecs <= 5;

  const ringColor = isCritical ? "#ef4444" : isLow ? "#f59e0b" : "#3b82f6";
  const trackColor = isCritical ? "#fee2e2" : isLow ? "#fef3c7" : "#e2e8f0";

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={`fixed bottom-5 right-5 z-[9990] flex flex-col items-center gap-1.5 select-none pointer-events-auto ${
        isCritical ? "animate-pulse" : ""
      }`}
      style={{
        position: "fixed",
        bottom: "1.25rem",
        right: "1.25rem",
        zIndex: 9990,
      }}
    >
      {/* Circle container */}
      <div
        className={`relative flex items-center justify-center rounded-full shadow-xl border-2 backdrop-blur-md transition-all duration-300 ${
          isCritical
            ? "bg-red-50/95 border-red-200 shadow-red-200/40 dark:bg-red-950/80 dark:border-red-800 dark:shadow-red-900/30"
            : isLow
              ? "bg-amber-50/95 border-amber-200 shadow-amber-200/40 dark:bg-amber-950/80 dark:border-amber-800 dark:shadow-amber-900/30"
              : "bg-white/95 border-slate-200 shadow-slate-300/30 dark:bg-slate-900/95 dark:border-slate-700 dark:shadow-black/40"
        }`}
        style={{ width: SIZE, height: SIZE }}
      >
        {/* SVG ring */}
        <svg
          width={SIZE}
          height={SIZE}
          className="absolute inset-0 -rotate-90 pointer-events-none"
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={trackColor}
            strokeWidth={STROKE}
            className="dark:stroke-slate-700/60"
          />
          {/* Progress */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
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

        {/* Time display */}
        <span
          className={`relative font-mono font-bold text-lg tracking-tight ${
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

      {/* Label pill */}
      <span
        className={`text-[9px] font-bold uppercase tracking-[0.12em] px-2.5 py-0.5 rounded-full border shadow-sm ${
          isCritical
            ? "text-red-500 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/60 dark:border-red-800"
            : isLow
              ? "text-amber-500 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/60 dark:border-amber-800"
              : "text-slate-500 bg-white/90 border-slate-200 dark:text-slate-300 dark:bg-slate-800/90 dark:border-slate-700"
        }`}
      >
        {label}
      </span>
    </div>,
    document.body
  );
}
