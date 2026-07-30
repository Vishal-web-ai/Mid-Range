"use client";

import { useEffect } from "react";

export default function HeroAnimationManager() {
  useEffect(() => {
    const nav = performance.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "reload") sessionStorage.removeItem("midrange-hero-seen");

    if (sessionStorage.getItem("midrange-hero-seen")) {
      document.documentElement.classList.add("hero-animation-done");
    }
  }, []);
  return null;
}
