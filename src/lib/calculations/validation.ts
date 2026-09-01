/**
 * Input validation helpers shared by all calculation modules.
 *
 * Every numeric input is checked for being a finite number (rejecting
 * undefined, NaN, ±Infinity, and non-number types that slip past TypeScript at
 * runtime) plus an optional sign constraint. Outputs are re-checked with
 * `guardFinite` so a division that overflows to Infinity or produces NaN is
 * reported as an error rather than returned to the caller.
 */
import { CalcErr, err } from "./result";

export type Rule = "finite" | "positive" | "nonnegative";

export interface FieldCheck {
  name: string;
  value: unknown;
  rule: Rule;
}

/** Validate a list of numeric fields; returns the first failure or null. */
export function validate(checks: FieldCheck[]): CalcErr | null {
  for (const c of checks) {
    const v = c.value;
    if (typeof v !== "number" || !Number.isFinite(v)) {
      return err(`${c.name} must be a finite number`, c.name);
    }
    if (c.rule === "positive" && v <= 0) {
      return err(`${c.name} must be greater than zero`, c.name);
    }
    if (c.rule === "nonnegative" && v < 0) {
      return err(`${c.name} must be zero or greater`, c.name);
    }
  }
  return null;
}

/** Ensure computed outputs are finite (no NaN / ±Infinity leaks out). */
export function guardFinite(values: Record<string, number>): CalcErr | null {
  for (const [k, v] of Object.entries(values)) {
    if (!Number.isFinite(v)) {
      return err(`Computed value "${k}" is not finite (check inputs)`, k);
    }
  }
  return null;
}

/** Require an integer (used for discrete inputs like Poisson k). */
export function requireInteger(name: string, value: unknown): CalcErr | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return err(`${name} must be a finite number`, name);
  }
  if (!Number.isInteger(value)) {
    return err(`${name} must be an integer`, name);
  }
  return null;
}
