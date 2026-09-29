"use client";

import { type TabId } from "@/src/store/useAppStore";
import { BookOpen, Lock } from "lucide-react";

type Props = {
  tabId: TabId;
  title: string;
  subtitle: string;
};

/**
 * Placeholder panel shown for quiz tabs that haven't been implemented yet.
 * Will be replaced with actual quiz logic later.
 */
export default function QuizPlaceholder({ tabId, title, subtitle }: Props) {
  return (
    <div className="quiz-placeholder">
      <div className="quiz-placeholder-icon">
        <BookOpen size={48} strokeWidth={1.5} />
      </div>
      <h2 className="quiz-placeholder-title">{title}</h2>
      <p className="quiz-placeholder-subtitle">{subtitle}</p>
      <div className="quiz-placeholder-badge">
        <Lock size={14} />
        <span>Konten kuis akan segera hadir</span>
      </div>
    </div>
  );
}
