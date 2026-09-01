import { getUnit } from "./registry";
import type { UnitDefinition } from "./types";

function toBase(value: number, unit: UnitDefinition): number {
  return unit.toBaseFn ? unit.toBaseFn(value) : value * unit.toBase;
}

function fromBase(baseValue: number, unit: UnitDefinition): number {
  return unit.fromBaseFn ? unit.fromBaseFn(baseValue) : baseValue / unit.toBase;
}

/**
 * Convert a value between two units of the *same* quantity.
 *
 * Throws if either unit id is unknown or the quantities do not match — callers
 * (calculators, converters) should treat mismatches as programmer errors.
 */
export function convert(value: number, fromId: string, toId: string): number {
  const from = getUnit(fromId);
  const to = getUnit(toId);

  if (!from) throw new Error(`Unknown unit: "${fromId}"`);
  if (!to) throw new Error(`Unknown unit: "${toId}"`);
  if (from.quantity !== to.quantity) {
    throw new Error(
      `Cannot convert ${from.quantity} (${fromId}) to ${to.quantity} (${toId})`,
    );
  }

  if (fromId === toId) return value;
  return fromBase(toBase(value, from), to);
}

/** Convert a value to the SI base unit of its quantity. */
export function toSI(value: number, fromId: string): number {
  const from = getUnit(fromId);
  if (!from) throw new Error(`Unknown unit: "${fromId}"`);
  return toBase(value, from);
}
