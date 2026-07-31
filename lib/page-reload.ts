export function isPageReload(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const nav = performance.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "reload") return true;
  } catch {}
  try {
    const legacy = (performance as unknown as { navigation?: { type?: number } }).navigation;
    if (legacy?.type === 1) return true;
  } catch {}
  return false;
}
