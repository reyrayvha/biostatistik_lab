"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Download, ChevronDown, ChevronUp, CheckCircle2, XCircle, X, Loader2, Lock, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "@/src/lib/supabaseClient";
import { useAppStore } from "@/src/store/useAppStore";

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
  const identity = useAppStore((s) => s.identity);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [data, setData] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Mode State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("quiz_attempts")
        .select(`
          id,
          total_score,
          completion_time,
          details,
          students!inner (
            id,
            name,
            nim,
            cohort
          )
        `)
        .order("total_score", { ascending: false })
        .order("completion_time", { ascending: true });

      // Fetch all students for the public global leaderboard
      // No filter by nim here


      const { data: attempts, error } = await query;

      if (error) {
        throw error;
      }

      if (attempts) {
        const formattedData: StudentRecord[] = attempts.map((attempt: any) => ({
          id: attempt.id,
          name: attempt.students.name,
          nim: attempt.students.nim,
          angkatan: attempt.students.cohort,
          numiScore: attempt.total_score,
          finishTimestamp: new Date(attempt.completion_time).getTime(),
          finishTime: new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
          }).format(new Date(attempt.completion_time)),
          quizzes: attempt.details || [],
        }));

        setData(formattedData);
      }
    } catch (error: any) {
      console.error("Error fetching leaderboard:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel('public:quiz_attempts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quiz_attempts' }, (payload) => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPassword("");
      setAdminError("");
    } else {
      setAdminError("PIN salah!");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus SEMUA data mahasiswa dan nilai kuis? Tindakan ini tidak dapat dibatalkan!")) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('students')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;
      alert("Semua data berhasil dihapus.");
      fetchLeaderboard();
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Gagal menghapus data.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    const exportData = data.map((student, index) => {
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
      addQuizData("Ujian Akhir", "Akhir", 6);

      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Papan Skor");
    XLSX.writeFile(workbook, "Rekap_Nilai_NUMi.xlsx");
  };

  const renderRankIcon = (rank: number | string) => {
    return <span className="text-slate-400 font-bold text-lg">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="text-indigo-400" size={32} />
            Papan Skor
          </h1>

          {isAdmin ? (
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAll}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 border border-rose-500 rounded-lg text-rose-400 hover:bg-rose-600/30 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.1)] backdrop-blur-sm font-medium"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Hapus Semua Data</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500 rounded-lg text-emerald-400 hover:bg-emerald-600/30 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-sm font-medium"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export to Excel</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all font-medium text-sm shadow-sm"
              title="Akses Mode Dosen"
            >
              <Lock size={16} className="text-indigo-400" />
              <span>Mode Dosen</span>
            </button>
          )}
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden space-y-4 pb-12">
          {loading ? (
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
              <p className="font-medium">Memuat data papan skor...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 text-center text-slate-400 font-medium">
              Belum ada data nilai kuis mahasiswa.
            </div>
          ) : (
            data.map((student, idx) => (
              <div key={student.id} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden shadow-xl">
                {/* Rank Badge */}
                <div className="absolute top-0 right-0 bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-bl-xl font-bold text-sm border-b border-l border-indigo-500/30">
                  Rank #{idx + 1}
                </div>

                {/* Student Info */}
                <div className="flex flex-col pr-20">
                  <span className="font-bold text-white text-lg leading-tight">{student.name}</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-slate-400">{student.nim}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                      {student.angkatan}
                    </span>
                  </div>
                </div>

                {/* Score Info */}
                <div className="bg-slate-900/50 rounded-xl p-4 flex justify-between items-center border border-slate-700/50">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Skor NUMi</span>
                    <span className="text-3xl font-black text-indigo-400">{student.numiScore}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-slate-400 text-right">{formatIndonesianDate(student.finishTimestamp)}</span>
                    <span className="text-xs text-slate-400 text-right">{student.finishTime}</span>
                  </div>
                </div>

                {/* Quizzes Summary (Horizontal Scroll) */}
                <div className="overflow-x-auto pb-2 -mx-4 px-4 snap-x">
                  <div className="flex gap-2 w-max">
                    {student.quizzes.map((quiz, qIdx) => {
                      const quizNames = ["Statistik", "Distribusi", "Probabilitas", "Uji Hipotesis", "Diagnostik", "Desain Studi", "Ujian Akhir"];
                      const qName = quizNames[qIdx] || `Q${qIdx + 1}`;
                      return (
                        <div key={qIdx} className="bg-slate-800 border border-slate-700 rounded-lg p-2 min-w-[100px] flex flex-col items-center justify-center snap-center">
                          <span className="text-[10px] text-slate-400 truncate w-full text-center">{qName}</span>
                          <span className="text-sm font-bold text-white mt-1">{quiz.correct}/{quiz.total}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action */}
                <div className="pt-2 border-t border-slate-700/50">
                  {isAdmin || student.nim === identity?.nim ? (
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="w-full py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-600/60 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      Lihat Detail Jawaban
                    </button>
                  ) : (
                    <div className="w-full py-2.5 bg-slate-800/50 border border-slate-700/30 rounded-lg text-sm text-slate-500 italic text-center">
                      Privasi Terjaga
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View (Hidden on Mobile) */}
        <div className="hidden md:block bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
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
                  <th className="px-6 py-4 font-semibold text-center">Ujian Akhir</th>
                  <th className="px-6 py-4 font-semibold text-center sticky right-0 bg-slate-800/90 backdrop-blur-md border-l border-slate-700/50">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                        <Loader2 className="animate-spin text-indigo-500" size={32} />
                        <p className="font-medium">Memuat data papan skor...</p>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-slate-400 font-medium">
                      Belum ada data nilai kuis mahasiswa.
                    </td>
                  </tr>
                ) : (
                  data.map((student, idx) => (
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
                        {isAdmin || student.nim === identity?.nim ? (
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-200 hover:bg-slate-600/60 hover:text-white transition-all backdrop-blur-sm"
                          >
                            Detail Jawaban
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500 italic px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700/30">
                            Privasi Terjaga
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
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

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdminModal(false)}></div>
          <div className="relative w-full max-w-sm bg-slate-800 border border-slate-600/50 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Mode Dosen</h3>
            <form onSubmit={handleAdminSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-2">Masukkan PIN / Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  autoFocus
                />
                {adminError && <p className="text-rose-400 text-sm mt-2">{adminError}</p>}
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAdminModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Batal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">Masuk</button>
              </div>
            </form>
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
