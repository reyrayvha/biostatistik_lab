# 📚 Dokumentasi & Codebase Walkthrough: Biostatistik Lab

Dokumen ini dirancang sebagai panduan komprehensif bagi Anda untuk memahami seluk-beluk arsitektur dan kode aplikasi ini. Gunakan dokumen ini sebagai bahan referensi utama saat melakukan presentasi atau serah terima (handover) ke developer lain.

---

## 1. Tech Stack & Arsitektur 🛠️

Aplikasi ini dibangun menggunakan arsitektur modern yang memisahkan tampilan (Frontend) dan layanan data (BaaS). Berikut adalah teknologi utama yang digunakan:

*   **Next.js (App Router)**: Berfungsi sebagai *framework* utama aplikasi React kita. Next.js mengurus *routing* halaman (di folder `app/`) dan proses *rendering*. Pada proyek ini, ia bertindak memastikan performa aplikasi cepat dan siap untuk produksi (production-ready).
*   **Tailwind CSS**: Kerangka kerja CSS berbasis *utility*. Alih-alih membuat file CSS besar, kita memberikan kelas-kelas kecil (seperti `flex`, `text-center`, `bg-blue-500`) langsung di dalam komponen (React). Ini sangat mempercepat proses *styling* UI dan memastikan desain tetap konsisten (serta responsif di layar HP).
*   **Zustand**: *State management* lokal pengganti Redux yang sangat ringan. Digunakan untuk melacak "status aplikasi saat ini" tanpa menyentuh database, seperti: menyimpan data nama/NIM yang sedang *login*, jawaban kuis sementara, dan riwayat navigasi tab.
*   **Supabase (Backend-as-a-Service)**: Inilah pondasi data aplikasi kita. Supabase berfungsi sebagai **pengganti backend tradisional**. Daripada kita harus menulis *server* Node.js/Express, membuat *endpoint* REST API, mengatur koneksi ke database SQL, dan mengurus *hosting* server, Supabase memberikan semuanya secara langsung (Out-of-the-Box). 
    *   **Perannya:** Kita bisa melakukan *Query* database PostgreSQL (seperti `SELECT`, `INSERT`) langsung dari kode Frontend (Next.js/React) secara aman menggunakan *library* `supabase-js`. Ia juga mengurus Realtime WebSocket untuk *update* papan skor.

---

## 2. Peta Struktur Folder & Fungsi File 📂

Berikut adalah gambaran besar (*Tree Diagram*) dari struktur folder proyek ini beserta penjelasan dari masing-masing file kunci:

```text
biostatistik-lab/
├── app/                  # (Sistem Routing Next.js App Router)
│   ├── layout.tsx        # HTML Wrapper utama aplikasi (Head, Font, Global Layout)
│   ├── page.tsx          # Halaman beranda utama yang me-render komponen <AppShell />
│   └── api/              
│       └── admin/        
│           └── route.ts  # API Endpoint Backend kecil untuk validasi PIN Admin/Dosen
│
├── src/                  # (Tempat disimpannya mayoritas kode logika)
│   ├── components/       # Komponen-komponen UI React yang bisa digunakan ulang
│   │   ├── AppShell.tsx       # Kerangka antarmuka utama (Sidebar, Header, Konten Utama)
│   │   ├── Leaderboard.tsx    # Menampilkan tabel skor dari database Supabase (Papan Skor)
│   │   ├── QuizPanel.tsx      # Komponen mesin utama untuk merender pertanyaan kuis
│   │   └── IdentityForm.tsx   # Form input identitas awal (Nama, NIM, Angkatan)
│   │
│   ├── lib/              # Konfigurasi utilitas dan SDK
│   │   └── supabaseClient.ts  # Menginisialisasi koneksi antara App dan Database Supabase
│   │
│   ├── store/            # State Management
│   │   └── useAppStore.ts     # Konfigurasi Zustand (Simpan State Login, Navigasi Tab, Skor Kuis Lokal)
│   │
│   └── data/             # Data statis
│       └── quizData.ts        # Kumpulan JSON / Array yang berisi bank soal-soal kuis
│
└── supabase_schema.sql   # Script SQL untuk membuat tabel di Supabase
```

**Penjelasan Singkat File Utama:**
*   **`src/lib/supabaseClient.ts`**: Ini adalah "Jembatan" antara aplikasi dan database. Di dalamnya terdapat fungsi untuk menghubungkan *URL* dan *API Key* Supabase. Setiap kali kita ingin membaca atau menyimpan data, kita harus mengimpor file ini.
*   **`src/components/Leaderboard.tsx`**: File ini bertugas mengambil data rekapitulasi nilai kuis (`quiz_attempts`) dari Supabase dan menampilkannya menjadi tabel. Di dalamnya juga terdapat mode 'Dosen/Admin' untuk menghapus data atau mengeskpor nilai ke Excel.
*   **`app/page.tsx`**: Ini adalah pintu masuk saat *user* membuka *website*. Sangat sederhana karena hanya memanggil (me-*render*) komponen `<AppShell />`.

---

## 3. Alur Data & State Management 🔄

Bagaimana aplikasi ini beroperasi dari awal *user* masuk hingga datanya tampil di Papan Skor?

**Alur Kerja (Data Flow):**
1.  **Inisialisasi**: Saat *user* membuka *web*, komponen `IdentityForm.tsx` muncul. Setelah *user* menginput Nama & NIM, datanya disimpan **secara lokal** di RAM browser menggunakan pustaka `Zustand` (`useAppStore`).
2.  **Mengerjakan Kuis**: *User* membuka tab kuis, komponen `QuizPanel.tsx` mengambil soal dari `quizData.ts`. Setiap *user* klik jawaban, status jawabannya (misal: "Soal 1 dijawab B") diperbarui secara lokal ke `useAppStore` di objek `currentAnswers`.
3.  **Submit & Sinkronisasi**: Saat kuis selesai (misal: Ujian Akhir disubmit), `QuizPanel.tsx` mengeksekusi perhitungan nilai. Lalu secara asinkron, menggunakan `supabaseClient`, kode akan menjalankan fungsi `UPSERT` (Update atau Insert) ke dalam tabel `students` dan `quiz_attempts` di Database Supabase.
4.  **Tampil di Papan Skor**: Saat ada *user* yang membuka tab Leaderboard, komponen `Leaderboard.tsx` akan melakukan operasi *fetch* (`SELECT`) semua data. Berkat integrasi Supabase, Papan Skor ini juga berlangganan (Subscribe) ke WebSockets `supabase.channel('public:quiz_attempts')`. Artinya, setiap kali ada orang lain di komputer berbeda yang menekan "Submit Kuis", tabel Leaderboard akan diperbarui **secara seketika (realtime)** di layar.

**Penggunaan React Hooks:**
Dalam proyek ini, React Hooks sangat krusial. Beberapa yang sering digunakan:
*   **`useState`**: Untuk manajemen status lokal di dalam satu komponen saja. Digunakan untuk mengecek apakah Modal sedang terbuka/tertutup, menyembunyikan/menampilkan *password* Admin, atau menyimpan indeks nomor soal yang sedang ditampilkan (misal: `currentIndex`).
*   **`useEffect`**: Ini adalah kait untuk menjalankan efek samping (sesuatu di luar fungsi komponen utama). Digunakan untuk:
    *   Memanggil data Papan Skor (fetch) pertama kali saat halaman dimuat.
    *   Berlangganan ke pembaruan realtime Supabase.
    *   Menggulir (Scroll) halaman otomatis ke atas saat berpindah halaman soal kuis.
*   **`useRef`**: Digunakan untuk menyimpan referensi langsung ke elemen HTML (DOM). Contohnya, untuk menjalankan fungsi geser (Scroll) otomatis ke kiri/kanan pada tabel *Leaderboard* tanpa me-render ulang UI.

---

## 4. Poin Penting untuk Presentasi (Talking Points) 🎙️

Berikut adalah kalimat-kalimat *"Nilai Jual"* teknis (Selling Points) yang bisa Anda gunakan saat presentasi untuk mengesankan penonton / developer lain:

1.  **"Aplikasi ini mengadopsi pola *Serverless* menggunakan Supabase."**
    *"Kami tidak lagi pusing mengurus infrastruktur *backend* atau memelihara *server*. Seluruh autentikasi, database PostgreSQL, dan API tersentralisasi dengan aman pada Supabase, yang sangat menekan biaya *server* dan *maintenance*."*
2.  **"Kami merancang State Management yang cerdas menggunakan pola *Hydration/Persist* (Zustand)."**
    *"Bahkan jika koneksi internet mahasiswa terputus di tengah ujian atau secara tidak sengaja me-refresh halaman (*reload browser*), jawaban sementara dan posisi kuis mereka tidak akan hilang karena statusnya telah diamankan di *Local Storage* secara persisten."*
3.  **"Papan Skor memiliki arsitektur *Realtime Event-Driven*."**
    *"Kami mengintegrasikan Supabase WebSockets di komponen *Leaderboard*. Begitu seorang mahasiswa menekan tombol submit (kapan pun dan di mana pun), papan skor di layar pengajar atau mahasiswa lain akan langsung berkedip dan diperbarui tanpa perlu memuat ulang (*refresh*) halaman web secara manual."*
4.  **"Untuk integritas ujian, kami mengimplementasikan *Seeded Randomization Engine* di Front-End."**
    *"Agar mahasiswa tidak saling contek urutan jawaban seperti (1:A, 2:B), sistem mengacak urutan soal kuis dengan cerdas berdasarkan algoritma *Hash* menggunakan 'NIM Mahasiswa' sebagai *seed*. Alhasil, urutan soal bagi NIM satu dan lainnya akan selalu berbeda, namun tetap stabil saat dia melakukan navigasi bolak-balik."*
