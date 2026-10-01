const fs = require('fs');
const path = require('path');

const hexToLight = {
  '#0d1117': '#f8fafc', // slate-50
  '#161b22': '#ffffff', // white
  '#1c2129': '#f1f5f9', // slate-100
  '#21262d': '#f1f5f9', // slate-100
  '#30363d': '#e2e8f0', // slate-200
  '#484f58': '#94a3b8', // slate-400
  '#8b949e': '#64748b', // slate-500
  '#c9d1d9': '#475569', // slate-600
  '#e6edf3': '#1e293b', // slate-800
  '#f0f6fc': '#0f172a', // slate-900
  '#58a6ff': '#2563eb', // blue-600
  '#388bfd': '#3b82f6', // blue-500
};

const dir = './src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  Object.entries(hexToLight).forEach(([dark, light]) => {
    // Replace all occurrences of dark hex (case-insensitive)
    const regex = new RegExp(dark, 'gi');
    content = content.replace(regex, light);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

// Also replace in globals.css
let gCss = fs.readFileSync('./app/globals.css', 'utf8');
let origGCss = gCss;

gCss = gCss.replace(/rgba\(22,\s*27,\s*34,\s*0\.8\)/g, 'rgba(255, 255, 255, 0.9)'); // question-card bg
gCss = gCss.replace(/rgba\(240,\s*246,\s*252,\s*0\.06\)/g, 'rgba(0, 0, 0, 0.05)'); // border-top
gCss = gCss.replace(/rgba\(240,\s*246,\s*252,\s*0\.03\)/g, 'rgba(0, 0, 0, 0.02)');
gCss = gCss.replace(/rgba\(240,\s*246,\s*252,\s*0\.04\)/g, 'rgba(0, 0, 0, 0.03)');
gCss = gCss.replace(/rgba\(240,\s*246,\s*252,\s*0\.025\)/g, 'rgba(0, 0, 0, 0.02)');
gCss = gCss.replace(/rgba\(255,\s*255,\s*255,\s*0\.03\)/g, 'rgba(0, 0, 0, 0.05)');
gCss = gCss.replace(/rgba\(56,\s*139,\s*253,\s*0\.08\)/g, 'rgba(59, 130, 246, 0.1)');

if (gCss !== origGCss) {
  fs.writeFileSync('./app/globals.css', gCss, 'utf8');
  console.log('Updated globals.css');
}
