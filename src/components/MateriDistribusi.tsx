"use client";

import React from 'react';
import { Bookmark } from 'lucide-react';
import InteractiveDistribution from './InteractiveDistribution';

export default function MateriDistribusi() {
  return (
    <div className="flex flex-col gap-10 text-[#e6edf3] font-sans" style={{ fontSize: '1.05rem', lineHeight: '1.85' }}>

      {/* 1. Skenario */}
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-[#58a6ff] mb-4">
          Hasil Lab yang Membuat Mahasiswa Kedokteran Panik
        </h3>
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
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Kurva Lonceng — Tempat Sebagian Besar Kedokteran Berada
        </h4>
        <p className="mb-4">
          Tekanan darah, berat lahir, kolesterol, skor tes kognitif — semuanya membentuk kurva
          berbentuk lonceng jika kamu mengukur cukup banyak orang. Ini bukan kebetulan. Ketika
          ratusan faktor genetik dan lingkungan kecil menjumlah, hasilnya mengarah ke bentuk
          lonceng. Itu kebenaran matematika mendalam yang disebut{" "}
          <strong className="text-[#f0f6fc]">Teorema Limit Pusat</strong>.
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
              className="bg-[#161b22] backdrop-blur-md border border-[#30363d] rounded-2xl p-6 hover:bg-[#1c2129] transition-all duration-300 hover:-translate-y-1">
              <span className="block text-[#58a6ff] font-bold text-lg mb-2">{c.label}</span>
              <p className="text-[#e6edf3] leading-relaxed text-sm">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Aturan 68-95-99.7 */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Aturan yang Akan Kamu Gunakan Setiap Hari: 68-95-99,7
        </h4>
        <p className="mb-5">Ini aturan paling berguna dalam biostatistik:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { pct: "68%", sigma: "±1σ" },
            { pct: "95%", sigma: "±2σ" },
            { pct: "99,7%", sigma: "±3σ" },
          ].map((s) => (
            <div key={s.pct} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 text-center shadow-xl">
              <span className="block text-3xl font-extrabold text-[#58a6ff] mb-1">{s.pct}</span>
              <p className="text-[#e6edf3] text-sm">nilai dalam <strong>{s.sigma}</strong> dari mean</p>
            </div>
          ))}
        </div>
        <p className="mb-4">
          Kembali ke pasien mahasiswa kita: jika hemoglobin punya μ = 15,5 dan σ = 1,0 pada
          pria muda, maka 17,8 sekitar 2,3σ di atas mean — di luar rentang 95% tapi tidak dramatis.
          Di klinik yang melihat ratusan pasien, kamu akan menemukan beberapa seperti ini.
        </p>
        <p>
          Tapi jika nilai pasien <strong className="text-[#f0f6fc]">3σ</strong> jauhnya? Itu di luar
          99,7% populasi. Sekarang perhatikan.
        </p>
      </div>

      {/* 4. Z-Score */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">Z-Score: Penerjemah Universal</h4>
        <p className="mb-4">
          Lab berbeda punya satuan berbeda — hemoglobin dalam g/dL, trombosit dalam ribu/μL,
          kreatinin dalam mg/dL. Bagaimana membandingkan seberapa &quot;abnormal&quot; masing-masing?
        </p>
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-5 text-center shadow-xl">
          <p className="text-[#58a6ff] font-mono text-lg font-bold">
            z = (nilai pasien − mean populasi) / SD
          </p>
        </div>
        <p className="mb-4">
          Z-score <strong className="text-[#f0f6fc]">+2</strong> = &quot;2 SD di atas rata-rata.&quot;{" "}
          Z-score <strong className="text-[#f0f6fc]">−3</strong> = &quot;3 SD di bawah.&quot;
        </p>
        <p>
          Sekarang kamu bisa bilang: &quot;Hemoglobinnya sedikit tinggi (z = +1,5), tapi
          kreatininnya mengkhawatirkan (z = +3,8).&quot; Kamu akan melihat z-score di ujian,
          grafik pertumbuhan pediatri, dan di jurnal manapun yang melakukan standarisasi data.
        </p>
      </div>

      {/* 5. TLP */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Mengapa Statistik Benar-Benar Bekerja: Teorema Limit Pusat
        </h4>
        <p className="mb-4">
          Eksperimen pikiran: ukur rata-rata tinggi badan 30 mahasiswa kedokteran acak. Lakukan
          lagi dengan kelompok berbeda. Dan lagi, ribuan kali. Plot semua rata-rata itu.{" "}
          <strong className="text-[#f0f6fc]">
            Tidak peduli seberapa aneh distribusi tinggi individu, distribusi rata-rata tersebut
            akan terlihat seperti kurva lonceng sempurna.
          </strong>{" "}
          Itulah TLP — dan itu sebabnya hampir setiap uji statistik bekerja. Data mentahmu tidak
          perlu normal. Kamu hanya perlu{" "}
          <strong className="text-[#58a6ff]">n ≥ 30</strong>.
        </p>
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 text-center shadow-xl">
          <p className="text-[#58a6ff] font-mono text-lg font-bold mb-2">SE = σ / √n</p>
          <p className="text-[#e6edf3] text-sm">
            Standar Error mengukur seberapa presisi estimasimu.
            Studi lebih besar → SE lebih kecil → estimasi lebih tepat.
          </p>
        </div>
      </div>

      {/* 6. Rangkuman */}
      <div className="bg-[#161b22]/80 border border-[#30363d] p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark size={20} className="text-[#58a6ff]" />
          <h4 className="text-lg font-semibold text-[#f0f6fc]">Rangkuman untuk Ujian</h4>
        </div>
        <ul className="space-y-2.5 text-[#e6edf3]">
          {[
            <><strong className="text-[#f0f6fc]">Aturan 68-95-99,7</strong> adalah dasar rentang referensi lab. Hafalkan.</>,
            <><strong className="text-[#f0f6fc]">Z-score = (nilai − mean) / SD.</strong> Melampaui ±2 berarti &quot;tidak biasa&quot; (di luar 95%).</>,
            <>~5% pasien sehat akan punya lab &quot;abnormal&quot; — secara desain, bukan penyakit.</>,
            <><strong className="text-[#f0f6fc]">TLP</strong> mengatakan rata-rata sampel terdistribusi normal meski data individu tidak.</>,
            <><strong className="text-[#f0f6fc]">SE = σ/√n</strong>: studi lebih besar → presisi lebih tinggi.</>,
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#58a6ff]" />
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

