"use client";

import React, { useState, useMemo } from "react";
import { Bookmark, FlaskConical } from "lucide-react";

export default function Quiz5Summary() {
  const [sens, setSens] = useState(95);
  const [spec, setSpec] = useState(90);
  const [prev, setPrev] = useState(10);

  const {
    tPosDPos,
    tPosDNeg,
    tNegDPos,
    tNegDNeg,
    totalDPos,
    totalDNeg,
    totalTPos,
    totalTNeg,
    total,
    ppv,
    npv,
    lrPlus,
    lrMinus
  } = useMemo(() => {
    const totalPop = 1000;
    const dPos = Math.round(totalPop * (prev / 100));
    const dNeg = totalPop - dPos;

    const tp = Math.round(dPos * (sens / 100));
    const fn = dPos - tp;

    const tn = Math.round(dNeg * (spec / 100));
    const fp = dNeg - tn;

    const tPos = tp + fp;
    const tNeg = fn + tn;

    const ppvVal = tPos > 0 ? (tp / tPos) * 100 : 0;
    const npvVal = tNeg > 0 ? (tn / tNeg) * 100 : 0;

    const sensRatio = sens / 100;
    const specRatio = spec / 100;

    const lrP = specRatio === 1 ? Infinity : sensRatio / (1 - specRatio);
    const lrM = specRatio === 0 ? Infinity : (1 - sensRatio) / specRatio;

    return {
      tPosDPos: tp,
      tPosDNeg: fp,
      tNegDPos: fn,
      tNegDNeg: tn,
      totalDPos: dPos,
      totalDNeg: dNeg,
      totalTPos: tPos,
      totalTNeg: tNeg,
      total: totalPop,
      ppv: ppvVal,
      npv: npvVal,
      lrPlus: lrP,
      lrMinus: lrM
    };
  }, [sens, spec, prev]);

  return (
    <div className="flex flex-col gap-10 text-[#e6edf3] font-sans" style={{ fontSize: '1.05rem', lineHeight: '1.85' }}>
      
      {/* 1. Skenario */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-4">
          Tes Rapid Strep yang Mengubah Diagnosis
        </h4>
        <p className="mb-4">
          Klinik Jumat sore. Anak 7 tahun: sakit tenggorokan, demam, tonsil bengkak. Gambaran strep klasik. Tes rapid strep — negatif.
        </p>
        <p className="mb-4">
          Apakah kamu mempercayainya?
        </p>
        <p className="mb-4">
          Dokter seniormu: &quot;Berapa sensitivitasnya?&quot; Kamu mencari: sekitar 85%. Artinya dari 100 anak yang benar-benar punya strep, tes ini melewatkan 15. Dengan presentasi seklasik ini — probabilitas pre-test mungkin 60-70% — hasil negatif dari tes dengan sensitivitas 85% seharusnya tidak membuatmu yakin.
        </p>
        <p className="mb-4">
          Dia memesan kultur tenggorokan dan memulai antibiotik empiris. Tiga hari kemudian, kultur kembali positif.
        </p>
        <p>
          Inilah mengapa kamu perlu memahami karakteristik tes — bukan hanya &quot;positif&quot; atau &quot;negatif,&quot; tapi apa arti hasil itu untuk PASIEN INI.
        </p>
      </div>

      {/* 2. Sensitivitas */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-3">Sensitivitas: Penjaga yang Memasukkan Semua Orang</h4>
        <p className="mb-4">
          Bayangkan penjaga pintu yang tugasnya menangkap setiap VIP (pasien sakit). Sensitivitas tinggi = menangkap hampir semua VIP, tapi tidak sengaja memasukkan beberapa orang biasa juga (positif palsu). Dia lebih memilih memasukkan berlebihan daripada melewatkan orang penting.
        </p>
        <p className="mb-4">
          Sensitivitas = PB / (PB + NP) — dari semua yang sakit, berapa banyak yang tertangkap tes?
        </p>
        <p className="mb-4">
          Sensitivitas 95% = 5% pasien sakit terlewat (tingkat negatif palsu).
        </p>
        <p className="mb-2">
          Ketika sensitivitas tinggi dan tes NEGATIF &rarr; kamu bisa menyingkirkan penyakit.<br/>
          Trik memori: SNout — Sensitif, Negatif, singkirkan (rules OUT).
        </p>
        <p>
          Penggunaan: tes skrining. Melewatkan kanker lebih buruk dari alarm palsu.
        </p>
      </div>

      {/* 3. Spesifisitas */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-3">Spesifisitas: Penjaga yang Menghalangi Penipu</h4>
        <p className="mb-4">
          Penjaga berbeda. Prioritasnya: mencegah non-VIP masuk. Dia tidak pernah membiarkan orang biasa lewat — tapi kadang tanpa sengaja memblokir VIP asli (negatif palsu).
        </p>
        <p className="mb-4">
          Spesifisitas = NB / (NB + PP) — dari semua yang sehat, berapa yang teridentifikasi dengan benar?
        </p>
        <p className="mb-4">
          Spesifisitas 95% = 5% orang sehat mendapat hasil positif palsu.
        </p>
        <p className="mb-2">
          Ketika spesifisitas tinggi dan tes POSITIF &rarr; kamu bisa menegakkan diagnosis.<br/>
          Trik memori: SpIn — Spesifik, Positif, tegakkan (rules IN).
        </p>
        <p>
          Penggunaan: tes konfirmasi. Kamu akan memulai kemo — kamu perlu yakin.
        </p>
      </div>

      {/* 4. Prevalensi */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-3">Jebakan Prevalensi</h4>
        <p className="mb-4">
          Tes rapid strep punya sensitivitas dan spesifisitas yang sama di mana-mana — angka itu melekat pada tesnya. Tapi NPP dan NPN berubah tergantung DI MANA kamu menggunakannya.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li>Klinik pediatri kaya strep (prevalensi 30%): rapid strep positif kemungkinan benar.</li>
          <li>Skrining wellness pada mahasiswa sehat (prevalensi 1%): kebanyakan positif adalah alarm palsu.</li>
        </ul>
        <p>
          Tes sama. Akurasi sama. Arti yang sama sekali berbeda. Inilah mengapa dokter UGD berpikir berbeda tentang troponin positif pada pria 65 tahun yang mencengkram dadanya vs. pelari maraton 22 tahun.
        </p>
      </div>

      {/* 5. Likelihood Ratio */}
      <div>
        <h4 className="text-2xl font-bold tracking-tight text-[#f0f6fc] mb-3">Rasio Kemungkinan: Berpikir Seperti Dokter Senior</h4>
        <p className="mb-4">
          LR menangkap seberapa besar tes mengubah pikiranmu:
        </p>
        <ul className="list-none mb-4 space-y-2">
          <li>LR+ = Sensitivitas / (1 - Spesifisitas) &rarr; &quot;Seberapa lebih mungkin positif ini pada orang sakit vs. sehat?&quot;</li>
          <li>LR- = (1 - Sensitivitas) / Spesifisitas &rarr; &quot;Seberapa kurang mungkin negatif ini pada orang sakit vs. sehat?&quot;</li>
        </ul>
        <ul className="list-none mb-4 space-y-1">
          <li>LR+ &gt; 10 &rarr; bukti kuat UNTUK penyakit</li>
          <li>LR+ 5-10 &rarr; pergeseran sedang</li>
          <li>LR = 1 &rarr; tes tidak berguna</li>
          <li>LR- &lt; 0,1 &rarr; bukti kuat MELAWAN penyakit</li>
        </ul>
        <p>
          Keindahannya: LR tidak berubah dengan prevalensi, jadi bisa dipakai di setting klinis manapun.
        </p>
      </div>

      {/* Rangkuman */}
      <div className="bg-[#161b22]/80 border border-[#30363d] p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark size={20} className="text-[#58a6ff]" />
          <h4 className="text-lg font-semibold text-[#f0f6fc]">Rangkuman untuk Ujian</h4>
        </div>
        <ul className="space-y-2.5 text-[#e6edf3]">
          <li>• Sensitivitas &amp; spesifisitas = intrinsik pada tes. Tidak berubah dengan prevalensi.</li>
          <li>• NPP &amp; NPN = bergantung pada populasi. Berubah drastis dengan prevalensi.</li>
          <li>• SNout: Sensitif + Negatif &rarr; Singkirkan. SpIn: Spesifik + Positif &rarr; Tegakkan.</li>
          <li>• Tes sensitif untuk skrining, tes spesifik untuk konfirmasi.</li>
          <li>• LR+ &gt; 10 = kuat menegakkan. LR- &lt; 0,1 = kuat menyingkirkan.</li>
          <li>• ROC AUC: 0,5 = tidak berguna, 1,0 = sempurna.</li>
        </ul>
      </div>

      {/* Eksplorasi Interaktif */}
      <div className="mt-8 bg-[#0d1117]/80 backdrop-blur-md border border-[#21262d] rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-[#161b22]/80 border-b border-[#21262d] p-4 flex items-center gap-3">
          <span className="text-lg">🧪</span>
          <span className="text-sm font-bold tracking-wider text-[#58a6ff] uppercase font-mono">
            Eksplorasi Interaktif
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Controls */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#e6edf3]">Sensitivitas: {sens}%</span>
              </div>
              <input type="range" min={50} max={100} step={1} value={sens}
                onChange={(e) => setSens(parseInt(e.target.value))}
                className="w-full accent-[#58a6ff]" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#e6edf3]">Spesifisitas: {spec}%</span>
              </div>
              <input type="range" min={50} max={100} step={1} value={spec}
                onChange={(e) => setSpec(parseInt(e.target.value))}
                className="w-full accent-[#58a6ff]" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#e6edf3]">Prevalensi: {prev}%</span>
              </div>
              <input type="range" min={1} max={50} step={1} value={prev}
                onChange={(e) => setPrev(parseInt(e.target.value))}
                className="w-full accent-[#58a6ff]" />
            </div>
          </div>

          {/* 2x2 Table */}
          <div className="border border-[#30363d] rounded-xl overflow-hidden bg-[#161b22] text-sm text-center">
            <div className="grid grid-cols-4 border-b border-[#30363d] text-[#8b949e] font-mono uppercase text-xs">
              <div className="p-3 bg-[#0d1117]"></div>
              <div className="p-3 bg-[#0d1117] border-l border-[#30363d]">D+</div>
              <div className="p-3 bg-[#0d1117] border-l border-[#30363d]">D-</div>
              <div className="p-3 bg-[#0d1117] border-l border-[#30363d]">Total</div>
            </div>
            <div className="grid grid-cols-4 border-b border-[#30363d]">
              <div className="p-3 text-[#8b949e] font-mono bg-[#0d1117]">T+</div>
              <div className="p-3 font-mono text-[#3fb950] border-l border-[#30363d] bg-[#3fb950]/10">{tPosDPos}</div>
              <div className="p-3 font-mono text-[#f85149] border-l border-[#30363d] bg-[#f85149]/10">{tPosDNeg}</div>
              <div className="p-3 font-mono border-l border-[#30363d] text-[#e6edf3]">{totalTPos}</div>
            </div>
            <div className="grid grid-cols-4 border-b border-[#30363d]">
              <div className="p-3 text-[#8b949e] font-mono bg-[#0d1117]">T-</div>
              <div className="p-3 font-mono text-[#f85149] border-l border-[#30363d] bg-[#f85149]/10">{tNegDPos}</div>
              <div className="p-3 font-mono text-[#3fb950] border-l border-[#30363d] bg-[#3fb950]/10">{tNegDNeg}</div>
              <div className="p-3 font-mono border-l border-[#30363d] text-[#e6edf3]">{totalTNeg}</div>
            </div>
            <div className="grid grid-cols-4 bg-[#0d1117] font-bold">
              <div className="p-3 text-[#e6edf3]">Total</div>
              <div className="p-3 font-mono text-[#58a6ff] border-l border-[#30363d]">{totalDPos}</div>
              <div className="p-3 font-mono text-[#58a6ff] border-l border-[#30363d]">{totalDNeg}</div>
              <div className="p-3 font-mono border-l border-[#30363d] text-[#e6edf3]">{total}</div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-[#8b949e] text-[10px] font-bold uppercase tracking-widest mb-1">PPV</span>
              <span className="text-xl font-mono font-bold text-[#58a6ff]">
                {ppv.toFixed(1)}%
              </span>
            </div>
            
            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-[#8b949e] text-[10px] font-bold uppercase tracking-widest mb-1">NPV</span>
              <span className="text-xl font-mono font-bold text-[#3fb950]">
                {npv.toFixed(1)}%
              </span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-[#8b949e] text-[10px] font-bold uppercase tracking-widest mb-1">LR+</span>
              <span className="text-xl font-mono font-bold text-[#d29922]">
                {lrPlus === Infinity ? "∞" : lrPlus.toFixed(1)}
              </span>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-[#8b949e] text-[10px] font-bold uppercase tracking-widest mb-1">LR-</span>
              <span className="text-xl font-mono font-bold text-[#f85149]">
                {lrMinus.toFixed(3)}
              </span>
            </div>
          </div>

          <div className="bg-[#161b22]/50 border border-[#30363d] rounded-lg p-3 text-xs font-mono text-[#8b949e] leading-relaxed">
            Mnemonik:<br/>
            SpIn = Spesifik + Positif &rarr; tegakkan diagnosis<br/>
            SNout = Sensitif + Negatif &rarr; singkirkan diagnosis
          </div>
        </div>
      </div>
    </div>
  );
}
