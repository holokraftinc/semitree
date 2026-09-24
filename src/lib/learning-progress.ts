/**
 * Anonymous, login-free learning progress via localStorage.
 *
 * Per-browser and best-effort: every read/write is guarded so a blocked or
 * empty store never breaks the UI. Keyed by a stable topic key ("<domain>:<slug>")
 * so the persistence layer can later be swapped for an account/database without
 * changing the learning UI.
 */

export interface TopicProgress {
  /** Furthest reading progress reached, 0-100. */
  progress: number;
  /** Whether the learner has reached the end of the topic content. */
  completed: boolean;
  /** Last update timestamp. */
  ts: number;
}

const KEY = "semitree:learning-progress:v1";

type Store = Record<string, TopicProgress>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

export function getTopicProgress(topicKey: string): TopicProgress | undefined {
  return readStore()[topicKey];
}

/**
 * Merge progress for a topic: keeps the highest progress seen and never clears
 * a completion once earned.
 */
export function saveTopicProgress(
  topicKey: string,
  update: { progress: number; completed: boolean },
): void {
  if (typeof window === "undefined") return;
  try {
    const store = readStore();
    const prev = store[topicKey];
    const progress = Math.max(0, Math.min(100, Math.round(update.progress)), prev?.progress ?? 0);
    const completed = Boolean(prev?.completed) || update.completed;
    store[topicKey] = { progress, completed, ts: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // storage unavailable — ignore
  }
}
