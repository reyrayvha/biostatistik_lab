"use client";

import { useEffect } from "react";
import { useAppStore } from "@/src/store/useAppStore";

export default function AppStateInitializer() {
  const initializeSidebarState = useAppStore((state) => state.initializeSidebarState);
  const initializeTheme = useAppStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeSidebarState();
    initializeTheme();
  }, [initializeSidebarState, initializeTheme]);

  return null;
}
