"use client";

import { useEffect } from "react";
import { isPageReload } from "@/lib/page-reload";

export default function HeroAnimationManager() {
  useEffect(() => {
    if (isPageReload()) sessionStorage.removeItem("midrange-hero-seen");

    if (sessionStorage.getItem("midrange-hero-seen")) {
      document.documentElement.classList.add("hero-animation-done");
    }
  }, []);
  return null;
}
