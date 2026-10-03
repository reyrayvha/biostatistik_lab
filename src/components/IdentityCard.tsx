"use client";

import { useState } from "react";
import { Edit3, LogOut, UserCircle2 } from "lucide-react";
import { useAppStore } from "@/src/store/useAppStore";
import { useToastStore } from "@/src/store/useToastStore";
import { EditIdentityModal } from "@/src/components/EditIdentityModal";

export function IdentityCard() {
  const identity = useAppStore((state) => state.identity);
  const resetAllState = useAppStore((state) => state.resetAllState);
  const addToast = useToastStore((state) => state.addToast);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!identity) return null;

  return (
    <>
      <div className="identity-card flex min-w-0 max-w-sm items-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] px-2 py-1.5 shadow-sm">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
          <UserCircle2 size={20} />
        </div>

        <div className="identity-card-info hidden min-w-0 flex-1 md:block">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="truncate font-semibold text-[var(--text-primary)]">{identity.nama}</span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-700">
              {identity.angkatan}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">NIM: {identity.nim}</p>
        </div>

        <div className="hidden shrink-0 items-center gap-1 md:flex">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-light)] bg-[var(--bg-card-hover)] px-2 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-elevated)]"
            aria-label="Edit identitas"
            title="Edit identitas"
          >
            <Edit3 size={12} />
            <span className="identity-action-label">Edit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              resetAllState();
              addToast("Anda telah logout. Silakan login kembali.", "success");
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
            aria-label="Logout user"
            title="Keluar"
          >
            <LogOut size={12} />
            <span className="identity-action-label">Keluar</span>
          </button>
        </div>
      </div>

      <EditIdentityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentIdentity={identity}
      />
    </>
  );
}
