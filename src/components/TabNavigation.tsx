"use client";

import {
  useAppStore,
  TAB_ORDER,
  TAB_LABELS,
  type TabId,
} from "@/src/store/useAppStore";
import { Circle, CircleCheck, Lock, Trophy } from "lucide-react";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TabNavigation() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const isTabUnlocked = useAppStore((s) => s.isTabUnlocked);
  const unlockedIndex = useAppStore((s) => s.unlockedIndex);
  const quizStates = useAppStore((s) => s.quizStates);

  const isAnyQuizStarted = Object.values(quizStates).some((q) => q.started);

  const handleTabClick = (tabId: TabId, unlocked: boolean) => {
    if (!unlocked) return;
    if (isAnyQuizStarted && tabId !== activeTab) {
      alert("Harap selesaikan kuis yang sedang berlangsung terlebih dahulu!");
      return;
    }
    setActiveTab(tabId);
  };

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
              className={`tab-item ${stateClass} ${isAnyQuizStarted && !isActive ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handleTabClick(tabId, unlocked)}
            >
              {/* Icon badge */}
              <span className="tab-icon-badge">
                {tabId === "leaderboard" ? (
                  <Trophy size={16} />
                ) : !unlocked ? (
                  <Lock size={15} />
                ) : isCompleted ? (
                  <CircleCheck size={16} />
                ) : (
                  <Circle size={16} />
                )}
              </span>

              {/* Labels */}
              <span className="tab-labels">
                <span className="tab-label-primary">
                  {TAB_LABELS[tabId]}
                </span>
                <span className="tab-label-sub">
                  {tabId.replace("-", " ")}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
