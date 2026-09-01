/**
 * Shared result type for every calculation module.
 *
 * Calculations never throw for bad *input* — they return a discriminated
 * `CalcResult` so callers (UI, tests, server) handle failure explicitly. A
 * successful result always carries the assumptions behind the number, and any
 * non-fatal warnings (e.g. an approximation used outside its ideal range).
 */
export interface CalcOk<T> {
  ok: true;
  value: T;
  /** The physical assumptions behind this result. Always present. */
  assumptions: string[];
  /** Non-fatal notes (e.g. approximation validity warnings). */
  warnings: string[];
}

export interface CalcErr {
  ok: false;
  error: string;
  /** Name of the offending input field, when applicable. */
  field?: string;
}

export type CalcResult<T> = CalcOk<T> | CalcErr;

export function ok<T>(
  value: T,
  assumptions: string[] = [],
  warnings: string[] = [],
): CalcOk<T> {
  return { ok: true, value, assumptions, warnings };
}

export function err(error: string, field?: string): CalcErr {
  return { ok: false, error, field };
}
