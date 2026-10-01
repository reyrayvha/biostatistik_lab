# SMART-MATH MEDICS 🩺🧮
**Platform Pembelajaran Interaktif Biostatistik untuk Mahasiswa Kedokteran.**

SMART-MATH MEDICS adalah sebuah aplikasi web edukatif yang dirancang khusus untuk membantu mahasiswa kedokteran dalam mempelajari materi Biostatistik secara interaktif, bertahap, dan menyenangkan. Aplikasi ini menggabungkan sistem kuis berurutan dengan papan skor (leaderboard) yang *real-time*, sehingga memicu semangat kompetitif yang positif antar mahasiswa.

---

## 📖 Cara Penggunaan Aplikasi (Alur Pengguna)

### 🧑‍🎓 Untuk Mahasiswa
1. **Registrasi Identitas**: Saat pertama kali membuka aplikasi, mahasiswa diwajibkan mengisi **Nama Lengkap**, **NIM**, dan **Angkatan**.
2. **Mulai Belajar (Kuis Bertahap)**: Mahasiswa akan dihadapkan pada 7 modul kuis yang harus dikerjakan secara berurutan:
   - *Statistik Dasar, Distribusi, Probabilitas, Uji Hipotesis, Diagnostik, Desain Studi, Ujian Akhir*.
   - Kuis selanjutnya hanya akan terbuka jika kuis sebelumnya telah diselesaikan.
3. **Pengerjaan Kuis**: Setiap menjawab pertanyaan, mahasiswa akan langsung mengetahui apakah jawabannya Benar atau Salah, lengkap dengan pembahasan/kunci jawaban.
4. **Melihat Papan Skor (Leaderboard)**: Setelah menyelesaikan kuis (atau kapan saja melalui menu Leaderboard), mahasiswa dapat melihat peringkat mereka berdasarkan **Skor NUMi** (Nilai Ujian Mahasiswa Interaktif) yang dibandingkan dengan teman-teman lainnya secara *real-time*. Nilai detail tiap kuis akan disembunyikan (*Privasi Terjaga*) dari mahasiswa lain.

### 👨‍🏫 Untuk Dosen (Mode Admin)
1. **Akses Mode Dosen**: Dosen dapat masuk ke "Mode Admin" melalui tombol gembok minimalis yang berada di Leaderboard, lalu memasukkan PIN rahasia.
2. **Lihat Nilai Lengkap**: Dalam mode ini, dosen memiliki akses tak terbatas untuk melihat nilai detail dari setiap modul kuis yang dikerjakan oleh seluruh mahasiswa.
3. **Ekspor Data (Excel)**: Dosen dapat mengunduh seluruh rekap nilai mahasiswa ke dalam format Microsoft Excel (`.xlsx`) dengan satu klik.
4. **Kelola Data**: Dosen juga memiliki hak akses untuk menghapus/mereset semua data skor mahasiswa jika diperlukan (misalnya untuk kelas/angkatan baru).
5. **Logout Admin**: Dosen dapat keluar dari mode admin melalui tombol *Logout Dosen* di bagian atas layar agar aplikasi kembali ke tampilan standar mahasiswa.

---

## 🚀 Fitur Utama
* **Form Registrasi Identitas**: Pendaftaran sesi yang mudah.
* **Sistem Pembelajaran Bertahap (Sequential Learning)**: Modul pembelajaran yang terstruktur.
* **Instant Feedback**: Pembahasan otomatis setelah menjawab kuis.
* **Leaderboard NUMi Real-Time**: 
  - Sinkronisasi data otomatis antar perangkat.
  - Tampilan tabel yang nyaman untuk layar besar dengan fitur *scroll* dan kolom statis.
* **Dashboard Dosen (Admin)**: Sistem manajemen nilai eksklusif dengan fitur Ekspor Excel dan Reset Data.

---

## 💻 Teknologi (Tech Stack)
* **Frontend Framework**: Next.js (App Router), React, TypeScript.
* **Styling & UI**: Tailwind CSS, CSS Variables, Lucide React (Icons).
* **State Management**: Zustand (Penyimpanan state lokal).
* **Backend & Database**: Supabase (PostgreSQL, *Real-time channels* untuk papan skor).
* **Utilities**: `xlsx` (Untuk fitur *Export* Excel).

---

## 🛠️ Cara Instalasi & Menjalankan Aplikasi (Untuk Developer)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   Buat file `.env.local` di folder *root* (sejajar dengan file `package.json`) dan masukkan URL serta anon key Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Jalankan Server Development**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser Anda untuk melihat hasilnya.