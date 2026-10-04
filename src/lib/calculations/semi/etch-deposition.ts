/**
 * Etching & deposition calculators (pure, SI, UI-independent).
 *
 * Standard geometric/rate relationships. Rate-based results assume a constant
 * rate over the process — real deposition and etch rates vary with time, loading,
 * and endpoint, which these first-order tools do not model.
 */
import { CalcResult, ok, err } from "../result";
import { validate, guardFinite } from "../validation";

/* --------------------------- Film thickness ------------------------------ */
// Volume = thickness × area. Provide exactly two; the third is computed.

export interface FilmThicknessInput {
  thickness?: number; // m
  area?: number; // m²
  volume?: number; // m³
}

export interface FilmThicknessResult {
  thickness: number; // m
  area: number; // m²
  volume: number; // m³
  computed: "thickness" | "area" | "volume";
}

export function filmThickness(input: FilmThicknessInput): CalcResult<FilmThicknessResult> {
  const entries: [keyof FilmThicknessInput, number | undefined][] = [
    ["thickness", input?.thickness],
    ["area", input?.area],
    ["volume", input?.volume],
  ];
  const provided = entries.filter(([, v]) => v !== undefined && v !== null);
  if (provided.length !== 2) {
    return err("Provide exactly two of thickness, area, and volume.");
  }
  for (const [name, v] of provided) {
    if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) {
      return err(`${name} must be greater than zero`, name as string);
    }
  }

  let { thickness, area, volume } = input;
  let computed: FilmThicknessResult["computed"];
  if (thickness != null && area != null) {
    volume = thickness * area;
    computed = "volume";
  } else if (volume != null && area != null) {
    thickness = volume / area;
    computed = "thickness";
  } else {
    // volume && thickness
    area = volume! / thickness!;
    computed = "area";
  }

  const nf = guardFinite({ thickness: thickness!, area: area!, volume: volume! });
  if (nf) return nf;

  return ok({ thickness: thickness!, area: area!, volume: volume!, computed }, [
    "Uniform film: volume = thickness × area.",
    "Assumes complete, gap-free coverage of the given area.",
  ]);
}

/* -------------------------- Deposition rate ------------------------------ */
// rate = deposited thickness / process time.

export interface DepositionRateInput {
  thickness: number; // m
  time: number; // s
}
export interface DepositionRateResult {
  rate: number; // m/s
}

export function depositionRate(input: DepositionRateInput): CalcResult<DepositionRateResult> {
  const invalid = validate([
    { name: "thickness", value: input?.thickness, rule: "positive" },
    { name: "time", value: input?.time, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const rate = input.thickness / input.time;
  const nf = guardFinite({ rate });
  if (nf) return nf;
  return ok({ rate }, [
    "Average rate = deposited thickness ÷ process time.",
    "Assumes a constant rate; real rates vary with time and conditions.",
  ]);
}

/* ------------------------- Time for a thickness -------------------------- */
// time = target thickness / rate. Used for process time and etch time.

export interface TimeForThicknessInput {
  thickness: number; // m
  rate: number; // m/s
}
export interface TimeForThicknessResult {
  time: number; // s
}

export function timeForThickness(input: TimeForThicknessInput): CalcResult<TimeForThicknessResult> {
  const invalid = validate([
    { name: "thickness", value: input?.thickness, rule: "positive" },
    { name: "rate", value: input?.rate, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const time = input.thickness / input.rate;
  const nf = guardFinite({ time });
  if (nf) return nf;
  return ok({ time }, [
    "Time = thickness ÷ rate, assuming a constant rate.",
    "Real processes add margin and often rely on endpoint detection rather than a fixed time.",
  ]);
}

/* ------------------------------ Etch rate -------------------------------- */
// rate = (initial − remaining) thickness / time.

export interface EtchRateInput {
  initialThickness: number; // m
  remainingThickness: number; // m
  time: number; // s
}
export interface EtchRateResult {
  removed: number; // m
  rate: number; // m/s
}

export function etchRate(input: EtchRateInput): CalcResult<EtchRateResult> {
  const invalid = validate([
    { name: "initialThickness", value: input?.initialThickness, rule: "positive" },
    { name: "remainingThickness", value: input?.remainingThickness, rule: "nonnegative" },
    { name: "time", value: input?.time, rule: "positive" },
  ]);
  if (invalid) return invalid;
  if (input.remainingThickness >= input.initialThickness) {
    return err("Remaining thickness must be less than the initial thickness.", "remainingThickness");
  }
  const removed = input.initialThickness - input.remainingThickness;
  const rate = removed / input.time;
  const nf = guardFinite({ removed, rate });
  if (nf) return nf;
  return ok({ removed, rate }, [
    "Average etch rate = (initial − remaining) thickness ÷ time.",
    "Assumes a constant rate; real rates vary with loading, depth, and endpoint.",
  ]);
}

/* ----------------------------- Selectivity ------------------------------- */
// selectivity = target etch rate / mask (or underlayer) etch rate.

export interface SelectivityInput {
  targetRate: number; // m/s (or any consistent rate unit)
  maskRate: number; // m/s
}
export interface SelectivityResult {
  selectivity: number; // dimensionless ratio
}

export function selectivity(input: SelectivityInput): CalcResult<SelectivityResult> {
  const invalid = validate([
    { name: "targetRate", value: input?.targetRate, rule: "positive" },
    { name: "maskRate", value: input?.maskRate, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const sel = input.targetRate / input.maskRate;
  const nf = guardFinite({ sel });
  if (nf) return nf;
  return ok({ selectivity: sel }, [
    "Selectivity = target etch rate ÷ mask/underlayer etch rate (dimensionless).",
    "Both rates must be in the same units; the ratio is unitless.",
    "No universal 'good' value — the required selectivity depends on the layer and stack.",
  ]);
}
