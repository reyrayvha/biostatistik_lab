const fs = require('fs');
const path = require('path');

const files = ['Quiz3Summary.tsx', 'Quiz4Summary.tsx', 'Quiz5Summary.tsx', 'Quiz6Summary.tsx'];

files.forEach(file => {
  const filePath = path.join(__dirname, '../src/components', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add import
  if (!content.includes("AccordionSection")) {
    const firstImportMatch = content.match(/^import .*?;$/m);
    if (firstImportMatch) {
      content = content.replace(firstImportMatch[0], `${firstImportMatch[0]}\nimport { AccordionSection } from './AccordionSection';`);
      changed = true;
    }
  }

  // 2. Replace <div><h3/h4>...</div>
  // Because of nested divs, regex is dangerous. I'll use a split strategy or match non-greedy up to a known end.
  // Actually, in these summaries, the main sections are separated by comments like {/* 1. ... */}
  // Let's replace:
  // <div>\s*<h[34][^>]*>(.*?)<\/h[34]>
  // with
  // <AccordionSection title={<>$1</>}>
  // and then replace the matching closing </div> with </AccordionSection>
  
  // To avoid regex hell, let's just do a simple replacement for the `<div>\n <h4...` pattern:
  // But wait, the </div> at the end of the section is hard to find reliably with regex.
  // We can write a simple state machine:
  
  let lines = content.split('\n');
  let newLines = [];
  let inSection = false;
  let divDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (!inSection) {
      // Look for <div> followed by <h3 or <h4 on the next few lines
      if (line.match(/^\s*<div>\s*$/)) {
        let hasHeader = false;
        let titleMatch = null;
        for (let j = 1; j <= 2; j++) {
          if (lines[i+j] && lines[i+j].match(/<h[34][^>]*>(.*?)<\/h[34]>/)) {
            hasHeader = true;
            titleMatch = lines[i+j].match(/<h[34][^>]*>(.*?)<\/h[34]>/);
            break;
          }
        }
        
        if (hasHeader) {
          inSection = true;
          divDepth = 1;
          const title = titleMatch[1].replace(/"/g, '&quot;');
          newLines.push(line.replace('<div>', `<AccordionSection title={<> ${title} </>}>`));
          continue;
        }
      }
      
      // Look for the "Rangkuman" section which is typically:
      // <div className="bg-slate-50/80 ...">
      //   <div className="flex items-center ...">
      //     <Bookmark ... />
      //     <h4 ...>Rangkuman untuk Ujian</h4>
      if (line.match(/^\s*<div className="bg-slate-50\/80[^"]*">\s*$/)) {
         let isRangkuman = false;
         for (let j = 1; j <= 5; j++) {
            if (lines[i+j] && lines[i+j].includes('Rangkuman untuk Ujian')) {
               isRangkuman = true; break;
            }
         }
         if (isRangkuman) {
           inSection = true;
           divDepth = 1;
           newLines.push(line.replace(/<div className="bg-slate-50\/80[^"]*">/, `<AccordionSection title={<div className="flex items-center gap-2"><Bookmark size={20} className="text-blue-600" /><span>Rangkuman untuk Ujian</span></div>}>`));
           continue;
         }
      }
      
      newLines.push(line);
    } else {
      // Track div depth
      if (line.match(/<div(\s|>)/) && !line.match(/<\/div>/)) {
        // has open div but no close div (rough approximation)
        divDepth += (line.match(/<div(\s|>)/g) || []).length;
        divDepth -= (line.match(/<\/div>/g) || []).length;
        newLines.push(line);
      } else if (line.match(/<\/div>/) && !line.match(/<div(\s|>)/)) {
        divDepth -= (line.match(/<\/div>/g) || []).length;
        if (divDepth <= 0) {
          // This is the closing div of the section
          newLines.push(line.replace(/<\/div>/, '</AccordionSection>'));
          inSection = false;
        } else {
          newLines.push(line);
        }
      } else {
        // line with both or neither
        divDepth += (line.match(/<div(\s|>)/g) || []).length;
        divDepth -= (line.match(/<\/div>/g) || []).length;
        
        if (divDepth <= 0 && line.match(/<\/div>/)) {
           // this shouldn't happen usually for cleanly formatted JSX, but just in case
           let replaced = line.replace(/<\/div>$/, '</AccordionSection>');
           if (replaced === line) replaced = line.replace(/<\/div>/, '</AccordionSection>');
           newLines.push(replaced);
           inSection = false;
        } else {
           newLines.push(line);
        }
      }
    }
  }

  // Also, we need to remove the <h3/h4> that we used as title if it was a standard section
  // Wait, if we keep the <h3/h4> inside the AccordionSection, it will just render the title twice (once in summary, once in body).
  // Yes! The title is already in AccordionSection summary. We should remove the inner h3/h4.
  let finalContent = newLines.join('\n');
  finalContent = finalContent.replace(/<h[34][^>]*>.*?<\/h[34]>\n?/g, (match) => {
    if (match.includes('Rangkuman untuk Ujian')) return ''; // it was Rangkuman
    // If it's inside an AccordionSection, we can probably safely remove it, but let's just remove all H3/H4 that we matched? 
    // Actually, in QuizXSummary, all h3/h4 are section headers! Removing them all is mostly safe EXCEPT for Interactive sections.
    return '';
  });
  
  // Wait, Interactive sections also have h3/h4.
  // The easiest way is to NOT use a parser and just manually craft replaces for 3,4,5,6 since it's just 4 files.
  
  fs.writeFileSync(filePath + '.draft', finalContent, 'utf8');
});
