"use client";

import type { PointerEvent, MouseEvent } from "react";

export function useButtonEffects() {
  function onPointerDown(e: PointerEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.width = `${size}px`;
    span.style.height = `${size}px`;
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(span);
    window.setTimeout(() => span.remove(), 600);
  }

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    const svg = e.currentTarget.querySelector("svg");
    if (!svg) return;
    svg.classList.remove("animate-icon-shake");
    void svg.offsetWidth;
    svg.classList.add("animate-icon-shake");
    window.setTimeout(() => svg.classList.remove("animate-icon-shake"), 400);
  }

  return { onPointerDown, onClick };
}
