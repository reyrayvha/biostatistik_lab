"use client";

import React, { useState, useEffect, useRef } from "react";
import { Trophy, Download, ChevronDown, ChevronUp, CheckCircle2, XCircle, X, Loader2, Lock, Trash2, RefreshCw, LogOut, ShieldCheck, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
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

const QUIZ_COLUMNS = [
  { id: 1, name: "Statistik", keyword: "statistik", total: 5 },
  { id: 2, name: "Distribusi", keyword: "distribusi", total: 5 },
  { id: 3, name: "Probabilitas", keyword: "probabilitas", total: 5 },
  { id: 4, name: "Uji Hipotesis", keyword: "hipotesis", total: 5 },
  { id: 5, name: "Diagnostik", keyword: "diagnostik", total: 5 },
  { id: 6, name: "Desain Studi", keyword: "desain", total: 5 },
  { id: 7, name: "Ujian Akhir", keyword: "akhir", total: 20 },
];

export default function Leaderboard() {
  const identity = useAppStore((s) => s.identity);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [data, setData] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const scrollTable = (direction: 'left' | 'right') => {
    if (tableScrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      tableScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Admin Mode State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    // Supabase Realtime (Hanya bekerja jika fitur Realtime diaktifkan di tabel quiz_attempts)
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

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = await response.json();
      
      if (data.success) {
        setIsAdmin(true);
        setShowAdminModal(false);
        setAdminPassword("");
        setAdminError("");
        setShowPassword(false);
      } else {
        setAdminError("PIN salah!");
      }
    } catch (err) {
      setAdminError("Gagal menghubungi server");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminPassword("");
    setAdminError("");
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
    return <span className="text-slate-500 font-bold text-lg">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 p-4 pb-32 md:p-8 md:pb-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Trophy className="text-blue-600" size={32} />
            Papan Skor
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={fetchLeaderboard}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all font-medium text-sm shadow-sm"
              title="Refresh Papan Skor"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-blue-600" : "text-slate-500"} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {isAdmin ? (
              <>
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-50 border border-red-200 rounded-lg text-rose-600 hover:bg-red-100 transition-colors font-medium text-sm shadow-sm"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Hapus Semua Data</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors font-medium text-sm shadow-sm"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Export to Excel</span>
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-all font-medium text-sm shadow-sm"
                  title="Keluar Mode Dosen"
                >
                  <LogOut size={16} className="text-slate-500" />
                  <span>Logout Dosen</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAdminModal(true)}
                className="p-2 sm:px-2.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center"
                title="Akses Dosen"
                aria-label="Akses Dosen"
              >
                <Lock size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Admin Card */}
        {isAdmin && (
          <div className="bg-white border border-indigo-100 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/60">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-800">Admin</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                    Akses Penuh
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  Anda memiliki akses penuh untuk melihat detail jawaban seluruh mahasiswa, mengekspor rekap nilai, dan mereset data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile View (Cards) */}
        <div className="block md:hidden flex flex-col gap-4 w-full">
          {loading ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="font-medium">Memuat data papan skor...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500 font-medium">
              Belum ada data nilai kuis mahasiswa.
            </div>
          ) : (
            data.map((student, idx) => (
              <div key={student.id} className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                
                {/* Header Card */}
                <div className="flex flex-col pr-16 border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] md:text-xs">Rank #{idx + 1}</span>
                    <span className="text-[10px] md:text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{student.angkatan}</span>
                  </div>
                  <span className="font-bold text-slate-800 text-base md:text-lg leading-tight break-words">{student.name}</span>
                  <span className="text-xs md:text-sm text-slate-500">{student.nim}</span>
                </div>

                {/* Highlight Card */}
                <div className="flex justify-between items-center bg-blue-50/40 p-2 md:p-3 rounded-lg border border-blue-50/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs text-blue-600 font-semibold uppercase tracking-wider mb-0.5">Skor NUMi</span>
                    <span className="text-xl md:text-2xl font-bold text-blue-600 leading-none">{student.numiScore}</span>
                  </div>
                  <div className="flex flex-col items-end text-[10px] md:text-xs text-slate-500">
                    <span className="font-medium">{formatIndonesianDate(student.finishTimestamp)}</span>
                    <span>{student.finishTime}</span>
                  </div>
                </div>

                {/* Grid Nilai (Penting) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                  {QUIZ_COLUMNS.map((col) => {
                    const quiz = student.quizzes.find((q) =>
                      q.title.toLowerCase().includes(col.keyword.toLowerCase())
                    );
                    return (
                      <div key={col.id} className="bg-slate-50 p-2 rounded-lg text-center flex flex-col items-center justify-center border border-slate-100">
                        <span className="text-[10px] md:text-[11px] text-slate-500 font-medium w-full truncate">{col.name}</span>
                        <span className={`text-sm md:text-base font-bold mt-0.5 ${quiz ? "text-slate-800" : "text-slate-400"}`}>
                          {quiz ? `${quiz.correct}/${quiz.total}` : `0/${col.total}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Card: Action */}
                {(isAdmin || student.nim === identity?.nim) && (
                  <div className="pt-3 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 rounded-lg text-[13px] md:text-sm font-semibold transition-colors"
                    >
                      Lihat Detail Jawaban
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View (Hidden on Mobile) */}
        <div className="hidden md:block bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden shadow-md">
          {/* Quick Scroll Bar & Table Header Info */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">
              Papan Peringkat Kuis Mahasiswa ({data.length} Mahasiswa)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] hidden sm:inline">Geser kolom kuis:</span>
              <button
                type="button"
                onClick={() => scrollTable('left')}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors shadow-xs"
                title="Geser ke Kiri"
              >
                <ChevronLeft size={14} />
                <span>Kiri</span>
              </button>
              <button
                type="button"
                onClick={() => scrollTable('right')}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors shadow-xs"
                title="Geser ke Kanan"
              >
                <span>Kanan</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div
            ref={tableScrollRef}
            className="overflow-auto max-h-[calc(100vh-250px)]"
          >
            <table className="w-full text-left whitespace-nowrap border-collapse">
              <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
                <tr className="border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="px-3 py-3 font-semibold text-center w-14 sticky left-0 bg-slate-100 z-30 shadow-[1px_0_0_0_#e2e8f0]">Rank</th>
                  <th className="px-4 py-3 font-semibold min-w-[170px] sticky left-14 bg-slate-100 z-30 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">Mahasiswa</th>
                  <th className="px-3 py-3 font-semibold text-center min-w-[90px]">Skor NUMi</th>
                  <th className="px-2.5 py-3 font-semibold text-center min-w-[80px]">Statistik</th>
                  <th className="px-2.5 py-3 font-semibold text-center min-w-[80px]">Distribusi</th>
                  <th className="px-2.5 py-3 font-semibold text-center min-w-[80px]">Probabilitas</th>
                  <th className="px-2.5 py-3 font-semibold text-center min-w-[85px]">Uji Hipotesis</th>
                  <th className="px-2.5 py-3 font-semibold text-center min-w-[80px]">Diagnostik</th>
                  <th className="px-2.5 py-3 font-semibold text-center min-w-[85px]">Desain Studi</th>
                  <th className="px-2.5 py-3 font-semibold text-center min-w-[85px]">Ujian Akhir</th>
                  <th className="px-4 py-3 font-semibold text-center sticky right-0 bg-slate-100 border-l border-slate-200 z-30 shadow-[-1px_0_0_0_#e2e8f0]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                        <p className="font-medium">Memuat data papan skor...</p>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center text-slate-500 font-medium">
                      Belum ada data nilai kuis mahasiswa.
                    </td>
                  </tr>
                ) : (
                  data.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                      {/* Rank */}
                      <td className="px-3 py-2.5 text-center sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[1px_0_0_0_#e2e8f0]">
                        <div className="flex justify-center items-center">
                          {renderRankIcon(idx + 1)}
                        </div>
                      </td>

                      {/* Mahasiswa */}
                      <td className="px-4 py-2.5 sticky left-14 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">
                        <div className="flex flex-col whitespace-normal max-w-[200px] min-w-[170px]">
                          <span className="font-bold text-slate-800 text-base leading-tight break-words mb-1">{student.name}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm text-slate-500">{student.nim}</span>
                            <span className="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {student.angkatan}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Skor NUMi */}
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-black text-blue-600 drop-shadow-[0_0_10px_rgba(99,102,241,0.25)]">{student.numiScore}</span>
                          <span className="text-xs text-slate-400 mt-0.5">{formatIndonesianDate(student.finishTimestamp)}</span>
                          <span className="text-xs text-slate-400">{student.finishTime}</span>
                        </div>
                      </td>

                      {/* Quiz Columns */}
                      {QUIZ_COLUMNS.map((col) => {
                        const quiz = student.quizzes.find((q) =>
                          q.title.toLowerCase().includes(col.keyword.toLowerCase())
                        );

                        return (
                          <td key={col.id} className="px-2.5 py-2.5 text-center">
                            <div className="flex flex-col items-center">
                              {quiz ? (
                                <>
                                  <span className="text-base font-bold text-slate-800">
                                    {quiz.correct}/{quiz.total}
                                  </span>
                                  <span className="text-xs text-slate-500 mt-0.5">
                                    Percobaan: {quiz.attempts}x
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-base font-semibold text-slate-400">
                                    0/{col.total}
                                  </span>
                                  <span className="text-xs text-slate-400 mt-0.5">
                                    Percobaan: 0x
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {/* Aksi */}
                      <td className="px-4 py-2.5 text-center sticky right-0 bg-white group-hover:bg-slate-50 transition-colors border-l border-slate-200 z-10 shadow-[-1px_0_0_0_#e2e8f0]">
                        {isAdmin || student.nim === identity?.nim ? (
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="px-3.5 py-1.5 bg-blue-600 border border-blue-600 rounded-lg text-xs font-medium text-white hover:bg-blue-700 transition-all shadow-xs"
                          >
                            Detail Jawaban
                          </button>
                        ) : (
                          <span className="text-xs text-slate-500 italic px-2 py-1 bg-slate-50 shadow-xs rounded-md border border-slate-200">
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

          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-md flex flex-col max-h-[85vh] overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Detail Jawaban</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedStudent.name} • {selectedStudent.nim}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {selectedStudent.quizzes.map((quiz, qIdx) => (
                <DetailAccordion key={qIdx} quiz={quiz} />
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full md:w-auto px-6 py-2.5 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 transition-colors font-medium"
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
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Mode Dosen</h3>
            <form onSubmit={handleAdminSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-slate-500 mb-2">Masukkan PIN / Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-11 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                    title={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {adminError && <p className="text-rose-600 text-sm mt-2">{adminError}</p>}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModal(false);
                    setShowPassword(false);
                  }}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors">Masuk</button>
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
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex flex-row items-center justify-between px-3 py-2 md:p-4 hover:bg-white shadow-sm transition-colors gap-2"
      >
        <span className="font-semibold text-slate-800 text-sm md:text-base text-left leading-tight flex-1">
          {quiz.title}
        </span>
        <div className="flex flex-row items-center gap-2 shrink-0">
          <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-md font-medium whitespace-nowrap ${quiz.correct === quiz.total
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-blue-50 text-blue-600 border border-blue-200"
            }`}>
            Skor: {quiz.correct}/{quiz.total}
          </span>
          {isOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 md:p-4 border-t border-slate-200 bg-white/30">
          <div className="flex flex-col gap-2 mt-1">
            {quiz.answers.map((ans, idx) => (
              <div key={idx} className="bg-slate-50/50 border border-slate-200 rounded-lg p-3 md:p-4">
                {/* Header Soal */}
                <div className="flex items-start gap-2 md:gap-3">
                  <span className="shrink-0 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md bg-white text-[10px] md:text-xs font-bold text-slate-500 border border-slate-200">
                    {ans.id}
                  </span>
                  <p className="text-slate-800 text-[13px] md:text-sm leading-relaxed mt-0.5">
                    {ans.question}
                  </p>
                </div>

                {/* Jawaban Mahasiswa */}
                <div className="mt-4 pl-12 flex flex-col items-start gap-2">
                  <div className={`inline-flex items-start gap-2.5 px-3 py-2 text-sm font-medium border rounded-md ${ans.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-rose-50 border-rose-200 text-rose-600'
                    }`}>
                    <div className="shrink-0 mt-0.5">
                      {ans.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    </div>
                    <span>Jawaban: {ans.selectedOption}. {ans.selectedText}</span>
                  </div>

                  {/* Kunci Jawaban */}
                  {!ans.isCorrect && (
                    <div className="text-slate-500 text-xs italic ml-1">
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
