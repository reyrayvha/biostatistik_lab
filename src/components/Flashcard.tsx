"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { flashcardsByQuiz, type Flashcard as FlashcardType } from "@/src/data/flashcardData";

interface FlashcardViewerProps {
  quizId: string;
  quizTitle: string;
  flashcards: FlashcardType[];
}

function FlashcardViewer({ quizId, quizTitle, flashcards }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [displayCards, setDisplayCards] = useState(flashcards);

  useEffect(() => {
    setDisplayCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffled(false);
  }, [flashcards]);

  const currentCard = displayCards[currentIndex] ?? flashcards[0];

  const progress = useMemo(() => {
    if (!displayCards.length) return 0;
    return ((currentIndex + 1) / displayCards.length) * 100;
  }, [currentIndex, displayCards.length]);

  const handlePrevious = () => {
    if (!displayCards.length) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : displayCards.length - 1));
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (!displayCards.length) return;
    setCurrentIndex((prev) => (prev < displayCards.length - 1 ? prev + 1 : 0));
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    if (!displayCards.length) return;
    const nextCards = shuffled ? flashcards : [...displayCards].sort(() => Math.random() - 0.5);
    setDisplayCards(nextCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffled((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") handlePrevious();
      if (event.key === "ArrowRight") handleNext();
      if (event.key === " ") {
        event.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [displayCards.length, currentIndex, shuffled]);

  if (!currentCard) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-1">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{quizTitle}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Kartu {currentIndex + 1} dari {displayCards.length}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsFlipped((prev) => !prev)}
        aria-label={isFlipped ? "Tampilkan pertanyaan" : "Tampilkan jawaban"}
        className="relative mb-6 h-72 w-full cursor-pointer rounded-2xl border border-blue-200 bg-transparent p-0 text-center shadow-xl transition-transform duration-300 hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        style={{ perspective: "1200px" }}
      >
        <span
          className="absolute inset-0 block rounded-2xl transition-transform duration-500"
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {[currentCard.front, currentCard.back].map((content, index) => {
            const isAnswer = index === 1;
            return (
              <span
                key={isAnswer ? "answer" : "question"}
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-6"
                style={{
                  backfaceVisibility: "hidden",
                  transform: isAnswer ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_55%)]" />
                <span className="relative z-10 flex max-w-lg flex-col items-center">
                  <span className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                    {isAnswer ? "Jawaban" : "Pertanyaan"}
                  </span>
                  <span className="text-xl font-bold text-white md:text-2xl">
                    {content}
                  </span>
                  <span className="mt-5 text-xs text-blue-100">
                    {isAnswer ? "Klik untuk membalik ke depan" : "Klik kartu untuk membalik"}
                  </span>
                </span>
              </span>
            );
          })}
        </span>
      </button>

      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrevious}
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          aria-label="Kartu sebelumnya"
          title="Previous card (Arrow Left)"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/70 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          aria-label="Kartu berikutnya"
          title="Next card (Arrow Right)"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleShuffle}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            shuffled
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <Shuffle size={16} />
          {shuffled ? "Shuffle: On" : "Shuffle"}
        </button>
      </div>

      <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
        Gunakan panah kiri/kanan atau tombol spasi untuk membalik kartu.
      </div>

      <div className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
        Quiz ID: {quizId}
      </div>
    </div>
  );
}

interface FlashcardButtonProps {
  quizId: string;
  quizTitle: string;
}

export function FlashcardButton({ quizId, quizTitle }: FlashcardButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const flashcards = flashcardsByQuiz[quizId] ?? [];

  if (!flashcards.length) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500"
      >
        <BookOpen size={16} />
        Belajar dengan Flashcard
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Flashcard</p>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{quizTitle}</h3>
              </div>
            </div>

            <div className="p-4 md:p-6">
              <FlashcardViewer quizId={quizId} quizTitle={quizTitle} flashcards={flashcards} />
            </div>
            <div className="flex justify-end border-t border-slate-200 px-4 py-3 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
