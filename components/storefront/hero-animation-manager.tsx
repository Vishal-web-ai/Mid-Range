"use client";

import { useEffect } from "react";

export default function HeroAnimationManager() {
  useEffect(() => {
    if (sessionStorage.getItem("midrange-hero-seen")) {
      document.documentElement.classList.add("hero-animation-done");
    }
  }, []);
  return null;
}
