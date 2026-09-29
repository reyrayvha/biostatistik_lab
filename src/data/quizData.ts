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
        quote: "Ketepatan dalam memahami distribusi data adalah kunci diagnosis yang tepat.",
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
        quote: "Di balik setiap probabilitas medis, ada ikhtiar dan doa untuk kesembuhan pasien.",
        questions: []
    },
    {
        quizId: 4,
        title: "Uji Hipotesis",
        summary: "[DUMMY] Area rangkuman materi Uji Hipotesis...",
        quote: "Kebenaran ilmiah dibangun atas dasar pengujian yang teliti dan integritas tinggi.",
        questions: []
    },
    {
        quizId: 5,
        title: "Tes Diagnostik",
        summary: "[DUMMY] Area rangkuman materi Tes Diagnostik...",
        quote: "Sensitivitas dan spesifisitas bukan sekadar angka, melainkan kepastian langkah klinis.",
        questions: []
    },
    {
        quizId: 6,
        title: "Desain Studi",
        summary: "[DUMMY] Area rangkuman materi Desain Studi...",
        quote: "Metodologi yang kokoh melahirkan bukti medis yang bermanfaat bagi kemanusiaan.",
        questions: []
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