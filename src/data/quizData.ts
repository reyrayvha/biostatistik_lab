// Cetakan untuk struktur Soal
export type Question = {
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
};

// Cetakan untuk struktur Kuis
export type Quiz = {
    quizId: number;
    title: string;
    summary: string;
    quote?: string; // Tempat quote/pesan refleksi setelah kuis selesai
    questions: Question[];
};

// Data utama yang akan dipanggil oleh UI
export const quizData: Quiz[] = [
    {
        quizId: 1,
        title: "Statistik Deskriptif",
        summary: "[DUMMY] Ini adalah area rangkuman materi Statistik Deskriptif. Mahasiswa akan membaca bagian ini untuk recall pengetahuan sebelum menekan tombol mulai kuis.",
        quote: "Angka yang Anda hitung barusan menyelamatkan satu nyawa. Itulah sebaik-baiknya amal (Itqan).",
        questions: [
            {
                id: 1,
                text: "Dataset usia pasien memiliki mean 65 dan median 58. Apa yang ditunjukkan ini?",
                options: ["Miring kiri", "Miring kanan", "Simetris", "Bimodal"],
                correctAnswer: "Miring kanan"
            },
            {
                id: 2,
                text: "Dalam distribusi miring kanan dari biaya RS, mana yang paling mewakili tagihan 'tipikal'?",
                options: ["Mean", "Median", "Modus", "Standar Deviasi"],
                correctAnswer: "Median"
            },
            {
                id: 3,
                text: "Jika setiap sistolik pasien naik 10 mmHg, apa yang terjadi pada standar deviasi?",
                options: ["Naik 10", "Berlipat ganda", "Tetap sama", "Turun 10"],
                correctAnswer: "Tetap sama"
            },
            {
                id: 4,
                text: "Nilai: 10, 12, 12, 14, 50. Mana yang paling terpengaruh pencilan?",
                options: ["Median", "Modus", "Mean", "IQR"],
                correctAnswer: "Mean"
            },
            {
                id: 5,
                text: "Obat A: mean penurunan LDL, SD=5. Obat B: mean sama, SD=20. Mana lebih bisa diprediksi?",
                options: ["Obat A", "Obat B", "Sama", "Tidak bisa ditentukan"],
                correctAnswer: "Obat A"
            }
        ]
    },
    {
        quizId: 2,
        title: "Distribusi",
        summary: "[DUMMY] Area rangkuman materi Distribusi...",
        quote: "Angka yang Anda hitung barusan menyelamatkan satu nyawa. Itulah sebaik-baiknya amal (Itqan).",
        questions: [
            {
                id: 1,
                text: "Berapa persen nilai yang berada dalam ±2σ pada distribusi normal?",
                options: ["68%", "90%", "95%", "99.7%"],
                correctAnswer: "95%"
            },
            {
                id: 2,
                text: "Referensi hemoglobin: mean=14, SD=1. Pasien punya 11 g/dL. Berapa SD di bawah?",
                options: ["1", "2", "3", "4"],
                correctAnswer: "3"
            },
            {
                id: 3,
                text: "Mana yang BUKAN sifat distribusi normal?",
                options: ["Mean = Median = Modus", "Didefinisikan oleh nilai μ dan σ", "Selalu miring kanan", "Luas di bawah kurva = 1"],
                correctAnswer: "Selalu miring kanan"
            },
            {
                id: 4,
                text: "Saat ukuran sampel meningkat, distribusi sampling mean menjadi lebih normal. Ini disebut:",
                options: ["Hukum Bilangan Besar", "Teorema Limit Pusat", "Teorema Bayes", "Regresi ke Mean"],
                correctAnswer: "Teorema Limit Pusat"
            },
            {
                id: 5,
                text: "Menaikkan σ dengan μ tetap membuat kurva:",
                options: ["Lebih tinggi dan sempit", "Lebih pendek dan lebar", "Bergeser ke kanan", "Lebih miring"],
                correctAnswer: "Lebih pendek dan lebar"
            }
        ]
    },
    {
        quizId: 3,
        title: "Probabilitas dan Bayes",
        summary: "[DUMMY] Area rangkuman materi Probabilitas...",
        quote: "Angka yang Anda hitung barusan menyelamatkan satu nyawa. Itulah sebaik-baiknya amal (Itqan).",
        questions: [
            {
                id: 1,
                text: "Tes: sensitivitas 99%, spesifisitas 99%. Prevalensi: 1%. Perkiraan NPP?",
                options: ["99%", "90%", "50%", "33%"],
                correctAnswer: "50%"
            },
            {
                id: 2,
                text: "Teorema Bayes menghubungkan probabilitas pre-test ke post-test menggunakan:",
                options: ["Sensitivitas dan spesifisitas", "Rasio kemungkinan", "A dan B keduanya bisa", "Standar deviasi dan kuartil"],
                correctAnswer: "A dan B keduanya bisa"
            },
            {
                id: 3,
                text: "Prevalensi 5%, LR+ = 10. Probabilitas post-test setelah tes positif?",
                options: ["15%", "34%", "50%", "90%"],
                correctAnswer: "34%"
            },
            {
                id: 4,
                text: "Skenario mana yang memberikan NPP TERTINGGI?",
                options: ["Prevalensi tinggi + spesifisitas tinggi", "Prevalensi rendah + spesifisitas tinggi", "Prevalensi rendah + spesifisitas tinggi", "Prevalensi tinggi + spesifisitas rendah"],
                correctAnswer: "Prevalensi tinggi + spesifisitas tinggi"
            },
            {
                id: 5,
                text: "Dua kejadian independen, masing-masing P = 0,1. P(keduanya terjadi)?",
                options: ["0.2", "0.1", "0.01", "0.02"],
                correctAnswer: "0.01"
            }
        ]
    },
    {
        quizId: 4,
        title: "Uji Hipotesis",
        summary: "[DUMMY] Area rangkuman materi Uji Hipotesis...",
        quote: "Angka yang Anda hitung barusan menyelamatkan satu nyawa. Itulah sebaik-baiknya amal (Itqan).",
        questions: [
            {
                id: 1,
                text: "Sebuah studi melaporkan p = 0,03. Ini berarti:",
                options: ["3% Kemungkinan Ho benar", "3% Kemungkinan hasil ini jika Ho benar", "Obat bekerja dengan 97% kepastian", "Ukuran efek besar"],
                correctAnswer: "3% Kemungkinan hasil ini jika Ho benar"
            },
            {
                id: 2,
                text: "Gagal menolak H₀ padahal obat benar-benar bekerja adalah:",
                options: ["Kesalahan Tipe I", "Kesalahan Tipe II", "Keputusan benar", "Kesalahan power"],
                correctAnswer: "Kesalahan Tipe II"
            },
            {
                id: 3,
                text: "Mana yang MENINGKATKAN power statistik?",
                options: ["Mengurangi n", "Menggunakan α = 0.01 bukan 0.05", "Menambah n", "Mengurangi ukuran efek"],
                correctAnswer: "Menambah n"
            },
            {
                id: 4,
                text: "Perbedaan TD 0,5 mmHg, p = 0,001, n = 50.000. Ini adalah:",
                options: ["Signifikan secara klinis", "Signifikan secara statistik tapi tidak signifikan secara klinis", "Kesalahan Tipe I", "Kesalahan Tipe II"],
                correctAnswer: "Signifikan secara statistik tapi tidak signifikan secara klinis"
            },
            {
                id: 5,
                text: "α = 0,05, 20 tes independen. Jumlah positif palsu yang diharapkan?",
                options: ["0", "1", "5", "20"],
                correctAnswer: "1"
            }
        ]
    },
    {
        quizId: 5,
        title: "Tes Diagnostik",
        summary: "[DUMMY] Area rangkuman materi Tes Diagnostik...",
        quote: "Angka yang Anda hitung barusan menyelamatkan satu nyawa. Itulah sebaik-baiknya amal (Itqan).",
        questions: [
            {
                id: 1,
                text: "Sensitivitas 100% + hasil negatif berarti:",
                options: ["Pasien punya penyakit", "Pasien tidak punya penyakit", "Tes tidak andal", "Perlu info lebih"],
                correctAnswer: "Pasien tidak punya penyakit"
            },
            {
                id: 2,
                text: "Mana yang paling berguna untuk menegakkan diagnosis?",
                options: ["Sensitivitas tinggi", "Spesifisitas tinggi", "NPN tinggi", "NPP tinggi"],
                correctAnswer: "Spesifisitas tinggi"
            },
            {
                id: 3,
                text: "LR = 1,0 berarti:",
                options: ["Tes sempurna", "Tidak ada informasi diagnostik", "Pasien punya penyakit", "Sensitivitas 100% dan spesifisitas 100%"],
                correctAnswer: "Tidak ada informasi diagnostik"
            },
            {
                id: 4,
                text: "Menaikkan prevalensi akan:",
                options: ["↑ NPP, ↓ NPN", "↓ keduanya", "↑ Keduanya", "Tidak berpengaruh"],
                correctAnswer: "↑ NPP, ↓ NPN"
            },
            {
                id: 5,
                text: "Kurva ROC memplot:",
                options: ["NPP vs NPN", "Sensitivitas vs (1-Spesifisitas)", "Power vs α", "Insidensi vs prevalensi"],
                correctAnswer: "Sensitivitas vs (1-Spesifisitas)"
            }
        ]
    },
    {
        quizId: 6,
        title: "Desain Studi",
        summary: "[DUMMY] Area rangkuman materi Desain Studi...",
        quote: "Angka yang Anda hitung barusan menyelamatkan satu nyawa. Itulah sebaik-baiknya amal (Itqan).",
        questions: [
            {
                id: 1,
                text: "Bukti TERKUAT untuk kausalitas?",
                options: ["Kasus-kontrol", "Kohort", "RCT", "Potong lintang"],
                correctAnswer: "RCT"
            },
            {
                id: 2,
                text: "Ukuran asosiasi pada studi kasus-kontrol:",
                options: ["Risiko relatif", "Odds Ratio", "Risiko Atribut", "Laju Insidensi"],
                correctAnswer: "Odds Ratio"
            },
            {
                id: 3,
                text: "Kanker terdeteksi 3 tahun lebih awal, pasien meninggal di usia sama:",
                options: ["Selection bias", "Recall bias", "Lead-time bias", "Length-time bias"],
                correctAnswer: "Lead-time bias"
            },
            {
                id: 4,
                text: "Ibu dari anak yang terkena dampak mengingat lebih banyak penggunaan obat:",
                options: ["Lead-time bias", "Selection bias", "Recall bias", "Efek Hawthorne"],
                correctAnswer: "Recall bias"
            },
            {
                id: 5,
                text: "Kopi → kanker paru, tapi peminum kopi lebih banyak merokok. Merokok adalah:",
                options: ["Effect modifier", "Perancu", "Mediator", "Collider"],
                correctAnswer: "Perancu"
            }
        ]
    },
    {
        quizId: 7,
        title: "Ujian Akhir - NUMi",
        summary: "[DUMMY] Area rangkuman materi persiapan Ujian Akhir (NUMi). Ujian ini mencakup keseluruhan materi dari Kuis 1 hingga 6.",
        quote: "Selamat telah menyelesaikan perjalanan belajar. Jadilah tenaga medis yang berilmu dan berdedikasi tinggi!",
        questions: [
            {
                id: 1,
                text: "p = 0,04, 95% CI: −2 sampai +8 mmHg. Interpretasi:",
                options: ["Obat berhasil", "CI bertentangan dengan p-value", "Tidak ada efek bermakna klinis yang terkonfirmasi", "Obat tidak berhasil"],
                correctAnswer: "Tidak ada efek bermakna klinis yang terkonfirmasi"
            },
            {
                id: 2,
                text: "Statin baru: LDL ↓5 mg/dL, p=0,0001, n=50.000:",
                options: ["Sangat efektif", "Signifikan statistik tapi tidak klinis", "Kesalahan Tipe I", "Harus menggantikan standar perawatan"],
                correctAnswer: "Signifikan statistik tapi tidak klinis"
            },
            {
                id: 3,
                text: "Hasil pemeriksaan indeks massa tubuh (IMT) seorang pasien menunjukkan Z-score 1,5. Interpretasi yang tepat adalah:",
                options: ["1.5 SD diatas mean", "1.5 SD dibawah mean", "Di persentil ke-15", "Di bawah 95% nilai"],
                correctAnswer: "1.5 SD diatas mean"
            },
            {
                id: 4,
                text: "Sebuah penelitian obat antihipertensi memiliki statistical power sebesar 60%. Pernyataan ini berarti:",
                options: ["60% peluang menemukan efek nyata", "40% kesalahan Tipe I", "60% tingkat kepercayaan", "60% sampel memadai", "Ada 60% kemungkinan penelitian gagal menemukan efek nyata"],
                correctAnswer: "60% peluang menemukan efek nyata"
            },
            {
                id: 5,
                text: "Prevalensi adalah:",
                options: ["Kasus baru/tahun", "Kasus yang ada/populasi pada satu titik waktu", "Laju perkembangan", "Insidensi kumulatif"],
                correctAnswer: "Kasus yang ada/populasi pada satu titik waktu"
            },
            {
                id: 6,
                text: "Sensitivitas 95%, spesifisitas 80%. Mana yang benar?",
                options: ["5% pasien sakit terlewat", "20% orang sehat tes positif", "A dan B keduanya", "Tidak keduanya benar"],
                correctAnswer: "A dan B keduanya"
            },
            {
                id: 7,
                text: "Waktu tunggu UGD: 5, 10, 15, 15, 20, 120 menit. Ringkasan terbaik:",
                options: ["Mean = 30.8", "Median = 15", "Modus = 15", "SD"],
                correctAnswer: "Median = 15"
            },
            {
                id: 8,
                text: "Dalam suatu penelitian klinis, 5 endpoint diuji secara bersamaan dengan alpha=0,05. Peluang terjadinya minimal satu false positive adalah:",
                options: ["5%", "10%", "23%", "50%"],
                correctAnswer: "23%"
            },
            {
                id: 9,
                text: "95% CI = [2,3; 8,7] untuk perbedaan mean. Interpretasi yang benar:",
                options: ["95% pasien dalam rentang ini", "95% yakin perbedaan sebenarnya dalam rentang", "95% probabilitas mean ada di sini", "p > 0.05"],
                correctAnswer: "95% yakin perbedaan sebenarnya dalam rentang"
            },
            {
                id: 10,
                text: "NNH = 200 berarti:",
                options: ["200 pasien dirugikan", "1 dari 200 yang diobati mengalami efek samping", "Terlalu berbahaya", "Risiko absolut 2%"],
                correctAnswer: "1 dari 200 yang diobati mengalami efek samping"
            },
            {
                id: 11,
                text: "ARR = 2%, NNT = 50 berarti:",
                options: ["Penurunan risiko relatif 2%", "Obati 50 agar 1 dapat manfaat", "50% mendapat manfaat", "Efikasi 2% / 50"],
                correctAnswer: "Obati 50 agar 1 dapat manfaat"
            },
            {
                id: 12,
                text: "Spesifisitas dihitung sebagai:",
                options: ["PB / (PB+NP)", "NB / (NB+PP)", "PB / (PB+PP)", "NB / (NB+NP)"],
                correctAnswer: "NB / (NB+PP)"
            },
            {
                id: 13,
                text: "LR+ = 15, prob pre-test = 10%. Probabilitas post-test setelah positif:",
                options: ["15%", "40%", "63%", "90%"],
                correctAnswer: "63%"
            },
            {
                id: 14,
                text: "Skrining mendeteksi kanker 2 tahun lebih awal. Ketahanan 5 tahun membaik tapi usia kematian tidak berubah:",
                options: ["Manfaat nyata", "Lead-time bias", "Length-time bias", "Selection bias"],
                correctAnswer: "Lead-time bias"
            },
            {
                id: 15,
                text: "TD diukur sebelum dan sesudah pada pasien YANG SAMA. Gunakan:",
                options: ["Uji-t independen", "Uji-t berpasangan", "Chi-square", "ANOVA"],
                correctAnswer: "Uji-t berpasangan"
            },
            {
                id: 16,
                text: "IMT: μ=25, σ=4. Berapa % populasi dengan IMT di atas 33?",
                options: ["2.5%", "5%", "16%", "0.15%"],
                correctAnswer: "2.5%"
            },
            {
                id: 17,
                text: "Tes HIV (sens/spes 99,5%), prevalensi 0,1%. NPP ≈:",
                options: ["95%", "67%", "17%", "50%"],
                correctAnswer: "17%"
            },
            {
                id: 18,
                text: "Studi kasus-kontrol untuk cacat lahir langka tepat karena:",
                options: ["Menegakkan kausalitas", "Menghitung insidensi", "Efisien mempelajari outcome langka", "Menghilangkan recall bias"],
                correctAnswer: "Efisien mempelajari outcome langka"
            },
            {
                id: 19,
                text: "10K perokok, 10K bukan perokok. 200 vs 20 kena kanker paru. RR:",
                options: ["10", "100", "0.1", "180"],
                correctAnswer: "10"
            },
            {
                id: 20,
                text: "Lebar 95% confidence interval pada hasil penelitian dapat meningkat (melebar) apabila:",
                options: ["↑ ukuran sampel", "↓ variasi", "↓ ukuran sampel", "↑ α ke 0.10"],
                correctAnswer: "↓ ukuran sampel"
            }
        ]
    }
];