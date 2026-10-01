"use client";

import React, { useState, useMemo } from 'react';
import { Bookmark, BarChart3, Settings2 } from 'lucide-react';

export default function Quiz1Summary() {
  type PresetType = 'simetris' | 'kanan' | 'kiri' | 'custom' | 'bimodal';
  const [activePreset, setActivePreset] = useState<PresetType>('simetris');
  const [inputText, setInputText] = useState("10, 12, 14, 15, 15, 15, 16, 18, 20");

  const parsedData = useMemo(() => {
    return inputText.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  }, [inputText]);

  const stats = useMemo(() => {
    const arr = [...parsedData].sort((a, b) => a - b);
    const n = arr.length;
    if (n === 0) return { mean: 0, median: 0, mode: "-", sd: 0, freqs: {}, maxFreq: 1 };
    const mean = arr.reduce((a, b) => a + b, 0) / n;
    const mid = Math.floor(n / 2);
    const median = n % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
    const freqs: Record<number, number> = {};
    arr.forEach(num => freqs[num] = (freqs[num] || 0) + 1);
    let maxFreq = 0;
    Object.values(freqs).forEach(f => { if (f > maxFreq) maxFreq = f; });
    const modes = Object.keys(freqs).filter(k => freqs[Number(k)] === maxFreq);
    const mode = modes.length > 3 ? "Multimodal" : modes.join(", ");
    let sd = 0;
    if (n > 1) {
      const sumSq = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
      sd = Math.sqrt(sumSq / (n - 1));
    }
    return { mean, median, mode, sd, freqs, maxFreq };
  }, [parsedData]);

  const binData = useMemo(() => {
    if (parsedData.length === 0) return { bins: [], maxBinFreq: 0 };
    const arr = [...parsedData].sort((a, b) => a - b);
    const min = arr[0];
    const max = arr[arr.length - 1];
    const binCount = 12;
    let range = max - min;
    if (range === 0) range = 12;
    const binSize = range / binCount;
    const bins = Array.from({ length: binCount }, (_, i) => ({
      min: min + (i * binSize), max: min + ((i + 1) * binSize),
      freq: 0, label: Math.round(min + (i * binSize)).toString()
    }));
    let maxBinFreq = 0;
    arr.forEach(num => {
      let binIndex = Math.floor((num - min) / binSize);
      if (binIndex >= binCount) binIndex = binCount - 1;
      if (binIndex < 0) binIndex = 0;
      bins[binIndex].freq++;
      if (bins[binIndex].freq > maxBinFreq) maxBinFreq = bins[binIndex].freq;
    });
    return { bins, maxBinFreq };
  }, [parsedData]);

  const insight = useMemo(() => {
    if (stats.mean === 0 && stats.median === 0) return null;
    const diff = stats.mean - stats.median;
    if (Math.abs(diff) <= 1.5) return "Mean ˜ Median — Distribusi kurang lebih simetris.";
    if (diff > 0) return "Mean > Median — Distribusi miring ke kanan (Positif). Ada pencilan bernilai besar.";
    return "Mean < Median — Distribusi miring ke kiri (Negatif). Ada pencilan bernilai kecil.";
  }, [stats.mean, stats.median]);

  const presets = {
    simetris: "10, 12, 14, 15, 15, 15, 16, 18, 20",
    kanan: "5, 6, 7, 7, 8, 9, 10, 40, 85",
    kiri: "5, 45, 70, 75, 78, 80, 80, 85, 90",
    bimodal: "10, 10, 10, 12, 15, 25, 28, 30, 30, 30"
  };

  const handlePresetClick = (preset: 'simetris' | 'kanan' | 'kiri' | 'bimodal') => {
    setActivePreset(preset);
    setInputText(presets[preset]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivePreset('custom');
    setInputText(e.target.value);
  };

  const presetBtn = (active: boolean) =>
    `px-4 py-1.5 text-sm rounded-full transition-colors border ${
      active
        ? 'bg-[#3b82f6]/15 text-blue-600 border-[#3b82f6]/30'
        : 'bg-slate-100/60 text-slate-700 border-slate-300 hover:bg-[#e2e8f0]'
    }`;

  return (
    <div className="flex flex-col gap-6 md:gap-10 text-sm md:text-base text-slate-700 leading-relaxed font-sans">

      {/* 1. Skenario */}
      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">
          UGD yang Tidak Bisa Mengukur Waktu Tunggunya Sendiri
        </h4>
        <p className="mb-4">
          Minggu pertama rotasi klinik. Direktur rumah sakit masuk ke rapat pagi dan dengan bangga mengumumkan: &quot;Rata-rata waktu tunggu UGD kita 28 menit.&quot; Dokter senior memutar matanya. &quot;Angka itu menyesatkan,&quot; bisiknya. &quot;Coba lihat datanya.&quot;
        </p>
        <p className="mb-4">
          Dia membuka data waktu tunggu kemarin: 8, 10, 12, 12, 14, 15, 15, 18, 20, 150 menit. Satu pasien menunggu dua setengah jam karena kesalahan administrasi rekam medis. Satu pencilan itu menarik mean dari sekitar 14 menit menjadi 27,4. Direktur secara teknis benar — tapi sangat menyesatkan.
        </p>
        <p>
          Ini pelajaran pertamamu: angka bisa berbohong jika kamu memilih ringkasan yang salah. Mean, median, dan modus adalah tiga lensa berbeda untuk data yang sama.
        </p>
      </div>

      {/* 2. Definisi */}
      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-3 leading-snug">Tiga Cara Menemukan &quot;Nilai Tengah&quot;</h4>
        <p className="mb-6">
          Bayangkan begini: 10 pasien datang ke klinikmu hari ini. Kamu ingin tahu seperti apa pasien &quot;tipikal&quot;.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Mean (x¯)", desc: "Jumlahkan semua usia, bagi dengan 10. Sederhana — tapi kalau satu pasien berusia 98 tahun, tiba-tiba \"rata-rata\" jadi 45 padahal semua yang lain berusia 30-an. Mean mudah dipengaruhi pencilan." },
            { label: "Median",   desc: "Urutkan semua orang berdasarkan usia, pilih orang yang berdiri di tengah. Si 98 tahun tidak menggeser angka ini. Untuk data miring — biaya RS, pendapatan, lama rawat — median adalah jawaban yang jujur." },
            { label: "Modus",   desc: "Usia mana yang paling sering muncul? Kurang glamor, tapi penting untuk data kategorikal — seperti keluhan utama paling umum di malam Jumat." },
          ].map((c) => (
            <div key={c.label}
              className="bg-slate-50 backdrop-blur-md border border-slate-300 rounded-2xl p-6 hover:bg-slate-100 transition-all duration-300 hover:-translate-y-1">
              <span className="block text-blue-600 font-bold text-lg mb-3">{c.label}</span>
              <p className="text-slate-700 leading-relaxed text-sm">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Standar Deviasi */}
      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">Mengapa &quot;Sebaran&quot; Bisa Menyelamatkan Nyawa</h4>
        <p className="mb-4">
          Ini skenario yang akan kamu hadapi saat residensi: dua obat tekanan darah sama-sama menurunkan sistolik 10 mmHg rata-rata. Mean identik. Dokter seniormu bertanya: &quot;Mana yang akan kamu resepkan?&quot;
        </p>
        <p className="mb-4">
          Obat A: kebanyakan pasien turun antara 8 dan 12 mmHg. Konsisten.<br />
          Obat B: ada yang turun 25 mmHg (hipotensi berbahaya), ada yang turun 0. Rata-rata sama, keamanan sangat berbeda.
        </p>
        <p>Itulah yang ditangkap oleh standar deviasi — konsistensi efek obat.</p>
      </div>

      {/* 4. Grid SD & IQR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Standar Deviasi (s)", desc: "Seberapa rapat data berkumpul di sekitar mean. s kecil = konsisten, bisa diprediksi. s besar = tidak stabil. Anggap saja sebagai \"skor keandalan\" datamu." },
          { label: "IQR (Rentang Interkuartil)", desc: "Rentang 50% data di tengah. Mengabaikan nilai ekstrem — pasangan setia dari median. Untuk data miring, laporkan median + IQR, bukan mean + SD." },
        ].map((c) => (
          <div key={c.label}
            className="bg-slate-50 backdrop-blur-md border border-slate-300 rounded-2xl p-6 hover:bg-slate-100 transition-all duration-300 hover:-translate-y-1">
            <span className="block text-blue-600 font-bold text-lg mb-3">{c.label}</span>
            <p className="text-slate-700 leading-relaxed text-sm">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* 5. Bentuk Distribusi */}
      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-3 leading-snug">Membaca Bentuk Penyakit</h4>
        <p className="mb-4">
          Dokter seniormu membuka dua histogram. &quot;Beritahu aku yang mana miring kanan.&quot;
        </p>
        <p className="mb-4">
          Bayangkan kamu mengurutkan tagihan RS dari 100 pasien. Kebanyakan berutang Rp5–20 juta. Tapi beberapa rawat ICU menghabiskan Rp1,5 miliar+. Tagihan ekstrem itu membuat ekor panjang ke kanan. Mean tertarik ke ekor itu, tapi median tetap di tempat kebanyakan pasien berada.
        </p>
        <ul className="space-y-2 mb-4">
          <li><strong className="text-slate-900 font-semibold">Miring kanan (Mean &gt; Median):</strong> Biaya kesehatan, lama rawat, pendapatan.</li>
          <li><strong className="text-slate-900 font-semibold">Miring kiri (Mean &lt; Median):</strong> Usia kematian di negara maju — kebanyakan hidup tua, sebagian meninggal muda.</li>
          <li><strong className="text-slate-900 font-semibold">Simetris (Mean ˜ Median):</strong> Tekanan darah, tinggi badan, kebanyakan nilai lab pada populasi sehat.</li>
        </ul>
        <p className="italic text-slate-600">
          Aturan klinisnya: jika seseorang menyebut mean untuk data miring, curigai. Tanyakan mediannya.
        </p>
      </div>

      {/* 6. Rangkuman */}
      <div className="bg-slate-50/80 border border-slate-300 p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark size={20} className="text-blue-600" />
          <h4 className="text-lg font-semibold text-slate-900">Rangkuman untuk Ujian</h4>
        </div>
        <ul className="space-y-2.5 text-slate-700">
          <li className="flex gap-3 items-start">
            <span className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            Menambahkan 10 ke setiap nilai? Mean bergeser 10, SD tetap sama. (Semua dapat bonus — sebarannya tidak berubah.)
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            Mengalikan dengan 2? Mean DAN SD dua-duanya berlipat ganda.
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            Mean selalu tertarik ke arah ekor.
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            Pencilan mempengaruhi: mean, range, SD. TIDAK mempengaruhi: median, modus, IQR.
          </li>
          <li className="flex gap-3 items-start">
            <span className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            Default untuk data klinis miring: Median + IQR.
          </li>
        </ul>
      </div>

      {/* 7. Eksplorasi Interaktif */}
      <div className="bg-[#f8fafc]/80 backdrop-blur-md border border-[#f1f5f9] rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-50/80 border-b border-[#f1f5f9] p-4 flex items-center gap-3">
          <div className="p-2 bg-[#3b82f6]/15 text-blue-600 rounded-lg">
            <BarChart3 size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Eksplorasi Interaktif</h3>
        </div>

        <div className="p-6">
          <p className="text-slate-700 mb-5">
            Coba ubah kumpulan data di bawah ini untuk melihat bagaimana Mean, Median, Modus, dan Standar Deviasi bereaksi.
          </p>

          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {(['simetris', 'kanan', 'kiri', 'bimodal'] as const).map((p) => (
                <button key={p} onClick={() => handlePresetClick(p)} className={presetBtn(activePreset === p)}>
                  {p === 'simetris' ? 'Simetris' : p === 'kanan' ? 'Miring Kanan' : p === 'kiri' ? 'Miring Kiri' : 'Bimodal'}
                </button>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Settings2 size={16} className="text-[#94a3b8]" />
              </div>
              <input type="text" value={inputText} onChange={handleInputChange}
                className="w-full bg-[#f8fafc] border border-slate-300 text-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#3b82f6]/50 focus:ring-1 focus:ring-[#3b82f6]/50 transition-all font-mono text-sm"
                placeholder="Masukkan angka dipisahkan koma..." />
            </div>
          </div>

          {/* Histogram */}
          <div className="h-56 mt-8 mb-6 flex items-end justify-center gap-1 border-b border-slate-300 pb-2">
            {binData.bins.map((bin, idx) => {
              const isZero = bin.freq === 0;
              return (
                <div key={idx} className="h-full flex flex-col justify-end items-center group w-8 sm:w-10 md:w-12">
                  <div className="flex-1 w-full flex items-end justify-center relative">
                    <div
                      className={`w-full mx-0.5 sm:mx-1 rounded-t-sm transition-all duration-500 ${isZero ? 'bg-transparent' : 'bg-gradient-to-t from-[#f1f5f9] to-[#3b82f6] border-t-2 border-[#2563eb]'}`}
                      style={{ height: isZero ? '0%' : `${Math.max((bin.freq / binData.maxBinFreq) * 100, 5)}%` }}
                    >
                      {!isZero && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-100 text-xs px-2 py-1 rounded transition-opacity pointer-events-none z-10 whitespace-nowrap text-[#79b8ff]">
                          Freq: {bin.freq}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-600 mt-2 font-mono h-4 shrink-0 flex items-center">{bin.label}</span>
                </div>
              );
            })}
            {binData.bins.length === 0 && (
              <div className="text-slate-600 text-sm pb-10">Grafik Kosong - Masukkan angka valid</div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { label: "MEAN",    val: stats.mean.toFixed(2) },
              { label: "MEDIAN",  val: stats.median.toFixed(2) },
              { label: "MODUS",   val: stats.mode },
              { label: "SD (s)",  val: stats.sd.toFixed(2) },
            ].map((s) => (
              <div key={s.label} className="bg-[#f8fafc]/70 border border-[#f1f5f9] p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="text-slate-600 text-xs font-medium uppercase tracking-wider mb-1">{s.label}</span>
                <span className="text-2xl font-mono text-slate-900 font-bold truncate w-full text-center">{s.val}</span>
              </div>
            ))}
          </div>

          {insight && (
            <div className="mt-5 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-xl p-4 text-center">
              <p className="text-[#79b8ff] font-medium">{insight}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

