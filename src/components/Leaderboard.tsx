"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Download, ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2, Lock, Trash2, RefreshCw, LogOut, ShieldCheck, Eye, EyeOff, PencilLine } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "@/src/lib/supabaseClient";
import { useAppStore } from "@/src/store/useAppStore";
import { useToastStore } from "@/src/store/useToastStore";
import { isIdentityFormValid, validateIdentity } from "@/src/lib/validators";

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

const formatCompactTimestamp = (timestamp: number) => {
  const date = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short' }).format(new Date(timestamp));
  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(timestamp));
  return `${date}, ${time}`;
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
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [data, setData] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdminMode = useAppStore((s) => s.isAdminMode);
  const clearAdminMode = useAppStore((s) => s.clearAdminMode);
  const addToast = useToastStore((s) => s.addToast);

  const handleViewStudent = (student: StudentRecord) => setSelectedStudent(student);

  const handleEditStudent = (student: StudentRecord) => setEditingStudent(student);

  const handleDeleteStudent = async () => {
    if (!deletingStudentId) return;

    const client = supabase;
    if (!client) {
      addToast("Konfigurasi Supabase belum tersedia.", "error");
      return;
    }

    try {
      setLoading(true);
      const { error } = await client.from("students").delete().eq("id", deletingStudentId);
      if (error) throw error;

      addToast("Data mahasiswa berhasil dihapus.", "success");
      setDeletingStudentId(null);
      setIsConfirmOpen(false);
      await fetchLeaderboard();
    } catch (error) {
      console.error("Error deleting student:", error);
      addToast("Gagal menghapus data mahasiswa.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEditedStudent = async (
    studentId: string,
    name: string,
    nim: string,
    angkatan: string,
  ) => {
    const validationErrors = validateIdentity(name, nim, angkatan);
    if (validationErrors.length > 0) {
      const errorMap = Object.fromEntries(
        validationErrors.map((error) => [error.field, error.message]),
      );
      addToast(Object.values(errorMap)[0] || "Mohon periksa kembali data mahasiswa.", "warning");
      return;
    }

    const client = supabase;
    if (!client) {
      addToast("Konfigurasi Supabase belum tersedia.", "error");
      return;
    }

    try {
      setLoading(true);
      const { error } = await client
        .from("students")
        .update({ name: name.trim(), nim: nim.trim(), cohort: angkatan.trim() })
        .eq("id", studentId);

      if (error) throw error;

      addToast("Data mahasiswa berhasil diperbarui.", "success");
      setEditingStudent(null);
      await fetchLeaderboard();
    } catch (error) {
      console.error("Error updating student:", error);
      addToast("Gagal memperbarui data mahasiswa.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      if (!supabase) {
        setData([]);
        return;
      }

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
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    const client = supabase;
    if (!client) {
      return;
    }

    const channel = client
      .channel('public:quiz_attempts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quiz_attempts' }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [isAdminMode]);

  const handleDeleteAll = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus SEMUA data mahasiswa dan nilai kuis? Tindakan ini tidak dapat dibatalkan!")) {
      return;
    }

    const client = supabase;
    if (!client) {
      addToast("Konfigurasi Supabase belum tersedia. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY untuk mengaktifkan operasi admin.", "error");
      return;
    }

    try {
      setLoading(true);
      const { error } = await client
        .from('students')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;
      addToast("Semua data berhasil dihapus.", "success");
      fetchLeaderboard();
    } catch (error) {
      console.error("Error deleting data:", error);
      addToast("Gagal menghapus data.", "error");
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
        <div className="flex flex-row justify-between items-center gap-2 relative">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Trophy className="text-blue-600 dark:text-blue-400" size={32} />
            Papan Skor
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={fetchLeaderboard}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-sm shadow-sm"
              title="Refresh Papan Skor"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-blue-600" : "text-slate-500"} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {isAdminMode ? (
              <>
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-rose-600 dark:text-rose-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium text-sm shadow-sm"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Hapus Semua Data</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors font-medium text-sm shadow-sm"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Export to Excel</span>
                </button>
                <button
                  onClick={clearAdminMode}
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all font-medium text-sm shadow-sm"
                  title="Keluar Mode Dosen"
                >
                  <LogOut size={16} className="text-slate-500" />
                  <span>Logout Dosen</span>
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Admin Card */}
        {isAdminMode && (
          <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-none shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-800">Admin</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
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
        <div className="hidden">
          {loading ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="font-medium">Memuat data papan skor...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center text-slate-500 font-medium">
              Belum ada data nilai kuis mahasiswa.
            </div>
          ) : (
            data.map((student, idx) => (
              <div key={student.id} className="bg-white dark:bg-slate-900 p-3 md:p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                
                {/* Header Card */}
                <div className="flex flex-col pr-16 border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-200 font-bold px-2 py-0.5 rounded text-[10px] md:text-xs">Rank #{idx + 1}</span>
                    <span className="hidden text-[10px] md:inline md:text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{student.angkatan}</span>
                  </div>
                  <span className="font-bold text-slate-800 text-base md:text-lg leading-tight break-words">{student.name}</span>
                  <span className="hidden text-xs md:inline md:text-sm text-slate-500">{student.nim}</span>
                </div>

                {/* Highlight Card */}
                <div className="flex justify-between items-center bg-blue-50/40 dark:bg-blue-950/30 p-2 md:p-3 rounded-lg border border-blue-50/50 dark:border-blue-900/60">
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs text-blue-600 font-semibold uppercase tracking-wider mb-0.5">Skor NUMi</span>
                    <span className="text-xl md:text-2xl font-bold text-blue-600 leading-none">{student.numiScore}</span>
                  </div>
                  <div className="flex flex-col items-end text-xs text-slate-500 dark:text-slate-400">
                    <span className="mt-1 hidden whitespace-nowrap md:inline">{formatCompactTimestamp(student.finishTimestamp)}</span>
                  </div>
                </div>

                {/* Grid Nilai (Penting) */}
                <div className="hidden grid-cols-2 gap-2 mt-3 md:grid md:grid-cols-3">
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
                {(isAdminMode || student.nim === identity?.nim) && (
                  <div className="pt-3 mt-3 border-t border-slate-100">
                    {isAdminMode ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewStudent(student)}
                          className="flex-1 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-2 py-2 text-[12px] font-semibold text-blue-700 dark:text-blue-200 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        >
                          Lihat
                        </button>
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="flex-1 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-2 py-2 text-[12px] font-semibold text-amber-700 dark:text-amber-200 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeletingStudentId(student.id);
                            setIsConfirmOpen(true);
                          }}
                          className="flex-1 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-2 py-2 text-[12px] font-semibold text-rose-700 dark:text-rose-200 transition-colors hover:bg-rose-100 dark:hover:bg-rose-900/50"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="w-full py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-100 dark:border-blue-800 rounded-lg text-[13px] md:text-sm font-semibold transition-colors"
                      >
                        Lihat Detail Jawaban
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View (Hidden on Mobile) */}
        <div className="block w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900">
          <div className="min-w-[900px] max-h-[calc(100vh-250px)] w-full overflow-y-auto">
            <table className="w-full table-fixed border-collapse text-left text-xs">
              <colgroup>
                <col className="w-[5%]" />
                <col className="w-[17%]" />
                <col className="w-[8%]" />
                {QUIZ_COLUMNS.map((col) => <col key={col.id} className="w-[8%]" />)}
                <col className="w-[14%]" />
              </colgroup>
              <thead className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-800 shadow-xs">
                <tr className="border-b border-slate-200/50 text-slate-600 text-[10px] uppercase tracking-wide dark:border-white/10 sm:text-xs">
                  <th className="break-words px-1 py-2 text-center font-semibold">Rank</th>
                  <th className="break-words border-r border-slate-200 px-2 py-2 font-semibold dark:border-slate-700">Mahasiswa</th>
                  <th className="break-words px-1 py-2 text-center font-semibold">Skor NUMi</th>
                  <th className="break-words px-1 py-2 text-center font-semibold">Statistik</th>
                  <th className="break-words px-1 py-2 text-center font-semibold">Distribusi</th>
                  <th className="break-words px-1 py-2 text-center font-semibold">Probabilitas</th>
                  <th className="break-words px-1 py-2 text-center font-semibold">Uji Hipotesis</th>
                  <th className="break-words px-1 py-2 text-center font-semibold">Diagnostik</th>
                  <th className="break-words px-1 py-2 text-center font-semibold">Desain Studi</th>
                  <th className="break-words px-1 py-2 text-center font-semibold">Ujian Akhir</th>
                  <th className="break-words border-l border-slate-200 px-1 py-2 text-center font-semibold dark:border-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/10">
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
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group">
                      {/* Rank */}
                      <td className="px-1 py-2 text-center">
                        <div className="flex justify-center items-center">
                          {renderRankIcon(idx + 1)}
                        </div>
                      </td>

                      {/* Mahasiswa */}
                      <td className="break-words border-r border-slate-200 px-2 py-2 dark:border-slate-700">
                        <div className="flex min-w-0 flex-col">
                          <span className="mb-1 break-words text-sm font-bold leading-tight text-slate-800">{student.name}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-sm text-slate-500">{student.nim}</span>
                            <span className="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                              {student.angkatan}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Skor NUMi */}
                      <td className="px-1 py-2 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-black text-blue-600">{student.numiScore}</span>
                          <span className="mt-1 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">{formatCompactTimestamp(student.finishTimestamp)}</span>
                        </div>
                      </td>

                      {/* Quiz Columns */}
                      {QUIZ_COLUMNS.map((col) => {
                        const quiz = student.quizzes.find((q) =>
                          q.title.toLowerCase().includes(col.keyword.toLowerCase())
                        );

                        return (
                          <td key={col.id} className="px-1 py-2 text-center">
                            <div className="flex flex-col items-center">
                              {quiz ? (
                                <>
                                  <span className="text-sm font-bold text-slate-800">
                                    {quiz.correct}/{quiz.total}
                                  </span>
                                  <span className="mt-0.5 text-[10px] leading-tight text-slate-500">
                                    Percobaan: {quiz.attempts}x
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-sm font-semibold text-slate-400">
                                    0/{col.total}
                                  </span>
                                  <span className="mt-0.5 text-[10px] leading-tight text-slate-400">
                                    Percobaan: 0x
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {/* Aksi */}
                      <td className="border-l border-slate-200 px-1 py-2 text-center dark:border-slate-700">
                        {isAdminMode ? (
                          <div className="flex flex-wrap items-center justify-center gap-1">
                            <button
                              onClick={() => handleViewStudent(student)}
                              className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-2 text-blue-700 dark:text-blue-200 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50"
                              title="Lihat detail"
                              aria-label="Lihat detail"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-2 text-amber-700 dark:text-amber-200 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/50"
                              title="Edit data"
                              aria-label="Edit data"
                            >
                              <PencilLine size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingStudentId(student.id);
                                setIsConfirmOpen(true);
                              }}
                              className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-2 text-rose-700 dark:text-rose-200 transition-colors hover:bg-rose-100 dark:hover:bg-rose-900/50"
                              title="Hapus data"
                              aria-label="Hapus data"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ) : student.nim === identity?.nim ? (
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="px-3.5 py-1.5 bg-blue-600 border border-blue-600 rounded-lg text-xs font-medium text-white hover:bg-blue-700 transition-all shadow-xs"
                          >
                            Detail Jawaban
                          </button>
                        ) : (
                            <span className="text-xs text-slate-500 italic px-2 py-1 bg-slate-50 dark:bg-slate-800 shadow-xs rounded-md border border-slate-200 dark:border-slate-700">
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
          {/* Layer Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedStudent(null)}
          ></div>

          {/* Layer Kotak Putih */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Layer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Detail Jawaban</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedStudent.name} • {selectedStudent.nim}</p>
              </div>
            </div>

            {/* Layer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedStudent.quizzes.map((quiz, qIdx) => (
                <DetailAccordion key={qIdx} quiz={quiz} />
              ))}
            </div>

            {/* Layer Footer */}
            <div className="flex justify-end p-4 border-t border-slate-100 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full md:w-auto px-6 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {editingStudent && (
        <EditStudentModal
          isOpen={Boolean(editingStudent)}
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={handleSaveEditedStudent}
        />
      )}

      {isConfirmOpen && deletingStudentId && (
        <ConfirmDeleteStudentDialog
          isOpen={isConfirmOpen}
          studentName={data.find((student) => student.id === deletingStudentId)?.name || "mahasiswa"}
          onClose={() => {
            setIsConfirmOpen(false);
            setDeletingStudentId(null);
          }}
          onConfirm={async () => {
            setIsConfirmOpen(false);
            await handleDeleteStudent();
          }}
        />
      )}

    </div>
  );
}

function EditStudentModal({
  isOpen,
  student,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  student: StudentRecord;
  onClose: () => void;
  onSave: (studentId: string, name: string, nim: string, angkatan: string) => Promise<void>;
}) {
  const [name, setName] = useState(student.name);
  const [nim, setNim] = useState(student.nim);
  const [angkatan, setAngkatan] = useState(student.angkatan);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const applyFieldError = (field: "nama" | "nim" | "angkatan", value: string) => {
    const validationErrors = validateIdentity(
      field === "nama" ? value : name,
      field === "nim" ? value : nim,
      field === "angkatan" ? value : angkatan,
    );

    const error = validationErrors.find((item) => item.field === field);
    setErrors((previous) => {
      const next = { ...previous };
      if (error) {
        next[field] = error.message;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validateIdentity(name, nim, angkatan);
    if (validationErrors.length > 0) {
      const nextErrors = Object.fromEntries(
        validationErrors.map((error) => [error.field, error.message]),
      );
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(student.id, name, nim, angkatan);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Edit Mahasiswa</p>
            <h2 className="text-xl font-bold text-slate-800">Edit Data Mahasiswa</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="student-edit-name" className="mb-1.5 block text-sm font-medium text-slate-700">Nama Lengkap</label>
            <input
              id="student-edit-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (errors.nama) {
                  const next = { ...errors };
                  delete next.nama;
                  setErrors(next);
                }
              }}
              onBlur={(event) => applyFieldError("nama", event.target.value)}
              className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-700 dark:text-slate-100 outline-none transition focus:ring-2 ${errors.nama ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30 focus:ring-red-200" : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100"}`}
              disabled={isLoading}
            />
            {errors.nama && <p className="mt-1 text-sm text-red-600 dark:text-red-400">⚠ {errors.nama}</p>}
          </div>

          <div>
            <label htmlFor="student-edit-nim" className="mb-1.5 block text-sm font-medium text-slate-700">NIM</label>
            <input
              id="student-edit-nim"
              value={nim}
              maxLength={10}
              inputMode="numeric"
              onChange={(event) => {
                const nextValue = event.target.value.replace(/\D/g, "");
                setNim(nextValue);
                if (errors.nim) {
                  const next = { ...errors };
                  delete next.nim;
                  setErrors(next);
                }
              }}
              onBlur={(event) => applyFieldError("nim", event.target.value)}
              className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-700 dark:text-slate-100 outline-none transition focus:ring-2 ${errors.nim ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30 focus:ring-red-200" : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100"}`}
              disabled={isLoading}
            />
            {errors.nim && <p className="mt-1 text-sm text-red-600 dark:text-red-400">⚠ {errors.nim}</p>}
          </div>

          <div>
            <label htmlFor="student-edit-angkatan" className="mb-1.5 block text-sm font-medium text-slate-700">Angkatan</label>
            <select
              id="student-edit-angkatan"
              value={angkatan}
              onChange={(event) => {
                setAngkatan(event.target.value);
                if (errors.angkatan) {
                  const next = { ...errors };
                  delete next.angkatan;
                  setErrors(next);
                }
              }}
              onBlur={(event) => applyFieldError("angkatan", event.target.value)}
              className={`w-full rounded-xl border bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-700 dark:text-slate-100 outline-none transition focus:ring-2 ${errors.angkatan ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30 focus:ring-red-200" : "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-100"}`}
              disabled={isLoading}
            >
              {[
                "2022",
                "2023",
                "2024",
                "2025",
              ].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.angkatan && <p className="mt-1 text-sm text-red-600 dark:text-red-400">⚠ {errors.angkatan}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
              disabled={isLoading || !isIdentityFormValid(name, nim, angkatan)}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteStudentDialog({
  isOpen,
  studentName,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  studentName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-200">
            <Trash2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Hapus Data Mahasiswa?</h2>
            <p className="text-sm text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
        </div>

        <p className="mb-5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/60 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">
          Anda akan menghapus data <strong>{studentName}</strong> beserta semua riwayat kuisnya.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-rose-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Accordion inside Modal
function DetailAccordion({ quiz }: { quiz: QuizResult }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex flex-row items-center justify-between px-3 py-2 md:p-4 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-colors gap-2"
      >
        <span className="font-semibold text-slate-800 text-sm md:text-base text-left leading-tight flex-1">
          {quiz.title}
        </span>
        <div className="flex flex-row items-center gap-2 shrink-0">
          <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-md font-medium whitespace-nowrap ${quiz.correct === quiz.total
            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
            : "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
            }`}>
            Skor: {quiz.correct}/{quiz.total}
          </span>
          {isOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-900/30">
          <div className="flex flex-col gap-2 mt-1">
            {quiz.answers.map((ans, idx) => (
              <div key={idx} className="bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 md:p-4">
                {/* Header Soal */}
                <div className="flex items-start gap-2 md:gap-3">
                  <span className="shrink-0 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md bg-white dark:bg-slate-900 text-[10px] md:text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                    {ans.id}
                  </span>
                  <p className="text-slate-800 text-[13px] md:text-sm leading-relaxed mt-0.5">
                    {ans.question}
                  </p>
                </div>

                {/* Jawaban Mahasiswa */}
                <div className="mt-4 pl-12 flex flex-col items-start gap-2">
                  <div className={`inline-flex items-start gap-2.5 px-3 py-2 text-sm font-medium border rounded-md ${ans.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-200'
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
