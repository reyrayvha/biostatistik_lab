const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/components');
const files = [
  'Quiz1Summary.tsx',
  'MateriDistribusi.tsx',
  'Quiz3Summary.tsx',
  'Quiz4Summary.tsx',
  'Quiz5Summary.tsx',
  'Quiz6Summary.tsx'
];

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import if not exists
  if (!content.includes('AccordionSection')) {
    content = content.replace(
      "import { Bookmark",
      "import { AccordionSection } from './AccordionSection';\nimport { Bookmark"
    );
    // If there was no Bookmark import, find the first import and add it after
    if (!content.includes("import { AccordionSection }")) {
       const firstImport = content.match(/import .*?;/);
       if (firstImport) {
         content = content.replace(firstImport[0], `${firstImport[0]}\nimport { AccordionSection } from './AccordionSection';`);
       }
    }
  }

  // Remove inline AccordionSection from MateriDistribusi if it exists
  if (file === 'MateriDistribusi.tsx' && content.includes('const AccordionSection =')) {
    content = content.replace(/import \{ Bookmark, ChevronDown \} from 'lucide-react';[\s\S]*?<\/details>\s*\);\s*};/, "import { Bookmark } from 'lucide-react';\nimport { AccordionSection } from './AccordionSection';");
  }

  // Replace <div> headers with AccordionSection
  // We look for <div>\s*<h[34][^>]*>(.*?)<\/h[34]>
  // We need to match the outer div... This is hard with regex. 
  // Let's do it manually for each known section? 
  // Wait, I can use a simpler approach. If I find `<div>\s*<h4 className="[^\"]*">(.*?)</h4>`, I can't just regex the end of `</div>`.
  
  // A safer approach: I can replace the start tag `<div>` with `<AccordionSection title={...}>`
  // But wait, it's easier to write a small parser.
});
