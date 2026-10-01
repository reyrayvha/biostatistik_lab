const fs = require('fs');
const path = require('path');

const dir = './src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const hexMap = {
    '#161b22': 'var(--slate-50)',
    '#1c2129': 'var(--slate-100)',
    '#30363d': 'var(--slate-200)',
    '#58a6ff': 'var(--brand-600)',
    '#e6edf3': 'var(--slate-700)',
    '#f0f6fc': 'var(--slate-900)',
    '#c9d1d9': 'var(--slate-600)',
    '#8b949e': 'var(--slate-500)',
    '#388bfd': 'var(--brand-500)',
    '#21262d': 'var(--slate-100)',
    '#0d1117': 'var(--bg-body)',
  };

  // Replace background and borders
  content = content.replace(/bg-\[#161b22\]/gi, 'bg-slate-50');
  content = content.replace(/bg-\[#1c2129\]/gi, 'bg-slate-100');
  content = content.replace(/bg-\[#21262d\]/gi, 'bg-slate-100');
  content = content.replace(/border-\[#30363d\]/gi, 'border-slate-200');
  
  // Replace texts
  content = content.replace(/text-\[#58a6ff\]/gi, 'text-blue-600');
  content = content.replace(/text-\[#388bfd\]/gi, 'text-blue-600');
  content = content.replace(/text-\[#e6edf3\]/gi, 'text-slate-700');
  content = content.replace(/text-\[#f0f6fc\]/gi, 'text-slate-900');
  content = content.replace(/text-\[#c9d1d9\]/gi, 'text-slate-600');
  content = content.replace(/text-\[#8b949e\]/gi, 'text-slate-500');
  
  // Also inline styles if any
  content = content.replace(/#161b22/gi, '#f8fafc'); // slate-50
  content = content.replace(/#1c2129/gi, '#f1f5f9'); // slate-100
  content = content.replace(/#30363d/gi, '#e2e8f0'); // slate-200
  content = content.replace(/#e6edf3/gi, '#334155'); // slate-700
  content = content.replace(/#f0f6fc/gi, '#0f172a'); // slate-900
  content = content.replace(/#c9d1d9/gi, '#475569'); // slate-600
  content = content.replace(/#8b949e/gi, '#64748b'); // slate-500
  content = content.replace(/#58a6ff/gi, '#2563eb'); // blue-600
  
  // Also check standard tailwind dark classes that might have been missed
  content = content.replace(/text-slate-200/g, 'text-slate-800');
  content = content.replace(/text-slate-300/g, 'text-slate-700');
  content = content.replace(/text-slate-400/g, 'text-slate-600');
  
  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
