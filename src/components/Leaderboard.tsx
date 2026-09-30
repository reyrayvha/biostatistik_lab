"use client";

import React, { useState, useMemo } from "react";
import { Trophy, Download, ChevronDown, ChevronUp, CheckCircle2, XCircle, X } from "lucide-react";
import * as XLSX from "xlsx";

// --- Types ---
type AnswerDetail = {
  id: string;
  question: string;
  selectedOption: string;
  selectedText: string;
  isCorrect: boolean;
  correctOption: string;
  correctText: string;
};

type QuizResult = {
  title: string;
  correct: number;
  total: number;
  attempts: number;
  answers: AnswerDetail[];
};

type StudentRecord = {
  id: string;
  name: string;
  nim: string;
  angkatan: string;
  numiScore: number;
  finishTime: string;
  finishTimestamp: number;
  quizzes: QuizResult[];
};

// --- Mock Data ---
function generateMockAnswers(topic: string, results: boolean[]): AnswerDetail[] {
  return results.map((isCorrect, i) => {
    const isTopic1 = topic === "Statistik" || topic === "Distribusi";

    const questionText = isTopic1
      ? `Berapa persen data populasi normal yang berada dalam ±2 Standar Deviasi?`
      : `Desain studi apa yang paling rentan terhadap recall bias?`;

    const correctOption = isTopic1 ? "B" : "C";
    const correctText = isTopic1 ? "95%" : "Case-Control";

    const wrongOption = isTopic1 ? "A" : "A";
    const wrongText = isTopic1 ? "68%" : "Cohort";

    return {
      id: `Q${i + 1}`,
      question: questionText,
      selectedOption: isCorrect ? correctOption : wrongOption,
      selectedText: isCorrect ? correctText : wrongText,
      isCorrect,
      correctOption,
      correctText
    };
  });
}

const mockData: StudentRecord[] = [
  {
    id: "1",
    name: "Dr. Budi Santoso",
    nim: "123456789",
    angkatan: "2023",
    numiScore: 850,
    finishTime: "10:20 WIB",
    finishTimestamp: 1696130400000,
    quizzes: [
      { title: "Statistik", correct: 5, total: 5, attempts: 1, answers: generateMockAnswers("Statistik", [true, true, true, true, true]) },
      { title: "Distribusi", correct: 4, total: 5, attempts: 2, answers: generateMockAnswers("Distribusi", [true, true, true, false, true]) },
      { title: "Probabilitas", correct: 5, total: 5, attempts: 1, answers: generateMockAnswers("Probabilitas", [true, true, true, true, true]) },
      { title: "Uji Hipotesis", correct: 3, total: 5, attempts: 2, answers: generateMockAnswers("Uji Hipotesis", [true, false, true, false, true]) },
      { title: "Diagnostik", correct: 4, total: 5, attempts: 1, answers: generateMockAnswers("Diagnostik", [true, true, false, true, true]) },
      { title: "Desain Studi", correct: 5, total: 5, attempts: 1, answers: generateMockAnswers("Desain Studi", [true, true, true, true, true]) },
    ],
  },
  {
    id: "2",
    name: "Siti Aminah",
    nim: "987654321",
    angkatan: "2023",
    numiScore: 850,
    finishTime: "10:21 WIB",
    finishTimestamp: 1696130460000,
    quizzes: [
      { title: "Statistik", correct: 4, total: 5, attempts: 1, answers: generateMockAnswers("Statistik", [true, true, false, true, true]) },
      { title: "Distribusi", correct: 5, total: 5, attempts: 1, answers: generateMockAnswers("Distribusi", [true, true, true, true, true]) },
      { title: "Probabilitas", correct: 4, total: 5, attempts: 2, answers: generateMockAnswers("Probabilitas", [true, false, true, true, true]) },
      { title: "Uji Hipotesis", correct: 4, total: 5, attempts: 1, answers: generateMockAnswers("Uji Hipotesis", [true, true, true, false, true]) },
      { title: "Diagnostik", correct: 4, total: 5, attempts: 2, answers: generateMockAnswers("Diagnostik", [true, true, true, false, true]) },
      { title: "Desain Studi", correct: 5, total: 5, attempts: 1, answers: generateMockAnswers("Desain Studi", [true, true, true, true, true]) },
    ],
  },
  {
    id: "3",
    name: "Andi Wijaya",
    nim: "112233445",
    angkatan: "2024",
    numiScore: 920,
    finishTime: "09:45 WIB",
    finishTimestamp: 1696128300000,
    quizzes: [
      { title: "Statistik", correct: 5, total: 5, attempts: 1, answers: generateMockAnswers("Statistik", [true, true, true, true, true]) },
      { title: "Distribusi", correct: 5, total: 5, attempts: 1, answers: generateMockAnswers("Distribusi", [true, true, true, true, true]) },
      { title: "Probabilitas", correct: 5, total: 5, attempts: 1, answers: generateMockAnswers("Probabilitas", [true, true, true, true, true]) },
      { title: "Uji Hipotesis", correct: 4, total: 5, attempts: 1, answers: generateMockAnswers("Uji Hipotesis", [true, true, false, true, true]) },
      { title: "Diagnostik", correct: 5, total: 5, attempts: 1, answers: generateMockAnswers("Diagnostik", [true, true, true, true, true]) },
      { title: "Desain Studi", correct: 5, total: 5, attempts: 1, answers: generateMockAnswers("Desain Studi", [true, true, true, true, true]) },
    ],
  },
  {
    id: "4",
    name: "Ratna Sari",
    nim: "556677889",
    angkatan: "2022",
    numiScore: 780,
    finishTime: "11:05 WIB",
    finishTimestamp: 1696133100000,
    quizzes: [
      { title: "Statistik", correct: 3, total: 5, attempts: 2, answers: generateMockAnswers("Statistik", [true, false, true, false, true]) },
      { title: "Distribusi", correct: 4, total: 5, attempts: 1, answers: generateMockAnswers("Distribusi", [true, true, true, false, true]) },
      { title: "Probabilitas", correct: 3, total: 5, attempts: 2, answers: generateMockAnswers("Probabilitas", [false, true, true, false, true]) },
      { title: "Uji Hipotesis", correct: 5, total: 5, attempts: 1, answers: generateMockAnswers("Uji Hipotesis", [true, true, true, true, true]) },
      { title: "Diagnostik", correct: 3, total: 5, attempts: 2, answers: generateMockAnswers("Diagnostik", [true, false, false, true, true]) },
      { title: "Desain Studi", correct: 4, total: 5, attempts: 1, answers: generateMockAnswers("Desain Studi", [true, true, true, true, false]) },
    ],
  }
];

// Helper to format date
const formatIndonesianDate = (timestamp: number) => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(timestamp));
};

export default function Leaderboard() {
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Sort students: Score DESC, then finishTimestamp ASC
  const sortedData = useMemo(() => {
    return [...mockData].sort((a, b) => {
      if (b.numiScore !== a.numiScore) {
        return b.numiScore - a.numiScore;
      }
      return a.finishTimestamp - b.finishTimestamp;
    });
  }, []);

  const handleExportExcel = () => {
    const exportData = sortedData.map((student, index) => {
      const rowData: Record<string, string | number> = {
        "Peringkat": parseInt(String(index + 1), 10), // Explicit number to prevent percentage formatting
        "Nama Mahasiswa": student.name,
        "NIM": student.nim,
        "Angkatan": student.angkatan,
        "Skor Akhir NUMi": parseInt(String(student.numiScore), 10), // Explicit number to prevent percentage formatting
        "Tanggal": formatIndonesianDate(student.finishTimestamp),
        "Waktu Selesai": student.finishTime,
      };

      // Helper to dynamically map summary and detailed answers
      const addQuizData = (columnPrefix: string, titleKeyword: string, defaultIndex: number) => {
        const q = student.quizzes.find((q) => q.title.toLowerCase().includes(titleKeyword.toLowerCase())) || student.quizzes[defaultIndex];

        // Add Summary Score
        rowData[`Nilai ${columnPrefix}`] = q ? `${q.correct}/${q.total}` : "-";

        // Add Detailed Answers horizontally
        if (q && q.answers) {
          q.answers.forEach((ans) => {
            const key = `${columnPrefix}_${ans.id}`;
            if (ans.isCorrect) {
              rowData[key] = `${ans.selectedOption} (Benar)`;
            } else {
              rowData[key] = `${ans.selectedOption} (Salah - Kunci: ${ans.correctOption})`;
            }
          });
        }
      };

      addQuizData("Statistik", "Statistik", 0);
      addQuizData("Distribusi", "Distribusi", 1);
      addQuizData("Probabilitas", "Probabilitas", 2);
      addQuizData("Uji Hipotesis", "Hipotesis", 3);
      addQuizData("Diagnostik", "Diagnostik", 4);
      addQuizData("Desain Studi", "Desain", 5);

      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Papan Skor");
    XLSX.writeFile(workbook, "Rekap_Nilai_NUMi.xlsx");
  };

  const renderRankIcon = (rank: number) => {
    return <span className="text-slate-400 font-bold text-lg">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="text-indigo-400" size={32} />
            Papan Skor Global (NUMi)
          </h1>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500 rounded-lg text-emerald-400 hover:bg-emerald-600/30 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-sm font-medium"
          >
            <Download size={18} />
            Export to Excel
          </button>
        </div>

        {/* Table Panel */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700/50 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold text-center w-20">Rank</th>
                  <th className="px-6 py-4 font-semibold min-w-[200px]">Mahasiswa</th>
                  <th className="px-6 py-4 font-semibold text-center">Skor NUMi</th>
                  <th className="px-6 py-4 font-semibold text-center">Statistik</th>
                  <th className="px-6 py-4 font-semibold text-center">Distribusi</th>
                  <th className="px-6 py-4 font-semibold text-center">Probabilitas</th>
                  <th className="px-6 py-4 font-semibold text-center">Uji Hipotesis</th>
                  <th className="px-6 py-4 font-semibold text-center">Diagnostik</th>
                  <th className="px-6 py-4 font-semibold text-center">Desain Studi</th>
                  <th className="px-6 py-4 font-semibold text-center sticky right-0 bg-slate-800/90 backdrop-blur-md border-l border-slate-700/50">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {sortedData.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-700/30 transition-colors">
                    {/* Rank */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        {renderRankIcon(idx + 1)}
                      </div>
                    </td>

                    {/* Mahasiswa */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-base">{student.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-slate-400">{student.nim}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {student.angkatan}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Skor NUMi */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">{student.numiScore}</span>
                        <span className="text-[10px] text-slate-400 mt-1">{formatIndonesianDate(student.finishTimestamp)}</span>
                        <span className="text-[10px] text-slate-400">{student.finishTime}</span>
                      </div>
                    </td>

                    {/* Quiz Columns */}
                    {student.quizzes.map((quiz, qIdx) => (
                      <td key={qIdx} className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-base font-semibold text-white">{quiz.correct}/{quiz.total}</span>
                          <span className="text-xs text-slate-500 mt-1">Percobaan: {quiz.attempts}x</span>
                        </div>
                      </td>
                    ))}

                    {/* Aksi */}
                    <td className="px-6 py-4 text-center sticky right-0 bg-slate-800/90 backdrop-blur-md border-l border-slate-700/50">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-200 hover:bg-slate-600/60 hover:text-white transition-all backdrop-blur-sm"
                      >
                        Detail Jawaban
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Detail Jawaban */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedStudent(null)}
          ></div>

          <div className="relative w-full max-w-2xl bg-slate-800 border border-slate-600/50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div>
                <h3 className="text-xl font-bold text-white">Detail Jawaban</h3>
                <p className="text-sm text-slate-400 mt-1">{selectedStudent.name} • {selectedStudent.nim}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {selectedStudent.quizzes.map((quiz, qIdx) => (
                <DetailAccordion key={qIdx} quiz={quiz} />
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-700/50 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Sub-component for Accordion inside Modal
function DetailAccordion({ quiz }: { quiz: QuizResult }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden bg-slate-900/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-200">{quiz.title}</span>
          <span className={`text-xs px-2 py-1 rounded-md font-medium ${quiz.correct === quiz.total
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
            }`}>
            Skor: {quiz.correct}/{quiz.total}
          </span>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
          <div className="flex flex-col gap-3 mt-2">
            {quiz.answers.map((ans, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
                {/* Header Soal */}
                <div className="flex items-start gap-3">
                  <span className="shrink-0 px-2.5 py-1 rounded-md bg-slate-800 text-xs font-bold text-slate-400 border border-slate-700">
                    {ans.id}
                  </span>
                  <p className="text-slate-200 text-sm leading-relaxed mt-0.5">
                    {ans.question}
                  </p>
                </div>

                {/* Jawaban Mahasiswa */}
                <div className="mt-4 pl-12 flex flex-col items-start gap-2">
                  <div className={`inline-flex items-start gap-2.5 px-3 py-2 text-sm font-medium border rounded-md ${ans.isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}>
                    <div className="shrink-0 mt-0.5">
                      {ans.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    </div>
                    <span>Jawaban: {ans.selectedOption}. {ans.selectedText}</span>
                  </div>

                  {/* Kunci Jawaban */}
                  {!ans.isCorrect && (
                    <div className="text-slate-400 text-xs italic ml-1">
                      Kunci Benar: {ans.correctOption}. {ans.correctText}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
