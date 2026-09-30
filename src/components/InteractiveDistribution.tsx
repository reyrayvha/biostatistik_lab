"use client";

import React, { useState, useMemo } from 'react';

// ---------------------------------------------------------------------------
// Math helpers
// ---------------------------------------------------------------------------

/** Standard normal PDF */
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/** Generate bell curve points in SVG-space */
function generateCurvePoints(
  svgWidth: number,
  svgHeight: number,
  padding: number,
  numPoints: number = 200
): { x: number; y: number }[] {
  const plotW = svgWidth - padding * 2;
  const plotH = svgHeight - padding * 2;
  const maxY = normalPDF(0); // peak of standard normal

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const z = -4 + t * 8; // z from -4 to +4
    const pdfVal = normalPDF(z);
    const px = padding + t * plotW;
    const py = padding + plotH - (pdfVal / maxY) * plotH * 0.92;
    points.push({ x: px, y: py });
  }
  return points;
}

/** Get the SVG x-coordinate for a given z-value */
function zToSvgX(z: number, svgWidth: number, padding: number): number {
  const plotW = svgWidth - padding * 2;
  const t = (z + 4) / 8; // map z ∈ [-4,4] → t ∈ [0,1]
  return padding + t * plotW;
}

// ---------------------------------------------------------------------------
// Sigma highlight configs
// ---------------------------------------------------------------------------

type SigmaKey = '1sigma' | '2sigma' | '3sigma';

const SIGMA_CONFIG: Record<SigmaKey, { z: number; pct: string; label: string }> = {
  '1sigma': { z: 1, pct: '68.2%', label: '±1σ → 68%' },
  '2sigma': { z: 2, pct: '95.4%', label: '±2σ → 95%' },
  '3sigma': { z: 3, pct: '99.7%', label: '±3σ → 99.7%' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function InteractiveDistribution() {
  const [mu, setMu] = useState(85);
  const [sigma, setSigma] = useState(28);
  const [highlight, setHighlight] = useState<SigmaKey>('1sigma');

  // SVG dimensions
  const SVG_W = 600;
  const SVG_H = 260;
  const PAD = 40;

  // Curve points (standard normal, independent of mu/sigma — labels change)
  const curvePoints = useMemo(() => generateCurvePoints(SVG_W, SVG_H, PAD), []);
  const curvePath = useMemo(() => {
    return curvePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  }, [curvePoints]);

  // Shaded area path for the selected sigma range
  const shadedPath = useMemo(() => {
    const { z } = SIGMA_CONFIG[highlight];
    const baseline = SVG_H - PAD;

    // Filter points within [-z, +z]
    const filtered = curvePoints.filter((_, i) => {
      const t = i / (curvePoints.length - 1);
      const zVal = -4 + t * 8;
      return zVal >= -z && zVal <= z;
    });

    if (filtered.length === 0) return '';

    const startX = filtered[0].x;
    const endX = filtered[filtered.length - 1].x;

    let d = `M${startX.toFixed(1)},${baseline}`;
    filtered.forEach(p => { d += ` L${p.x.toFixed(1)},${p.y.toFixed(1)}`; });
    d += ` L${endX.toFixed(1)},${baseline} Z`;

    return d;
  }, [highlight, curvePoints]);

  // Axis tick labels based on mu and sigma
  const axisTicks = useMemo(() => {
    const cfg = SIGMA_CONFIG[highlight];
    const ticks: { z: number; label: string }[] = [
      { z: -3, label: '-3σ' },
      { z: -2, label: '-2σ' },
      { z: -1, label: '-1σ' },
      { z: 0, label: `μ=${mu}` },
      { z: 1, label: '+1σ' },
      { z: 2, label: '+2σ' },
      { z: 3, label: '+3σ' },
    ];
    return ticks.map(t => ({
      ...t,
      x: zToSvgX(t.z, SVG_W, PAD),
      isInRange: Math.abs(t.z) <= cfg.z,
    }));
  }, [mu, sigma, highlight]);

  // Insight text
  const { z, pct } = SIGMA_CONFIG[highlight];
  const lowerBound = mu - z * sigma;
  const upperBound = mu + z * sigma;

  return (
    <div className="mt-8 bg-[#0d1117]/80 backdrop-blur-md border border-[#21262d] rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-[#161b22]/80 border-b border-[#21262d] p-4 flex items-center gap-3">
        <span className="text-lg">🧪</span>
        <span className="text-sm font-bold tracking-wider text-[#58a6ff] uppercase font-mono">
          Eksplorasi Interaktif
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Instruction box */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex items-center gap-3">
          <span className="shrink-0 px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase font-mono bg-[#388bfd]/15 text-[#58a6ff] border border-[#388bfd]/30 rounded-md">
            Coba Sendiri
          </span>
          <p className="text-sm text-[#e6edf3]">
            Atur <strong className="text-[#e6edf3]">μ</strong> (mean) dan{" "}
            <strong className="text-[#e6edf3]">σ</strong> (SD) untuk mengubah bentuk kurva.
            Pilih rentang ±1/2/3σ untuk melihat persentase populasi.
          </p>
        </div>

        {/* Sliders */}
        <div className="space-y-5">
          {/* μ slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#e6edf3]">μ (Mean)</span>
              <span className="text-sm font-mono font-bold text-[#58a6ff]">{mu}</span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              value={mu}
              onChange={e => setMu(Number(e.target.value))}
              className="w-full accent-[#58a6ff]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#484f58] mt-1">
              <span>0</span><span>50</span><span>100</span><span>150</span><span>200</span>
            </div>
          </div>

          {/* σ slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#e6edf3]">σ (Standar Deviasi)</span>
              <span className="text-sm font-mono font-bold text-[#58a6ff]">{sigma}</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={sigma}
              onChange={e => setSigma(Number(e.target.value))}
              className="w-full accent-[#58a6ff]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#484f58] mt-1">
              <span>1</span><span>13</span><span>25</span><span>38</span><span>50</span>
            </div>
          </div>
        </div>

        {/* Bell Curve SVG */}
        <div className="bg-[#0d1117]/60 border border-[#21262d] rounded-xl p-4 flex justify-center">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full max-w-[560px]"
            preserveAspectRatio="xMidYMid meet"
          >
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
            <line
              x1={PAD} y1={SVG_H - PAD} x2={SVG_W - PAD} y2={SVG_H - PAD}
              stroke="#30363d" strokeWidth="1"
            />

            {/* Shaded area */}
            {shadedPath && (
              <path
                d={shadedPath}
                fill="url(#shade-grad)"
                style={{ transition: 'all 0.3s ease' }}
              />
            )}

            {/* Curve line */}
            <path
              d={curvePath}
              fill="none"
              stroke="url(#curve-stroke)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Sigma boundary lines */}
            {[-z, z].map(zVal => {
              const sx = zToSvgX(zVal, SVG_W, PAD);
              return (
                <line
                  key={zVal}
                  x1={sx} y1={PAD} x2={sx} y2={SVG_H - PAD}
                  stroke="#58a6ff"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  opacity="0.5"
                />
              );
            })}

            {/* Mean line */}
            <line
              x1={zToSvgX(0, SVG_W, PAD)} y1={PAD}
              x2={zToSvgX(0, SVG_W, PAD)} y2={SVG_H - PAD}
              stroke="#58a6ff"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.7"
            />



            {/* Axis ticks */}
            {axisTicks.map((tick, idx) => (
              <g key={idx}>
                <line
                  x1={tick.x} y1={SVG_H - PAD}
                  x2={tick.x} y2={SVG_H - PAD + 6}
                  stroke={tick.isInRange ? '#58a6ff' : '#484f58'}
                  strokeWidth="1"
                />
                <text
                  x={tick.x}
                  y={SVG_H - PAD + 20}
                  textAnchor="middle"
                  fill={tick.isInRange ? '#c9d1d9' : '#484f58'}
                  fontSize="10"
                  fontFamily="var(--font-mono), monospace"
                  fontWeight={tick.z === 0 ? '700' : '400'}
                >
                  {tick.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Sigma toggle buttons */}
        <div className="flex items-center justify-center gap-3">
          {(Object.keys(SIGMA_CONFIG) as SigmaKey[]).map(key => {
            const isActive = highlight === key;
            return (
              <button
                key={key}
                onClick={() => setHighlight(key)}
                className={`px-5 py-2 text-sm font-mono font-semibold rounded-full transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#388bfd]/20 text-[#58a6ff] border-[#388bfd]/40 shadow-[0_0_14px_rgba(56,139,253,0.25)]'
                    : 'bg-[#21262d] text-[#e6edf3] border-[#30363d] hover:bg-[#30363d] hover:text-[#e6edf3]'
                }`}
              >
                {SIGMA_CONFIG[key].label}
              </button>
            );
          })}
        </div>

        {/* Insight box */}
        <div className="bg-[#388bfd]/8 border border-[#388bfd]/20 rounded-xl p-4 flex items-start gap-3">
          <span className="shrink-0 mt-0.5 text-[#58a6ff]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </span>
          <p className="text-sm text-[#e6edf3] leading-relaxed">
            <strong className="text-[#58a6ff]">{pct}</strong> nilai berada di antara{" "}
            <strong className="font-mono">{lowerBound}</strong> dan{" "}
            <strong className="font-mono">{upperBound}</strong>.
            {highlight === '1sigma' && (
              <> Melampaui ±2σ = <span className="text-[#58a6ff] font-semibold">&apos;abnormal&apos;</span> di banyak tes lab.</>
            )}
            {highlight === '2sigma' && (
              <> Dasar untuk CI 95%.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

