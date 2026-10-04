/**
 * Chip-packaging calculators (pure, SI, UI-independent).
 *
 * Geometric and first-order thermal relationships. Thermal results use the
 * simplified steady-state single-resistance model (ΔT = P·Rθ); real packages
 * have multiple parallel/series paths, hotspots, and transients not modelled here.
 */
import { CalcResult, ok, err } from "../result";
import { validate, guardFinite } from "../validation";

/* -------------------------- Package dimensions --------------------------- */
// footprint = length × width;  volume = length × width × height.

export interface PackageDimsInput {
  length: number; // m
  width: number; // m
  height: number; // m
}
export interface PackageDimsResult {
  footprint: number; // m²
  volume: number; // m³
}

export function packageDimensions(input: PackageDimsInput): CalcResult<PackageDimsResult> {
  const invalid = validate([
    { name: "length", value: input?.length, rule: "positive" },
    { name: "width", value: input?.width, rule: "positive" },
    { name: "height", value: input?.height, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const footprint = input.length * input.width;
  const volume = footprint * input.height;
  const nf = guardFinite({ footprint, volume });
  if (nf) return nf;
  return ok({ footprint, volume }, [
    "Rectangular package: footprint = length × width; volume = footprint × height.",
    "Ignores leads, balls, chamfers, and internal structure.",
  ]);
}

/* -------------------------- Thermal resistance --------------------------- */
// ΔT = P × Rθ. Provide exactly two of {deltaT, power, thetaResistance}.

export interface ThermalResistanceInput {
  deltaT?: number; // K (= °C difference)
  power?: number; // W
  thetaResistance?: number; // K/W (°C/W)
}
export interface ThermalResistanceResult {
  deltaT: number;
  power: number;
  thetaResistance: number;
  computed: "deltaT" | "power" | "thetaResistance";
}

export function thermalResistance(input: ThermalResistanceInput): CalcResult<ThermalResistanceResult> {
  const entries: [keyof ThermalResistanceInput, number | undefined][] = [
    ["deltaT", input?.deltaT],
    ["power", input?.power],
    ["thetaResistance", input?.thetaResistance],
  ];
  const provided = entries.filter(([, v]) => v !== undefined && v !== null);
  if (provided.length !== 2) return err("Provide exactly two of ΔT, power, and thermal resistance.");
  for (const [name, v] of provided) {
    if (typeof v !== "number" || !Number.isFinite(v)) return err(`${name} must be a finite number`, name as string);
    // ΔT may be 0; power and Rθ must be > 0 to solve the others.
    if (v < 0) return err(`${name} must be zero or greater`, name as string);
  }

  let { deltaT, power, thetaResistance } = input;
  let computed: ThermalResistanceResult["computed"];
  if (power != null && thetaResistance != null) {
    deltaT = power * thetaResistance;
    computed = "deltaT";
  } else if (deltaT != null && thetaResistance != null) {
    if (thetaResistance === 0) return err("Thermal resistance must be greater than zero to solve for power.", "thetaResistance");
    power = deltaT / thetaResistance;
    computed = "power";
  } else {
    if (power === 0) return err("Power must be greater than zero to solve for thermal resistance.", "power");
    thetaResistance = deltaT! / power!;
    computed = "thetaResistance";
  }

  const nf = guardFinite({ deltaT: deltaT!, power: power!, thetaResistance: thetaResistance! });
  if (nf) return nf;
  return ok({ deltaT: deltaT!, power: power!, thetaResistance: thetaResistance!, computed }, [
    "Simplified steady-state model: ΔT = P × Rθ.",
    "Thermal resistance Rθ is in °C/W (= K/W); ΔT is a temperature difference.",
    "Single lumped resistance — real packages have multiple heat paths.",
  ]);
}

/* ---------------------------- Thermal budget ----------------------------- */
// allowable power = (Tj_max − T_ambient) / Rθ.

export interface ThermalBudgetInput {
  tjMax: number; // K
  tAmbient: number; // K
  thetaResistance: number; // K/W
}
export interface ThermalBudgetResult {
  allowablePower: number; // W
  deltaT: number; // K
}

export function thermalBudget(input: ThermalBudgetInput): CalcResult<ThermalBudgetResult> {
  const invalid = validate([
    { name: "tjMax", value: input?.tjMax, rule: "finite" },
    { name: "tAmbient", value: input?.tAmbient, rule: "finite" },
    { name: "thetaResistance", value: input?.thetaResistance, rule: "positive" },
  ]);
  if (invalid) return invalid;
  if (input.tjMax <= input.tAmbient) {
    return err("Maximum junction temperature must be above the ambient temperature.", "tjMax");
  }
  const deltaT = input.tjMax - input.tAmbient;
  const allowablePower = deltaT / input.thetaResistance;
  const nf = guardFinite({ allowablePower, deltaT });
  if (nf) return nf;
  return ok({ allowablePower, deltaT }, [
    "Simplified steady-state model: allowable P = (Tj_max − T_ambient) / Rθ.",
    "Assumes a single thermal resistance from junction to ambient and uniform heating.",
    "Real limits include margin, transients, and hotspots not modelled here.",
  ]);
}

/* ---------------------- Interconnect geometric capacity ------------------- */
// For a given area and pitch: cols = floor(width/pitch), rows = floor(height/pitch).

export interface InterconnectCapacityInput {
  areaWidth: number; // m
  areaHeight: number; // m
  pitch: number; // m
}
export interface InterconnectCapacityResult {
  columns: number;
  rows: number;
  count: number;
}

export function interconnectCapacity(input: InterconnectCapacityInput): CalcResult<InterconnectCapacityResult> {
  const invalid = validate([
    { name: "areaWidth", value: input?.areaWidth, rule: "positive" },
    { name: "areaHeight", value: input?.areaHeight, rule: "positive" },
    { name: "pitch", value: input?.pitch, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const columns = Math.floor(input.areaWidth / input.pitch);
  const rows = Math.floor(input.areaHeight / input.pitch);
  const count = Math.max(0, columns) * Math.max(0, rows);
  const nf = guardFinite({ count });
  if (nf) return nf;
  return ok({ columns: Math.max(0, columns), rows: Math.max(0, rows), count }, [
    "Theoretical geometric capacity only: a full grid at the given pitch across the whole area.",
    "Real packages reach far fewer connections — keep-outs, power/ground, routing, and reliability all reduce usable count.",
  ]);
}

/* -------------------------- Bump / pitch array --------------------------- */
// count = rows × columns;  density = 1 / pitch² (connections per area).

export interface BumpArrayInput {
  rows: number;
  columns: number;
  pitch: number; // m
}
export interface BumpArrayResult {
  count: number;
  arrayWidth: number; // m
  arrayHeight: number; // m
  density: number; // connections / m²
}

export function bumpArray(input: BumpArrayInput): CalcResult<BumpArrayResult> {
  const invalid = validate([
    { name: "rows", value: input?.rows, rule: "positive" },
    { name: "columns", value: input?.columns, rule: "positive" },
    { name: "pitch", value: input?.pitch, rule: "positive" },
  ]);
  if (invalid) return invalid;
  if (!Number.isInteger(input.rows) || !Number.isInteger(input.columns)) {
    return err("Rows and columns must be whole numbers.", Number.isInteger(input.rows) ? "columns" : "rows");
  }
  const count = input.rows * input.columns;
  const arrayWidth = (input.columns - 1) * input.pitch;
  const arrayHeight = (input.rows - 1) * input.pitch;
  const density = 1 / (input.pitch * input.pitch);
  const nf = guardFinite({ count, density });
  if (nf) return nf;
  return ok({ count, arrayWidth, arrayHeight, density }, [
    "count = rows × columns; the array spans (columns−1)·pitch by (rows−1)·pitch.",
    "Areal density of a full grid is 1/pitch² (set by pitch alone).",
    "Geometric maximum — real designs use fewer for power, ground, and keep-outs.",
  ]);
}
