"use client";

import { useAppStore } from "@/src/store/useAppStore";
import TabNavigation from "@/src/components/TabNavigation";
import IdentityForm from "@/src/components/IdentityForm";
import QuizPanel from "@/src/components/QuizPanel";
import QuizPlaceholder from "@/src/components/QuizPlaceholder";
import { Trophy } from "lucide-react";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AppShell() {
  const activeTab = useAppStore((s) => s.activeTab);
  const identity = useAppStore((s) => s.identity);

  function renderContent() {
    if (activeTab === "identitas") {
      return <IdentityForm />;
    }

    // Quiz 1-6 → use QuizPanel
    const quizMatch = activeTab.match(/^quiz-(\d+)$/);
    if (quizMatch) {
      const quizId = parseInt(quizMatch[1], 10);

      // Quiz 7 (NUMi) — placeholder for now
      if (quizId === 7) {
        return (
          <QuizPlaceholder
            tabId={activeTab}
            title="Quiz 7 — NUMi (Ujian Akhir)"
            subtitle="Ujian komprehensif mencakup seluruh materi dari Quiz 1 hingga 6."
          />
        );
      }

      // Quiz 1-6 → full quiz logic
      return <QuizPanel quizId={quizId} />;
    }

    if (activeTab === "leaderboard") {
      return (
        <div className="quiz-placeholder">
          <div className="quiz-placeholder-icon">
            <Trophy size={48} strokeWidth={1.5} />
          </div>
          <h2 className="quiz-placeholder-title">Leaderboard</h2>
          <p className="quiz-placeholder-subtitle">
            Papan skor global — lihat peringkat seluruh mahasiswa.
          </p>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <div className="app-brand-logo">
              <span className="brand-text-white">SMART-MATH</span>
              <span className="brand-text-blue">MEDICS</span>
            </div>
            <div className="app-brand-divider" />
            <span className="app-brand-tagline">
              Interactive Learning Platform for Medical Students
            </span>
          </div>

          {identity && (
            <div className="app-user-badge">
              <span className="app-user-avatar">
                {identity.nama.charAt(0).toUpperCase()}
              </span>
              <div className="app-user-info">
                <span className="app-user-name">{identity.nama}</span>
                <span className="app-user-nim">{identity.nim}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <TabNavigation />

      {/* Main content */}
      <main className="app-main">
        <div className="app-content">{renderContent()}</div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          © {new Date().getFullYear()} Biostatistik Lab — Fakultas Kedokteran
        </p>
      </footer>
    </div>
  );
}
