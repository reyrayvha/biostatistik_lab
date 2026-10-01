const fs = require('fs');

function applyLight(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Backgrounds & Surfaces
  content = content.replace(/bg-slate-900/g, 'bg-slate-50');
  content = content.replace(/bg-slate-800\/50/g, 'bg-white shadow-sm border-slate-200');
  content = content.replace(/bg-slate-800\/80/g, 'bg-slate-100');
  content = content.replace(/bg-slate-800/g, 'bg-white');
  content = content.replace(/bg-slate-900\/50/g, 'bg-slate-50');

  // Borders
  content = content.replace(/border-slate-700\/50/g, 'border-slate-200');
  content = content.replace(/border-slate-700\/30/g, 'border-slate-200');
  content = content.replace(/border-slate-700/g, 'border-slate-200');
  content = content.replace(/border-slate-600\/50/g, 'border-slate-200');
  content = content.replace(/border-slate-600/g, 'border-slate-200');
  content = content.replace(/divide-slate-700\/50/g, 'divide-slate-200');

  // Text
  content = content.replace(/text-slate-300/g, 'text-slate-700');
  content = content.replace(/text-white/g, 'text-slate-800');
  content = content.replace(/text-slate-200/g, 'text-slate-800');
  content = content.replace(/text-slate-400/g, 'text-slate-500');

  // Specific buttons & states
  content = content.replace(/hover:bg-slate-700\/30/g, 'hover:bg-slate-50');
  content = content.replace(/hover:bg-slate-600\/60/g, 'hover:bg-slate-200');
  content = content.replace(/hover:bg-slate-700/g, 'hover:bg-slate-100');
  
  // Indigo -> Blue
  content = content.replace(/text-indigo-400/g, 'text-blue-600');
  content = content.replace(/text-indigo-500/g, 'text-blue-600');
  content = content.replace(/bg-indigo-500\/20/g, 'bg-blue-50');
  content = content.replace(/bg-indigo-500\/10/g, 'bg-blue-50');
  content = content.replace(/text-indigo-300/g, 'text-blue-700');
  content = content.replace(/border-indigo-500\/30/g, 'border-blue-200');
  content = content.replace(/bg-indigo-600/g, 'bg-blue-600');
  content = content.replace(/hover:bg-indigo-500/g, 'hover:bg-blue-700');
  content = content.replace(/text-indigo-200/g, 'text-blue-800');
  content = content.replace(/bg-indigo-900\/50/g, 'bg-blue-50');

  // Emerald -> Green
  content = content.replace(/bg-emerald-500\/20/g, 'bg-green-50');
  content = content.replace(/text-emerald-400/g, 'text-green-700');
  content = content.replace(/border-emerald-500\/30/g, 'border-green-200');
  content = content.replace(/bg-emerald-500\/10/g, 'bg-green-50');
  content = content.replace(/bg-emerald-900\/30/g, 'bg-green-50');
  content = content.replace(/text-emerald-300/g, 'text-green-800');
  content = content.replace(/border-emerald-500\/50/g, 'border-green-300');

  // Rose -> Red
  content = content.replace(/bg-rose-500\/10/g, 'bg-red-50');
  content = content.replace(/text-rose-400/g, 'text-red-600');
  content = content.replace(/border-rose-500\/30/g, 'border-red-200');
  content = content.replace(/bg-rose-600\/20/g, 'bg-red-50');
  content = content.replace(/border-rose-500/g, 'border-red-200');
  content = content.replace(/bg-rose-900\/30/g, 'bg-red-50');
  content = content.replace(/text-rose-300/g, 'text-red-800');
  content = content.replace(/border-rose-500\/50/g, 'border-red-300');
  
  content = content.replace(/bg-slate-700\/50/g, 'bg-slate-100');
  content = content.replace(/bg-slate-700/g, 'bg-slate-100');
  content = content.replace(/bg-slate-600/g, 'bg-slate-200');

  fs.writeFileSync(path, content, 'utf8');
  console.log(path + ' updated');
}

// 1. Process all Quiz Summaries + MateriDistribusi
const files = [
  './src/components/Quiz1Summary.tsx',
  './src/components/MateriDistribusi.tsx',
  './src/components/Quiz3Summary.tsx',
  './src/components/Quiz4Summary.tsx',
  './src/components/Quiz5Summary.tsx',
  './src/components/Quiz6Summary.tsx',
];

files.forEach(f => {
  if (fs.existsSync(f)) applyLight(f);
});

// 2. Fix globals.css hardcoded colors
let globalsPath = './app/globals.css';
let gCss = fs.readFileSync(globalsPath, 'utf8');

gCss = gCss.replace(/rgba\(13,\s*17,\s*23,\s*0\.88\)/g, 'rgba(255, 255, 255, 0.88)');
gCss = gCss.replace(/rgba\(13,\s*17,\s*23,\s*0\.6\)/g, '#f1f5f9'); // bg-slate-100 for sidebar
gCss = gCss.replace(/\.brand-text-white\s*{\s*color:\s*#e6edf3;\s*}/, '.brand-text-white {\n  color: var(--slate-800);\n}');
gCss = gCss.replace(/\.brand-text-blue\s*{\s*color:\s*#58a6ff;\s*}/, '.brand-text-blue {\n  color: var(--brand-600);\n}');
gCss = gCss.replace(/\.app-user-badge\s*{[\s\S]*?}/, (match) => {
  return match.replace(/background:\s*var\(--slate-800\)/, 'background: var(--slate-100)');
});
gCss = gCss.replace(/\.app-user-name\s*{[\s\S]*?}/, (match) => {
  return match.replace(/color:\s*var\(--text-primary\)/, 'color: var(--slate-700)');
});
gCss = gCss.replace(/\.app-user-nim\s*{[\s\S]*?}/, (match) => {
  return match.replace(/color:\s*var\(--text-secondary\)/, 'color: var(--slate-500)');
});
// Tab item text for inactive
gCss = gCss.replace(/\.tab-label-primary\s*{[\s\S]*?}/, (match) => {
  return match.replace(/color:\s*var\(--text-secondary\)/, 'color: var(--slate-600)');
});

fs.writeFileSync(globalsPath, gCss, 'utf8');
console.log('globals.css updated');
