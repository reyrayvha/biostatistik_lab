const fs = require('fs');

const path = './src/components/Leaderboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// Container
content = content.replace(/bg-slate-900/g, 'bg-slate-50');
content = content.replace(/text-slate-300/g, 'text-slate-700');

// Typography
content = content.replace(/text-white/g, 'text-slate-800');
content = content.replace(/text-slate-200/g, 'text-slate-800');
content = content.replace(/text-slate-400/g, 'text-slate-500');

// Cards & Panel
content = content.replace(/bg-slate-800\/50/g, 'bg-white shadow-sm');
content = content.replace(/bg-slate-800\/80/g, 'bg-slate-100');
content = content.replace(/bg-slate-800\/90/g, 'bg-slate-50');
content = content.replace(/bg-slate-800/g, 'bg-white');
content = content.replace(/bg-slate-900\/50/g, 'bg-slate-50');

content = content.replace(/border-slate-700\/50/g, 'border-slate-200');
content = content.replace(/border-slate-700\/30/g, 'border-slate-200');
content = content.replace(/border-slate-700/g, 'border-slate-200');
content = content.replace(/border-slate-600\/50/g, 'border-slate-200');
content = content.replace(/divide-slate-700\/50/g, 'divide-slate-200');

// Colors
content = content.replace(/text-indigo-400/g, 'text-blue-600');
content = content.replace(/text-indigo-500/g, 'text-blue-600');
content = content.replace(/bg-indigo-500\/20/g, 'bg-blue-50');
content = content.replace(/text-indigo-300/g, 'text-blue-700');
content = content.replace(/border-indigo-500\/30/g, 'border-blue-200');

content = content.replace(/bg-emerald-500\/20/g, 'bg-emerald-50');
content = content.replace(/text-emerald-400/g, 'text-emerald-700');
content = content.replace(/border-emerald-500\/30/g, 'border-emerald-200');
content = content.replace(/bg-emerald-500\/10/g, 'bg-emerald-50');
content = content.replace(/border-emerald-500\/30/g, 'border-emerald-200');

content = content.replace(/bg-rose-500\/10/g, 'bg-rose-50');
content = content.replace(/text-rose-400/g, 'text-rose-600');
content = content.replace(/border-rose-500\/30/g, 'border-rose-200');
content = content.replace(/bg-rose-600\/20/g, 'bg-red-50');
content = content.replace(/border-rose-500/g, 'border-red-200');

// Hovers & Actions
content = content.replace(/hover:bg-slate-700\/30/g, 'hover:bg-slate-50');
content = content.replace(/bg-slate-700\/50/g, 'bg-slate-100'); // for smaller buttons
content = content.replace(/hover:bg-slate-600\/60/g, 'hover:bg-slate-200');
content = content.replace(/hover:bg-slate-700/g, 'hover:bg-slate-100');
content = content.replace(/bg-slate-700/g, 'bg-slate-100');

content = content.replace(/backdrop-blur-md/g, ''); // Light theme usually relies less on strong blur
content = content.replace(/shadow-2xl/g, 'shadow-md');

fs.writeFileSync(path, content, 'utf8');
console.log('Leaderboard updated');
