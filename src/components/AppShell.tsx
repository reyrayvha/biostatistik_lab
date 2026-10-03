"use client";

import { useState, useEffect } from "react";
import { Menu, Lock, X, Moon, Sun, GraduationCap, ArrowRight } from "lucide-react";
import { useAppStore } from "@/src/store/useAppStore";
import TabNavigation from "@/src/components/TabNavigation";
import IdentityForm from "@/src/components/IdentityForm";
import QuizPanel from "@/src/components/QuizPanel";
import Leaderboard from "@/src/components/Leaderboard";
import { AdminPinModal } from "@/src/components/AdminPinModal";
import { Toast } from "@/src/components/Toast";
import { IdentityCard } from "@/src/components/IdentityCard";
import { useToastStore } from "@/src/store/useToastStore";

export default function AppShell() {
  const [mounted, setMounted] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [loginStep, setLoginStep] = useState<"login" | "identity">("login");

  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const identity = useAppStore((s) => s.identity);
  const isSidebarOpen = useAppStore((s) => s.isSidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const isAdminMode = useAppStore((s) => s.isAdminMode);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const setAdminMode = useAppStore((s) => s.setAdminMode);
  const hasUnsavedQuizAnswers = useAppStore((s) => s.hasUnsavedQuizAnswers);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!identity && !isAdminMode) setLoginStep("login");
  }, [identity, isAdminMode]);

  useEffect(() => {
    const mainEl = document.querySelector(".app-main");
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedQuizAnswers()) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && hasUnsavedQuizAnswers()) {
        addToast(
          "Anda masih memiliki jawaban kuis yang belum disimpan. Pastikan semua jawaban selesai sebelum meninggalkan halaman.",
          "warning",
          4000,
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [addToast, hasUnsavedQuizAnswers]);

  function handleAdminSuccess(name: string) {
    setAdminMode(name);
    setActiveTab("leaderboard");
  }

  function renderContent() {
    if (!identity && !isAdminMode) {
      if (loginStep === "identity") {
        return <IdentityForm onBack={() => setLoginStep("login")} />;
      }

      return (
        <div className="identity-panel login-panel">
          <div className="identity-form login-card">
            <div className="login-mark"><GraduationCap size={30} /></div>
            <div className="identity-hero">
              <h2 className="identity-hero-title">Masuk ke SMART-MATH MEDICS</h2>
              <p className="identity-hero-subtitle">Pilih akses untuk melanjutkan.</p>
            </div>
            <button
              type="button"
              className="form-submit"
              onClick={() => setLoginStep("identity")}
            >
              Masuk sebagai Mahasiswa
              <ArrowRight size={18} />
            </button>
            <div className="login-divider"><span>ATAU</span></div>
            <button
              type="button"
              className="login-admin-button"
              onClick={() => setIsAdminModalOpen(true)}
            >
              <Lock size={16} />
              Akses Mode Dosen
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === "identitas") {
      return <IdentityForm />;
    }

    const quizMatch = activeTab.match(/^quiz-(\d+)$/);
    if (quizMatch) {
      const quizId = parseInt(quizMatch[1], 10);
      return <QuizPanel quizId={quizId} />;
    }

    if (activeTab === "leaderboard") {
      return <Leaderboard />;
    }

    return null;
  }

  if (!mounted) {
    return <div className="app-shell min-h-screen bg-[var(--bg-body)]" />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner w-full flex justify-between items-center gap-2 px-6 md:px-8">
          {identity && (
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm transition-colors hover:bg-[var(--bg-card-hover)]"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}

          <div className="app-brand flex-1">
            <div className="flex flex-row items-center gap-1 md:gap-1.5 whitespace-nowrap text-lg md:text-xl font-black">
              <span className="brand-text-white">SMART-MATH</span>
              <span className="brand-text-blue">MEDICS</span>
            </div>
            <div className="app-brand-divider" />
            <span className="app-brand-tagline">
              Interactive Learning Platform for Medical Students
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-light)] bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm transition-colors hover:bg-[var(--bg-card-hover)]"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            {identity && <IdentityCard />}
          </div>
        </div>
      </header>

      <div className={`app-body ${!identity && !isAdminMode ? "app-body--auth" : ""}`}>
        {identity && (
          <>
            <div
              className={`app-nav-wrapper transition-all duration-300 ${isSidebarOpen ? "open" : "closed"}`}
              aria-label="Sidebar navigation"
            >
              <TabNavigation />
            </div>

            {isSidebarOpen && (
              <div className="mobile-nav-overlay" onClick={toggleSidebar} />
            )}
          </>
        )}

        <main className={`app-main ${!identity && !isAdminMode ? "app-main--auth" : ""}`}>
          <div className="app-content">{renderContent()}</div>
        </main>
      </div>

      <AdminPinModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      <Toast />
    </div>
  );
}
