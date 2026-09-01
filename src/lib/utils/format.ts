/**
 * Number formatting for calculator results. UI-only (no physics).
 *
 * Values are converted to a friendly display unit *before* formatting, so this
 * only needs to render a magnitude readably: significant figures for
 * mid-range values, scientific notation for very large / very small ones.
 */
export function formatNumber(value: number, sig = 4): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";

  const abs = Math.abs(value);
  if (abs < 1e-3 || abs >= 1e6) {
    // e.g. 1.235e-5
    return value.toExponential(sig - 1);
  }
  // Trim trailing zeros from significant-figure rounding.
  return String(Number(value.toPrecision(sig)));
}

/** Parse a user-entered string to a number, or null if empty/invalid. */
export function parseNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}
