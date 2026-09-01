/**
 * Calculation-engine contract for Semitree.
 *
 * A `CalculationDefinition` fully describes a tool *without any UI*: its inputs,
 * its outputs, the pure function that maps one to the other, and metadata that
 * links it back to the Learn content. The UI (built in a later phase) renders a
 * form from `inputs`, calls `compute`, and displays `outputs` — it never
 * contains physics. This keeps the engine testable in isolation and reusable
 * on the server later.
 *
 * NOTE: This file defines the *shape* only. No calculators are implemented in
 * Phase 01 — see docs/ROADMAP.md.
 */

import type { Quantity } from "@/lib/units/types";

/** Category groupings mirror the product spec's tool sections. */
export type CalculationCategory =
  | "fluid-mechanics"
  | "resistance-network"
  | "droplet"
  | "diffusion-mixing"
  | "lab-utilities"
  | "advanced";

/** Release tier from the product spec. */
export type Tier = "mvp" | "v1" | "v2";

/**
 * A single numeric input field. `quantity` ties it to the units layer so the UI
 * can offer the right unit dropdown and the engine can normalise to SI.
 */
export interface NumberInputField {
  kind: "number";
  /** Machine key used in the input record passed to `compute`. */
  key: string;
  label: string;
  quantity: Quantity;
  /** Default unit id (from the units registry) for display. */
  defaultUnit: string;
  /** Optional inclusive bounds, in the field's own unit. */
  min?: number;
  max?: number;
  /** Short helper text / assumptions note. */
  help?: string;
}

/** A discrete choice input (e.g. channel cross-section: circular vs rectangular). */
export interface SelectInputField {
  kind: "select";
  key: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue: string;
  help?: string;
}

export type InputField = NumberInputField | SelectInputField;

/** Description of one computed output. */
export interface OutputField {
  key: string;
  label: string;
  /** Quantity for unit-aware display; omit for dimensionless results (e.g. Re). */
  quantity?: Quantity;
  /** Preferred display unit id when `quantity` is set. */
  displayUnit?: string;
}

/** Values handed to `compute`: number fields are already normalised to SI. */
export type CalculationInput = Record<string, number | string>;

/** Values returned by `compute`: numbers are in each output's SI base unit. */
export type CalculationOutput = Record<string, number | string>;

/**
 * The full, UI-independent definition of a calculator.
 */
export interface CalculationDefinition<
  I extends CalculationInput = CalculationInput,
  O extends CalculationOutput = CalculationOutput,
> {
  /** URL-safe unique id, e.g. "reynolds-number". */
  slug: string;
  name: string;
  /** One-line description for cards and search. */
  summary: string;
  category: CalculationCategory;
  tier: Tier;
  /** The equation, as a display string (rendered by the UI, e.g. KaTeX). */
  formula: string;
  inputs: InputField[];
  outputs: OutputField[];
  /** Pure function. Must not touch React, the DOM, or any I/O. */
  compute: (input: I) => O;
  /** Slugs of related Learn concepts/lessons — powers the learn↔tool wiring. */
  relatedConcepts?: string[];
}
