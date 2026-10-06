# Panduan Penggunaan Aplikasi SMART-MATH MEDICS

**SMART-MATH MEDICS (Interactive Learning Platform for Medical Students)** adalah aplikasi pembelajaran interaktif berbasis web untuk melatih dan mengevaluasi pemahaman mahasiswa kedokteran dalam bidang biostatistik.

Aplikasi ini dibagi menjadi dua mode akses utama:
1. **Mode Mahasiswa**: Untuk mempelajari materi dan mengerjakan kuis.
2. **Mode Dosen (Admin)**: Untuk memantau, mengekspor, dan mengelola nilai serta data mahasiswa.

Berikut adalah panduan lengkap penggunaan aplikasi untuk masing-masing pengguna.

---

## A. Panduan Untuk Mahasiswa

### 1. Memulai Aplikasi (Login)
Saat pertama kali membuka aplikasi, Anda akan dihadapkan pada halaman utama.
1. Klik tombol **"Masuk sebagai Mahasiswa"**.
2. Anda akan diminta untuk mengisi **Data Diri**:
   - **Nama Lengkap**: Masukkan nama lengkap Anda.
   - **NIM**: Masukkan Nomor Induk Mahasiswa (maksimal 10 digit angka).
   - **Angkatan**: Pilih tahun angkatan Anda dari pilihan yang tersedia.
3. Pastikan data yang dimasukkan sudah benar, kemudian klik **"Mulai Belajar"**.
4. Setelah berhasil masuk, Anda akan langsung diarahkan ke materi dan kuis pertama.

### 2. Navigasi dan Materi Pembelajaran
Aplikasi ini memiliki 7 tahapan pembelajaran yang harus diselesaikan secara berurutan:
- **Kuis 1**: Statistik Deskriptif
- **Kuis 2**: Distribusi
- **Kuis 3**: Probabilitas & Bayes
- **Kuis 4**: Uji Hipotesis
- **Kuis 5**: Tes Diagnostik
- **Kuis 6**: Desain Studi
- **Kuis 7**: Ujian Akhir (Evaluasi)

**Cara Belajar:**
1. Anda dapat melihat navigasi modul di **Sidebar** (menu samping). Modul yang terkunci akan memiliki ikon gembok (🔒) dan tidak dapat diakses hingga modul sebelumnya diselesaikan.
2. Setiap kali Anda membuka modul baru, Anda akan diberikan **Ringkasan Materi** terlebih dahulu. Baca dan pelajari materi yang disajikan (termasuk mencoba fitur interaktif atau *flashcard* jika tersedia).
3. Setelah memahami materi, gulir ke bawah dan klik tombol **"Mulai Kuis"**.

### 3. Mengerjakan Kuis
1. Setiap kuis terdiri dari beberapa soal pilihan ganda.
2. Pilih salah satu jawaban yang Anda anggap paling tepat untuk setiap soal.
3. Setelah selesai, klik tombol **"Selesai & Lihat Nilai"**.
4. Hasil kuis (Skor, Jumlah Benar/Salah, dan Jawaban yang benar) akan langsung ditampilkan.
5. Anda dapat mengulang kuis dengan mengklik **"Ulangi Kuis"** jika ingin memperbaiki nilai, atau klik **"Lanjut ke Materi Selanjutnya"** untuk membuka modul berikutnya.
*Catatan: Jika Anda tidak menyelesaikan kuis dan mencoba berpindah tab/menutup halaman, sistem akan memberikan peringatan bahwa jawaban belum tersimpan.*

### 4. Melihat Papan Skor dan Detail Jawaban
1. Setelah Anda berhasil menyelesaikan semua modul atau kapan pun Anda ingin melihat perolehan poin Anda dibandingkan teman yang lain, Anda dapat mengklik menu **"Papan Skor"** (ikon piala 🏆) di bilah samping (sidebar).
2. Di tabel papan skor, cari nama Anda.
3. Anda dapat melihat ringkasan skor keseluruhan (Skor NUMi) beserta rekap masing-masing kuis.
4. Pada kolom **Aksi** di baris nama Anda, klik tombol **"Detail"** (ikon mata 👁️) untuk membuka detail jawaban. Anda dapat melihat dengan lengkap riwayat jawaban Anda pada setiap kuis beserta kunci jawabannya.
*Catatan: Anda tidak dapat melihat detail jawaban mahasiswa lain untuk menjaga privasi.*

### 5. Pengaturan Tampilan
- Anda dapat mengubah tema warna aplikasi (Terang/Gelap) dengan mengklik ikon **Matahari (☀️) / Bulan (🌙)** di sudut kanan atas layar.
- Jika Anda ingin mengubah profil (Nama/NIM/Angkatan), klik kotak profil/nama Anda di sudut kanan atas dan lakukan perubahan.

---

## B. Panduan Untuk Dosen (Admin)

Mode Dosen digunakan untuk memantau nilai mahasiswa, mengekspor laporan, serta mengelola data di dalam Papan Skor.

### 1. Mengakses Mode Dosen
1. Buka halaman utama aplikasi (saat belum login sebagai mahasiswa).
2. Klik tombol **"Akses Mode Dosen"** (ikon gembok 🔒) yang berada di bagian bawah.
3. Sebuah kotak dialog akan muncul. Masukkan **PIN Rahasia** Dosen.
4. Klik **"Masuk"**.
5. Jika PIN benar, Anda akan langsung diarahkan ke halaman **Papan Skor (Leaderboard)** dengan hak akses penuh.

### 2. Melihat Data dan Detail Jawaban Mahasiswa
Berbeda dengan mahasiswa, Dosen dapat melihat semua informasi di Papan Skor secara detail:
1. Anda akan melihat seluruh daftar mahasiswa beserta rincian: Peringkat, Nama, NIM, Angkatan, Skor NUMi, Waktu Selesai, dan persentase setiap sub-kuis.
2. Di kolom **Aksi**, Anda dapat mengklik **Tombol "Lihat detail"** (ikon mata 👁️) berwarna biru pada mahasiswa mana pun untuk memunculkan modal "Detail Jawaban".
3. Di dalam modal Detail Jawaban, Anda dapat melihat soal per soal, jawaban apa yang dipilih oleh mahasiswa tersebut, dan apa jawaban yang sebenarnya benar.

### 3. Mengubah dan Menghapus Data Mahasiswa
Sebagai Admin, Anda dapat mengoreksi atau menghapus data jika terjadi kesalahan:
- **Edit Data Mahasiswa**: Klik tombol **"Edit data"** (ikon pensil ✏️) berwarna kuning. Anda dapat mengoreksi Nama Lengkap, NIM, atau Angkatan mahasiswa tersebut, lalu klik "Simpan".
- **Hapus Satu Data**: Klik tombol **"Hapus data"** (ikon tempat sampah 🗑️) berwarna merah pada baris mahasiswa tertentu untuk menghapus mahasiswa tersebut dari sistem (misalnya untuk uji coba/testing).

### 4. Mengekspor Data ke Excel
Untuk keperluan pelaporan akademik:
1. Di halaman Papan Skor, cari tombol **"Export to Excel"** di bagian atas kanan.
2. Klik tombol tersebut.
3. Aplikasi akan mengunduh sebuah file bernama `Rekap_Nilai_NUMi.xlsx`.
4. File Excel ini berisi rekap lengkap, mulai dari Nama, NIM, Skor, waktu selesai, hingga detail jawaban Benar/Salah dari masing-masing soal.

### 5. Menghapus Semua Data (Reset)
Jika semester atau blok rotasi telah berganti dan Anda ingin mereset aplikasi untuk mahasiswa baru:
1. Klik tombol **"Hapus Semua Data"** berwarna merah di bagian atas kanan halaman Papan Skor.
2. Akan muncul konfirmasi ganda. **Perhatian:** Tindakan ini tidak dapat dibatalkan.
3. Jika dikonfirmasi, seluruh data mahasiswa dan jawaban kuis akan bersih dari sistem.

### 6. Keluar dari Mode Dosen
Jika Anda sudah selesai melakukan evaluasi dan manajemen data, klik tombol **"Logout Dosen"** di sudut kanan atas halaman Papan Skor untuk menutup hak akses keamanan Admin.
