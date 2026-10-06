"use client";

import React from 'react';
import { Bookmark } from 'lucide-react';
import InteractiveDistribution from './InteractiveDistribution';

export default function MateriDistribusi() {
  return (
    <div className="flex flex-col gap-6 md:gap-10 text-sm md:text-base text-slate-700 leading-relaxed font-sans">

      {/* 1. Skenario */}
      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">
          <span className="text-blue-600">Hasil Lab yang Membuat Mahasiswa Kedokteran Panik</span>
        </h4>
        <p className="mb-4">
          Bulan kedua rotasi. Kamu mendapat hasil lab pada pasien sehat berusia 22 tahun.
          Hemoglobinnya 17,8 g/dL — ditandai merah sebagai &quot;TINGGI.&quot; Detak jantungmu
          melonjak. Apakah kamu harus menelepon dokter senior?
        </p>
        <p className="mb-4">
          Residen tersenyum. &quot;Tenang. Rentang referensi itu hanya ±2 standar deviasi dari
          mean populasi. Secara definisi, 5% orang yang sehat sempurna akan berada di luar
          rentang itu — 2,5% di setiap sisi. Pasienmu kemungkinan baik-baik saja.&quot;
        </p>
        <p>
          Momen itu mengkristalkan kebenaran penting: untuk praktik kedokteran, kamu harus
          memahami bagaimana &quot;normal&quot; didefinisikan.
        </p>
      </div>

      {/* 2. Kurva Lonceng */}
      <div className="mb-6">
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">
          Kurva Lonceng — Tempat Sebagian Besar Kedokteran Berada
        </h4>
        <p className="mb-4">
          Tekanan darah, berat lahir, kolesterol, skor tes kognitif — semuanya membentuk kurva
          berbentuk lonceng jika kamu mengukur cukup banyak orang. Ini bukan kebetulan. Ketika
          ratusan faktor genetik dan lingkungan kecil menjumlah, hasilnya mengarah ke bentuk
          lonceng. Itu kebenaran matematika mendalam yang disebut{" "}
          <strong className="text-slate-900">Teorema Limit Pusat</strong>.
        </p>
        <p className="mb-5">
          Kurva ini didefinisikan oleh hanya dua angka:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "μ (mu)", desc: "Pusat lonceng (mean populasi). Ubah μ dan lonceng bergeser kiri-kanan." },
            { label: "σ (sigma)", desc: "Seberapa lebar atau sempit lonceng (standar deviasi). Ubah σ dan dia melebar (lebih datar) atau menyempit (lebih tinggi). Dua tombol mengendalikan seluruh bentuk." },
          ].map((c) => (
            <div key={c.label}
              className="bg-slate-50 backdrop-blur-md border border-slate-200 rounded-2xl p-6 hover:bg-slate-100 transition-all duration-300 hover:-translate-y-1">
              <span className="block text-blue-600 font-bold text-lg mb-2">{c.label}</span>
              <p className="text-slate-700 leading-relaxed text-sm">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Aturan 68-95-99.7 */}
      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">
          Aturan yang Akan Kamu Gunakan Setiap Hari: 68-95-99,7
        </h4>
        <p className="mb-5">Ini aturan paling berguna dalam biostatistik:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { pct: "68%", sigma: "±1σ" },
            { pct: "95%", sigma: "±2σ" },
            { pct: "99,7%", sigma: "±3σ" },
          ].map((s) => (
            <div key={s.pct} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center shadow-xl">
              <span className="block text-xl md:text-3xl font-extrabold text-blue-600 mb-1">{s.pct}</span>
              <p className="text-slate-700 text-sm">nilai dalam <strong>{s.sigma}</strong> dari mean</p>
            </div>
          ))}
        </div>
        <p className="mb-4">
          Kembali ke pasien mahasiswa kita: jika hemoglobin punya μ = 15,5 dan σ = 1,0 pada
          pria muda, maka 17,8 sekitar 2,3σ di atas mean — di luar rentang 95% tapi tidak dramatis.
          Di klinik yang melihat ratusan pasien, kamu akan menemukan beberapa seperti ini.
        </p>
        <p>
          Tapi jika nilai pasien <strong className="text-slate-900">3σ</strong> jauhnya? Itu di luar
          99,7% populasi. Sekarang perhatikan.
        </p>
      </div>

      {/* 4. Z-Score */}
      <div className="mb-6">
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">
          Z-Score: Penerjemah Universal
        </h4>
        <p className="mb-4">
          Lab berbeda punya satuan berbeda — hemoglobin dalam g/dL, trombosit dalam ribu/μL,
          kreatinin dalam mg/dL. Bagaimana membandingkan seberapa &quot;abnormal&quot; masing-masing?
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-5 text-center shadow-xl">
          <p className="text-blue-600 font-mono text-lg font-bold">
            z = (nilai pasien − mean populasi) / SD
          </p>
        </div>
        <p className="mb-4">
          Z-score <strong className="text-slate-900">+2</strong> = &quot;2 SD di atas rata-rata.&quot;{" "}
          Z-score <strong className="text-slate-900">−3</strong> = &quot;3 SD di bawah.&quot;
        </p>
        <p>
          Sekarang kamu bisa bilang: &quot;Hemoglobinnya sedikit tinggi (z = +1,5), tapi
          kreatininnya mengkhawatirkan (z = +3,8).&quot; Kamu akan melihat z-score di ujian,
          grafik pertumbuhan pediatri, dan di jurnal manapun yang melakukan standarisasi data.
        </p>
      </div>

      {/* 5. TLP */}
      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">
          Mengapa Statistik Benar-Benar Bekerja: Teorema Limit Pusat
        </h4>
        <p className="mb-4">
          Eksperimen pikiran: ukur rata-rata tinggi badan 30 mahasiswa kedokteran acak. Lakukan
          lagi dengan kelompok berbeda. Dan lagi, ribuan kali. Plot semua rata-rata itu.{" "}
          <strong className="text-slate-900">
            Tidak peduli seberapa aneh distribusi tinggi individu, distribusi rata-rata tersebut
            akan terlihat seperti kurva lonceng sempurna.
          </strong>{" "}
          Itulah TLP — dan itu sebabnya hampir setiap uji statistik bekerja. Data mentahmu tidak
          perlu normal. Kamu hanya perlu{" "}
          <strong className="text-blue-600">n ≥ 30</strong>.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-xl">
          <p className="text-blue-600 font-mono text-lg font-bold mb-2">SE = σ / √n</p>
          <p className="text-slate-700 text-sm">
            Standar Error mengukur seberapa presisi estimasimu.
            Studi lebih besar → SE lebih kecil → estimasi lebih tepat.
          </p>
        </div>
      </div>

      {/* 6. Rangkuman */}
      <div className="bg-slate-50/80 border border-slate-300 p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark size={20} className="text-blue-600" />
          <h4 className="text-lg font-semibold text-slate-900">Rangkuman untuk Ujian</h4>
        </div>
        <ul className="space-y-2.5 text-slate-700">
          {[
            <><strong className="text-slate-900">Aturan 68-95-99,7</strong> adalah dasar rentang referensi lab. Hafalkan.</>,
            <><strong className="text-slate-900">Z-score = (nilai − mean) / SD.</strong> Melampaui ±2 berarti &quot;tidak biasa&quot; (di luar 95%).</>,
            <>~5% pasien sehat akan punya lab &quot;abnormal&quot; — secara desain, bukan penyakit.</>,
            <><strong className="text-slate-900">TLP</strong> mengatakan rata-rata sampel terdistribusi normal meski data individu tidak.</>,
            <><strong className="text-slate-900">SE = σ/√n</strong>: studi lebih besar → presisi lebih tinggi.</>,
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 7. Interaktif */}
      <InteractiveDistribution />
    </div>
  );
}

