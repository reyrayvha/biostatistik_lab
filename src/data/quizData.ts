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
                text: "[DUMMY] Contoh soal Biostatistik nomor 1?",
                options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
                correctAnswer: "Opsi A"
            },
            {
                id: 2,
                text: "[DUMMY] Contoh soal Biostatistik nomor 2?",
                options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
                correctAnswer: "Opsi B"
            },
            {
                id: 3,
                text: "[DUMMY] Contoh soal Biostatistik nomor 3?",
                options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
                correctAnswer: "Opsi C"
            },
            {
                id: 4,
                text: "[DUMMY] Contoh soal Biostatistik nomor 4?",
                options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
                correctAnswer: "Opsi D"
            },
            {
                id: 5,
                text: "[DUMMY] Contoh soal Biostatistik nomor 5?",
                options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
                correctAnswer: "Opsi A"
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
                text: "[DUMMY] Soal distribusi nomor 1?",
                options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
                correctAnswer: "Opsi A"
            }
            // Nanti tinggal copy-paste block soal di atas sampai ada 5 soal
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