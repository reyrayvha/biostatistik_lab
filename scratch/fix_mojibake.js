const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git' && file !== 'scratch') {
        results = results.concat(walk(full));
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.json') || file.endsWith('.css') || file.endsWith('.md')) {
      results.push(full);
    }
  });
  return results;
}

const replacements = [
  // Mojibake patterns resulting from UTF-8 read as Windows-1252/ISO-8859-1 and saved as UTF-8
  { from: /â€”/g, to: ' — ' },       // em dash (or ' - ')
  { from: /â€“/g, to: ' – ' },       // en dash
  { from: /â€™/g, to: "'" },         // right single quote / apostrophe
  { from: /â€˜/g, to: "'" },         // left single quote
  { from: /â€œ/g, to: '"' },         // left double quote
  { from: /â€\x9d/g, to: '"' },      // right double quote
  { from: /â€/g, to: '—' },          // fallback em dash / quote
  { from: /â€¢/g, to: '•' },         // bullet
  { from: /â†’/g, to: '→' },         // right arrow
  { from: /â†/g, to: '←' },          // left arrow
  { from: /â‰ /g, to: '≠' },         // not equal
  { from: /âˆ’/g, to: '−' },         // minus
  { from: /âˆž/g, to: '∞' },         // infinity
  { from: /â‰¥/g, to: '≥' },         // greater or equal
  { from: /â‰¤/g, to: '≤' },         // less or equal
  { from: /â‰ˆ/g, to: '≈' },         // approx
  { from: /Î²/g, to: 'β' },          // beta
  { from: /Î±/g, to: 'α' },          // alpha
  { from: /Î¼/g, to: 'μ' },          // mu
  { from: /Ïƒ/g, to: 'σ' },          // sigma
  { from: /âœ”/g, to: '✔' },         // check
  { from: /âœ–/g, to: '✖' },         // cross
  { from: /âœ/g, to: '✓' }           // check
];

const files = walk(path.resolve(__dirname, '..'));

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const r of replacements) {
    if (r.from.test(content)) {
      content = content.replace(r.from, r.to);
      changed = true;
    }
  }

  // Also clean up any double spaces that might have been introduced by dash replacements
  if (changed) {
    // Specifically fix Quiz panel title format e.g. `Quiz ${quizId} - ${quiz.title}`
    content = content.replace(/`Quiz \${quizId}  ?—?  ?\${quiz\.title}`/g, '`Quiz ${quizId} – ${quiz.title}`');
    content = content.replace(/Quiz \${quizId} — \${quiz\.title}/g, 'Quiz ${quizId} – ${quiz.title}');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed mojibake in:', filePath);
  }
});
