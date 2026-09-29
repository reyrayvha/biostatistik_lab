"use client";

import { create } from "zustand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserIdentity = {
  nama: string;
  nim: string;
  angkatan: string;
};

export type TabId =
  | "identitas"
  | "quiz-1"
  | "quiz-2"
  | "quiz-3"
  | "quiz-4"
  | "quiz-5"
  | "quiz-6"
  | "quiz-7"
  | "leaderboard";

export const TAB_ORDER: TabId[] = [
  "identitas",
  "quiz-1",
  "quiz-2",
  "quiz-3",
  "quiz-4",
  "quiz-5",
  "quiz-6",
  "quiz-7",
  "leaderboard",
];

export const TAB_LABELS: Record<TabId, string> = {
  identitas: "Data Diri",
  "quiz-1": "Statistik Deskriptif",
  "quiz-2": "Distribusi",
  "quiz-3": "Probabilitas & Bayes",
  "quiz-4": "Uji Hipotesis",
  "quiz-5": "Tes Diagnostik",
  "quiz-6": "Desain Studi",
  "quiz-7": "Ujian Akhir NUMi",
  leaderboard: "Papan Skor",
};

// ---------------------------------------------------------------------------
// Quiz State Types
// ---------------------------------------------------------------------------

/** Maps question id → selected answer string */
export type QuizAnswers = Record<number, string>;

export type QuizResult = {
  score: number;
  total: number;
  answers: QuizAnswers;
};

export type QuizState = {
  /** How many attempts the user has used for this quiz */
  attemptsUsed: number;
  /** Whether the quiz is currently in-progress (questions shown) */
  started: boolean;
  /** Current attempt's answers (question id → selected option) */
  currentAnswers: QuizAnswers;
  /** Best result across attempts */
  bestResult: QuizResult | null;
  /** Most recent result (used for display after finishing) */
  lastResult: QuizResult | null;
};

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

type AppState = {
  // Identity
  identity: UserIdentity | null;
  setIdentity: (identity: UserIdentity) => void;

  // Navigation
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  unlockedIndex: number;
  unlockNext: () => void;
  isTabUnlocked: (tab: TabId) => boolean;

  // Quiz
  quizStates: Record<number, QuizState>;
  startQuiz: (quizId: number) => void;
  answerQuestion: (quizId: number, questionId: number, answer: string) => void;
  finishQuiz: (quizId: number, score: number, total: number) => void;
  retryQuiz: (quizId: number) => void;

  /** Advance to the next tab and navigate there */
  advanceToNextQuiz: () => void;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Stable, frozen default — safe to use as selector fallback without causing re-renders. */
export const DEFAULT_QUIZ_STATE: Readonly<QuizState> = Object.freeze({
  attemptsUsed: 0,
  started: false,
  currentAnswers: Object.freeze({}) as QuizAnswers,
  bestResult: null,
  lastResult: null,
});

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

export const useAppStore = create<AppState>((set, get) => ({
  // === Identity ===
  identity: null,
  setIdentity: (identity) => {
    const current = get().unlockedIndex;
    set({
      identity,
      unlockedIndex: Math.max(current, 1),
      activeTab: "quiz-1",
    });
  },

  // === Navigation ===
  activeTab: "identitas",
  setActiveTab: (tab) => {
    if (get().isTabUnlocked(tab)) {
      set({ activeTab: tab });
    }
  },

  unlockedIndex: 0,
  unlockNext: () => {
    const current = get().unlockedIndex;
    if (current < TAB_ORDER.length - 1) {
      set({ unlockedIndex: current + 1 });
    }
  },

  isTabUnlocked: (tab) => {
    const idx = TAB_ORDER.indexOf(tab);
    return idx <= get().unlockedIndex;
  },

  // === Quiz ===
  quizStates: {},

  startQuiz: (quizId) => {
    const prev = get().quizStates[quizId] ?? { ...DEFAULT_QUIZ_STATE };
    set({
      quizStates: {
        ...get().quizStates,
        [quizId]: {
          ...prev,
          started: true,
          currentAnswers: {},
          lastResult: null,
        },
      },
    });
  },

  answerQuestion: (quizId, questionId, answer) => {
    const prev = get().quizStates[quizId] ?? { ...DEFAULT_QUIZ_STATE };
    set({
      quizStates: {
        ...get().quizStates,
        [quizId]: {
          ...prev,
          currentAnswers: {
            ...prev.currentAnswers,
            [questionId]: answer,
          },
        },
      },
    });
  },

  finishQuiz: (quizId, score, total) => {
    const prev = get().quizStates[quizId] ?? { ...DEFAULT_QUIZ_STATE };
    const newResult: QuizResult = {
      score,
      total,
      answers: { ...prev.currentAnswers },
    };

    const bestResult =
      prev.bestResult && prev.bestResult.score >= score
        ? prev.bestResult
        : newResult;

    set({
      quizStates: {
        ...get().quizStates,
        [quizId]: {
          ...prev,
          attemptsUsed: prev.attemptsUsed + 1,
          started: false,
          lastResult: newResult,
          bestResult,
        },
      },
    });
  },

  retryQuiz: (quizId) => {
    const prev = get().quizStates[quizId] ?? { ...DEFAULT_QUIZ_STATE };
    set({
      quizStates: {
        ...get().quizStates,
        [quizId]: {
          ...prev,
          started: true,
          currentAnswers: {},
          lastResult: null,
        },
      },
    });
  },

  advanceToNextQuiz: () => {
    const { unlockedIndex } = get();
    const nextIndex = unlockedIndex + 1;
    if (nextIndex < TAB_ORDER.length) {
      set({
        unlockedIndex: nextIndex,
        activeTab: TAB_ORDER[nextIndex],
      });
    }
  },
}));
