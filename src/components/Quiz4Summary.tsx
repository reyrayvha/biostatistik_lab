"use client";

import React, { useState, useMemo } from "react";
import { Bookmark, FlaskConical, Lightbulb } from "lucide-react";

// Approximation of Standard Normal CDF
function normalCDF(x: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

  // Map alpha levels to two-sided Z critical values
const zCrits: Record<number, number> = {
  0.01: 2.5758,
  0.05: 1.96,
  0.1: 1.6449,
};

function normalPDF(x: number) {
  return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
}

export default function Quiz4Summary() {
  const [n, setN] = useState(30);
  const [effect, setEffect] = useState(5);
  const [alpha, setAlpha] = useState<0.01 | 0.05 | 0.1>(0.05);

  const sigma = 15; // Asumsi standar deviasi tekanan darah

  const { pValue, power, isSignificant, zVal } = useMemo(() => {
    const currentZCrit = zCrits[alpha];
    const calculatedZ = (Math.abs(effect) * Math.sqrt(n)) / sigma;
    
    const p = 2 * (1 - normalCDF(calculatedZ));
    const pow = normalCDF(calculatedZ - currentZCrit) + normalCDF(-calculatedZ - currentZCrit);
    
    return {
      pValue: p,
      power: pow * 100,
      isSignificant: p < alpha,
      zVal: calculatedZ,
    };
  }, [n, effect, alpha]);

  // Kelas preset button
  const presetBtn = (active: boolean) =>
    `px-4 py-1.5 text-sm rounded-full transition-colors border ${
      active
        ? "bg-[#388bfd]/15 text-[#58a6ff] border-[#388bfd]/30 shadow-[0_0_10px_rgba(56,139,253,0.1)]"
        : "bg-[#21262d]/60 text-[#e6edf3] border-[#30363d] hover:bg-[#30363d] hover:text-[#e6edf3]"
    }`;

  // SVG Bell Curve Path
  const { curvePath, shadeLeft } = useMemo(() => {
    let pts = [];
    const maxPdf = normalPDF(0);
    // Rentang x dari -3.5 sampai +3.5
    for (let i = -3.5; i <= 3.5; i += 0.05) {
      const x = ((i + 3.5) / 7) * 600; // 0 to 600
      const y = 210 - (normalPDF(i) / maxPdf) * 190; // peak at 20, baseline at 210
      pts.push({ z: i, x, y });
    }
    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

    const getShade = (boundZ: number) => {
      const filtered = pts.filter(p => p.z <= boundZ);
      if (filtered.length === 0) return "";
      const exactX = ((boundZ + 3.5) / 7) * 600;
      const exactY = 210 - (normalPDF(boundZ) / maxPdf) * 190;
      
      return `M 0 210 ${filtered.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")} L ${exactX.toFixed(1)} ${exactY.toFixed(1)} L ${exactX.toFixed(1)} 210 Z`;
    };

    // Shading represents Beta (Type II error) boundary
    const currentZCrit = zCrits[alpha];
    const betaBound = currentZCrit - zVal;

    return { 
      curvePath: linePath,
      shadeLeft: getShade(betaBound)
    };
  }, [zVal, alpha]);

  return (
    <div className="flex flex-col gap-10 text-[#e6edf3] font-sans" style={{ fontSize: '1.05rem', lineHeight: '1.85' }}>
      
      {/* 1. Obat yang Berhasil */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Obat yang "Berhasil" (tapi Tidak Berarti)
        </h4>
        <p className="mb-4">
          Elektif penelitian. PI masuk rapat lab sambil tersenyum: &quot;Kita dapat p = 0,001! Paper ini akan jadi besar.&quot;
        </p>
        <p className="mb-4">
          Kamu melihat datanya. Obat tekanan darah baru menurunkan sistolik... 0,4 mmHg vs. plasebo. Pada 48.000 pasien.
          Efeknya nyata — p-value mengonfirmasi itu — tapi 0,4 mmHg tidak membuat perbedaan apapun. Pasienmu tidak akan
          merasa lebih baik, hidup lebih lama, atau terhindar dari stroke.
        </p>
        <p>
          Ini pelajaran terpenting dalam uji hipotesis: signifikansi statistik bukan signifikansi klinis. P-value memberitahu bahwa
          efek itu ada. Ia tidak mengatakan apapun tentang apakah efek itu penting.
        </p>
      </div>

      {/* 2. Apa Arti P-Value Sebenarnya */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Apa Arti P-Value Sebenarnya (Semua Orang Salah Memahami Ini)
        </h4>
        <p className="mb-4">
          Kamu menguji apakah obat baru menurunkan kolesterol. Ho: &quot;tidak ada perbedaan.&quot; Kamu mendapat p = 0,03.
        </p>
        <p className="mb-4">
          Artinya: &quot;Jika obat benar-benar tidak melakukan apa-apa, ada peluang 3% melihat hasil seekstrem ini.&quot;
        </p>
        <p className="mb-2">Jebakan-jebakannya:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>&quot;3% kemungkinan obat tidak bekerja.&quot; SALAH. P-value ≠ probabilitas Ho benar.</li>
          <li>&quot;Obat bekerja dengan 97% kepastian.&quot; SALAH. Kamu tidak bisa menghitung 1 − p.</li>
          <li>&quot;Efeknya besar karena p kecil.&quot; SALAH. Dengan n besar, efek kecil tak bermakna bisa punya p-value kecil.</li>
        </ul>
        <p>
          Anggap p-value seperti detektor logam berbunyi. Ia mengatakan &quot;ada sesuatu di sini&quot; — bukan apakah itu koin emas
          atau tutup botol.
        </p>
      </div>

      {/* 3. Dua Cara untuk Salah */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Dua Cara untuk Salah (Analogi UGD)
        </h4>
        <p className="mb-4">Kamu di UGD. Dua jenis kesalahan yang merusak malammu:</p>
        <ul className="space-y-4 mb-4">
          <li>
            <strong className="text-[#f78166]">Kesalahan Tipe I (Alarm Palsu):</strong> Kamu mendiagnosis usus buntu, bergegas ke operasi — usus buntunya normal. Kamu
            &quot;menolak&quot; null padahal benar. Konsekuensi: operasi yang tidak perlu.
          </li>
          <li>
            <strong className="text-[#d29922]">Kesalahan Tipe II (Diagnosis Terlewat):</strong> Kamu memulangkan pasien dengan &quot;flu perut&quot; — mereka kembali keesokan
            harinya dengan usus buntu pecah. Kamu &quot;gagal menolak&quot; null padahal usus buntu memang ada.
          </li>
        </ul>
        <p>
          Dalam penelitian: α (biasanya 0,05) = tingkat alarm palsu yang bisa diterima. β = probabilitas melewatkan efek nyata.
          Power = 1 − β = peluang menangkap efek nyata.
        </p>
      </div>

      {/* 4. Power */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Power: Mengapa Studi Kecil Berbahaya
        </h4>
        <p className="mb-4">
          Seorang dokter senior menyebut studi: 15 pasien per kelompok, &quot;tidak ada perbedaan signifikan&quot; antara dua obat. &quot;Jadi
          keduanya setara,&quot; katanya.
        </p>
        <p className="mb-4">
          Tunggu dulu. Dengan 15 pasien, studi itu mungkin hanya punya power 30% — peluang 70% melewatkan perbedaan
          nyata. Studi itu tidak dirancang untuk menemukan apapun.
        </p>
        <p>
          Power meningkat dengan: ukuran sampel lebih besar (paling praktis), efek lebih besar, α lebih tinggi (tradeoff), variansi
          lebih rendah. Jika kamu tidak bisa mencapai 80% power, studi itu tidak layak dijalankan.
        </p>
      </div>

      {/* 5. Confidence Interval */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Confidence Interval: Yang Disembunyikan P-Value
        </h4>
        <p className="mb-4">
          Paper A: &quot;Obat menurunkan LDL 15 mg/dL (95% CI: 8–22, p &lt; 0,001).&quot; CI menunjukkan efek sebenarnya antara 8 dan 22 —
          semua bermakna secara klinis. Temuan berguna.
        </p>
        <p className="mb-4">
          Paper B: &quot;Obat menurunkan LDL 2 mg/dL (95% CI: 0,5–3,5, p = 0,01).&quot; Tetap signifikan! Tapi CI menunjukkan efek
          sebenarnya antara 0,5 dan 3,5 — tidak ada yang bermakna secara klinis. CI mengungkap apa yang disembunyikan p-value.
        </p>
        <p>
          Jika 95% CI melewati nol (misalnya, −3 sampai +8), kamu bahkan tidak bisa yakin obatnya melakukan apapun.
        </p>
      </div>

      {/* 6. Jebakan Perbandingan Ganda */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Jebakan Perbandingan Ganda
        </h4>
        <p className="mb-4">
          Perusahaan farmasi menguji obatnya terhadap 20 outcome. Pada α = 0,05, kamu akan mengharapkan 1 dari 20
          &quot;signifikan&quot; murni karena kebetulan.
        </p>
        <p className="mb-4">
          Benar saja, siaran pers: &quot;Obat secara signifikan memperbaiki kualitas tidur (p = 0,03)!&quot; Mereka tidak menyebut 19 hasil
          null lainnya.
        </p>
        <p>
          Koreksi Bonferroni: bagi α dengan jumlah tes (0,05/20 = 0,0025). Perlindungan sebenarnya adalah skeptisisme ketika
          kamu melihat satu temuan cherry-picked dari banyak analisis.
        </p>
      </div>

      {/* 7. Rangkuman */}
      <div className="bg-[#161b22]/80 border border-[#30363d] p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark size={20} className="text-[#58a6ff]" />
          <h4 className="text-lg font-semibold text-[#f0f6fc]">Rangkuman untuk Ujian</h4>
        </div>
        <ul className="space-y-2.5 text-[#e6edf3]">
          <li>• P-value = probabilitas data jika Ho benar. BUKAN probabilitas Ho benar.</li>
          <li>• Tipe I = positif palsu (α). Tipe II = negatif palsu (β). Power = 1 − β.</li>
          <li>• ↑ n &rarr; ↑ power. Target ≥ 80%.</li>
          <li>• Selalu lihat ukuran efek + CI — bukan hanya p-value.</li>
          <li>• Signifikansi statistik ≠ signifikansi klinis.</li>
          <li>• 20 tes pada α=0,05 &rarr; ekspektasi 1 positif palsu.</li>
        </ul>
      </div>

      {/* Eksplorasi Interaktif */}
      <div className="mt-4 bg-[#0d1117]/80 backdrop-blur-md border border-[#21262d] rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-[#161b22]/80 border-b border-[#21262d] p-4 flex items-center gap-3">
          <div className="p-2 bg-[#388bfd]/15 text-[#58a6ff] rounded-lg">
            <FlaskConical size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#f0f6fc] uppercase tracking-wider text-sm">Eksplorasi Interaktif</h3>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-[#8b949e] mb-3 font-mono">
                n: {n}
              </label>
              <input type="range" min={10} max={200} step={5} value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="w-full accent-[#58a6ff]" />
            </div>
            
            <div>
              <label className="block text-sm text-[#8b949e] mb-3 font-mono">
                Efek (mmHg): {effect}
              </label>
              <input type="range" min={1} max={15} step={1} value={effect}
                onChange={(e) => setEffect(parseInt(e.target.value))}
                className="w-full accent-[#58a6ff]" />
            </div>
            
            <div>
              <label className="block text-sm text-[#8b949e] mb-2 font-mono">α:</label>
              <div className="flex gap-2">
                {[0.01, 0.05, 0.1].map((a) => (
                  <button key={a} onClick={() => setAlpha(a as any)}
                    className={`px-4 py-1.5 text-sm font-mono rounded-full transition-colors border ${
                      alpha === a
                        ? "bg-transparent text-[#58a6ff] border-[#388bfd]"
                        : "bg-transparent text-[#8b949e] border-[#30363d] hover:border-[#8b949e]"
                    }`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`bg-transparent border p-4 rounded-xl flex flex-col items-center justify-center text-center transition-colors ${
              isSignificant ? "border-[#3fb950]" : "border-[#f85149]"
            }`}>
              <span className="text-[#8b949e] text-xs font-medium uppercase tracking-wider mb-2">P-Value</span>
              <span className="text-3xl font-mono font-bold transition-colors"
                style={{ color: isSignificant ? "#3fb950" : "#f85149" }}>
                {pValue < 0.001 ? "<0.001" : pValue.toFixed(4)}
              </span>
            </div>
            
            <div className={`bg-transparent border p-4 rounded-xl flex flex-col items-center justify-center text-center transition-colors ${
              power >= 80 ? "border-[#3fb950]" : "border-[#d29922]"
            }`}>
              <span className="text-[#8b949e] text-xs font-medium uppercase tracking-wider mb-2">Power</span>
              <span className="text-3xl font-mono font-bold transition-colors"
                style={{ color: power >= 80 ? "#3fb950" : "#d29922" }}>
                {power >= 99.9 ? "99.9" : power.toFixed(1)}%
              </span>
            </div>

            <div className={`bg-transparent border p-4 rounded-xl flex flex-col items-center justify-center text-center transition-colors ${
              isSignificant ? "border-[#3fb950]" : "border-[#30363d]"
            }`}>
              <span className="text-[#8b949e] text-xs font-medium uppercase tracking-wider mb-2">Hasil</span>
              <span className={`text-xl font-bold ${isSignificant ? "text-[#3fb950]" : "text-[#8b949e]"}`}>
                {isSignificant ? "Tolak H₀" : "Gagal menolak"}
              </span>
            </div>
          </div>

          {/* Visualization & Interpretation */}
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-full max-w-[560px] pointer-events-none relative bg-[#0d1117]/60 border border-[#21262d] rounded-xl p-4 flex justify-center">
              {/* Kurva Distribusi Normal */}
              <svg viewBox="0 0 600 240" className="w-full h-auto overflow-visible" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="shade-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#388bfd" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#388bfd" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="curve-stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#388bfd" stopOpacity="0.3" />
                    <stop offset="20%" stopColor="#58a6ff" stopOpacity="1" />
                    <stop offset="80%" stopColor="#58a6ff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#388bfd" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                
                {/* Baseline */}
                <line x1="0" y1="210" x2="600" y2="210" stroke="#30363d" strokeWidth="2" />
                
                {/* P-Value Shaded Areas (mengikuti kurva) - Left tail only to match reference */}
                <path d={shadeLeft} fill="url(#shade-grad)" />
                
                {/* Kurva Utama */}
                <path d={curvePath} fill="none" stroke="url(#curve-stroke)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Garis batas Beta */}
                {(() => {
                  const betaBound = zCrits[alpha] - zVal;
                  if (betaBound >= -3.5 && betaBound <= 3.5) {
                    const bx = ((betaBound + 3.5) / 7) * 600;
                    const by = 210 - (normalPDF(betaBound)/normalPDF(0))*190;
                    return (
                      <line x1={bx} y1="210" x2={bx} y2={by} 
                        stroke="#58a6ff" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                    );
                  }
                  return null;
                })()}
                
                {/* X-axis ticks */}
                {[
                  { z: -3, label: '-3σ' }, { z: -2, label: '-2σ' }, { z: -1, label: '-1σ' },
                  { z: 0, label: 'μ=140' }, { z: 1, label: '+1σ' }, { z: 2, label: '+2σ' }, { z: 3, label: '+3σ' }
                ].map(tick => {
                  const tx = ((tick.z + 3.5) / 7) * 600;
                  return (
                    <g key={tick.z}>
                      <line x1={tx} y1="210" x2={tx} y2="216" stroke="#30363d" strokeWidth="2" />
                      <text x={tx} y="234" textAnchor="middle" fill="#8b949e" fontSize="13" fontFamily="monospace">
                        {tick.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="bg-[#161b22]/50 border border-[#30363d] rounded-lg p-3 text-sm flex gap-3 items-start">
            <Lightbulb size={18} className="text-[#d29922] shrink-0 mt-0.5" />
            <p className="text-[#c9d1d9]">
              {isSignificant 
                ? (power >= 80 
                    ? `Signifikan dengan power baik (${power >= 99.9 ? "100" : power.toFixed(0)}%).` 
                    : `Signifikan tapi power hanya ${power.toFixed(0)}% — kurang power.`)
                : `p = ${pValue.toFixed(3)} > α. Tidak signifikan. ↑ n atau ukuran efek.`}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
