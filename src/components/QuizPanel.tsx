"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAppStore, DEFAULT_QUIZ_STATE } from "@/src/store/useAppStore";
import { quizData, type Question } from "@/src/data/quizData";
import Quiz1Summary from "@/src/components/Quiz1Summary";
import MateriDistribusi from "@/src/components/MateriDistribusi";
import Quiz3Summary from "@/src/components/Quiz3Summary";
import Quiz4Summary from "@/src/components/Quiz4Summary";
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
} from "lucide-react";

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
  summary,
  attemptsUsed,
  bestResult,
  onStart,
}: {
  quizId: number;
  title: string;
  summary: string;
  attemptsUsed: number;
  bestResult: { score: number; total: number } | null;
  onStart: () => void;
}) {
  const hasAttemptsLeft = attemptsUsed < MAX_ATTEMPTS;
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);

  return (
    <div className="quiz-summary-screen">
      <div className="quiz-summary-header">
        <div className="quiz-summary-icon">
          <BookOpen size={32} strokeWidth={1.5} />
        </div>
        <h2 className="quiz-summary-title">{title}</h2>
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
            ) : (
              <p className="quiz-summary-text">{summary}</p>
            )}
          </div>
        )}
      </div>

      {hasAttemptsLeft ? (
        <button className="quiz-start-btn" onClick={onStart}>
          <Play size={18} />
          {attemptsUsed > 0 ? "Ulangi Kuis" : "Mulai Kuis"}
        </button>
      ) : (
        <div className="quiz-no-attempts">
          <span>Anda telah menggunakan semua percobaan.</span>
        </div>
      )}
    </div>
  );
}

/** Segmented progress bar — each segment shows question status */
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

  return (
    <div className="quiz-score-panel" ref={panelRef}>
      <div className="quiz-score-header">
        <div
          className={`quiz-score-circle ${percentage >= 80
              ? "quiz-score-circle--great"
              : percentage >= 60
                ? "quiz-score-circle--good"
                : "quiz-score-circle--low"
            }`}
        >
          <span className="quiz-score-value">{percentage}%</span>
        </div>
        <h3 className="quiz-score-title">
          {percentage === 100
            ? "Sempurna"
            : percentage >= 80
              ? "Hasil Sangat Baik"
              : percentage >= 60
                ? "Cukup Baik"
                : "Terus Berlatih"}
        </h3>
        <p className="quiz-score-detail">
          Anda menjawab{" "}
          <strong>
            {score} dari {total}
          </strong>{" "}
          soal dengan benar
        </p>
      </div>

      <div className="quiz-score-stats">
        <div className="score-stat-card">
          <Target size={20} />
          <span className="score-stat-value">
            {score}/{total}
          </span>
          <span className="score-stat-label">Total Benar</span>
        </div>
        <div className="score-stat-card">
          <Zap size={20} />
          <span className="score-stat-value">{percentage}%</span>
          <span className="score-stat-label">Akurasi</span>
        </div>
        <div className="score-stat-card">
          <RotateCcw size={20} />
          <span className="score-stat-value">
            {attemptsUsed}/{MAX_ATTEMPTS}
          </span>
          <span className="score-stat-label">Percobaan</span>
        </div>
      </div>

      {/* Quote Refleksi Pasca Kuis */}
      <div className="quiz-completion-quote">
        <Quote size={18} className="quiz-quote-icon" />
        <p className="quiz-quote-text">&ldquo;{displayQuote}&rdquo;</p>
      </div>

      <div className="quiz-score-actions">
        {hasAttemptsLeft && (
          <button className="quiz-retry-btn" onClick={onRetry}>
            <RotateCcw size={16} />
            Ulangi Kuis ({MAX_ATTEMPTS - attemptsUsed} sisa)
          </button>
        )}
        <button className="quiz-advance-btn" onClick={onAdvance}>
          Lanjut ke Kuis Selanjutnya
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main QuizPanel — paginated, 1 question at a time
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

  // Local pagination state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Reset local state when navigating to a different quiz
  useEffect(() => {
    setCurrentIndex(0);
    setShowResults(false);
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

  const questions = quiz.questions;
  const totalQuestions = questions.length;

  // Current question
  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion
    ? currentAnswers[currentQuestion.id]
    : undefined;
  const isCurrentAnswered = currentAnswer !== undefined;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Score calculation
  const currentScore = questions.reduce((acc, q) => {
    if (currentAnswers[q.id] === q.correctAnswer) return acc + 1;
    return acc;
  }, 0);

  const answeredCount = Object.keys(currentAnswers).length;
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;

  const hasFinished = lastResult !== null && !started;

  // Handle "Next" button
  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      // Finish the quiz and show results
      finishQuiz(quizId, currentScore, totalQuestions);
      setShowResults(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLastQuestion, quizId, currentScore, totalQuestions, finishQuiz]);

  // Handle retry
  const handleRetry = useCallback(() => {
    retryQuiz(quizId);
    setCurrentIndex(0);
    setShowResults(false);
  }, [quizId, retryQuiz]);

  // ----- Render: Summary screen -----
  if (!started && !hasFinished && !showResults) {
    return (
      <QuizSummaryScreen
        quizId={quizId}
        title={`Quiz ${quizId} — ${quiz.title}`}
        summary={quiz.summary}
        attemptsUsed={attemptsUsed}
        bestResult={bestResult}
        onStart={() => {
          if (attemptsUsed > 0) {
            retryQuiz(quizId);
          } else {
            startQuiz(quizId);
          }
        }}
      />
    );
  }

  // ----- Render: Score results -----
  if (showResults || hasFinished) {
    const displayAttemptsUsed = lastResult ? attemptsUsed : attemptsUsed + 1;

    return (
      <QuizScorePanel
        score={lastResult ? lastResult.score : currentScore}
        total={totalQuestions}
        attemptsUsed={displayAttemptsUsed}
        quote={quiz.quote}
        onRetry={handleRetry}
        onAdvance={advanceToNextQuiz}
      />
    );
  }

  // ----- Render: Paginated question view -----
  return (
    <div className="quiz-panel">
      {/* Header bar */}
      <div className="quiz-header-bar">
        <h2 className="quiz-header-title">
          Quiz {quizId} — {quiz.title}
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
        <button className="quiz-next-btn" onClick={handleNext}>
          {isLastQuestion ? (
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

