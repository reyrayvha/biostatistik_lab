"use client";

import React from 'react';
import { Bookmark } from 'lucide-react';
import InteractiveDistribution from './InteractiveDistribution';

export default function MateriDistribusi() {
  return (
    <div className="flex flex-col gap-8 text-[#c9d1d9] leading-relaxed font-sans">

      {/* 1. Intro / Skenario */}
      <div className="border-l-4 border-[#30363d] bg-[#161b22]/80 p-5 rounded-r-xl">
        <h3 className="text-lg font-semibold text-[#58a6ff] mb-3">
          Hasil Lab yang Membuat Mahasiswa Kedokteran Panik
        </h3>
        <p className="mb-2">
          Bulan kedua rotasi. Kamu mendapat hasil lab pada pasien sehat berusia 22 tahun.
          Hemoglobinnya 17,8 g/dL — ditandai merah sebagai &quot;TINGGI.&quot; Detak jantungmu
          melonjak. Apakah kamu harus menelepon dokter senior?
        </p>
        <p className="mb-2">
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
        <h4 className="text-xl font-semibold text-[#f0f6fc] mb-3">
          Kurva Lonceng — Tempat Sebagian Besar Kedokteran Berada
        </h4>
        <p className="mb-3">
          Tekanan darah, berat lahir, kolesterol, skor tes kognitif — semuanya membentuk kurva
          berbentuk lonceng jika kamu mengukur cukup banyak orang. Ini bukan kebetulan. Ketika
          ratusan faktor genetik dan lingkungan kecil menjumlah, hasilnya mengarah ke bentuk
          lonceng. Itu kebenaran matematika mendalam yang disebut{" "}
          <strong className="text-[#e6edf3]">Teorema Limit Pusat</strong>.
        </p>
        <p className="mb-4">
          Kurva ini didefinisikan oleh hanya dua angka:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#161b22] backdrop-blur-md border border-[#30363d] rounded-2xl p-6 shadow-xl hover:bg-[#1c2129] transition-all duration-300 hover:-translate-y-1">
            <span className="block text-[#58a6ff] font-bold text-lg mb-2">μ (mu)</span>
            <p className="text-[#c9d1d9] leading-relaxed text-sm">
              Pusat lonceng (mean populasi). Ubah μ dan lonceng bergeser kiri-kanan.
            </p>
          </div>
          <div className="bg-[#161b22] backdrop-blur-md border border-[#30363d] rounded-2xl p-6 shadow-xl hover:bg-[#1c2129] transition-all duration-300 hover:-translate-y-1">
            <span className="block text-[#58a6ff] font-bold text-lg mb-2">σ (sigma)</span>
            <p className="text-[#c9d1d9] leading-relaxed text-sm">
              Seberapa lebar atau sempit lonceng (standar deviasi). Ubah σ dan dia melebar
              (lebih datar) atau menyempit (lebih tinggi). Dua tombol mengendalikan seluruh bentuk.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Aturan 68-95-99,7 */}
      <div>
        <h4 className="text-xl font-semibold text-[#f0f6fc] mb-3">
          Aturan yang Akan Kamu Gunakan Setiap Hari: 68-95-99,7
        </h4>
        <p className="mb-4">Ini aturan paling berguna dalam biostatistik:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 text-center shadow-xl">
            <span className="block text-3xl font-extrabold text-[#58a6ff] mb-1">68%</span>
            <p className="text-[#8b949e] text-sm">nilai dalam <strong className="text-[#c9d1d9]">±1σ</strong> dari mean</p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 text-center shadow-xl">
            <span className="block text-3xl font-extrabold text-[#58a6ff] mb-1">95%</span>
            <p className="text-[#8b949e] text-sm">nilai dalam <strong className="text-[#c9d1d9]">±2σ</strong></p>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 text-center shadow-xl">
            <span className="block text-3xl font-extrabold text-[#58a6ff] mb-1">99,7%</span>
            <p className="text-[#8b949e] text-sm">nilai dalam <strong className="text-[#c9d1d9]">±3σ</strong></p>
          </div>
        </div>
        <div className="border-l-4 border-[#30363d] bg-[#161b22]/80 p-5 rounded-r-xl">
          <p className="mb-2">
            Kembali ke pasien mahasiswa kita: jika hemoglobin punya μ = 15,5 dan σ = 1,0 pada
            pria muda, maka 17,8 sekitar 2,3σ di atas mean — di luar rentang 95% tapi tidak dramatis.
            Di klinik yang melihat ratusan pasien, kamu akan menemukan beberapa seperti ini.
          </p>
          <p>
            Tapi jika nilai pasien <strong className="text-[#e6edf3]">3σ</strong> jauhnya? Itu di luar
            99,7% populasi. Sekarang perhatikan.
          </p>
        </div>
      </div>

      {/* 4. Z-Score */}
      <div>
        <h4 className="text-xl font-semibold text-[#f0f6fc] mb-3">
          Z-Score: Penerjemah Universal
        </h4>
        <p className="mb-3">
          Lab berbeda punya satuan berbeda — hemoglobin dalam g/dL, trombosit dalam ribu/μL,
          kreatinin dalam mg/dL. Bagaimana membandingkan seberapa &quot;abnormal&quot; masing-masing?
        </p>
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-4 text-center shadow-xl">
          <p className="text-[#58a6ff] font-mono text-lg font-bold">
            z = (nilai pasien − mean populasi) / SD
          </p>
        </div>
        <p className="mb-2">
          Z-score <strong className="text-[#e6edf3]">+2</strong> = &quot;2 SD di atas rata-rata.&quot;{" "}
          Z-score <strong className="text-[#e6edf3]">−3</strong> = &quot;3 SD di bawah.&quot;
        </p>
        <p>
          Sekarang kamu bisa bilang: &quot;Hemoglobinnya sedikit tinggi (z = +1,5), tapi
          kreatininnya mengkhawatirkan (z = +3,8).&quot; Kamu akan melihat z-score di ujian,
          grafik pertumbuhan pediatri, dan di jurnal manapun yang melakukan standarisasi data.
        </p>
      </div>

      {/* 5. Teorema Limit Pusat */}
      <div>
        <h4 className="text-xl font-semibold text-[#f0f6fc] mb-3">
          Mengapa Statistik Benar-Benar Bekerja: Teorema Limit Pusat
        </h4>
        <p className="mb-3">
          Eksperimen pikiran: ukur rata-rata tinggi badan 30 mahasiswa kedokteran acak. Lakukan
          lagi dengan kelompok berbeda. Dan lagi, ribuan kali. Plot semua rata-rata itu.{" "}
          <strong className="text-[#e6edf3]">
            Tidak peduli seberapa aneh distribusi tinggi individu, distribusi rata-rata tersebut
            akan terlihat seperti kurva lonceng sempurna.
          </strong>{" "}
          Itulah TLP — dan itu sebabnya hampir setiap uji statistik bekerja. Data mentahmu tidak
          perlu normal. Kamu hanya perlu{" "}
          <strong className="text-[#58a6ff]">n ≥ 30</strong>.
        </p>
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 text-center shadow-xl">
          <p className="text-[#58a6ff] font-mono text-lg font-bold mb-2">
            SE = σ / √n
          </p>
          <p className="text-[#8b949e] text-sm">
            Standar Error mengukur seberapa presisi estimasimu.
            Studi lebih besar → SE lebih kecil → estimasi lebih tepat.
          </p>
        </div>
      </div>

      {/* 6. Card Rangkuman untuk Ujian */}
      <div className="bg-[#161b22]/80 border border-[#30363d] p-5 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 text-[#c9d1d9] mb-3">
          <Bookmark size={20} className="text-[#58a6ff]" />
          <h4 className="text-lg font-semibold">Rangkuman untuk Ujian</h4>
        </div>
        <ul className="list-disc pl-6 space-y-2 text-sm text-[#8b949e]">
          <li>
            <strong className="text-[#c9d1d9]">Aturan 68-95-99,7</strong> adalah dasar rentang
            referensi lab. Hafalkan.
          </li>
          <li>
            <strong className="text-[#c9d1d9]">Z-score = (nilai − mean) / SD.</strong> Melampaui
            ±2 berarti &quot;tidak biasa&quot; (di luar 95%).
          </li>
          <li>
            ~5% pasien sehat akan punya lab &quot;abnormal&quot; — secara desain, bukan penyakit.
          </li>
          <li>
            <strong className="text-[#c9d1d9]">TLP</strong> mengatakan rata-rata sampel terdistribusi
            normal meski data individu tidak.
          </li>
          <li>
            <strong className="text-[#c9d1d9]">SE = σ/√n</strong>: studi lebih besar → presisi
            lebih tinggi.
          </li>
        </ul>
      </div>

      {/* 7. Eksplorasi Interaktif */}
      <InteractiveDistribution />

    </div>
  );
}
