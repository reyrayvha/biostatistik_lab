"use client";

import { useState, type FormEvent } from "react";
import { User, Hash, CalendarDays, ArrowRight, ArrowLeft } from "lucide-react";
import { useAppStore } from "@/src/store/useAppStore";
import { useToastStore } from "@/src/store/useToastStore";
import {
  checkDuplicateIdentity,
  isIdentityFormValid,
  validateIdentity,
} from "@/src/lib/validators";

export default function IdentityForm({ onBack }: { onBack?: () => void } = {}) {
  const identity = useAppStore((s) => s.identity);
  const setIdentity = useAppStore((s) => s.setIdentity);
  const addToast = useToastStore((s) => s.addToast);

  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const angkatanOptions = ["2022", "2023", "2024", "2025"];

  const validate = (): boolean => {
    const validationErrors = validateIdentity(nama, nim, angkatan);
    const nextErrors = Object.fromEntries(
      validationErrors.map((error) => [error.field, error.message]),
    );
    setErrors(nextErrors);
    return validationErrors.length === 0;
  };

  const handleFieldBlur = (field: "nama" | "nim" | "angkatan", value: string) => {
    const validationErrors = validateIdentity(
      field === "nama" ? value : nama,
      field === "nim" ? value : nim,
      field === "angkatan" ? value : angkatan,
    );

    const fieldError = validationErrors.find((error) => error.field === field);
    setErrors((previous) => {
      if (!fieldError) {
        const next = { ...previous };
        delete next[field];
        return next;
      }
      return { ...previous, [field]: fieldError.message };
    });
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) {
      addToast("Mohon periksa kembali data identitas Anda.", "warning");
      return;
    }

    try {
      const duplicateMessage = await checkDuplicateIdentity(nama, nim, angkatan);
      if (duplicateMessage) {
        setErrors((previous) => ({ ...previous, nim: duplicateMessage }));
        addToast(duplicateMessage, "warning");
        return;
      }
    } catch (error) {
      console.error("Duplicate identity check failed:", error);
      addToast("Tidak dapat memvalidasi data identitas saat ini. Coba beberapa saat lagi.", "error");
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setIdentity({
      nama: nama.trim(),
      nim: nim.trim(),
      angkatan: angkatan.trim(),
    });
  }

  if (identity) {
    return (
      <div className="identity-panel">
        <div className="identity-form" style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <div className="mx-auto bg-blue-50 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mb-4 border border-blue-200">
            <User size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sesi Aktif</h2>
          <p className="text-slate-500 mb-6">
            Anda sedang mengerjakan kuis sebagai:
          </p>
          <div className="bg-white shadow-sm border-slate-200 rounded-xl p-4 inline-block text-left mb-8 border border-slate-200">
            <p className="font-semibold text-slate-800 text-lg mb-1">{identity.nama}</p>
            <div className="flex gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Hash size={14} /> {identity.nim}</span>
              <span className="flex items-center gap-1"><CalendarDays size={14} /> Angkatan {identity.angkatan}</span>
            </div>
          </div>
          <p className="text-sm text-red-600 mb-4 px-4">
            Mengganti akun akan mereset dan menghapus seluruh progres kuis Anda saat ini yang belum tersimpan!
          </p>
          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin mengganti akun? Seluruh progres kuis yang belum disubmit di ujian akhir akan hilang!")) {
                setIdentity(null);
                setNama("");
                setNim("");
                setAngkatan("");
              }
            }}
            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors mx-auto inline-flex items-center justify-center gap-2 font-medium"
          >
            <ArrowRight size={18} className="rotate-180" />
            Ganti Akun & Mulai Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="identity-panel">
      {onBack && (
        <button type="button" className="login-back-button" onClick={onBack}>
          <ArrowLeft size={16} />
          Kembali ke Login
        </button>
      )}
      {/* Form card containing both hero and fields */}
      <form
        onSubmit={handleSubmit}
        className="identity-form"
        noValidate
        autoComplete="off"
      >
        {/* Hero section */}
        <div className="identity-hero">
          <h2 className="identity-hero-title">Data Diri</h2>
          <p className="identity-hero-subtitle">
            Lengkapi data diri Anda untuk membuat sesi mahasiswa.
          </p>
        </div>

        {/* Nama */}
        <div className="form-field">
          <label htmlFor="input-nama" className="form-label">
            <User size={18} />
            Nama Lengkap
          </label>
          <input
            id="input-nama"
            type="text"
            className={`form-input ${errors.nama ? "form-input--error" : ""}`}
            placeholder="Contoh: Yedi Tiar Maulana"
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
              if (errors.nama) {
                const next = { ...errors };
                delete next.nama;
                setErrors(next);
              }
            }}
            onBlur={(e) => handleFieldBlur("nama", e.target.value)}
          />
          {errors.nama && (
            <span className="form-error">{errors.nama}</span>
          )}
        </div>

        {/* NPM / NIM */}
        <div className="form-field">
          <label htmlFor="input-nim" className="form-label">
            <Hash size={16} />
            NPM / NIM
          </label>
          <input
            id="input-nim"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className={`form-input ${errors.nim ? "form-input--error" : ""}`}
            placeholder="Contoh: 2023110001"
            value={nim}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setNim(onlyNums);
              if (errors.nim) {
                const next = { ...errors };
                delete next.nim;
                setErrors(next);
              }
            }}
            onBlur={(e) => handleFieldBlur("nim", e.target.value)}
          />
          {errors.nim && (
            <span className="form-error">{errors.nim}</span>
          )}
        </div>

        {/* Angkatan */}
        <div className="form-field">
          <label htmlFor="input-angkatan" className="form-label">
            <CalendarDays size={16} />
            Angkatan
          </label>
          <select
            id="input-angkatan"
            className={`form-input form-select ${errors.angkatan ? "form-input--error" : ""
              }`}
            value={angkatan}
            onChange={(e) => {
              setAngkatan(e.target.value);
              if (errors.angkatan) {
                const next = { ...errors };
                delete next.angkatan;
                setErrors(next);
              }
            }}
            onBlur={(e) => handleFieldBlur("angkatan", e.target.value)}
          >
            <option value="" disabled>
              Pilih tahun angkatan
            </option>
            {angkatanOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.angkatan && (
            <span className="form-error">{errors.angkatan}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="form-submit"
          disabled={isSubmitting || !isIdentityFormValid(nama, nim, angkatan)}
          style={{ marginTop: "6px" }}
        >
          {isSubmitting ? (
            <>
              <span className="form-submit-spinner" />
              Memproses…
            </>
          ) : (
            <>
              Mulai Kuis
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
