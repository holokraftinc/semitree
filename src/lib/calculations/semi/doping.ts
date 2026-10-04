/**
 * Doping calculators (pure, SI, UI-independent).
 *
 * Standard carrier/transport relationships for non-degenerate silicon-like
 * semiconductors with complete dopant ionization. These are educational; real
 * devices involve incomplete ionization, degeneracy, temperature effects, and
 * field dependence not modelled here.
 */
import { CalcResult, ok, err } from "../result";
import { validate, guardFinite } from "../validation";
import { Q, NI_SILICON_300K } from "./constants";

/* ----------------------- Carrier concentration --------------------------- */
// Charge neutrality + mass action (n·p = ni²):
//   n-type: n = Nd/2 + √((Nd/2)² + ni²),  p = ni²/n
//   p-type: p = Na/2 + √((Na/2)² + ni²),  n = ni²/p

export type DopantType = "n" | "p";

export interface CarrierInput {
  dopant: number; // Nd or Na, m^-3
  type: DopantType;
  intrinsicConc?: number; // ni, m^-3 (default silicon ~300 K)
}

export interface CarrierResult {
  majority: number; // m^-3
  minority: number; // m^-3
  electron: number; // n, m^-3
  hole: number; // p, m^-3
  type: DopantType;
  intrinsicConc: number;
}

export function carrierConcentration(input: CarrierInput): CalcResult<CarrierResult> {
  if (!input || (input.type !== "n" && input.type !== "p")) {
    return err("Choose a dopant type (n or p).", "type");
  }
  const ni = input.intrinsicConc ?? NI_SILICON_300K;
  const invalid = validate([
    { name: "dopant", value: input?.dopant, rule: "positive" },
    { name: "intrinsicConc", value: ni, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const half = input.dopant / 2;
  const majority = half + Math.sqrt(half * half + ni * ni);
  const minority = (ni * ni) / majority;
  const electron = input.type === "n" ? majority : minority;
  const hole = input.type === "n" ? minority : majority;

  const nf = guardFinite({ majority, minority });
  if (nf) return nf;

  const warnings: string[] = [];
  if (input.dopant < 10 * ni) {
    warnings.push("Dopant concentration is within ~10× of the intrinsic level, so the material is only weakly extrinsic; majority ≈ dopant is a poor approximation here.");
  }

  return ok({ majority, minority, electron, hole, type: input.type, intrinsicConc: ni }, [
    "Charge neutrality with mass action (n·p = ni²).",
    "Complete dopant ionization; non-degenerate (Boltzmann) statistics.",
    "Single dopant type; no compensation.",
  ], warnings);
}

/* ----------------------------- Conductivity ------------------------------ */
// σ = q·(n·μn + p·μp)

export interface ConductivityInput {
  electron: number; // n, m^-3
  hole: number; // p, m^-3
  electronMobility: number; // μn, m²/(V·s)
  holeMobility: number; // μp, m²/(V·s)
}
export interface ConductivityResult {
  conductivity: number; // S/m
  resistivity: number; // Ω·m
}

export function conductivity(input: ConductivityInput): CalcResult<ConductivityResult> {
  const invalid = validate([
    { name: "electron", value: input?.electron, rule: "nonnegative" },
    { name: "hole", value: input?.hole, rule: "nonnegative" },
    { name: "electronMobility", value: input?.electronMobility, rule: "nonnegative" },
    { name: "holeMobility", value: input?.holeMobility, rule: "nonnegative" },
  ]);
  if (invalid) return invalid;

  const sigma = Q * (input.electron * input.electronMobility + input.hole * input.holeMobility);
  if (sigma <= 0) return err("Conductivity is zero — enter at least one non-zero carrier concentration and mobility.");
  const resistivity = 1 / sigma;
  const nf = guardFinite({ sigma, resistivity });
  if (nf) return nf;

  return ok({ conductivity: sigma, resistivity }, [
    "σ = q·(n·μn + p·μp); drift conduction only.",
    "Mobilities assumed constant (no field or doping dependence modelled).",
  ]);
}

/* ------------------------------ Resistivity ------------------------------ */
// ρ = 1 / σ

export interface ResistivityInput {
  conductivity: number; // S/m
}
export interface ResistivityResult {
  resistivity: number; // Ω·m
}

export function resistivityFromConductivity(input: ResistivityInput): CalcResult<ResistivityResult> {
  const invalid = validate([{ name: "conductivity", value: input?.conductivity, rule: "positive" }]);
  if (invalid) return invalid;
  const resistivity = 1 / input.conductivity;
  const nf = guardFinite({ resistivity });
  if (nf) return nf;
  return ok({ resistivity }, ["Resistivity is the reciprocal of conductivity: ρ = 1/σ."]);
}

/* ------------------------- Doping conversion ----------------------------- */
// number of atoms = concentration × volume. Provide exactly two.

export interface DopingConversionInput {
  concentration?: number; // m^-3
  volume?: number; // m³
  count?: number; // dimensionless
}
export interface DopingConversionResult {
  concentration: number;
  volume: number;
  count: number;
  computed: "concentration" | "volume" | "count";
}

export function dopingConversion(input: DopingConversionInput): CalcResult<DopingConversionResult> {
  const entries: [keyof DopingConversionInput, number | undefined][] = [
    ["concentration", input?.concentration],
    ["volume", input?.volume],
    ["count", input?.count],
  ];
  const provided = entries.filter(([, v]) => v !== undefined && v !== null);
  if (provided.length !== 2) return err("Provide exactly two of concentration, volume, and count.");
  for (const [name, v] of provided) {
    if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) {
      return err(`${name} must be greater than zero`, name as string);
    }
  }

  let { concentration, volume, count } = input;
  let computed: DopingConversionResult["computed"];
  if (concentration != null && volume != null) {
    count = concentration * volume;
    computed = "count";
  } else if (count != null && volume != null) {
    concentration = count / volume;
    computed = "concentration";
  } else {
    volume = count! / concentration!;
    computed = "volume";
  }

  const nf = guardFinite({ concentration: concentration!, volume: volume!, count: count! });
  if (nf) return nf;

  return ok({ concentration: concentration!, volume: volume!, count: count!, computed }, [
    "Total atoms = concentration × volume.",
    "Concentration is a density (atoms per volume); count is the total number — they are not the same.",
  ]);
}

/* --------------------------- Implant dose -------------------------------- */
// total ions = dose (ions/area) × area.

export interface ImplantDoseInput {
  dose: number; // ions / m²
  area: number; // m²
}
export interface ImplantDoseResult {
  totalIons: number;
}

export function implantTotalIons(input: ImplantDoseInput): CalcResult<ImplantDoseResult> {
  const invalid = validate([
    { name: "dose", value: input?.dose, rule: "positive" },
    { name: "area", value: input?.area, rule: "positive" },
  ]);
  if (invalid) return invalid;
  const totalIons = input.dose * input.area;
  const nf = guardFinite({ totalIons });
  if (nf) return nf;
  return ok({ totalIons }, [
    "Dose is implanted ions per unit area; total = dose × area.",
    "Educational only — no implant energy, profile, or operational settings are modelled.",
  ]);
}

/* ---------------------- Doping → sheet-resistance chain -------------------- */
// n-type: n ≈ Nd ⇒ σ = q·n·μn ⇒ ρ = 1/σ ⇒ Rs = ρ / t

export interface DopingChainInput {
  dopant: number; // Nd, m^-3 (n-type)
  electronMobility: number; // μn, m²/(V·s)
  thickness: number; // t, m
  intrinsicConc?: number;
}
export interface DopingChainResult {
  carrier: number; // n, m^-3
  conductivity: number; // S/m
  resistivity: number; // Ω·m
  sheetResistance: number; // Ω/□
}

export function dopingChain(input: DopingChainInput): CalcResult<DopingChainResult> {
  const ni = input?.intrinsicConc ?? NI_SILICON_300K;
  const invalid = validate([
    { name: "dopant", value: input?.dopant, rule: "positive" },
    { name: "electronMobility", value: input?.electronMobility, rule: "positive" },
    { name: "thickness", value: input?.thickness, rule: "positive" },
  ]);
  if (invalid) return invalid;

  const half = input.dopant / 2;
  const carrier = half + Math.sqrt(half * half + ni * ni); // majority electrons
  const sigma = Q * carrier * input.electronMobility;
  const resistivity = 1 / sigma;
  const sheetResistance = resistivity / input.thickness;
  const nf = guardFinite({ carrier, sigma, resistivity, sheetResistance });
  if (nf) return nf;

  return ok({ carrier, conductivity: sigma, resistivity, sheetResistance }, [
    "n-type: majority electron concentration from charge neutrality + mass action.",
    "σ = q·n·μn (electron drift only); ρ = 1/σ; Rs = ρ/t.",
    "Complete ionization, constant mobility, uniform film.",
  ]);
}
