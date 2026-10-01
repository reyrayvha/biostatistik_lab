# SMART-MATH MEDICS
Platform Pembelajaran Interaktif Biostatistik untuk Mahasiswa Kedokteran.

## 🚀 Fitur Utama
* **Form Registrasi Identitas**: Pendaftaran sesi menggunakan Nama, NIM, dan Angkatan.
* **Sistem Pembelajaran Bertahap (Sequential Learning)**: 7 modul kuis (Statistik, Distribusi, Probabilitas, Uji Hipotesis, Diagnostik, Desain Studi, Ujian Akhir) yang harus diselesaikan secara berurutan.
* **Kuis Interaktif & Instant Feedback**: Langsung mengetahui benar/salah setelah menjawab beserta kunci jawaban.
* **Papan Skor Global (Leaderboard NUMi) Real-Time**: 
  - Sinkronisasi data nilai secara langsung antar perangkat.
  - Tampilan responsif (tabel untuk desktop, *card view* untuk *mobile*).
* **Mode Dosen (Admin)**: 
  - Dilengkapi PIN rahasia untuk akses khusus.
  - Fitur melihat detail jawaban semua mahasiswa (privasi mahasiswa terjaga dari pengguna biasa).
  - Fitur *Export* data ke format Microsoft Excel (`.xlsx`).
  - Fitur Hapus/Reset semua data nilai.

## 💻 Teknologi (Tech Stack)
* **Frontend Framework**: Next.js (App Router), React, TypeScript.
* **Styling & UI**: Tailwind CSS, CSS Variables, Lucide React (Icons).
* **State Management**: Zustand.
* **Backend & Database**: Supabase (PostgreSQL, *Real-time channels*).
* **Utilities**: `xlsx` (Excel Export).

## 🛠️ Cara Menjalankan Aplikasi

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   Buat file `.env.local` di folder *root* dan masukkan URL serta anon key Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Jalankan Server Development**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser Anda untuk melihat hasilnya.