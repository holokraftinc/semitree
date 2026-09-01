// Calculation-definition contract + registry (for UI wiring in a later phase).
export * from "./types";
export {
  registerCalculation,
  getAllCalculations,
  getCalculation,
} from "./registry";

// Shared result + validation primitives.
export type { CalcResult, CalcOk, CalcErr } from "./result";
export { ok, err } from "./result";
export { validate, guardFinite, requireInteger } from "./validation";

// Pure scientific calculation modules (UI-independent). Inputs/outputs are SI.
export * from "./reynolds";
export * from "./hydraulicDiameter";
export * from "./pressureDrop";
export * from "./flowResistance";
export * from "./diffusionTime";
export * from "./poissonLoading";
export * from "./syringePump";
export * from "./unitConversion";
