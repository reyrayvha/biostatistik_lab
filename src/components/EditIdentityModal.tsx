"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/src/store/useAppStore";
import { useToastStore } from "@/src/store/useToastStore";
import {
  checkDuplicateIdentity,
  isIdentityFormValid,
  validateIdentity,
} from "@/src/lib/validators";

export type CurrentIdentity = {
  nama: string;
  nim: string;
  angkatan: string;
};

export function EditIdentityModal({
  isOpen,
  onClose,
  currentIdentity,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentIdentity: CurrentIdentity;
}) {
  const [nama, setNama] = useState(currentIdentity.nama);
  const [nim, setNim] = useState(currentIdentity.nim);
  const [angkatan, setAngkatan] = useState(currentIdentity.angkatan);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateIdentity = useAppStore((state) => state.updateIdentity);
  const addToast = useToastStore((state) => state.addToast);

  const angkatanOptions = useMemo(() => ["2022", "2023", "2024", "2025"], []);

  const handleFieldBlur = (field: "nama" | "nim" | "angkatan", value: string) => {
    const validationErrors = validateIdentity(
      field === "nama" ? value : nama,
      field === "nim" ? value : nim,
      field === "angkatan" ? value : angkatan,
    );

    const fieldError = validationErrors.find((error) => error.field === field);
    setErrors((previous) => {
      if (fieldError) {
        return { ...previous, [field]: fieldError.message };
      }
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateIdentity(nama, nim, angkatan);
    if (validationErrors.length > 0) {
      const errorMap = Object.fromEntries(
        validationErrors.map((error) => [error.field, error.message]),
      );
      setErrors(errorMap);
      addToast("Mohon periksa kembali data identitas Anda.", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const duplicateMessage = await checkDuplicateIdentity(nama, nim, angkatan, currentIdentity.nim);
      if (duplicateMessage) {
        setErrors((previous) => ({ ...previous, nim: duplicateMessage }));
        addToast(duplicateMessage, "warning");
        setIsLoading(false);
        return;
      }

      updateIdentity({
        nama: nama.trim(),
        nim: nim.trim(),
        angkatan: angkatan.trim(),
      });

      addToast("Data identitas berhasil diperbarui.", "success");
      onClose();
    } catch {
      addToast("Gagal memperbarui data identitas. Coba lagi.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Edit Data
            </p>
            <h2 className="text-xl font-bold text-slate-800">Edit Data Identitas</h2>
          </div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-nama" className="mb-1.5 block text-sm font-medium text-slate-700">
              Nama Lengkap
            </label>
            <input
              id="edit-nama"
              type="text"
              value={nama}
              onChange={(event) => {
                setNama(event.target.value);
                if (errors.nama) {
                  const next = { ...errors };
                  delete next.nama;
                  setErrors(next);
                }
              }}
              onBlur={(event) => handleFieldBlur("nama", event.target.value)}
              className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-700 outline-none transition focus:ring-2 ${
                errors.nama ? "border-red-300 bg-red-50 focus:ring-red-200" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
              }`}
              disabled={isLoading}
            />
            {errors.nama && <p className="mt-1 text-sm text-red-600">⚠ {errors.nama}</p>}
          </div>

          <div>
            <label htmlFor="edit-nim" className="mb-1.5 block text-sm font-medium text-slate-700">
              NIM
            </label>
            <input
              id="edit-nim"
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={nim}
              onChange={(event) => {
                const nextValue = event.target.value.replace(/\D/g, "");
                setNim(nextValue);
                if (errors.nim) {
                  const next = { ...errors };
                  delete next.nim;
                  setErrors(next);
                }
              }}
              onBlur={(event) => handleFieldBlur("nim", event.target.value)}
              className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-700 outline-none transition focus:ring-2 ${
                errors.nim ? "border-red-300 bg-red-50 focus:ring-red-200" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
              }`}
              disabled={isLoading}
            />
            {errors.nim && <p className="mt-1 text-sm text-red-600">⚠ {errors.nim}</p>}
          </div>

          <div>
            <label htmlFor="edit-angkatan" className="mb-1.5 block text-sm font-medium text-slate-700">
              Angkatan
            </label>
            <select
              id="edit-angkatan"
              value={angkatan}
              onChange={(event) => {
                setAngkatan(event.target.value);
                if (errors.angkatan) {
                  const next = { ...errors };
                  delete next.angkatan;
                  setErrors(next);
                }
              }}
              onBlur={(event) => handleFieldBlur("angkatan", event.target.value)}
              className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-700 outline-none transition focus:ring-2 ${
                errors.angkatan ? "border-red-300 bg-red-50 focus:ring-red-200" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
              }`}
              disabled={isLoading}
            >
              <option value="">Pilih Angkatan</option>
              {angkatanOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.angkatan && <p className="mt-1 text-sm text-red-600">⚠ {errors.angkatan}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
              disabled={isLoading || !isIdentityFormValid(nama, nim, angkatan)}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
