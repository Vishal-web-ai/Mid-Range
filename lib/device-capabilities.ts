"use client";

export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;

  const cores = navigator.hardwareConcurrency;
  if (cores !== undefined && cores <= 4) return true;

  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (memory !== undefined && memory > 0 && memory <= 4) return true;

  return false;
}
