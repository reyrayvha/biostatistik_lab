"use client";

import React, { useState, useMemo } from 'react';
import { Bookmark, BarChart3, Settings2 } from 'lucide-react';

export default function Quiz1Summary() {
  // --- STATS LOGIC ---
  type PresetType = 'simetris' | 'kanan' | 'kiri' | 'custom' | 'bimodal';
  const [activePreset, setActivePreset] = useState<PresetType>('simetris');
  const [inputText, setInputText] = useState("10, 12, 14, 15, 15, 15, 16, 18, 20");

  const parsedData = useMemo(() => {
    return inputText
      .split(',')
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n));
  }, [inputText]);

  const stats = useMemo(() => {
    const arr = [...parsedData].sort((a, b) => a - b);
    const n = arr.length;
    if (n === 0) return { mean: 0, median: 0, mode: "-", sd: 0, freqs: {}, maxFreq: 1 };

    // Mean
    const mean = arr.reduce((a, b) => a + b, 0) / n;

    // Median
    const mid = Math.floor(n / 2);
    const median = n % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];

    // Mode & Frequencies
    const freqs: Record<number, number> = {};
    arr.forEach(num => freqs[num] = (freqs[num] || 0) + 1);
    let maxFreq = 0;
    Object.values(freqs).forEach(f => { if (f > maxFreq) maxFreq = f; });
    const modes = Object.keys(freqs).filter(k => freqs[Number(k)] === maxFreq);
    const mode = modes.length > 3 ? "Multimodal" : modes.join(", ");

    // SD (Sample)
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
    const binCount = 12; // 12 fixed bins for scaled axis
    
    let range = max - min;
    if (range === 0) range = 12; // avoid div by zero if all numbers are identical
    const binSize = range / binCount;

    const bins = Array.from({ length: binCount }, (_, i) => ({
      min: min + (i * binSize),
      max: min + ((i + 1) * binSize),
      freq: 0,
      label: Math.round(min + (i * binSize)).toString()
    }));

    let maxBinFreq = 0;
    arr.forEach(num => {
      let binIndex = Math.floor((num - min) / binSize);
      if (binIndex >= binCount) binIndex = binCount - 1; // upper bound inclusive
      if (binIndex < 0) binIndex = 0;
      bins[binIndex].freq++;
      if (bins[binIndex].freq > maxBinFreq) maxBinFreq = bins[binIndex].freq;
    });

    return { bins, maxBinFreq };
  }, [parsedData]);

  const insight = useMemo(() => {
    if (stats.mean === 0 && stats.median === 0) return null;
    const diff = stats.mean - stats.median;
    if (Math.abs(diff) <= 1.5) return "💡 Mean ≈ Median → Distribusi kurang lebih simetris.";
    if (diff > 0) return "💡 Mean > Median → Distribusi miring ke kanan (Positif). Ada pencilan bernilai besar.";
    return "💡 Mean < Median → Distribusi miring ke kiri (Negatif). Ada pencilan bernilai kecil.";
  }, [stats.mean, stats.median]);

  // --- PRESETS ---
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

  return (
    <div className="flex flex-col gap-8 text-slate-300 leading-relaxed font-sans">
      
      {/* 1. Skenario / Cerita */}
      <div className="border-l-4 border-slate-600 bg-slate-800/30 p-5 rounded-r-xl">
        <h4 className="text-lg font-semibold text-slate-200 mb-3">UGD yang Tidak Bisa Mengukur Waktu Tunggunya Sendiri</h4>
        <p className="mb-2">
          Minggu pertama rotasi klinik. Direktur rumah sakit masuk ke rapat pagi dan dengan bangga mengumumkan: "Rata-rata waktu tunggu UGD kita 28 menit." Dokter senior memutar matanya. "Angka itu menyesatkan," bisiknya. "Coba lihat datanya."
        </p>
        <p className="mb-2">
          Dia membuka data waktu tunggu kemarin: 8, 10, 12, 12, 14, 15, 15, 18, 20, 150 menit. Satu pasien menunggu dua setengah jam karena kesalahan administrasi rekam medis. Satu pencilan itu menarik mean dari sekitar 14 menit menjadi 27,4. Direktur secara teknis benar — tapi sangat menyesatkan.
        </p>
        <p>
          Ini pelajaran pertamamu: angka bisa berbohong jika kamu memilih ringkasan yang salah. Mean, median, dan modus adalah tiga lensa berbeda untuk data yang sama.
        </p>
      </div>

      {/* 2. Definisi */}
      <div>
        <h4 className="text-xl font-semibold text-slate-100 mb-2">Tiga Cara Menemukan "Nilai Tengah"</h4>
        <p className="mb-5 text-slate-400">
          Bayangkan begini: 10 pasien datang ke klinikmu hari ini. Kamu ingin tahu seperti apa pasien "tipikal".
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <span className="block text-indigo-400 font-bold text-lg mb-3">Mean (x̄)</span>
            <p className="text-slate-300 leading-relaxed text-sm">
              Jumlahkan semua usia, bagi dengan 10. Sederhana — tapi kalau satu pasien berusia 98 tahun, tiba-tiba "rata-rata" jadi 45 padahal semua yang lain berusia 30-an. Mean mudah dipengaruhi pencilan.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <span className="block text-indigo-400 font-bold text-lg mb-3">Median</span>
            <p className="text-slate-300 leading-relaxed text-sm">
              Urutkan semua orang berdasarkan usia, pilih orang yang berdiri di tengah. Si 98 tahun tidak menggeser angka ini. Untuk data miring — biaya RS, pendapatan, lama rawat — median adalah jawaban yang jujur.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <span className="block text-indigo-400 font-bold text-lg mb-3">Modus</span>
            <p className="text-slate-300 leading-relaxed text-sm">
              Usia mana yang paling sering muncul? Kurang glamor, tapi penting untuk data kategorikal — seperti keluhan utama paling umum di malam Jumat.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Cerita Obat */}
      <div className="border-l-4 border-slate-600 bg-slate-800/30 p-5 rounded-r-xl">
        <h4 className="text-lg font-semibold text-slate-200 mb-3">Mengapa "Sebaran" Bisa Menyelamatkan Nyawa</h4>
        <p className="mb-2">
          Ini skenario yang akan kamu hadapi saat residensi: dua obat tekanan darah sama-sama menurunkan sistolik 10 mmHg rata-rata. Mean identik. Dokter seniormu bertanya: "Mana yang akan kamu resepkan?"
        </p>
        <p className="mb-2">
          Obat A: kebanyakan pasien turun antara 8 dan 12 mmHg. Konsisten.<br />
          Obat B: ada yang turun 25 mmHg (hipotensi berbahaya), ada yang turun 0. Rata-rata sama, keamanan sangat berbeda.
        </p>
        <p>
          Itulah yang ditangkap oleh standar deviasi — konsistensi efek obat.
        </p>
      </div>

      {/* 4. Grid Sebaran */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
          <span className="block text-indigo-400 font-bold text-lg mb-3">Standar Deviasi (σ)</span>
          <p className="text-slate-300 leading-relaxed text-sm">
            Seberapa rapat data berkumpul di sekitar mean. σ kecil = konsisten, bisa diprediksi. σ besar = tidak stabil. Anggap saja sebagai "skor keandalan" datamu.
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
          <span className="block text-indigo-400 font-bold text-lg mb-3">IQR (Rentang Interkuartil)</span>
          <p className="text-slate-300 leading-relaxed text-sm">
            Rentang 50% data di tengah. Mengabaikan nilai ekstrem — pasangan setia dari median. Untuk data miring, laporkan median + IQR, bukan mean + SD.
          </p>
        </div>
      </div>

      {/* 5. Membaca Bentuk Penyakit */}
      <div>
        <h4 className="text-xl font-semibold text-slate-100 mb-3">Membaca Bentuk Penyakit</h4>
        <p className="mb-2 text-slate-300">
          Dokter seniormu membuka dua histogram. "Beritahu aku yang mana miring kanan."
        </p>
        <p className="mb-4 text-slate-400">
          Bayangkan kamu mengurutkan tagihan RS dari 100 pasien. Kebanyakan berutang Rp5–20 juta. Tapi beberapa rawat ICU menghabiskan Rp1,5 miliar+. Tagihan ekstrem itu membuat ekor panjang ke kanan. Mean tertarik ke ekor itu, tapi median tetap di tempat kebanyakan pasien berada.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong className="text-slate-200 font-medium">Miring kanan (Mean &gt; Median):</strong> Biaya kesehatan, lama rawat, pendapatan.</li>
          <li><strong className="text-slate-200 font-medium">Miring kiri (Mean &lt; Median):</strong> Usia kematian di negara maju — kebanyakan hidup tua, sebagian meninggal muda.</li>
          <li><strong className="text-slate-200 font-medium">Simetris (Mean ≈ Median):</strong> Tekanan darah, tinggi badan, kebanyakan nilai lab pada populasi sehat.</li>
        </ul>
        <p className="italic text-slate-400">
          Aturan klinisnya: jika seseorang menyebut mean untuk data miring, curigai. Tanyakan mediannya.
        </p>
      </div>

      {/* 6. Highlight Box */}
      <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-xl">
        <div className="flex items-center gap-2 text-slate-300 mb-3">
          <Bookmark size={20} className="text-indigo-400" />
          <h4 className="text-lg font-semibold">Rangkuman untuk Ujian</h4>
        </div>
        <ul className="list-disc pl-6 space-y-1 text-sm text-slate-400">
          <li>Menambahkan 10 ke setiap nilai? Mean bergeser 10, SD tetap sama. (Semua dapat bonus — sebarannya tidak berubah.)</li>
          <li>Mengalikan dengan 2? Mean DAN SD dua-duanya berlipat ganda.</li>
          <li>Mean selalu tertarik ke arah ekor.</li>
          <li>Pencilan mempengaruhi: mean, range, SD. TIDAK mempengaruhi: median, modus, IQR.</li>
          <li>Default untuk data klinis miring: Median + IQR.</li>
        </ul>
      </div>

      {/* =========================================
          7. EKSPLORASI INTERAKTIF
      ========================================= */}
      <div className="mt-8 bg-[#0f172a]/60 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-800/50 border-b border-slate-700/50 p-4 flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg">
            <BarChart3 size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-100">Eksplorasi Interaktif</h3>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-slate-400 mb-4">
            Coba ubah kumpulan data di bawah ini untuk melihat bagaimana Mean, Median, Modus, dan Standar Deviasi bereaksi.
          </p>
          
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handlePresetClick('simetris')}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors border ${
                  activePreset === 'simetris'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'
                }`}
              >
                Simetris
              </button>
              <button 
                onClick={() => handlePresetClick('kanan')}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors border ${
                  activePreset === 'kanan'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'
                }`}
              >
                Miring Kanan
              </button>
              <button 
                onClick={() => handlePresetClick('kiri')}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors border ${
                  activePreset === 'kiri'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'
                }`}
              >
                Miring Kiri
              </button>
              <button 
                onClick={() => handlePresetClick('bimodal')}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors border ${
                  activePreset === 'bimodal'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300'
                }`}
              >
                Bimodal
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Settings2 size={16} className="text-slate-500" />
              </div>
              <input 
                type="text" 
                value={inputText}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700/50 text-slate-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono text-sm"
                placeholder="Masukkan angka dipisahkan koma..."
              />
            </div>
          </div>

          {/* Bar Chart (Histogram) */}
          <div className="h-56 mt-8 mb-6 flex items-end justify-center gap-1 border-b border-white/20 pb-2">
            {binData.bins.map((bin, idx) => {
              const isZero = bin.freq === 0;
              return (
                <div key={idx} className="h-full flex flex-col justify-end items-center group w-8 sm:w-10 md:w-12">
                  <div className="flex-1 w-full flex items-end justify-center relative">
                    <div 
                      className={`w-full mx-0.5 sm:mx-1 rounded-t-sm transition-all duration-500 ${isZero ? 'bg-transparent border-none' : 'bg-gradient-to-t from-slate-800 to-indigo-500 border-t-2 border-indigo-400'}`}
                      style={{ height: isZero ? '0%' : `${Math.max((bin.freq / binData.maxBinFreq) * 100, 5)}%` }}
                    >
                      {!isZero && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-xs px-2 py-1 rounded transition-opacity pointer-events-none z-10 whitespace-nowrap text-indigo-200">
                          Freq: {bin.freq}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 mt-2 font-mono h-4 shrink-0 flex items-center">{bin.label}</span>
                </div>
              );
            })}
            {binData.bins.length === 0 && (
              <div className="text-slate-500 text-sm pb-10">Grafik Kosong - Masukkan angka valid</div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex flex-col items-center justify-center transition-all">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">MEAN</span>
              <span className="text-2xl font-mono text-white font-bold">{stats.mean.toFixed(2)}</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex flex-col items-center justify-center transition-all">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">MEDIAN</span>
              <span className="text-2xl font-mono text-white font-bold">{stats.median.toFixed(2)}</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">MODUS</span>
              <span className="text-2xl font-mono text-white font-bold line-clamp-1 truncate w-full" title={stats.mode}>{stats.mode}</span>
            </div>
            <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex flex-col items-center justify-center transition-all">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">SD (σ)</span>
              <span className="text-2xl font-mono text-white font-bold">{stats.sd.toFixed(2)}</span>
            </div>
          </div>

          {/* Insight Auto Conclusion */}
          {insight && (
            <div className="mt-5 bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 text-center animate-in fade-in zoom-in duration-500">
              <p className="text-indigo-200 font-medium text-sm">{insight}</p>
            </div>
          )}
          
        </div>
      </div>
      
    </div>
  );
}
