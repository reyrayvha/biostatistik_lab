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
  Info,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useToastStore } from "@/src/store/useToastStore";
import { FlashcardButton } from "@/src/components/Flashcard";
import FloatingTimer from "@/src/components/FloatingTimer";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SUMMARY_DURATION = 240; // 4 menit membaca & eksplorasi materi
const QUESTION_DURATION = 60; // 1 menit per soal

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Summary / pre-quiz screen */
function QuizSummaryScreen({
  quizId,
  title,
  bestResult,
  onStart,
  onAdvance,
  summarySecondsLeft,
}: {
  quizId: number;
  title: string;
  bestResult: { score: number; total: number } | null;
  onStart: () => void;
  onAdvance?: () => void;
  summarySecondsLeft?: number;
}) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);

  return (
    <div className="quiz-summary-screen">
      <div className="quiz-summary-header">
        <div className="quiz-summary-icon">
          <BookOpen size={32} strokeWidth={1.5} />
        </div>
        <h2 className="text-lg md:text-2xl font-bold text-center text-slate-800 dark:text-slate-100">{title}</h2>

        {/* Time indicator for reading material when not yet finished */}
        {quizId !== 7 && !bestResult && summarySecondsLeft !== undefined && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300 text-xs font-semibold mt-1">
            <Clock size={14} className="text-blue-600 dark:text-blue-400" />
            <span>
              Waktu Eksplorasi Materi: {Math.floor(summarySecondsLeft / 60)}:{(summarySecondsLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      {bestResult && (
        <div className="quiz-best-score-banner">
          <CheckCircle2 size={18} />
          <span>
            Kuis telah diselesaikan. Skor tersimpan:{" "}
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
          {!bestResult ? (
            <button
              className="flex-1 py-3.5 rounded-xl font-semibold text-base transition-colors tracking-wide bg-[#2563eb] text-[#f8fafc] hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none"
              onClick={onStart}
            >
              {quizId === 7 ? "Mulai Ujian Akhir" : "Mulai Quiz"}
            </button>
          ) : onAdvance ? (
            <button
              className="flex-1 py-3.5 rounded-xl bg-[#2563eb] text-[#f8fafc] font-semibold text-base hover:bg-blue-700 transition-colors tracking-wide shadow-md shadow-blue-200 dark:shadow-none"
              onClick={onAdvance}
            >
              {quizId === 7 ? "Lihat Papan Skor" : "Lanjut Quiz Berikutnya"}
            </button>
          ) : null}
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
}: {
  questions: Question[];
  currentAnswers: Record<number, string>;
  currentIndex: number;
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
          <div
            key={q.id}
            className={segClass}
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
  remainingSeconds,
}: {
  question: Question;
  index: number;
  total: number;
  selectedAnswer: string | undefined;
  onAnswer: (answer: string) => void;
  remainingSeconds?: number;
}) {
  const isAnswered = selectedAnswer !== undefined;

  return (
    <div className="question-card" key={`q-${question.id}-${index}`} style={{ animation: "slideLeft 0.3s ease" }}>
      {/* Question header */}
      <div className="question-header">
        <div className="flex items-center gap-2">
          <span className="question-number">
            <Hash size={14} />
            Soal {index + 1} dari {total}
          </span>
          {remainingSeconds !== undefined && (
            <span
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border transition-colors ${
                remainingSeconds <= 10
                  ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800 animate-pulse"
                  : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}
            >
              <Clock size={12} />
              {Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, "0")}
            </span>
          )}
        </div>
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
  quote,
  onAdvance,
}: {
  score: number;
  total: number;
  quote?: string;
  onAdvance: () => void;
}) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
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
    <div ref={panelRef} className="flex flex-col gap-4 md:gap-6 w-full max-w-4xl mx-auto p-4 pb-8 md:p-8 md:pb-8 font-sans mt-4 bg-slate-50 border border-slate-300 rounded-2xl dark:bg-slate-900 dark:border-slate-800">

      {/* Header Section */}
      <div className="text-center flex flex-col items-center">
        <h3 className="text-xs md:text-sm font-semibold tracking-wider uppercase text-slate-500 mb-2 md:mb-3 flex items-center gap-2">
          <Target size={18} /> Hasil Quiz
        </h3>

        <div className="text-5xl md:text-7xl font-bold tracking-tight leading-none text-slate-900 dark:text-slate-100 mt-2 md:mt-0">
          {percentage}
          <span className="text-3xl md:text-5xl font-normal text-slate-500 ml-1 md:ml-2">%</span>
        </div>

        <div className="mt-4 md:mt-5 flex flex-col items-center justify-center gap-2 md:gap-3">
          <span className="px-4 md:px-5 py-1 md:py-1.5 rounded-full border border-slate-300 bg-[#f8fafc] text-[10px] md:text-xs uppercase font-bold tracking-widest text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
            {levelText}
          </span>
          <p className="text-sm md:text-base text-slate-500">Anda menjawab <strong className="text-slate-700 dark:text-slate-200">{score} dari {total}</strong> soal dengan benar</p>
        </div>
      </div>

      <hr className="border-slate-300 dark:border-slate-800 my-1 md:my-2" />

      {/* Stats Row - 2 columns */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mt-1 md:mt-2">
        <div className="bg-[#f8fafc] border border-slate-300 rounded-xl p-4 md:p-6 text-center flex flex-col justify-center items-center dark:bg-slate-800/60 dark:border-slate-700">
          <div className="text-xs md:text-sm text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5">
            <Target size={14} className="hidden md:block" /> Benar
          </div>
          <div className="text-2xl md:text-4xl text-slate-700 dark:text-slate-200 font-semibold">{score}<span className="text-sm md:text-lg text-slate-500 font-normal ml-1">/{total}</span></div>
        </div>
        <div className="bg-[#f8fafc] border border-slate-300 rounded-xl p-4 md:p-6 text-center flex flex-col justify-center items-center dark:bg-slate-800/60 dark:border-slate-700">
          <div className="text-xs md:text-sm text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5">
            <Zap size={14} className="hidden md:block" /> Akurasi
          </div>
          <div className="text-2xl md:text-4xl text-slate-700 dark:text-slate-200 font-semibold">{percentage}<span className="text-sm md:text-lg text-slate-500 font-normal ml-1">%</span></div>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-3 md:mt-6 mb-1 md:mb-2 flex items-center justify-center px-2 md:px-4">
        <p className="text-sm md:text-lg text-slate-700 dark:text-slate-300 font-medium italic text-center leading-relaxed max-w-2xl mx-auto">
          &ldquo;{displayQuote}&rdquo;
        </p>
      </div>

      {/* Actions */}
      <div className="mt-2 md:mt-4">
        <button
          onClick={onAdvance}
          className="w-full py-3.5 rounded-xl bg-[#2563eb] text-[#f8fafc] font-semibold text-sm md:text-base hover:bg-blue-700 transition-colors tracking-wide shadow-md shadow-blue-200 dark:shadow-none"
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
  onAdvance,
}: {
  score: number;
  total: number;
  questions: Question[];
  currentAnswers: Record<number, string>;
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
    <div className="flex flex-col gap-4 md:gap-6 w-full max-w-4xl mx-auto p-4 pb-8 md:p-8 md:pb-8 font-sans mt-4 bg-slate-50 border border-slate-300 rounded-2xl dark:bg-slate-900 dark:border-slate-800">

      {/* Header Section */}
      <div className="text-center flex flex-col items-center">
        <h3 className="text-xs md:text-sm font-semibold tracking-wider uppercase text-slate-500 mb-2 md:mb-3 flex items-center gap-2">
          <BookOpen size={18} /> Indeks Pemahaman Numerik
        </h3>

        <div className="text-5xl md:text-7xl font-bold tracking-tight leading-none text-slate-900 dark:text-slate-100 mt-2 md:mt-0">
          {numiScore}
          <span className="text-3xl md:text-5xl font-normal text-slate-500 ml-1 md:ml-2">/ 1000</span>
        </div>
      </div>

      {/* Stats Row - 2 columns */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mt-1 md:mt-2">
        <div className="bg-[#f8fafc] border border-slate-300 rounded-xl p-4 md:p-6 text-center flex flex-col justify-center items-center dark:bg-slate-800/60 dark:border-slate-700">
          <div className="text-xs md:text-sm text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5">
            <Target size={14} className="hidden md:block" /> Benar
          </div>
          <div className="text-2xl md:text-4xl text-slate-700 dark:text-slate-200 font-semibold">{score}<span className="text-sm md:text-lg text-slate-500 font-normal ml-1">/{total}</span></div>
        </div>
        <div className="bg-[#f8fafc] border border-slate-300 rounded-xl p-4 md:p-6 text-center flex flex-col justify-center items-center dark:bg-slate-800/60 dark:border-slate-700">
          <div className="text-xs md:text-sm text-slate-500 uppercase font-bold tracking-widest mb-1 md:mb-2 flex items-center justify-center gap-1.5">
            <Zap size={14} className="hidden md:block" /> Akurasi
          </div>
          <div className="text-2xl md:text-4xl text-slate-700 dark:text-slate-200 font-semibold">{accuracy}<span className="text-sm md:text-lg text-slate-500 font-normal ml-1">%</span></div>
        </div>
      </div>

      <hr className="border-slate-300 dark:border-slate-800 my-1 md:my-2" />

      {/* Domain Breakdown */}
      <div>
        <h4 className="text-sm md:text-base text-slate-900 dark:text-slate-100 font-semibold mb-3 md:mb-4">Rincian per Domain</h4>
        <div className="space-y-3 md:space-y-4">
          {domains.map(d => {
            const barColor = d.pct >= 80 ? '#3fb950' : d.pct >= 60 ? '#d29922' : '#2563eb';
            return (
              <div key={d.name} className="flex flex-col gap-1 md:gap-2">
                <div className="flex justify-between items-center text-xs md:text-[15px]">
                  <span className="text-slate-600 dark:text-slate-300 truncate mr-2">{d.name}</span>
                  <span className="font-mono text-slate-500 font-medium shrink-0">
                    {d.correct}/{d.total} <span className="ml-1 md:ml-1.5 text-slate-700 dark:text-slate-200">({d.pct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-[#f8fafc] dark:bg-slate-800 rounded-full overflow-hidden">
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
      <div className="bg-[#f8fafc] border border-slate-300 rounded-xl p-4 md:p-5 mt-2 dark:bg-slate-800/60 dark:border-slate-700">
        <h4 className="text-sm md:text-base text-slate-900 dark:text-slate-100 font-semibold mb-3 md:mb-4">Interpretasi NUMi</h4>
        <div className="flex flex-col md:flex-row md:flex-wrap gap-x-12 gap-y-2 md:gap-y-3 text-xs md:text-sm font-mono text-slate-500">
          <div className="flex items-center justify-between md:justify-start gap-2.5 border-b border-slate-200 dark:border-slate-700 pb-2 md:pb-0 md:border-0"><span className="text-slate-700 dark:text-slate-200 font-medium">900-1000:</span> Ahli</div>
          <div className="flex items-center justify-between md:justify-start gap-2.5 border-b border-slate-200 dark:border-slate-700 pb-2 md:pb-0 md:border-0"><span className="text-slate-700 dark:text-slate-200 font-medium">750-899:</span> Mahir</div>
          <div className="flex items-center justify-between md:justify-start gap-2.5 border-b border-slate-200 dark:border-slate-700 pb-2 md:pb-0 md:border-0"><span className="text-slate-700 dark:text-slate-200 font-medium">600-749:</span> Berkembang</div>
          <div className="flex items-center justify-between md:justify-start gap-2.5"><span className="text-slate-700 dark:text-slate-200 font-medium">&lt; 600:</span> Dasar</div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 md:mt-6">
        <button
          onClick={onAdvance}
          className="w-full py-3.5 rounded-xl bg-[#2563eb] text-[#f8fafc] font-semibold text-sm md:text-base hover:bg-blue-700 transition-colors tracking-wide shadow-md shadow-blue-200 dark:shadow-none"
        >
          Lihat Papan Skor
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
  const advanceToNextQuiz = useAppStore((s) => s.advanceToNextQuiz);
  const quizStartConfirmed = useAppStore((s) => s.quizStartConfirmed);
  const addToast = useToastStore((s) => s.addToast);

  // Local pagination state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [forceSummary, setForceSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer states: 4 minutes for summary (Quiz 1-6), 1 minute per question
  const [summarySecondsLeft, setSummarySecondsLeft] = useState(SUMMARY_DURATION);
  const [questionSecondsLeft, setQuestionSecondsLeft] = useState(QUESTION_DURATION);

  // Reset local state when navigating to a different quiz
  useEffect(() => {
    setCurrentIndex(0);
    setShowResults(false);
    setForceSummary(false);
    setSummarySecondsLeft(SUMMARY_DURATION);
    setQuestionSecondsLeft(QUESTION_DURATION);
  }, [quizId]);

  // Reset pagination and question timer when quiz restarts or starts
  const { started } = quizState;
  useEffect(() => {
    if (started) {
      setCurrentIndex(0);
      setShowResults(false);
      setQuestionSecondsLeft(QUESTION_DURATION);
    }
  }, [started]);

  // Reset question timer whenever currentIndex changes during an active quiz
  useEffect(() => {
    if (started) {
      setQuestionSecondsLeft(QUESTION_DURATION);
    }
  }, [currentIndex, started]);

  if (!quiz) return null;

  const {
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
  const hasFinished = lastResult !== null && !started;

  // 1. Summary Countdown Timer Effect (4 minutes for Quiz 1-6)
  // ONLY runs once user has confirmed starting the quiz in VerificationStartModal
  useEffect(() => {
    if (
      !quizStartConfirmed ||
      quizId === 7 ||
      bestResult ||
      started ||
      hasFinished ||
      showResults ||
      forceSummary
    ) {
      return;
    }

    const interval = setInterval(() => {
      setSummarySecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizStartConfirmed, quizId, bestResult, started, hasFinished, showResults, forceSummary]);

  // Auto-start quiz when 4-minute summary timer runs out
  useEffect(() => {
    if (
      quizStartConfirmed &&
      summarySecondsLeft === 0 &&
      !started &&
      !bestResult &&
      !hasFinished &&
      !showResults &&
      quizId !== 7
    ) {
      addToast("Waktu membaca materi (4 menit) telah habis. Kuis dimulai!", "info");
      startQuiz(quizId);
    }
  }, [quizStartConfirmed, summarySecondsLeft, started, bestResult, hasFinished, showResults, quizId, startQuiz, addToast]);

  // 2. Question Countdown Timer Effect (1 minute per question for Quiz 1-7)
  // ONLY runs when user has confirmed and quiz is started
  useEffect(() => {
    if (!quizStartConfirmed || !started || showResults || hasFinished) return;

    const interval = setInterval(() => {
      setQuestionSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizStartConfirmed, started, showResults, hasFinished, currentIndex]);

  // Handle "Next" button & Auto-advance on time up
  const handleNext = useCallback(async (isTimeUp = false) => {
    if (isSubmitting) return;

    if (isLastQuestion) {
      setIsSubmitting(true);

      // 1. Finish the quiz locally FIRST so the Zustand store is perfectly up-to-date
      finishQuiz(quizId, currentScore, totalQuestions);

      // 2. Sync to Supabase in the background
      try {
        const currentIdentity = useAppStore.getState().identity;
        if (!currentIdentity) throw new Error("Identity not found");

        const { supabase: supabaseClient } = await import("@/src/lib/supabaseClient");
        if (!supabaseClient) {
          throw new Error("Supabase belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        }

        const { data: student, error: studentError } = await supabaseClient
          .from("students")
          .upsert(
            { nim: currentIdentity.nim, name: currentIdentity.nama, cohort: currentIdentity.angkatan },
            { onConflict: "nim" }
          )
          .select("id")
          .single();

        if (studentError) throw studentError;

        const states = useAppStore.getState().quizStates;

        const details = quizData.map((quizItem) => {
          const state = states[quizItem.quizId];
          if (!state || state.attemptsUsed === 0) return null;

          const answersToUse = (state.lastResult && Object.keys(state.lastResult.answers).length > 0)
            ? state.lastResult.answers
            : (state.bestResult && Object.keys(state.bestResult.answers).length > 0)
              ? state.bestResult.answers
              : state.currentAnswers;

          const answersDetail = quizItem.questions.map((q) => {
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
            title: quizItem.title,
            correct: correctCount,
            total: quizItem.questions.length,
            attempts: state.attemptsUsed,
            answers: answersDetail,
          };
        }).filter(Boolean);

        // Compute numiScore safely from details based ONLY on Ujian Akhir (Quiz 7)
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
      if (isTimeUp) {
        setCurrentIndex((prev) => prev + 1);
        setQuestionSecondsLeft(QUESTION_DURATION);
      } else {
        setCurrentIndex((prev) => {
          const freshAnswers = useAppStore.getState().quizStates[quizId]?.currentAnswers || {};
          const q = questions[prev];
          if (q && freshAnswers[q.id] !== undefined) {
            return prev + 1;
          }
          return prev;
        });
        setQuestionSecondsLeft(QUESTION_DURATION);
      }
    }
  }, [isSubmitting, isLastQuestion, quizId, currentScore, totalQuestions, finishQuiz, questions, addToast]);

  // Auto-advance when question time runs out (1 minute per question)
  useEffect(() => {
    if (quizStartConfirmed && questionSecondsLeft === 0 && started && !showResults && !hasFinished && !isSubmitting) {
      if (!isLastQuestion) {
        addToast(`Waktu untuk Soal ${currentIndex + 1} habis! Beralih ke soal berikutnya.`, "warning");
      } else {
        addToast("Waktu pengerjaan soal habis! Kuis selesai.", "info");
      }
      handleNext(true);
    }
  }, [quizStartConfirmed, questionSecondsLeft, started, showResults, hasFinished, isSubmitting, isLastQuestion, currentIndex, handleNext, addToast]);

  // ----- Render: Summary screen -----
  if ((!started && !hasFinished && !showResults) || forceSummary) {
    return (
      <>
        <QuizSummaryScreen
          quizId={quizId}
          title={quizId === 7 ? "Ujian Akhir" : `Quiz ${quizId} – ${quiz.title}`}
          bestResult={bestResult}
          onStart={() => {
            setForceSummary(false);
            startQuiz(quizId);
          }}
          onAdvance={advanceToNextQuiz}
          summarySecondsLeft={quizStartConfirmed ? summarySecondsLeft : undefined}
        />
        {quizStartConfirmed && quizId !== 7 && !bestResult && (
          <FloatingTimer
            totalSeconds={SUMMARY_DURATION}
            remainingSeconds={summarySecondsLeft}
            label="Waktu Materi"
          />
        )}
      </>
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
          onAdvance={advanceToNextQuiz}
        />
      );
    }

    return (
      <QuizScorePanel
        score={lastResult ? lastResult.score : currentScore}
        total={totalQuestions}
        quote={quiz.quote}
        onAdvance={advanceToNextQuiz}
      />
    );
  }

  // ----- Render: Paginated question view -----
  return (
    <>
      <div className="quiz-panel">
        {/* Header bar */}
        <div className="quiz-header-bar">
          <h2 className="text-lg md:text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
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
            remainingSeconds={quizStartConfirmed ? questionSecondsLeft : undefined}
          />
        )}

        {/* Next / See Results button */}
        {isCurrentAnswered && (
          <button className="quiz-next-btn" onClick={() => handleNext(false)} disabled={isSubmitting}>
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

      {/* Floating circular countdown timer - outside quiz-panel */}
      {quizStartConfirmed && (
        <FloatingTimer
          totalSeconds={QUESTION_DURATION}
          remainingSeconds={questionSecondsLeft}
          label={`Soal ${currentIndex + 1}/${totalQuestions}`}
        />
      )}
    </>
  );
}

