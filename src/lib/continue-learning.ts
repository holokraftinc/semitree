/**
 * "Continue where you left off" — local, login-free history via localStorage.
 *
 * No account sync (that's a later phase). Everything here is per-browser and
 * best-effort: every read/write is guarded so a blocked or empty store never
 * breaks the UI.
 */

export type RecentType = "lesson" | "tool" | "concept";

export interface RecentItem {
  type: RecentType;
  slug: string;
  title: string;
  href: string;
  ts: number;
}

const KEY = "semitree:recent:v1";
const MAX = 6;

export function getRecent(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentItem[]) : [];
  } catch {
    return [];
  }
}

export function recordRecent(item: Omit<RecentItem, "ts">): void {
  if (typeof window === "undefined") return;
  try {
    const now = Date.now();
    const existing = getRecent().filter((r) => r.href !== item.href);
    const next = [{ ...item, ts: now }, ...existing].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — ignore
  }
}
