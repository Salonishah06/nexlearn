/*
  Display formatters shared by the read-only content pages.
  All inputs may be null/undefined/0 — callers decide whether to render at all.
*/

/** "intermediate" -> "Intermediate". Leaves already-cased or empty values alone. */
export function capitalize(value: string | null | undefined): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Seconds -> "18h 24m" / "45m" / "9:05".
 * `style: "long"` (default) is for course/module totals; `style: "clock"` is the
 * mm:ss used next to individual lessons.
 */
export function formatDuration(
  seconds: number | null | undefined,
  style: "long" | "clock" = "long",
): string {
  if (!seconds || seconds <= 0) return "";
  const total = Math.round(seconds);

  if (style === "clock") {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  const h = Math.floor(total / 3600);
  const m = Math.round((total % 3600) / 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

/** 18240 -> "18.2k", 950 -> "950". */
export function formatCount(n: number | null | undefined): string {
  if (n == null) return "";
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
}
