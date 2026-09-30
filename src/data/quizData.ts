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
                text: "[DUMMY] Soal Ujian Akhir nomor 1?",
                options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
                correctAnswer: "Opsi A"
            }
            // Nanti diisi sampai 20 soal
        ]
    }
];