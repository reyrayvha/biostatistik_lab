# Biostatistik-Lab

## Deskripsi Proyek
Aplikasi web interaktif berbasis kuis yang dirancang khusus untuk mahasiswa kedokteran. Aplikasi ini memfasilitasi pembelajaran biostatistik melalui sistem kuis bertahap dengan validasi *real-time*, analitik hasil akhir (NUMi), dan *Leaderboard* interaktif yang bisa diekspor. Dirancang untuk menampung 30-50 mahasiswa secara bersamaan dalam satu sesi kelas.

## Arsitektur & Infrastruktur (Tech Stack)
- **Frontend:** Next.js (App Router) dengan React dan TailwindCSS.
- **Database (BaaS):** Supabase (Penting: Digunakan untuk menyimpan hasil kuis setiap user agar bisa ditampilkan secara global di Leaderboard tanpa membebani server).
- **Hosting:** Vercel (menjamin stabilitas saat diakses puluhan mahasiswa bersamaan).
- **Library Tambahan:** `lucide-react` (untuk icon), `xlsx` atau `exceljs` (untuk fitur ekspor Excel).

## Alur Aplikasi (Step Navigation)
Sistem menggunakan Tab Navigation yang **Strict/Terkunci**. User tidak bisa meloncati tab. Tab selanjutnya hanya terbuka jika tab saat ini sudah diselesaikan.
1. **Identitas**: Form input Nama, NIM, dan Angkatan.
2. **Quiz 1**: Statistik Deskriptif
3. **Quiz 2**: Distribusi
4. **Quiz 3**: Probabilitas dan Bayes
5. **Quiz 4**: Uji Hipotesis
6. **Quiz 5**: Tes Diagnostik
7. **Quiz 6**: Desain Studi
8. **Quiz 7 (Ujian Akhir)**: NUMi (Nilai Ujian Akhir)
9. **Leaderboard**: Papan Skor Global.

## Aturan Kuis & Pembelajaran
### Sebelum Kuis
- Tampilkan **Rangkuman Materi** untuk *recall* pengetahuan.
- Terdapat tombol "Mulai Kuis" setelah membaca.

### Sistem Soal & Kesempatan (Re-attempt)
- **Quiz 1 s/d 6**: Masing-masing 5 soal.
- **Quiz 7 (NUMi)**: 20 soal (gabungan urut dari materi kuis 1-6).
- **Batas Percobaan**: Maksimal **2 kali percobaan (re-attempt)** untuk setiap kuis (termasuk ujian akhir).

### Validasi Real-time
- Pilihan ganda menggunakan bentuk *Card*.
- Validasi langsung saat dipilih: **Benar = Hijau**, **Salah = Merah**.

### Post-Quiz (Setelah Kuis 1-6)
- Tampilkan skor kuis.
- Tampilkan 2 tombol: "Ulangi Kuis" (jika sisa attempt > 0) atau "Lanjut ke Kuis Selanjutnya".

## Spesifikasi Halaman Hasil NUMi (Ujian Akhir)
Struktur dari atas ke bawah:
1. **Skor Total NUMi** dan Keterangan/Feedback singkat.
2. **3 Card Ringkasan**: [Total Benar], [Persentase Akurasi], [Skor NUMi].
3. **Rincian Per Domain/Materi**: Breakdown hasil dari 20 soal ke dalam 5 kategori materi sebelumnya. Tampilkan jumlah benar dan sub-skor tiap materi.
4. **Interpretasi NUMi**:
   - 900 - 1000 = Ahli
   - 750 - 899 = Mahir
   - 600 - 749 = Berkembang
   - < 600 = Dasar
5. **Navigasi Akhir**: Tombol "Ulangi Kuis" atau "Lihat Papan Skor".

## Spesifikasi Leaderboard & Ekspor
Tabel diurutkan dari Skor NUMi tertinggi.
- **Kolom 0-3**: Urutan, Mahasiswa (Nama & NIM), Angkatan, NUMi (Total Skor).
- **Kolom 4 (Kuis 1-7)**: Format "Benar/Total" (contoh: 4/5). Sediakan icon info (tooltip) untuk melihat jumlah *attempt* yang dilakukan.
- **Kolom 5 (Detail)**: Icon/Tombol untuk membuka *modal/expandable row*. Isinya riwayat jawaban (indikator merah/hijau yang bisa di-scroll).
- **Kolom 6 (Waktu)**: Timestamp penyelesaian ujian.
- **Fitur Ekspor (Client-Side)**: Tombol "Ekspor ke Excel" di bawah tabel. Menggunakan library `xlsx` untuk mengunduh seluruh data tabel ke format `.xlsx` yang rapi.