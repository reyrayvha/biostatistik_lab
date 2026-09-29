"use client";

import {
  useAppStore,
  TAB_ORDER,
  TAB_LABELS,
  type TabId,
} from "@/src/store/useAppStore";
import {
  User,
  BookOpen,
  BarChart3,
  FlaskConical,
  TestTube2,
  Stethoscope,
  FileSearch,
  GraduationCap,
  Trophy,
  Lock,
  Check,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Icon mapping for each tab
// ---------------------------------------------------------------------------

const TAB_ICONS: Record<TabId, React.ReactNode> = {
  identitas: <User size={18} />,
  "quiz-1": <BarChart3 size={18} />,
  "quiz-2": <BookOpen size={18} />,
  "quiz-3": <FlaskConical size={18} />,
  "quiz-4": <TestTube2 size={18} />,
  "quiz-5": <Stethoscope size={18} />,
  "quiz-6": <FileSearch size={18} />,
  "quiz-7": <GraduationCap size={18} />,
  leaderboard: <Trophy size={18} />,
};

const TAB_SUBTITLES: Record<TabId, string> = {
  identitas: "Data Diri",
  "quiz-1": "Statistik Deskriptif",
  "quiz-2": "Distribusi",
  "quiz-3": "Probabilitas & Bayes",
  "quiz-4": "Uji Hipotesis",
  "quiz-5": "Tes Diagnostik",
  "quiz-6": "Desain Studi",
  "quiz-7": "NUMi (Ujian Akhir)",
  leaderboard: "Papan Skor",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TabNavigation() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const isTabUnlocked = useAppStore((s) => s.isTabUnlocked);
  const unlockedIndex = useAppStore((s) => s.unlockedIndex);

  return (
    <nav className="tab-navigation" role="tablist" aria-label="Step navigation">
      <div className="tab-nav-inner">
        {TAB_ORDER.map((tabId, idx) => {
          const unlocked = isTabUnlocked(tabId);
          const isActive = activeTab === tabId;
          const isCompleted = idx < unlockedIndex;

          let stateClass = "tab-item--locked";
          if (isActive) stateClass = "tab-item--active";
          else if (isCompleted) stateClass = "tab-item--completed";
          else if (unlocked) stateClass = "tab-item--unlocked";

          return (
            <button
              key={tabId}
              id={`tab-${tabId}`}
              role="tab"
              aria-selected={isActive}
              aria-disabled={!unlocked}
              tabIndex={unlocked ? 0 : -1}
              className={`tab-item ${stateClass}`}
              onClick={() => unlocked && setActiveTab(tabId)}
            >
              {/* Progress connector line (skip first) */}
              {idx > 0 && (
                <span
                  className={`tab-connector ${
                    isCompleted || isActive
                      ? "tab-connector--active"
                      : "tab-connector--inactive"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Icon badge */}
              <span className="tab-icon-badge">
                {!unlocked ? (
                  <Lock size={14} />
                ) : isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  TAB_ICONS[tabId]
                )}
              </span>

              {/* Labels */}
              <span className="tab-labels">
                <span className="tab-label-primary">
                  {TAB_LABELS[tabId]}
                </span>
                <span className="tab-label-sub">{TAB_SUBTITLES[tabId]}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
