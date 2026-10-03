export type Flashcard = {
  id: string;
  quizId: string;
  front: string;
  back: string;
};

export const flashcardsByQuiz: Record<string, Flashcard[]> = {
  quiz_1: [
    {
      id: "quiz_1_fc_1",
      quizId: "quiz_1",
      front: "Apa yang dimaksud dengan mean?",
      back: "Mean adalah rata-rata dari seluruh data, dihitung dengan menjumlahkan semua nilai lalu dibagi banyaknya data.",
    },
    {
      id: "quiz_1_fc_2",
      quizId: "quiz_1",
      front: "Bagaimana cara menentukan median?",
      back: "Median adalah nilai tengah setelah data diurutkan. Untuk data ganjil, median adalah data tengah; untuk data genap, median adalah rata-rata dua data tengah.",
    },
    {
      id: "quiz_1_fc_3",
      quizId: "quiz_1",
      front: "Apa itu modus?",
      back: "Modus adalah nilai yang paling sering muncul dalam sekumpulan data.",
    },
    {
      id: "quiz_1_fc_4",
      quizId: "quiz_1",
      front: "Apa perbedaan data numerik dan kategorik?",
      back: "Data numerik berupa angka yang dapat diolah secara kuantitatif, sedangkan data kategorik berupa kelompok atau kategori seperti jenis kelamin atau golongan darah.",
    },
  ],
  quiz_2: [
    {
      id: "quiz_2_fc_1",
      quizId: "quiz_2",
      front: "Apa ciri distribusi normal?",
      back: "Distribusi normal berbentuk lonceng simetris, dengan mean, median, dan modus berada di titik tengah.",
    },
    {
      id: "quiz_2_fc_2",
      quizId: "quiz_2",
      front: "Apa arti skewness positif?",
      back: "Skewness positif berarti ekor distribusi lebih panjang di sisi kanan, sehingga rata-rata cenderung lebih tinggi daripada median.",
    },
    {
      id: "quiz_2_fc_3",
      quizId: "quiz_2",
      front: "Apa fungsi histogram?",
      back: "Histogram menggambarkan distribusi frekuensi data numerik dalam bentuk batang, sehingga membantu melihat bentuk dan sebaran data.",
    },
    {
      id: "quiz_2_fc_4",
      quizId: "quiz_2",
      front: "Kenapa standar deviasi penting?",
      back: "Standar deviasi menunjukkan seberapa jauh data menyebar dari rata-rata. Semakin besar nilainya, semakin luas penyebaran data.",
    },
  ],
  quiz_3: [
    {
      id: "quiz_3_fc_1",
      quizId: "quiz_3",
      front: "Apa arti probabilitas?",
      back: "Probabilitas adalah ukuran kemungkinan suatu kejadian terjadi, bernilai antara 0 dan 1.",
    },
    {
      id: "quiz_3_fc_2",
      quizId: "quiz_3",
      front: "Apa yang dimaksud dengan kejadian saling lepas?",
      back: "Dua kejadian saling lepas jika terjadi satu kejadian tidak memengaruhi kemungkinan terjadinya kejadian yang lain.",
    },
    {
      id: "quiz_3_fc_3",
      quizId: "quiz_3",
      front: "Apa rumus probabilitas bersyarat?",
      back: "Probabilitas bersyarat P(A|B) = P(A dan B) / P(B), dengan P(B) > 0.",
    },
    {
      id: "quiz_3_fc_4",
      quizId: "quiz_3",
      front: "Apa yang dimaksud dengan Bayes?",
      back: "Teorema Bayes memperbarui probabilitas suatu kejadian setelah informasi baru masuk.",
    },
  ],
  quiz_4: [
    {
      id: "quiz_4_fc_1",
      quizId: "quiz_4",
      front: "Apa tujuan uji hipotesis?",
      back: "Uji hipotesis digunakan untuk menilai apakah bukti data cukup kuat untuk menolak hipotesis nol.",
    },
    {
      id: "quiz_4_fc_2",
      quizId: "quiz_4",
      front: "Apa itu hipotesis nol?",
      back: "Hipotesis nol adalah klaim default yang menyatakan tidak ada perbedaan atau efek yang signifikan.",
    },
    {
      id: "quiz_4_fc_3",
      quizId: "quiz_4",
      front: "Apa arti p-value?",
      back: "p-value adalah peluang mendapatkan hasil sekurang-kurangnya sebesar yang diamati jika hipotesis nol benar.",
    },
    {
      id: "quiz_4_fc_4",
      quizId: "quiz_4",
      front: "Apa yang dimaksud dengan signifikansi statistik?",
      back: "Signifikansi statistik menunjukkan bahwa hasil yang diamati kemungkinan besar bukan akibat kebetulan semata.",
    },
  ],
  quiz_5: [
    {
      id: "quiz_5_fc_1",
      quizId: "quiz_5",
      front: "Apa arti sensitifitas?",
      back: "Sensitifitas adalah kemampuan tes untuk mendeteksi penyakit pada individu yang benar-benar sakit.",
    },
    {
      id: "quiz_5_fc_2",
      quizId: "quiz_5",
      front: "Apa arti spesifisitas?",
      back: "Spesifisitas adalah kemampuan tes untuk menegaskan bahwa individu yang tidak sakit benar-benar negatif.",
    },
    {
      id: "quiz_5_fc_3",
      quizId: "quiz_5",
      front: "Apa itu nilai prediksi positif?",
      back: "Nilai prediksi positif adalah peluang seseorang benar-benar sakit jika hasil tes positif.",
    },
    {
      id: "quiz_5_fc_4",
      quizId: "quiz_5",
      front: "Mengapa sensitifitas dan spesifisitas penting?",
      back: "Keduanya membantu mengevaluasi kualitas tes diagnostik dan memandu keputusan klinis.",
    },
  ],
  quiz_6: [
    {
      id: "quiz_6_fc_1",
      quizId: "quiz_6",
      front: "Apa yang dimaksud dengan desain studi observasional?",
      back: "Desain studi observasional mengamati hubungan antar variabel tanpa intervensi atau manipulasi eksperimen.",
    },
    {
      id: "quiz_6_fc_2",
      quizId: "quiz_6",
      front: "Apa perbedaan studi kohort dan studi kasus-kontrol?",
      back: "Studi kohort mengikuti kelompok berdasarkan paparan ke waktu, sedangkan studi kasus-kontrol membandingkan kasus dan kontrol dari sudut pandang paparan masa lalu.",
    },
    {
      id: "quiz_6_fc_3",
      quizId: "quiz_6",
      front: "Kenapa randomisasi penting?",
      back: "Randomisasi mengurangi bias dan membantu pembagian kelompok yang sebanding sehingga hasil lebih valid.",
    },
    {
      id: "quiz_6_fc_4",
      quizId: "quiz_6",
      front: "Apa tujuan blinding dalam penelitian?",
      back: "Blinding mengurangi bias dari subjek atau peneliti yang mengetahui kelompok interv emsi.",
    },
  ],
};
