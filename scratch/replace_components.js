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
  content = content.replace(/text-indigo-300/g, 'text-blue-700');
  content = content.replace(/border-indigo-500\/30/g, 'border-blue-200');
  content = content.replace(/bg-indigo-600/g, 'bg-blue-600');
  content = content.replace(/hover:bg-indigo-500/g, 'hover:bg-blue-700');

  // Emerald -> Green
  content = content.replace(/bg-emerald-500\/20/g, 'bg-green-50');
  content = content.replace(/text-emerald-400/g, 'text-green-700');
  content = content.replace(/border-emerald-500\/30/g, 'border-green-200');
  content = content.replace(/bg-emerald-500\/10/g, 'bg-green-50');

  // Rose -> Red
  content = content.replace(/bg-rose-500\/10/g, 'bg-red-50');
  content = content.replace(/text-rose-400/g, 'text-red-600');
  content = content.replace(/border-rose-500\/30/g, 'border-red-200');
  content = content.replace(/bg-rose-600\/20/g, 'bg-red-50');
  content = content.replace(/border-rose-500/g, 'border-red-200');
  
  content = content.replace(/bg-slate-700\/50/g, 'bg-slate-100');
  content = content.replace(/bg-slate-700/g, 'bg-slate-100');

  fs.writeFileSync(path, content, 'utf8');
  console.log(path + ' updated');
}

applyLight('./src/components/QuizPanel.tsx');
applyLight('./src/components/TabNavigation.tsx');
applyLight('./src/components/IdentityForm.tsx');
applyLight('./src/components/QuizPlaceholder.tsx');
