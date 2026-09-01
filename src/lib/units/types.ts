/**
 * Unit-system types for Semitree.
 *
 * The units layer is intentionally UI-independent and framework-free so it can
 * be reused by the calculation engine, tests, and (later) server code. It is
 * organised by physical *quantity* (length, pressure, flow rate, ...). Each
 * quantity has one canonical SI base unit; every other unit declares how to
 * convert to and from that base.
 */

/** A physical quantity whose units share a common SI base. */
export type Quantity =
  | "length"
  | "area"
  | "volume"
  | "pressure"
  | "flowRate"
  | "velocity"
  | "viscosity"
  | "density"
  | "time"
  | "temperature"
  | "diffusivity";

/**
 * Definition of a single unit.
 *
 * Most units are linear (`value_base = value * toBase`). A few — temperature,
 * for example — are affine, so optional `toBaseFn` / `fromBaseFn` hooks are
 * provided for the general case.
 */
export interface UnitDefinition {
  /** Stable machine key, e.g. "uL_per_min". */
  id: string;
  /** Human label, e.g. "µL/min". */
  label: string;
  /** The quantity this unit measures. */
  quantity: Quantity;
  /** Multiplicative factor to the SI base unit (used when no *Fn hooks given). */
  toBase: number;
  /** Optional non-linear conversion into the base unit. */
  toBaseFn?: (value: number) => number;
  /** Optional non-linear conversion out of the base unit. */
  fromBaseFn?: (value: number) => number;
}

/** The canonical SI base unit id for each quantity. */
export type BaseUnits = Record<Quantity, string>;
