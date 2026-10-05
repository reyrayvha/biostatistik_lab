"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAppStore, DEFAULT_QUIZ_STATE } from "@/src/store/useAppStore";
import { quizData, type Question } from "@/src/data/quizData";
import Quiz1Summary from "@/src/components/Quiz1Summary";
import MateriDistribusi from "@/src/components/MateriDistribusi";
import Quiz3Summary from "@/src/components/Quiz3Summary";
import Quiz4Summary from "@/src/components/Quiz4Summary";
import Quiz5Summary from "@/src/components/Quiz5Summary";
import Quiz6Summary from "@/src/components/Quiz6Summary";
import {
  BookOpen,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Trophy,
  Target,
  Zap,
  Hash,
  Eye,
  Quote,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useToastStore } from "@/src/store/useToastStore";
import { FlashcardButton } from "@/src/components/Flashcard";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_ATTEMPTS = 2;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Summary / pre-quiz screen */
function QuizSummaryScreen({
  quizId,
  title,
  attemptsUsed,
  bestResult,
  onStart,
  onAdvance,
}: {
  quizId: number;
  title: string;
  attemptsUsed: number;
  bestResult: { score: number; total: number } | null;
  onStart: () => void;
  onAdvance?: () => void;
}) {
  const hasAttemptsLeft = attemptsUsed < MAX_ATTEMPTS;
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <div className="quiz-summary-screen">
      <div className="quiz-summary-header">
        <div className="quiz-summary-icon">
          <BookOpen size={32} strokeWidth={1.5} />
        </div>
        <h2 className="text-lg md:text-2xl font-bold text-center text-slate-800">{title}</h2>
        {attemptsUsed > 0 && (
          <div className="quiz-attempt-badge">
            <Zap size={14} />
            Percobaan: {attemptsUsed}/{MAX_ATTEMPTS}
          </div>
        )}
      </div>

      {bestResult && (
        <div className="quiz-best-score-banner">
          <Trophy size={18} />
          <span>
            Skor terbaik Anda:{" "}
            <strong>
              {bestResult.score}/{bestResult.total}
            </strong>
          </span>
        </div>
      )}

      {quizId !== 7 && (
        <div className="quiz-summary-content">
          <button
            className="quiz-summary-accordion-toggle"
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
          >
            <div className="quiz-summary-accordion-title">
              <BookOpen size={18} />
              <h3>Rangkuman Materi</h3>
            </div>
            {isSummaryOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {isSummaryOpen && (
            <div className="quiz-summary-accordion-content">
              {quizId === 1 ? (
                <Quiz1Summary />
              ) : quizId === 2 ? (
                <MateriDistribusi />
              ) : quizId === 3 ? (
                <Quiz3Summary />
              ) : quizId === 4 ? (
                <Quiz4Summary />
              ) : quizId === 5 ? (
                <Quiz5Summary />
              ) : quizId === 6 ? (
                <Quiz6Summary />
              ) : null}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex w-full flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          {hasAttemptsLeft ? (
            <button
              className={`flex-1 py-3.5 rounded-xl font-medium text-base transition-colors tracking-wide ${attemptsUsed === 0
                ? "bg-[#2563eb] text-[#f8fafc] hover:bg-[#79c0ff] font-semibold"
                : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-[#e2e8f0]/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                }`}
              onClick={onStart}
            >
              {attemptsUsed > 0
                ? (quizId === 7 ? `Ulangi Ujian Akhir (${MAX_ATTEMPTS - attemptsUsed} sisa)` : `Ulangi Quiz (${MAX_ATTEMPTS - attemptsUsed} sisa)`)
                : (quizId === 7 ? "Mulai Ujian Akhir" : "Mulai Quiz")}
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center py-3.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-500 font-medium text-sm tracking-wide dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Sisa percobaan quiz ini telah habis.
            </div>
          )}

          {bestResult && onAdvance && (
            <button
              className="flex-1 py-3.5 rounded-xl bg-[#2563eb] text-[#f8fafc] font-semibold text-base hover:bg-[#79c0ff] transition-colors tracking-wide"
              onClick={onAdvance}
            >
              {quizId === 7 ? "Lihat Papan Skor" : "Lanjut Quiz Berikutnya"}
            </button>
          )}
        </div>

        <FlashcardButton quizId={`quiz_${quizId}`} quizTitle={title} />
      </div>
    </div>
  );
}

/** Segmented progress bar  —  each segment shows question status */
function SegmentedProgressBar({
  questions,
  currentAnswers,
  currentIndex,
  onSegmentClick,
}: {
  questions: Question[];
  currentAnswers: Record<number, string>;
  currentIndex: number;
  onSegmentClick: (index: number) => void;
}) {
  return (
    <div className="segmented-progress">
      {questions.map((q, idx) => {
        const answer = currentAnswers[q.id];
        let segClass = "seg-bar-item";

        if (answer !== undefined) {
          segClass +=
            answer === q.correctAnswer
              ? " seg-bar-item--correct"
              : " seg-bar-item--wrong";
        } else if (idx === currentIndex) {
          segClass += " seg-bar-item--current";
        }

        return (
          <button
            key={q.id}
            className={segClass}
            onClick={() => onSegmentClick(idx)}
            aria-label={`Soal ${idx + 1}`}
            title={`Soal ${idx + 1}`}
          />
        );
      })}
    </div>
  );
}

/** Single question view with option cards */
function QuestionView({
  question,
  index,
  total,
  selectedAnswer,
  onAnswer,
}: {
  question: Question;
  index: number;
  total: number;
  selectedAnswer: string | undefined;
  onAnswer: (answer: string) => void;
}) {
  const isAnswered = selectedAnswer !== undefined;

  return (
    <div className="question-card" key={`q-${question.id}-${index}`} style={{ animation: "slideLeft 0.3s ease" }}>
      {/* Question header */}
      <div className="question-header">
        <span className="question-number">
          <Hash size={14} />
          Soal {index + 1} dari {total}
        </span>
        {isAnswered && (
          <span
            className={`question-status ${selectedAnswer === question.correctAnswer
              ? "question-status--correct"
              : "question-status--wrong"
              }`}
          >
            {selectedAnswer === question.correctAnswer ? (
              <>
                <CheckCircle2 size={14} /> Benar
              </>
            ) : (
              <>
                <XCircle size={14} /> Salah
              </>
            )}
          </span>
        )}
      </div>

      {/* Question text */}
      <p className="question-text">{question.text}</p>

      {/* Options */}
      <div className="options-grid">
        {question.options.map((option, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx);
          let optionClass = "option-card";

          if (isAnswered) {
            if (option === selectedAnswer) {
              if (selectedAnswer === question.correctAnswer) {
                optionClass += " option-card--correct";
              } else {
                optionClass += " option-card--wrong";
              }
            } else {
              optionClass += " option-card--disabled";
            }
          }

          return (
            <button
              key={option}
              className={optionClass}
              disabled={isAnswered}
              onClick={() => onAnswer(option)}
            >
              <span className="option-letter">{letter}</span>
              <span className="option-text">{option}</span>
              {isAnswered && option === selectedAnswer && (
                selectedAnswer === question.correctAnswer ? (
                  <CheckCircle2 size={16} className="option-icon-correct" />
                ) : (
                  <XCircle size={16} className="option-icon-wrong" />
                )
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Score result panel */
function QuizScorePanel({
  score,
  total,
  attemptsUsed,
  quote,
  onRetry,
  onAdvance,
}: {
  score: number;
  total: number;
  attemptsUsed: number;
  quote?: string;
  onRetry: () => void;
  onAdvance: () => void;
}) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const hasAttemptsLeft = attemptsUsed < MAX_ATTEMPTS;
  const panelRef = useRef<HTMLDivElement>(null);

  const displayQuote =
    quote ||
    "Angka yang Anda hitung barusan menyelamatkan satu nyawa. Itulah sebaik-baiknya amal (Itqan).";

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  let levelText = "Terus Berlatih";
  if (percentage === 100) {
    levelText = "Sempurna";
  } else if (percentage >= 80) {
    levelText = "Sangat Baik";
  } else if (percentage >= 60) {
    levelText = "Cukup Baik";
  }

  return (
    <div ref={panelRef} className="flex flex-col gap-4 md:gap-6 w-full max-w-4xl mx-auto p-4 pb-8 md:p-8 md:pb-8 font-sans mt-4 bg-slate-50 border border-slate-300 rounded-2xl">

      {/* Header Section */}
      <div className="text-center flex flex-col items-center">
        <h3 className="text-xs md:text-sm font-semibold tracking-wider uppercase text-slate-500 mb-2 md:mb-3 flex items-center gap-2">
          <Target size={18} /> Hasil Quiz
        </h3>

        <div className="text-5xl md:text-7xl font-bold tracking-tight leading-none text-slate-900 mt-2 md:mt-0">
          {percentage}
          <span className="text-3xl md:text-5xl font-normal text-slate-500 ml-1 md:ml-2">%</span>
        </div>

        <div className="mt-4 md:mt-5 flex flex-col items-center justify-center gap-2 md:gap-3">
          <span className="px-4 md:px-5 py-1 md:py-1.5 rounded-full border border-slate-300 bg-[#f8fafc] text-[10px] md:text-xs uppercase font-bold tracking-widest text-slate-700">
            {levelText}
          </span>
          <p className="text-sm md:text-base text-slate-500">Anda menjawab <strong className="text-slate-700">{score} dari {total}</strong> soal dengan benar</p>
        </div>
      </div>

      <hr className="border-slate-300 my-1 md:my-2" />

      {/* Stats Row */}
      <div className="flex gap-2 md:gap-4 mt-1 md:mt-2">
        <div className="flex-1 bg-[#f8fafc] border border-slate-300 rounded-xl p-3 md:p-6 text-center flex flex-col justify-center items-center">
          <div className="text-xs md:text-sm text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5">
            <Target size={14} className="hidden md:block" /> Benar
          </div>
          <div className="text-2xl md:text-4xl text-slate-700 font-semibold">{score}<span className="text-sm md:text-lg text-slate-500 font-normal ml-1">/{total}</span></div>
        </div>
        <div className="flex-1 bg-[#f8fafc] border border-slate-300 rounded-xl p-3 md:p-6 text-center flex flex-col justify-center items-center">
          <div className="text-xs md:text-sm text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5">
            <Zap size={14} className="hidden md:block" /> Akurasi
          </div>
          <div className="text-2xl md:text-4xl text-slate-700 font-semibold">{percentage}<span className="text-sm md:text-lg text-slate-500 font-normal ml-1">%</span></div>
        </div>
        <div className="flex-1 bg-[#f8fafc] border border-slate-300 rounded-xl p-3 md:p-6 text-center flex flex-col justify-center items-center">
          <div className="text-xs md:text-sm text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5">
            <RotateCcw size={14} className="hidden md:block" /> Percobaan
          </div>
          <div className="text-2xl md:text-4xl text-slate-700 font-semibold">{attemptsUsed}<span className="text-sm md:text-lg text-slate-500 font-normal ml-1">/{MAX_ATTEMPTS}</span></div>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-3 md:mt-6 mb-1 md:mb-2 flex items-center justify-center px-2 md:px-4">
        <p className="text-sm md:text-lg text-slate-700 font-medium italic text-center leading-relaxed max-w-2xl mx-auto">
          &ldquo;{displayQuote}&rdquo;
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-5 mt-2 md:mt-4">
        <button
          onClick={onRetry}
          className="flex-1 py-3 md:py-3.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm md:text-base hover:bg-[#e2e8f0]/50 transition-colors tracking-wide"
        >
          Buka Kembali Materi {hasAttemptsLeft ? `(${MAX_ATTEMPTS - attemptsUsed} sisa)` : ""}
        </button>
        <button
          onClick={onAdvance}
          className="flex-1 py-3 md:py-3.5 rounded-xl bg-[#2563eb] text-[#f8fafc] font-semibold text-sm md:text-base hover:bg-[#79c0ff] transition-colors tracking-wide"
        >
          Lanjut ke Quiz Selanjutnya
        </button>
      </div>
    </div>
  );
}

/** NUMi Final Exam Result Panel - COMPACT & NEUTRAL UI */
function NUMiScorePanel({
  score,
  total,
  questions,
  currentAnswers,
  onRetry,
  onAdvance,
}: {
  score: number;
  total: number;
  questions: Question[];
  currentAnswers: Record<number, string>;
  onRetry: () => void;
  onAdvance?: () => void;
}) {
  const numiScore = total > 0 ? Math.round((score / total) * 1000) : 0;
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  const getDomainScore = (start: number, count: number) => {
    let correct = 0;
    for (let i = start; i < start + count; i++) {
      const q = questions[i];
      if (q && currentAnswers[q.id] === q.correctAnswer) correct++;
    }
    const pct = count > 0 ? Math.round((correct / count) * 100) : 0;
    return { correct, total: count, pct };
  };

  const domains = [
    { name: "Uji Hipotesis", ...getDomainScore(0, 7) },
    { name: "Distribusi Data", ...getDomainScore(7, 2) },
    { name: "Probabilitas & Teorema Bayes", ...getDomainScore(9, 2) },
    { name: "Tes Diagnostik", ...getDomainScore(11, 3) },
    { name: "Statistik Deskriptif", ...getDomainScore(14, 1) },
    { name: "Desain Studi Epidemiologi", ...getDomainScore(15, 5) },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full max-w-4xl mx-auto p-4 pb-8 md:p-8 md:pb-8 font-sans mt-4 bg-slate-50 border border-slate-300 rounded-2xl">

      {/* Header Section */}
      <div className="text-center flex flex-col items-center">
        <h3 className="text-xs md:text-sm font-semibold tracking-wider uppercase text-slate-500 mb-2 md:mb-3 flex items-center gap-2">
          <BookOpen size={18} /> Indeks Pemahaman Numerik
        </h3>

        <div className="text-5xl md:text-7xl font-bold tracking-tight leading-none text-slate-900 mt-2 md:mt-0">
          {numiScore}
          <span className="text-3xl md:text-5xl font-normal text-slate-500 ml-1 md:ml-2">/ 1000</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-2 md:gap-4 mt-1 md:mt-2">
        <div className="flex-1 bg-[#f8fafc] border border-slate-300 rounded-xl p-3 md:p-6 text-center flex flex-col justify-center items-center">
          <div className="text-xs md:text-sm text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5">
            <Target size={14} className="hidden md:block" /> Benar
          </div>
          <div className="text-2xl md:text-4xl text-slate-700 font-semibold">{score}<span className="text-sm md:text-lg text-slate-500 font-normal ml-1">/{total}</span></div>
        </div>
        <div className="flex-1 bg-[#f8fafc] border border-slate-300 rounded-xl p-3 md:p-6 text-center flex flex-col justify-center items-center">
          <div className="text-xs md:text-sm text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5">
            <Zap size={14} className="hidden md:block" /> Akurasi
          </div>
          <div className="text-2xl md:text-4xl text-slate-700 font-semibold">{accuracy}<span className="text-sm md:text-lg text-slate-500 font-normal ml-1">%</span></div>
        </div>
      </div>

      <hr className="border-slate-300 my-1 md:my-2" />

      {/* Domain Breakdown */}
      <div>
        <h4 className="text-sm md:text-base text-slate-900 font-semibold mb-3 md:mb-4">Rincian per Domain</h4>
        <div className="space-y-3 md:space-y-4">
          {domains.map(d => {
            // Neutral colors: Green for very good, Yellow for okay, Blue for low (avoids aggressive red)
            const barColor = d.pct >= 80 ? '#3fb950' : d.pct >= 60 ? '#d29922' : '#2563eb';
            return (
              <div key={d.name} className="flex flex-col gap-1 md:gap-2">
                <div className="flex justify-between items-center text-xs md:text-[15px]">
                  <span className="text-slate-600 truncate mr-2">{d.name}</span>
                  <span className="font-mono text-slate-500 font-medium shrink-0">
                    {d.correct}/{d.total} <span className="ml-1 md:ml-1.5 text-slate-700">({d.pct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-[#f8fafc] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${d.pct}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interpretasi (Padat) */}
      <div className="bg-[#f8fafc] border border-slate-300 rounded-xl p-4 md:p-5 mt-2">
        <h4 className="text-sm md:text-base text-slate-900 font-semibold mb-3 md:mb-4">Interpretasi NUMi</h4>
        <div className="flex flex-col md:flex-row md:flex-wrap gap-x-12 gap-y-2 md:gap-y-3 text-xs md:text-sm font-mono text-slate-500">
          <div className="flex items-center justify-between md:justify-start gap-2.5 border-b border-slate-200 pb-2 md:pb-0 md:border-0"><span className="text-slate-700 font-medium">900-1000:</span> Ahli</div>
          <div className="flex items-center justify-between md:justify-start gap-2.5 border-b border-slate-200 pb-2 md:pb-0 md:border-0"><span className="text-slate-700 font-medium">750-899:</span> Mahir</div>
          <div className="flex items-center justify-between md:justify-start gap-2.5 border-b border-slate-200 pb-2 md:pb-0 md:border-0"><span className="text-slate-700 font-medium">600-749:</span> Berkembang</div>
          <div className="flex items-center justify-between md:justify-start gap-2.5"><span className="text-slate-700 font-medium">&lt; 600:</span> Dasar</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-5 mt-4 md:mt-6">
        <button
          onClick={onRetry}
          className="flex-1 py-3 md:py-3.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm md:text-base hover:bg-[#e2e8f0]/50 transition-colors tracking-wide"
        >
          Ulangi Ujian Akhir
        </button>
        <button
          onClick={onAdvance}
          className="flex-1 py-3 md:py-3.5 rounded-xl bg-[#2563eb] text-[#f8fafc] font-semibold text-sm md:text-base hover:bg-[#79c0ff] transition-colors tracking-wide"
        >
          Papan Skor
        </button>
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Main QuizPanel  —  paginated, 1 question at a time
// ---------------------------------------------------------------------------

export default function QuizPanel({ quizId }: { quizId: number }) {
  const quiz = quizData.find((q) => q.quizId === quizId);

  const quizState =
    useAppStore((s) => s.quizStates[quizId]) ?? DEFAULT_QUIZ_STATE;

  const startQuiz = useAppStore((s) => s.startQuiz);
  const answerQuestion = useAppStore((s) => s.answerQuestion);
  const finishQuiz = useAppStore((s) => s.finishQuiz);
  const retryQuiz = useAppStore((s) => s.retryQuiz);
  const advanceToNextQuiz = useAppStore((s) => s.advanceToNextQuiz);
  const addToast = useToastStore((s) => s.addToast);

  // Local pagination state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [forceSummary, setForceSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset local state when navigating to a different quiz
  useEffect(() => {
    setCurrentIndex(0);
    setShowResults(false);
    setForceSummary(false);
  }, [quizId]);

  // Reset pagination when quiz restarts
  const { started } = quizState;
  useEffect(() => {
    if (started) {
      setCurrentIndex(0);
      setShowResults(false);
    }
  }, [started]);

  if (!quiz) return null;

  const {
    attemptsUsed,
    currentAnswers,
    lastResult,
    bestResult,
  } = quizState;

  const identity = useAppStore((s) => s.identity);
  const nim = identity?.nim || "default";

  const questions = useMemo(() => {
    // Simple PRNG hash based on nim + quizId
    let h = 0;
    const seed = nim + "-" + quizId;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
    }
    const rand = function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };

    const shuffled = [...quiz.questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = rand() % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [quiz.questions, nim, quizId]);
  const totalQuestions = questions.length;

  // Current question
  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion
    ? currentAnswers[currentQuestion.id]
    : undefined;
  const isCurrentAnswered = currentAnswer !== undefined;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Auto-scroll ke atas saat ganti soal
  useEffect(() => {
    const mainEl = document.querySelector('.app-main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex]);

  // Score calculation
  const currentScore = questions.reduce((acc, q) => {
    if (currentAnswers[q.id] === q.correctAnswer) return acc + 1;
    return acc;
  }, 0);

  const answeredCount = Object.keys(currentAnswers).length;
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;

  const hasFinished = lastResult !== null && !started;

  // Handle "Next" button
  const handleNext = useCallback(async () => {
    if (isLastQuestion) {
      setIsSubmitting(true);

      // 1. Finish the quiz locally FIRST so the Zustand store is perfectly up-to-date
      finishQuiz(quizId, currentScore, totalQuestions);

      // 2. Sync to Supabase in the background
      try {
        const identity = useAppStore.getState().identity;
        if (!identity) throw new Error("Identity not found");

        const { supabase: supabaseClient } = await import("@/src/lib/supabaseClient");
        if (!supabaseClient) {
          throw new Error("Supabase belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        }

        const { data: student, error: studentError } = await supabaseClient
          .from("students")
          .upsert(
            { nim: identity.nim, name: identity.nama, cohort: identity.angkatan },
            { onConflict: "nim" }
          )
          .select("id")
          .single();

        if (studentError) throw studentError;

        const states = useAppStore.getState().quizStates;

        const details = quizData.map((quiz) => {
          const state = states[quiz.quizId];
          if (!state || state.attemptsUsed === 0) return null;

          const answersToUse = state.lastResult ? state.lastResult.answers : state.currentAnswers;

          const answersDetail = quiz.questions.map((q) => {
            const selectedOpt = answersToUse[q.id];
            const selectedIdx = q.options.indexOf(selectedOpt || "");
            const correctIdx = q.options.indexOf(q.correctAnswer);

            return {
              id: q.id.toString(),
              question: q.text,
              selectedOption: selectedIdx !== -1 ? String.fromCharCode(65 + selectedIdx) : "-",
              selectedText: selectedOpt || "-",
              isCorrect: selectedOpt === q.correctAnswer,
              correctOption: correctIdx !== -1 ? String.fromCharCode(65 + correctIdx) : "-",
              correctText: q.correctAnswer,
            };
          });

          const correctCount = answersDetail.filter((a) => a.isCorrect).length;

          return {
            title: quiz.title,
            correct: correctCount,
            total: quiz.questions.length,
            attempts: state.attemptsUsed,
            answers: answersDetail,
          };
        }).filter(Boolean);

        // Compute numiScore safely from details to avoid 0 score if lastResult was null
        const quiz7Detail = details.find((d) => d && (d.title.includes("Ujian Akhir") || d.title.includes("NUMi")));
        let numiScore = 0;
        if (quiz7Detail) {
          numiScore = Math.round((quiz7Detail.correct / quiz7Detail.total) * 1000);
        }

        const { data: existingAttempt } = await supabaseClient
          .from("quiz_attempts")
          .select("id")
          .eq("student_id", student.id)
          .maybeSingle();

        if (existingAttempt) {
          const { error: attemptError } = await supabaseClient
            .from("quiz_attempts")
            .update({
              total_score: numiScore,
              completion_time: new Date().toISOString(),
              details: details,
            })
            .eq("id", existingAttempt.id);
          if (attemptError) throw attemptError;
        } else {
          const { error: attemptError } = await supabaseClient
            .from("quiz_attempts")
            .insert({
              student_id: student.id,
              total_score: numiScore,
              details: details,
            });
          if (attemptError) throw attemptError;
        }
      } catch (err: any) {
        console.error("Error submitting quiz:", err);
        addToast("Gagal memperbarui nilai ke server: " + (err.message || "Pastikan koneksi internet stabil."), "error");
      } finally {
        setIsSubmitting(false);
        setShowResults(true);
      }
    } else {
      setCurrentIndex((prev) => {
        // Mencegah bug double-click (fast click) yang melewati soal
        const freshAnswers = useAppStore.getState().quizStates[quizId]?.currentAnswers || {};
        const q = questions[prev];
        if (q && freshAnswers[q.id] !== undefined) {
          return prev + 1;
        }
        return prev;
      });
    }
  }, [isLastQuestion, quizId, currentScore, totalQuestions, finishQuiz, questions]);

  // Handle retry from score panel (go back to summary first)
  const handleRetryFromScore = useCallback(() => {
    setForceSummary(true);
    setShowResults(false);
  }, []);

  // ----- Render: Summary screen -----
  if ((!started && !hasFinished && !showResults) || forceSummary) {
    return (
      <QuizSummaryScreen
        quizId={quizId}
        title={quizId === 7 ? "Ujian Akhir" : `Quiz ${quizId} – ${quiz.title}`}
        attemptsUsed={attemptsUsed}
        bestResult={bestResult}
        onStart={() => {
          setForceSummary(false);
          if (attemptsUsed > 0) {
            retryQuiz(quizId);
          } else {
            startQuiz(quizId);
          }
        }}
        onAdvance={advanceToNextQuiz}
      />
    );
  }

  // ----- Render: Score results -----
  if ((showResults || hasFinished) && !forceSummary) {
    if (quizId === 7) {
      return (
        <NUMiScorePanel
          score={lastResult ? lastResult.score : currentScore}
          total={totalQuestions}
          questions={questions}
          currentAnswers={currentAnswers}
          onRetry={handleRetryFromScore}
          onAdvance={advanceToNextQuiz}
        />
      );
    }

    const displayAttemptsUsed = lastResult ? attemptsUsed : attemptsUsed + 1;

    return (
      <QuizScorePanel
        score={lastResult ? lastResult.score : currentScore}
        total={totalQuestions}
        attemptsUsed={displayAttemptsUsed}
        quote={quiz.quote}
        onRetry={handleRetryFromScore}
        onAdvance={advanceToNextQuiz}
      />
    );
  }

  // ----- Render: Paginated question view -----
  return (
    <div className="quiz-panel">
      {/* Header bar */}
      <div className="quiz-header-bar">
        <h2 className="text-lg md:text-2xl font-bold text-center text-slate-800">
          {quizId === 7 ? "Ujian Akhir" : `Quiz ${quizId} – ${quiz.title}`}
        </h2>
        <span className="quiz-header-meta">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Segmented progress bar */}
      <SegmentedProgressBar
        questions={questions}
        currentAnswers={currentAnswers}
        currentIndex={currentIndex}
        onSegmentClick={(idx) => {
          // Allow navigating to answered questions or current
          if (idx <= answeredCount) {
            setCurrentIndex(idx);
          }
        }}
      />

      {/* Single question */}
      {currentQuestion && (
        <QuestionView
          question={currentQuestion}
          index={currentIndex}
          total={totalQuestions}
          selectedAnswer={currentAnswer}
          onAnswer={(answer) =>
            answerQuestion(quizId, currentQuestion.id, answer)
          }
        />
      )}

      {/* Next / See Results button */}
      {isCurrentAnswered && (
        <button className="quiz-next-btn" onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Menyimpan Hasil...
            </>
          ) : isLastQuestion ? (
            <>
              <Eye size={16} />
              Lihat Hasil
            </>
          ) : (
            <>
              Selanjutnya
              <ArrowRight size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

