const fs = require('fs');

const path = 'c:\\\\Projects\\\\Client\\\\biostatistik-lab\\\\biostatistik-lab\\\\src\\\\components\\\\MateriDistribusi.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { Bookmark } from 'lucide-react';",
  `import { Bookmark, ChevronDown } from 'lucide-react';

const AccordionSection = ({ title, children, defaultOpen = false }: { title: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) => {
  return (
    <details className="group border border-slate-200 rounded-xl bg-white shadow-sm [&_summary::-webkit-details-marker]:hidden" open={defaultOpen}>
      <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 md:p-6 text-slate-900 font-bold text-lg md:text-xl leading-snug">
        {title}
        <ChevronDown className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" />
      </summary>
      <div className="p-4 pt-0 md:p-6 md:pt-0">
        {children}
      </div>
    </details>
  );
};`
);

content = content.replace(
  `      <div>
        <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-2 md:mb-4 leading-snug">
          Hasil Lab yang Membuat Mahasiswa Kedokteran Panik
        </h3>`,
  `      <AccordionSection title={<span className="text-blue-600">Hasil Lab yang Membuat Mahasiswa Kedokteran Panik</span>}>`
).replace(
  `        </p>
      </div>

      {/* 2. Kurva Lonceng */}`,
  `        </p>
      </AccordionSection>

      {/* 2. Kurva Lonceng */}`
);

content = content.replace(
  `      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">
          Kurva Lonceng — Tempat Sebagian Besar Kedokteran Berada
        </h4>`,
  `      <AccordionSection title="Kurva Lonceng — Tempat Sebagian Besar Kedokteran Berada">`
).replace(
  `            </div>
          ))}
        </div>
      </div>

      {/* 3. Aturan 68-95-99.7 */}`,
  `            </div>
          ))}
        </div>
      </AccordionSection>

      {/* 3. Aturan 68-95-99.7 */}`
);

content = content.replace(
  `      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">
          Aturan yang Akan Kamu Gunakan Setiap Hari: 68-95-99,7
        </h4>`,
  `      <AccordionSection title="Aturan yang Akan Kamu Gunakan Setiap Hari: 68-95-99,7">`
).replace(
  `        </p>
      </div>

      {/* 4. Z-Score */}`,
  `        </p>
      </AccordionSection>

      {/* 4. Z-Score */}`
);

content = content.replace(
  `      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">Z-Score: Penerjemah Universal</h4>`,
  `      <AccordionSection title="Z-Score: Penerjemah Universal">`
).replace(
  `        </p>
      </div>

      {/* 5. TLP */}`,
  `        </p>
      </AccordionSection>

      {/* 5. TLP */}`
);

content = content.replace(
  `      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">
          Mengapa Statistik Benar-Benar Bekerja: Teorema Limit Pusat
        </h4>`,
  `      <AccordionSection title="Mengapa Statistik Benar-Benar Bekerja: Teorema Limit Pusat">`
).replace(
  `          </p>
        </div>
      </div>

      {/* 6. Rangkuman */}`,
  `          </p>
        </div>
      </AccordionSection>

      {/* 6. Rangkuman */}`
);

content = content.replace(
  `      <div className="bg-slate-50/80 border border-slate-200 p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark size={20} className="text-blue-600" />
          <h4 className="text-lg font-semibold text-slate-900">Rangkuman untuk Ujian</h4>
        </div>`,
  `      <AccordionSection title={<div className="flex items-center gap-2"><Bookmark size={20} className="text-blue-600" /><span>Rangkuman untuk Ujian</span></div>}>`
).replace(
  `        </ul>
      </div>

      {/* 7. Interaktif */}`,
  `        </ul>
      </AccordionSection>

      {/* 7. Interaktif */}`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
