"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "gone">("enter");

  useEffect(() => {
    const hasSeen = localStorage.getItem("midrange-intro");
    if (hasSeen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("gone");
      return;
    }

    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 1200);
    const t3 = setTimeout(() => {
      setPhase("gone");
      localStorage.setItem("midrange-intro", "1");
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className="bg-ink-black fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      <div className="text-center">
        <p
          className="font-hero text-gradient-red text-sm tracking-[0.3em] uppercase"
          style={{
            opacity: phase === "enter" ? 0 : 1,
            transform: phase === "enter" ? "translateY(8px)" : "translateY(0)",
            transition: "all 0.4s ease",
          }}
        >
          Est. 2024
        </p>
        <h1
          className="font-hero text-gradient-red mt-2 text-4xl font-bold tracking-widest uppercase sm:text-6xl"
          style={{
            opacity: phase === "enter" ? 0 : 1,
            transform: phase === "enter" ? "translateY(12px)" : "translateY(0)",
            transition: "all 0.5s ease 0.1s",
          }}
        >
          MidRange
        </h1>
        <div
          className="bg-gradient-red mx-auto mt-4 h-0.5"
          style={{
            width: phase === "enter" ? 0 : "6rem",
            transition: "width 0.6s ease 0.2s",
          }}
        />
      </div>
    </div>
  );
}
