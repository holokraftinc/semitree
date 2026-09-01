import type { CalculationDefinition } from "./types";

/**
 * Central registry of calculators.
 *
 * Phase 01 ships the registry *mechanism* but no calculators — the array is
 * intentionally empty. Each calculator (built in a later phase) will be defined
 * in its own file under this folder and registered via `registerCalculation`,
 * so the Tools UI and search can enumerate them without hard-coded lists.
 */
const REGISTRY = new Map<string, CalculationDefinition>();

/** Register a calculator. Throws on duplicate slug to catch collisions early. */
export function registerCalculation(def: CalculationDefinition): void {
  if (REGISTRY.has(def.slug)) {
    throw new Error(`Duplicate calculation slug: "${def.slug}"`);
  }
  REGISTRY.set(def.slug, def);
}

/** All registered calculators. */
export function getAllCalculations(): CalculationDefinition[] {
  return [...REGISTRY.values()];
}

/** Look up a calculator by slug. */
export function getCalculation(slug: string): CalculationDefinition | undefined {
  return REGISTRY.get(slug);
}
