"use client";

import React, { useState, useMemo } from "react";
import { Bookmark, Calculator, FlaskConical } from "lucide-react";

type ExplorerMode = "table2x2" | "lr";

function probToOdds(p: number) {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  return p / (1 - p);
}
function oddsToProbPct(odds: number) {
  if (!isFinite(odds)) return 100;
  return (odds / (1 + odds)) * 100;
}

const presets2x2 = [
  { label: "HIV Mahasiswa",   prevalence: 0.01, sensitivity: 99.9, specificity: 99.9 },
  { label: "Tes Moderat",     prevalence: 5,    sensitivity: 90,   specificity: 95   },
  { label: "Populasi Tinggi", prevalence: 30,   sensitivity: 85,   specificity: 80   },
];

// Helpers warna
const ppvColor  = (v: number) => v >= 70 ? "#3fb950" : v >= 40 ? "#d29922" : "#f85149";
const lrMinColor= (v: number) => v <= 0.1 ? "#3fb950" : v <= 0.2 ? "#d29922" : "#f85149";
const lrPlusColor=(v: number) => v >= 10  ? "#3fb950" : v >= 5   ? "#d29922" : "#f85149";

function lrStrength(lr: number) {
  if (lr >= 10) return { label: "Kuat",          color: "#3fb950" };
  if (lr >= 5)  return { label: "Sedang",         color: "#d29922" };
  if (lr >= 2)  return { label: "Lemah",          color: "#f78166" };
  return          { label: "Tidak Informatif", color: "#f85149" };
}

export default function Quiz3Summary() {
  const [mode, setMode] = useState<ExplorerMode>("table2x2");

  const [population,  setPopulation]  = useState(100000);
  const [prevalence,  setPrevalence]  = useState(0.01);
  const [sensitivity, setSensitivity] = useState(99.9);
  const [specificity, setSpecificity] = useState(99.9);
  const [activePreset, setActivePreset] = useState(0);

  const tbl = useMemo(() => {
    const prev = Math.min(Math.max(prevalence, 0.001), 99.999) / 100;
    const sens = Math.min(Math.max(sensitivity, 0.001), 99.999) / 100;
    const spec = Math.min(Math.max(specificity, 0.001), 99.999) / 100;
    const diseased = Math.round(population * prev);
    const healthy  = population - diseased;
    const tp = Math.round(diseased * sens);
    const fn = diseased - tp;
    const tn = Math.round(healthy * spec);
    const fp = healthy - tn;
    const totalPos = tp + fp;
    const totalNeg = fn + tn;
    const ppv = totalPos > 0 ? (tp / totalPos) * 100 : 0;
    const npv = totalNeg > 0 ? (tn / totalNeg) * 100 : 0;
    const lrPlus  = (1 - spec) > 0 ? sens / (1 - spec) : Infinity;
    const lrMinus = spec > 0 ? (1 - sens) / spec : 0;
    return { diseased, healthy, tp, fn, tn, fp, totalPos, totalNeg, ppv, npv, lrPlus, lrMinus };
  }, [population, prevalence, sensitivity, specificity]);

  const handlePreset = (i: number) => {
    const p = presets2x2[i];
    setActivePreset(i);
    setPrevalence(p.prevalence);
    setSensitivity(p.sensitivity);
    setSpecificity(p.specificity);
  };

  const [preTestProb, setPreTestProb] = useState(5);
  const [lrInput,     setLrInput]     = useState(10);

  const lrRes = useMemo(() => {
    const preOdds  = probToOdds(preTestProb / 100);
    const postOdds = preOdds * lrInput;
    return { preOdds, postOdds, postProb: oddsToProbPct(postOdds) };
  }, [preTestProb, lrInput]);

  const lrStr = lrStrength(lrInput);

  // Kelas preset button — sama persis dengan Quiz1Summary
  const presetBtn = (active: boolean) =>
    `px-4 py-1.5 text-sm rounded-full transition-colors border ${
      active
        ? "bg-[#388bfd]/15 text-[#58a6ff] border-[#388bfd]/30 shadow-[0_0_10px_rgba(56,139,253,0.1)]"
        : "bg-[#21262d]/60 text-[#e6edf3] border-[#30363d] hover:bg-[#30363d] hover:text-[#e6edf3]"
    }`;

  return (
    <div className="flex flex-col gap-10 text-[#e6edf3] font-sans" style={{ fontSize: '1.05rem', lineHeight: '1.85' }}>

      {/* 1. Skenario */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Tes yang Benar 99% — tapi Tetap Salah
        </h4>
        <p className="mb-4">
          Bulan ketiga. Kamu di klinik kesehatan mahasiswa. Seorang mahasiswa 20 tahun — tanpa faktor
          risiko, tanpa gejala — menjalani tes HIV rutin. Sensitivitas 99,9%, spesifisitas 99,9%.
          Hasilnya positif.
        </p>
        <p className="mb-4">
          Mahasiswa itu ketakutan. Kamu hampir berkata &ldquo;Maaf&rdquo; ketika dokter seniormu menghentikanmu.
        </p>
        <p className="mb-4">
          Di populasi berisiko rendah ini, prevalensi HIV sekitar 0,01%. Dari 100.000 mahasiswa:
        </p>
        <ul className="list-disc pl-6 mb-2 space-y-1 text-sm">
          <li>10 punya HIV &rarr; ~10 tes positif (positif benar)</li>
          <li>99.990 tidak punya &rarr; ~100 tes positif (positif palsu)</li>
        </ul>
        <p>
          110 hasil positif, hanya 10 yang benar. Probabilitas mahasiswa ini benar-benar punya HIV?{" "}
          <strong className="text-[#f78166]">Sekitar 9%.</strong>
        </p>
        <p className="mt-3 italic text-[#c9d1d9]">
          Tesnya akurat 99,9%. Matematikanya tetap mengatakan pasien kemungkinan tidak punya HIV.
          Selamat datang di Teorema Bayes.
        </p>
      </div>

      {/* 2. Intuisi Bayesian */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">Mengapa Intuisimu Sudah Bayesian</h4>
        <p className="mb-4">
          Kamu sudah melakukan ini setiap hari. Ketika atlet 25 tahun datang dengan nyeri dada, otakmu
          memberikan probabilitas pre-test yang rendah untuk serangan jantung. Ketika perokok 68 tahun
          dengan diabetes datang dengan gejala yang sama, probabilitasmu melonjak.
        </p>
        <p className="mb-4">
          Troponin positif memiliki arti yang sangat berbeda pada dua pasien ini — karena mereka memulai
          dari baseline yang berbeda.
        </p>
        <p>
          Teorema Bayes memformalisasi ini: Probabilitas post-test = f(probabilitas pre-test, karakteristik tes).
          Hasil sama, arti berbeda, tergantung siapa yang kamu tes.
        </p>
      </div>

      {/* 3. Tabel 2×2 Penjelasan */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">Tabel 2×2: Kalkulator Diagnostikmu</h4>
        <p className="mb-4">
          Ini alat praktisnya. Bayangkan menguji 10.000 orang. Prevalensi: 5%, sensitivitas: 90%, spesifisitas: 95%.
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>500 punya penyakit, 9.500 tidak</li>
          <li>Dari 500 yang sakit: 90% tes positif &rarr; 450 PB, 50 NP</li>
          <li>Dari 9.500 yang sehat: 95% tes negatif &rarr; 9.025 NB, 475 PP</li>
        </ol>
        <p>
          NPP = 450 / (450 + 475) ={" "}
          <strong className="text-[#f78166]">48,6%</strong>. Tes positif hanya memberimu peluang seperti lempar koin!
          Orang sehat jauh melebihi orang sakit, jadi bahkan tingkat positif palsu yang kecil menghasilkan ratusan alarm palsu.
        </p>
      </div>

      {/* 4. Likelihood Ratio */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Rasio Kemungkinan: Jalan Pintas yang Disukai Dokter Senior
        </h4>
        <p className="mb-3">
          Mengisi tabel 2×2 saat ronde terlalu lama. Rasio kemungkinan (likelihood ratio) bisa dihitung di kepala:
        </p>
        <ul className="space-y-2 mb-4">
          <li>
            <strong className="text-[#3fb950]">LR+</strong> = Sensitivitas / (1 &minus; Spesifisitas)
            &rarr; seberapa besar hasil positif meningkatkan peluang penyakit
          </li>
          <li>
            <strong className="text-[#58a6ff]">LR&minus;</strong> = (1 &minus; Sensitivitas) / Spesifisitas
            &rarr; seberapa besar hasil negatif menurunkan peluang
          </li>
        </ul>
        <p className="mb-3">
          Resepnya: konversi probabilitas pre-test ke odds &rarr; kalikan dengan LR &rarr; konversi balik.
        </p>
        <p>
          LR+ di atas 10? Bukti kuat menegakkan diagnosis. LR&minus; di bawah 0,1? Bukti kuat menyingkirkan
          diagnosis. LR mendekati 1? Kamu membuang darah pasien dan uang rumah sakit.
        </p>
      </div>

      {/* 5. Kapan TIDAK Memesan Tes */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Pelajarannya: Kapan TIDAK Memesan Tes
        </h4>
        <p className="mb-4">
          Jika prevalensi sangat rendah, bahkan tes yang sangat baik menghasilkan lebih banyak positif
          palsu daripada positif benar. Inilah mengapa kita tidak menyaring setiap mahasiswa 20 tahun
          untuk kanker pankreas.
        </p>
        <p className="mb-4">
          Sebelum memesan tes apapun, tanyakan: &quot;Berapa probabilitas pre-test saya?&quot; Jika sangat rendah
          dan tesnya tidak sangat spesifik, hasil positif akan menyebabkan lebih banyak kecemasan daripada kejelasan.
        </p>
        <p className="italic">
          Klinisi terbaik tidak hanya tahu tes mana yang harus dipesan — mereka tahu tes mana yang
          TIDAK harus dipesan.
        </p>
      </div>

      {/* 6. Rangkuman */}
      <div className="bg-[#161b22]/80 border border-[#30363d] p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark size={20} className="text-[#58a6ff]" />
          <h4 className="text-lg font-semibold text-[#f0f6fc]">Rangkuman untuk Ujian</h4>
        </div>
        <ul className="space-y-2.5 text-[#e6edf3]">
          <li>NPP bergantung pada prevalensi. Prevalensi rendah &rarr; NPP rendah, meskipun tes bagus.</li>
          <li>Sensitivitas &amp; spesifisitas = sifat TES — tidak berubah dengan prevalensi.</li>
          <li>NPP &amp; NPN = sifat tes + populasi yang diuji.</li>
          <li>LR+ &gt; 10 = tes positif kuat. LR− &lt; 0,1 = tes negatif kuat.</li>
          <li>Selalu mulai dari probabilitas pre-test — itu jangkar untuk semuanya.</li>
        </ul>
      </div>

      {/* 7. Eksplorasi Interaktif */}
      <div className="mt-4 bg-[#0d1117]/80 backdrop-blur-md border border-[#21262d] rounded-2xl overflow-hidden shadow-xl">
        {/* Header + tab */}
        <div className="bg-[#161b22]/80 border-b border-[#21262d] p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-[#388bfd]/15 text-[#58a6ff] rounded-lg">
              <FlaskConical size={20} />
            </div>
            <h3 className="text-lg font-semibold text-[#f0f6fc]">Eksplorasi Interaktif</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMode("table2x2")} className={presetBtn(mode === "table2x2")}>
              Tabel 2×2
            </button>
            <button onClick={() => setMode("lr")} className={presetBtn(mode === "lr")}>
              Kalkulator LR
            </button>
          </div>
        </div>

        <div className="p-6">

          {/* ── MODE: Tabel 2×2 ── */}
          {mode === "table2x2" && (
            <div className="space-y-6">
              <p className="text-sm text-[#e6edf3]">
                Atur prevalensi, sensitivitas, dan spesifisitas untuk melihat bagaimana NPP dan NPN
                berubah. Perhatikan efek dramatis prevalensi yang sangat rendah.
              </p>

              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                {presets2x2.map((p, i) => (
                  <button key={p.label} onClick={() => handlePreset(i)}
                    className={presetBtn(activePreset === i)}>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: "Prevalensi", val: prevalence, disp: `${prevalence.toFixed(3)}%`,
                    min: 0.001, max: 50, step: 0.001,
                    fn: (v: number) => { setActivePreset(-1); setPrevalence(v); } },
                  { label: "Sensitivitas", val: sensitivity, disp: `${sensitivity.toFixed(1)}%`,
                    min: 1, max: 99.9, step: 0.1,
                    fn: (v: number) => { setActivePreset(-1); setSensitivity(v); } },
                  { label: "Spesifisitas", val: specificity, disp: `${specificity.toFixed(1)}%`,
                    min: 1, max: 99.9, step: 0.1,
                    fn: (v: number) => { setActivePreset(-1); setSpecificity(v); } },
                  { label: "Populasi", val: population, disp: population.toLocaleString(),
                    min: 1000, max: 1000000, step: 1000,
                    fn: (v: number) => setPopulation(v) },
                ].map((s) => (
                  <div key={s.label}>
                    <label className="flex justify-between text-xs text-[#e6edf3] mb-1">
                      <span>{s.label}</span>
                      <span className="text-[#e6edf3] font-mono">{s.disp}</span>
                    </label>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                      onChange={(e) => s.fn(parseFloat(e.target.value))}
                      className="w-full accent-[#388bfd]" />
                  </div>
                ))}
              </div>

              {/* Tabel 2×2 */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3" />
                      <th className="p-3 text-center text-[#3fb950] font-semibold">Penyakit (+)</th>
                      <th className="p-3 text-center text-[#58a6ff] font-semibold">Penyakit (−)</th>
                      <th className="p-3 text-center text-[#e6edf3]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { row: "Tes (+)", rowCol: "#3fb950", cells: [
                        { val: tbl.tp, label: "Positif Benar", col: "#3fb950",  bg: "rgba(63,185,80,0.12)"  },
                        { val: tbl.fp, label: "Positif Palsu", col: "#f85149",  bg: "rgba(248,81,73,0.12)"  },
                      ], total: tbl.totalPos },
                      { row: "Tes (−)", rowCol: "#58a6ff", cells: [
                        { val: tbl.fn, label: "Negatif Palsu", col: "#f78166",  bg: "rgba(247,129,102,0.12)" },
                        { val: tbl.tn, label: "Negatif Benar", col: "#58a6ff",  bg: "rgba(88,166,255,0.12)"  },
                      ], total: tbl.totalNeg },
                    ].map((r) => (
                      <tr key={r.row} className="border-t border-[#21262d]">
                        <td className="p-3 font-semibold" style={{ color: r.rowCol }}>{r.row}</td>
                        {r.cells.map((cell, ci) => (
                          <td key={ci} className="p-3 text-center">
                            <span className="px-3 py-1 rounded-lg font-mono font-bold"
                              style={{ background: cell.bg, color: cell.col }}>
                              {cell.val.toLocaleString()}
                            </span>
                            <div className="text-xs text-[#e6edf3] mt-1">{cell.label}</div>
                          </td>
                        ))}
                        <td className="p-3 text-center text-[#e6edf3] font-mono">
                          {r.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-[#21262d]">
                      <td className="p-3 text-[#e6edf3]">Total</td>
                      {[tbl.diseased, tbl.healthy, population].map((v, i) => (
                        <td key={i} className="p-3 text-center text-[#e6edf3] font-mono">
                          {v.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "NPP (PPV)", value: `${tbl.ppv.toFixed(1)}%`, sub: "Prob. penyakit jika tes +", color: ppvColor(tbl.ppv) },
                  { label: "NPN (NPV)", value: `${tbl.npv.toFixed(1)}%`, sub: "Prob. sehat jika tes −",   color: "#3fb950" },
                  { label: "LR+", value: isFinite(tbl.lrPlus) ? tbl.lrPlus.toFixed(1) : "∞",
                    sub: "Kekuatan tes positif", color: lrPlusColor(tbl.lrPlus) },
                  { label: "LR−", value: tbl.lrMinus.toFixed(3),
                    sub: "Kekuatan tes negatif", color: lrMinColor(tbl.lrMinus) },
                ].map((c) => (
                  <div key={c.label}
                    className="bg-[#0d1117]/70 border border-[#21262d] p-4 rounded-xl flex flex-col items-center text-center">
                    <span className="text-[#e6edf3] text-xs font-medium uppercase tracking-wider mb-1">{c.label}</span>
                    <span className="text-2xl font-mono font-bold" style={{ color: c.color }}>{c.value}</span>
                    <span className="text-[#c9d1d9] text-xs mt-1">{c.sub}</span>
                  </div>
                ))}
              </div>

              {/* Insight */}
              <div className={`rounded-xl p-4 text-center border ${
                tbl.ppv < 50
                  ? "bg-[#f85149]/10 border-[#f85149]/20"
                  : "bg-[#3fb950]/10 border-[#3fb950]/20"
              }`}>
                <p className="text-sm font-medium" style={{ color: ppvColor(tbl.ppv) }}>
                  {tbl.ppv < 10
                    ? `NPP hanya ${tbl.ppv.toFixed(1)}% — lebih dari ${(100 - tbl.ppv).toFixed(0)}% hasil positif adalah palsu. Pikirkan ulang sebelum memberi diagnosis.`
                    : tbl.ppv < 50
                    ? `NPP ${tbl.ppv.toFixed(1)}% — kurang dari setengah hasil positif yang benar. Pertimbangkan tes konfirmasi.`
                    : `NPP ${tbl.ppv.toFixed(1)}% — mayoritas hasil positif adalah benar. Tes cukup informatif pada populasi ini.`}
                </p>
              </div>
            </div>
          )}

          {/* ── MODE: Kalkulator LR ── */}
          {mode === "lr" && (
            <div className="space-y-6">
              <p className="text-sm text-[#e6edf3]">
                Masukkan probabilitas pre-test dan likelihood ratio untuk menghitung probabilitas post-test
                menggunakan metode odds (nomogram Fagan).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex justify-between text-xs text-[#e6edf3] mb-1">
                    <span>Probabilitas Pre-Test</span>
                    <span className="text-[#e6edf3] font-mono">{preTestProb}%</span>
                  </label>
                  <input type="range" min={1} max={99} step={1} value={preTestProb}
                    onChange={(e) => setPreTestProb(parseInt(e.target.value))}
                    className="w-full accent-[#388bfd]" />
                  <div className="flex justify-between text-xs text-[#c9d1d9] mt-1">
                    <span>1% (Sangat rendah)</span><span>99% (Sangat tinggi)</span>
                  </div>
                </div>
                <div>
                  <label className="flex justify-between text-xs text-[#e6edf3] mb-1">
                    <span>Likelihood Ratio (LR+)</span>
                    <span className="text-[#e6edf3] font-mono">{lrInput.toFixed(1)}</span>
                  </label>
                  <input type="range" min={0.1} max={100} step={0.1} value={lrInput}
                    onChange={(e) => setLrInput(parseFloat(e.target.value))}
                    className="w-full accent-[#388bfd]" />
                  <div className="flex justify-between text-xs text-[#c9d1d9] mt-1">
                    <span>0.1</span><span>100</span>
                  </div>
                </div>
              </div>

              {/* LR strength badge */}
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm text-[#e6edf3]">Kekuatan LR+:</span>
                <span className="px-4 py-1 rounded-full text-sm font-bold"
                  style={{
                    background: lrStr.color + "22",
                    color: lrStr.color,
                    border: `1px solid ${lrStr.color}44`,
                  }}>
                  {lrStr.label} ({lrInput.toFixed(1)})
                </span>
              </div>

              {/* Bayes flow */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
                <div className="flex flex-col items-center bg-[#0d1117]/70 border border-[#21262d] rounded-xl p-4 w-36">
                  <span className="text-xs text-[#e6edf3] mb-1 text-center">Pre-Test Prob</span>
                  <span className="text-2xl font-mono font-bold text-[#58a6ff]">{preTestProb}%</span>
                  <span className="text-xs text-[#c9d1d9] mt-1">
                    Odds: {probToOdds(preTestProb / 100).toFixed(3)}
                  </span>
                </div>

                <div className="flex flex-col items-center px-4">
                  <span className="text-xs text-[#e6edf3] mb-1">× LR+</span>
                  <div className="flex items-center gap-1">
                    <div className="h-0.5 w-12 bg-gradient-to-r from-[#58a6ff] to-[#388bfd]" />
                    <span className="text-[#388bfd] text-lg">&#9658;</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-[#388bfd] mt-1">
                    {lrInput.toFixed(1)}
                  </span>
                </div>

                <div className="flex flex-col items-center bg-[#0d1117]/70 border border-[#21262d] rounded-xl p-4 w-36">
                  <span className="text-xs text-[#e6edf3] mb-1 text-center">Post-Test Prob</span>
                  <span className="text-2xl font-mono font-bold transition-all duration-500"
                    style={{ color: ppvColor(lrRes.postProb) }}>
                    {lrRes.postProb.toFixed(1)}%
                  </span>
                  <span className="text-xs text-[#c9d1d9] mt-1">
                    Odds: {isFinite(lrRes.postOdds) ? lrRes.postOdds.toFixed(3) : "∞"}
                  </span>
                </div>
              </div>

              {/* Probability bar */}
              <div>
                <div className="flex justify-between text-xs text-[#e6edf3] mb-1">
                  <span>Probabilitas Post-Test</span>
                  <span className="font-mono" style={{ color: ppvColor(lrRes.postProb) }}>
                    {lrRes.postProb.toFixed(1)}%
                  </span>
                </div>
                <div className="h-4 bg-[#21262d] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(lrRes.postProb, 100)}%`,
                      background: `linear-gradient(90deg, #388bfd, ${ppvColor(lrRes.postProb)})`,
                    }} />
                </div>
                <div className="flex justify-between text-xs text-[#c9d1d9] mt-1">
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>

              {/* LR referensi */}
              <div className="bg-[#0d1117]/60 border border-[#21262d] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#e6edf3] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calculator size={14} /> Referensi Cepat LR+
                </p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { range: "> 10",  label: "Kuat",         color: "#3fb950" },
                    { range: "5–10",  label: "Sedang",        color: "#d29922" },
                    { range: "2–5",   label: "Lemah",         color: "#f78166" },
                    { range: "≈ 1",   label: "Tidak berguna", color: "#6e7681" },
                  ].map((r) => (
                    <div key={r.range} className="flex flex-col items-center">
                      <span className="text-sm font-mono font-bold" style={{ color: r.color }}>{r.range}</span>
                      <span className="text-xs text-[#c9d1d9] mt-0.5">{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insight */}
              <div className="bg-[#388bfd]/10 border border-[#388bfd]/20 rounded-xl p-4 text-center">
                <p className="text-[#79b8ff] font-medium text-sm">
                  {lrRes.postProb < 20
                    ? `Probabilitas post-test sangat rendah (${lrRes.postProb.toFixed(1)}%) — LR+ ini tidak cukup mengubah keputusan klinis. Prevalensi terlalu rendah.`
                    : lrRes.postProb < 50
                    ? `Probabilitas post-test ${lrRes.postProb.toFixed(1)}% — diagnosis belum meyakinkan. Pertimbangkan tes konfirmasi.`
                    : lrRes.postProb < 80
                    ? `Probabilitas post-test ${lrRes.postProb.toFixed(1)}% — tes cukup informatif. Mulai pertimbangkan penanganan.`
                    : `Probabilitas post-test ${lrRes.postProb.toFixed(1)}% — diagnosis sangat mungkin. Lanjut ke tatalaksana.`}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


