"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  "quiz-7": "Ujian Akhir",
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
  // Theme
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  initializeTheme: () => void;

  // Identity
  identity: UserIdentity | null;
  setIdentity: (identity: UserIdentity | null) => void;
  updateIdentity: (identity: Partial<UserIdentity>) => void;
  resetAllState: () => void;

  // Navigation
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  unlockedIndex: number;
  unlockNext: () => void;
  isTabUnlocked: (tab: TabId) => boolean;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  initializeSidebarState: () => void;

  // Admin
  isAdminMode: boolean;
  adminName: string | null;
  adminAuthTimestamp: number | null;
  setAdminMode: (name: string) => void;
  clearAdminMode: () => void;
  isAdmin: () => boolean;

  // Quiz
  quizStates: Record<number, QuizState>;
  startQuiz: (quizId: number) => void;
  answerQuestion: (quizId: number, questionId: number, answer: string) => void;
  finishQuiz: (quizId: number, score: number, total: number) => void;
  retryQuiz: (quizId: number) => void;
  hasUnsavedQuizAnswers: (quizId?: number) => boolean;

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

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
  // === Theme ===
  theme: "light",
  setTheme: (theme) => {
    set({ theme });

    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("app_theme", theme);
    }
  },
  initializeTheme: () => {
    if (typeof window === "undefined") return;

    const savedTheme = window.localStorage.getItem("app_theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : systemPrefersDark ? "dark" : "light";

    set({ theme: nextTheme });
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme === "dark" ? "dark" : "light";
  },

  // === Identity ===
  identity: null,
  setIdentity: (identity) => {
    if (!identity) {
      set({
        identity: null,
        unlockedIndex: 0,
        activeTab: "identitas",
        quizStates: {},
        isAdminMode: false,
        adminName: null,
        adminAuthTimestamp: null,
      });
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("biostatistik-storage");
      }
      return;
    }
    const current = get().unlockedIndex;
    set({
      identity,
      unlockedIndex: Math.max(current, 1),
      activeTab: "quiz-1",
    });
  },
  updateIdentity: (identity) => {
    const current = get().identity;
    if (!current) return;

    set({
      identity: {
        ...current,
        ...identity,
      },
    });
  },
  resetAllState: () => {
    set({
      identity: null,
      activeTab: "identitas",
      unlockedIndex: 0,
      isAdminMode: false,
      adminName: null,
      adminAuthTimestamp: null,
      quizStates: {},
    });

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("biostatistik-storage");
      window.localStorage.removeItem("sidebar_state");
    }
  },

  // === Navigation ===
  activeTab: "identitas",
  setActiveTab: (tab) => {
    if (get().isTabUnlocked(tab)) {
      // When navigating to a quiz tab, reset transient quiz state so the
      // user always lands on the summary/material screen first.
      const quizMatch = tab.match(/^quiz-(\d+)$/);
      if (quizMatch) {
        const quizId = parseInt(quizMatch[1], 10);
        const prev = get().quizStates[quizId];
        if (prev) {
          set({
            activeTab: tab,
            quizStates: {
              ...get().quizStates,
              [quizId]: {
                ...prev,
                started: false,
                lastResult: null,
              },
            },
          });
          return;
        }
      }
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
    if (tab === "leaderboard") return true;
    const idx = TAB_ORDER.indexOf(tab);
    return idx <= get().unlockedIndex;
  },

  isSidebarOpen: true,
  setSidebarOpen: (open) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sidebar_state", String(open));
    }
    set({ isSidebarOpen: open });
  },
  toggleSidebar: () => {
    set((state) => {
      const next = !state.isSidebarOpen;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("sidebar_state", String(next));
      }
      return { isSidebarOpen: next };
    });
  },
  initializeSidebarState: () => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("sidebar_state");
    const next = stored === null ? window.innerWidth >= 768 : stored === "true";
    set({ isSidebarOpen: next });
  },

  isAdminMode: false,
  adminName: null,
  adminAuthTimestamp: null,
  setAdminMode: (name) => {
    set({
      isAdminMode: true,
      adminName: name,
      adminAuthTimestamp: Date.now(),
    });
  },
  clearAdminMode: () => {
    set({
      isAdminMode: false,
      adminName: null,
      adminAuthTimestamp: null,
    });
  },
  isAdmin: () => get().isAdminMode,

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
  hasUnsavedQuizAnswers: (quizId) => {
    const states = get().quizStates;
    if (!quizId) {
      return Object.values(states).some((state) => state.started && Object.keys(state.currentAnswers).length > 0);
    }

    const state = states[quizId];
    return Boolean(state && state.started && Object.keys(state.currentAnswers).length > 0);
  },

  advanceToNextQuiz: () => {
    const { activeTab, unlockedIndex, quizStates } = get();
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < TAB_ORDER.length) {
      const nextTab = TAB_ORDER[nextIndex];
      // Only advance unlockedIndex if we actually unlocked something new
      const newUnlockedIndex = Math.max(unlockedIndex, nextIndex);

      // Reset the target quiz's transient state so the summary screen shows
      const quizMatch = nextTab.match(/^quiz-(\d+)$/);
      if (quizMatch) {
        const quizId = parseInt(quizMatch[1], 10);
        const prev = quizStates[quizId];
        if (prev) {
          set({
            unlockedIndex: newUnlockedIndex,
            activeTab: nextTab,
            quizStates: {
              ...quizStates,
              [quizId]: {
                ...prev,
                started: false,
                lastResult: null,
              },
            },
          });
          return;
        }
      }
      set({
        unlockedIndex: newUnlockedIndex,
        activeTab: nextTab,
      });
    }
  },
    }),
    {
      name: "biostatistik-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        identity: state.identity,
        activeTab: state.activeTab,
        unlockedIndex: state.unlockedIndex,
        quizStates: state.quizStates,
        isSidebarOpen: state.isSidebarOpen,
        isAdminMode: state.isAdminMode,
        adminName: state.adminName,
        adminAuthTimestamp: state.adminAuthTimestamp,
      }),
    }
  )
);
