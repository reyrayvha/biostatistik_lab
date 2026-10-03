"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (adminName: string) => void;
}

export function AdminPinModal({ isOpen, onClose, onSuccess }: AdminPinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setPin("");
    setError("");
    setShowPin(false);
    setAttempts(0);

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (attempts >= 3) {
      setError("Terlalu banyak percobaan. Coba lagi nanti.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/verify-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPin("");
        onSuccess(data.name || "Dosen");
        onClose();
        return;
      }

      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 3 || data.error === "Terlalu banyak percobaan. Coba lagi nanti.") {
        setError("Terlalu banyak percobaan. Coba lagi nanti.");
      } else {
        setError(data.error || "PIN salah. Silakan coba lagi.");
      }
    } catch (error) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setError("Gagal menghubungi server. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-pin-title"
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Lock size={20} />
            </div>
            <div>
              <h3 id="admin-pin-title" className="text-xl font-bold text-slate-800">
                Akses Mode Dosen
              </h3>
              <p className="text-sm text-slate-500">Masukkan PIN untuk masuk ke mode dosen</p>
            </div>
          </div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-pin" className="mb-2 block text-sm font-medium text-slate-600">
              PIN
            </label>

            <div className="relative">
              <input
                id="admin-pin"
                ref={inputRef}
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white"
                placeholder="Masukkan PIN"
                autoComplete="off"
              />

              <button
                type="button"
                onClick={() => setShowPin((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="mt-2 text-sm font-medium text-rose-600">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || pin.trim().length === 0}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              {isLoading ? "Memeriksa..." : "Masuk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
