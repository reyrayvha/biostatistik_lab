"use client";

import { useState, type FormEvent } from "react";
import { useAppStore } from "@/src/store/useAppStore";
import { User, Hash, CalendarDays, ArrowRight, Sparkles } from "lucide-react";

export default function IdentityForm() {
  const identity = useAppStore((s) => s.identity);
  const setIdentity = useAppStore((s) => s.setIdentity);

  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!nama.trim()) errs.nama = "Nama tidak boleh kosong";
    if (!nim.trim()) {
      errs.nim = "NPM / NIM tidak boleh kosong";
    } else if (!/^\d+$/.test(nim.trim())) {
      errs.nim = "NPM / NIM harus berupa angka";
    }
    if (!angkatan.trim()) errs.angkatan = "Angkatan harus dipilih";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Small delay for animation
    await new Promise((r) => setTimeout(r, 500));

    setIdentity({
      nama: nama.trim(),
      nim: nim.trim(),
      angkatan: angkatan.trim(),
    });
  }

  // Opsi angkatan manual (2022 - 2025)
  const angkatanOptions = ["2022", "2023", "2024", "2025"];

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
      {/* Form card containing both hero and fields */}
      <form
        onSubmit={handleSubmit}
        className="identity-form"
        noValidate
        autoComplete="off"
      >
        {/* Hero section */}
        <div className="identity-hero">
          <h2 className="identity-hero-title">Selamat Datang di Ujian Biostatistik</h2>
          <p className="identity-hero-subtitle">
            Silakan isi data diri Anda untuk memulai ujian.
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
            placeholder="Contoh: Dr. Ahmad Ridho"
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
              if (errors.nama) setErrors((prev) => ({ ...prev, nama: "" }));
            }}
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
              if (errors.nim) setErrors((prev) => ({ ...prev, nim: "" }));
            }}
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
              if (errors.angkatan)
                setErrors((prev) => ({ ...prev, angkatan: "" }));
            }}
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
          disabled={isSubmitting}
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
