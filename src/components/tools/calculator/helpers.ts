import { toSI } from "@/lib/units";
import { parseNumber } from "@/lib/utils/format";
import type { MeasurementValue } from "./MeasurementField";

/**
 * Convert a user measurement (raw string + unit) to its SI base value.
 * Returns null when the field is empty or not a finite number, so the caller
 * can show a per-field validation message.
 */
export function measurementToSI(m: MeasurementValue): number | null {
  const n = parseNumber(m.raw);
  if (n === null) return null;
  try {
    return toSI(n, m.unit);
  } catch {
    return null;
  }
}
