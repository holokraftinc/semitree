/**
 * Unit conversion — a validated wrapper over the units layer (src/lib/units).
 *
 * Covers the converters in spec §2E (flow rate, pressure, volume, viscosity,
 * and every other quantity in the units registry). Unknown units and
 * cross-quantity conversions are returned as errors rather than thrown.
 */
import { CalcResult, ok, err } from "./result";
import { validate, guardFinite } from "./validation";
import { convert, getUnit } from "../units";

export interface UnitConversionInput {
  value: number;
  /** Source unit id (see units registry, e.g. "uL_per_min"). */
  from: string;
  /** Target unit id. */
  to: string;
}

export interface UnitConversionResult {
  value: number;
  from: string;
  to: string;
  /** The physical quantity both units measure. */
  quantity: string;
}

export function convertUnit(
  input: UnitConversionInput,
): CalcResult<UnitConversionResult> {
  const invalid = validate([
    { name: "value", value: input?.value, rule: "finite" },
  ]);
  if (invalid) return invalid;

  const fromUnit = getUnit(input?.from);
  if (!fromUnit) return err(`Unknown unit "${input?.from}"`, "from");
  const toUnit = getUnit(input?.to);
  if (!toUnit) return err(`Unknown unit "${input?.to}"`, "to");
  if (fromUnit.quantity !== toUnit.quantity) {
    return err(
      `Cannot convert ${fromUnit.quantity} (${input.from}) to ${toUnit.quantity} (${input.to})`,
      "to",
    );
  }

  let converted: number;
  try {
    converted = convert(input.value, input.from, input.to);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Conversion failed");
  }

  const nf = guardFinite({ value: converted });
  if (nf) return nf;

  return ok(
    {
      value: converted,
      from: input.from,
      to: input.to,
      quantity: fromUnit.quantity,
    },
    ["Linear/affine unit conversion as defined in the units registry."],
  );
}
