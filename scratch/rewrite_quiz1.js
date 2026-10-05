const fs = require('fs');

let content = fs.readFileSync('src/components/Quiz1Summary.tsx', 'utf8');

// 1. Add import
if (!content.includes("AccordionSection")) {
  content = content.replace(
    "import { Bookmark, BarChart3, Settings2 } from 'lucide-react';",
    "import { Bookmark, BarChart3, Settings2 } from 'lucide-react';\nimport { AccordionSection } from './AccordionSection';"
  );
}

// 2. Section 1
content = content.replace(
  `      {/* 1. Skenario */}
      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">
          UGD yang Tidak Bisa Mengukur Waktu Tunggunya Sendiri
        </h4>`,
  `      {/* 1. Skenario */}
      <AccordionSection title="UGD yang Tidak Bisa Mengukur Waktu Tunggunya Sendiri">`
).replace(
  `        </p>
      </div>

      {/* 2. Definisi */}`,
  `        </p>
      </AccordionSection>

      {/* 2. Definisi */}`
);

// 3. Section 2
content = content.replace(
  `      {/* 2. Definisi */}
      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-3 leading-snug">Tiga Cara Menemukan &quot;Nilai Tengah&quot;</h4>`,
  `      {/* 2. Definisi */}
      <AccordionSection title='Tiga Cara Menemukan "Nilai Tengah"'>`
).replace(
  `            </div>
          ))}
        </div>
      </div>

      {/* 3. Standar Deviasi */}`,
  `            </div>
          ))}
        </div>
      </AccordionSection>

      {/* 3. Standar Deviasi */}`
);

// 4. Section 3
content = content.replace(
  `      {/* 3. Standar Deviasi */}
      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-4 leading-snug">Mengapa &quot;Sebaran&quot; Bisa Menyelamatkan Nyawa</h4>`,
  `      {/* 3. Standar Deviasi */}
      <AccordionSection title='Mengapa "Sebaran" Bisa Menyelamatkan Nyawa'>`
).replace(
  `        <p>Itulah yang ditangkap oleh standar deviasi — konsistensi efek obat.</p>
      </div>

      {/* 4. Grid SD & IQR */}`,
  `        <p>Itulah yang ditangkap oleh standar deviasi — konsistensi efek obat.</p>
      </AccordionSection>

      {/* 4. Grid SD & IQR */}`
);

// 5. Section 4
content = content.replace(
  `      {/* 4. Grid SD & IQR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Standar Deviasi (s)",`,
  `      {/* 4. Grid SD & IQR */}
      <AccordionSection title="Standar Deviasi vs IQR">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Standar Deviasi (s)",`
).replace(
  `            <p className="text-slate-700 leading-relaxed text-sm">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* 5. Bentuk Distribusi */}`,
  `            <p className="text-slate-700 leading-relaxed text-sm">{c.desc}</p>
          </div>
        ))}
        </div>
      </AccordionSection>

      {/* 5. Bentuk Distribusi */}`
);

// 6. Section 5
content = content.replace(
  `      {/* 5. Bentuk Distribusi */}
      <div>
        <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-3 leading-snug">Membaca Bentuk Penyakit</h4>`,
  `      {/* 5. Bentuk Distribusi */}
      <AccordionSection title="Membaca Bentuk Penyakit">`
).replace(
  `          Aturan klinisnya: jika seseorang menyebut mean untuk data miring, curigai. Tanyakan mediannya.
        </p>
      </div>

      {/* 6. Rangkuman */}`,
  `          Aturan klinisnya: jika seseorang menyebut mean untuk data miring, curigai. Tanyakan mediannya.
        </p>
      </AccordionSection>

      {/* 6. Rangkuman */}`
);

// 7. Section 6
content = content.replace(
  `      {/* 6. Rangkuman */}
      <div className="bg-slate-50/80 border border-slate-300 p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark size={20} className="text-blue-600" />
          <h4 className="text-lg font-semibold text-slate-900">Rangkuman untuk Ujian</h4>
        </div>`,
  `      {/* 6. Rangkuman */}
      <AccordionSection title={<div className="flex items-center gap-2"><Bookmark size={20} className="text-blue-600" /><span>Rangkuman untuk Ujian</span></div>}>`
).replace(
  `        </ul>
      </div>

      {/* 7. Eksplorasi Interaktif */}`,
  `        </ul>
      </AccordionSection>

      {/* 7. Eksplorasi Interaktif */}`
);

fs.writeFileSync('src/components/Quiz1Summary.tsx', content, 'utf8');
console.log('Quiz1Summary updated');
