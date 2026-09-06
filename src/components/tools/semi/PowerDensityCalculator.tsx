"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import {
  MeasurementField,
  type MeasurementValue,
} from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { powerDensity, type PowerDensityResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

export function PowerDensityCalculator() {
  const [powerValue, setPowerValue] = useState<MeasurementValue>({ raw: "100", unit: "W" });
  const [dieWidth, setDieWidth] = useState<MeasurementValue>({ raw: "10", unit: "mm" });
  const [dieHeight, setDieHeight] = useState<MeasurementValue>({ raw: "10", unit: "mm" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<PowerDensityResult | null>(null);

  const reset = () => {
    setPowerValue({ raw: "100", unit: "W" });
    setDieWidth({ raw: "10", unit: "mm" });
    setDieHeight({ raw: "10", unit: "mm" });
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = measurementToSI(powerValue);
    const w = measurementToSI(dieWidth);
    const h = measurementToSI(dieHeight);
    const nextErrors: Record<string, string> = {};
    if (p === null) nextErrors.power = "Enter a valid number.";
    if (w === null) nextErrors.dieWidth = "Enter a valid number.";
    if (h === null) nextErrors.dieHeight = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = powerDensity({ power: p!, area: w! * h! });
    if (!res.ok) {
      if (res.field === "power") setErrors({ power: res.error });
      else setFormError(res.error);
      setResult(null);
      track("calculation_error", { tool: "power-density", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "power-density" });
  };

  return (
    <CalculatorShell
      title="Power density"
      description="Areal power density of a die or package from total power and area."
      tier="mvp"
      trackSlug="power-density"
      categoryLabel="Packaging & thermal"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Power density" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <MeasurementField
            label="Total power (P)"
            quantity="power"
            value={powerValue}
            onChange={setPowerValue}
            error={errors.power}
          />
          <MeasurementField
            label="Die width"
            quantity="length"
            value={dieWidth}
            onChange={setDieWidth}
            error={errors.dieWidth}
          />
          <MeasurementField
            label="Die height"
            quantity="length"
            value={dieHeight}
            onChange={setDieHeight}
            error={errors.dieHeight}
          />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  {
                    label: "Power density",
                    value: formatNumber(result.powerDensity / 1e4),
                    unit: "W/cm²",
                    primary: true,
                  },
                  {
                    label: "Power density",
                    value: formatNumber(result.powerDensity / 1e6),
                    unit: "W/mm²",
                  },
                  {
                    label: "Power density (SI)",
                    value: formatNumber(result.powerDensity),
                    unit: "W/m²",
                  },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Power density, not total power, drives local heating and hot spots.
            For reference, a modern high-performance CPU/GPU die runs on the order
            of tens to ~100 W/cm². High values demand advanced cooling and can
            create thermal gradients across the die even when the average
            junction temperature looks acceptable — check the Junction
            temperature tool alongside this.
          </p>
        ) : (
          <p>Enter total power and die footprint (area is width × height).</p>
        )
      }
      formula={{
        expression: "P_density = P / A",
        label: "Areal power density",
        caption: "Total dissipated power divided by die area.",
      }}
      variables={[
        { symbol: "P_density", name: "Power density", unit: "W/m²" },
        { symbol: "P", name: "Total power", unit: "W" },
        { symbol: "A", name: "Die area (w × h)", unit: "m²" },
      ]}
      assumptions={[
        "Uniform power dissipation over the given area.",
        "Areal power density only; no depth/volume term.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>P = 100 W over a 10 mm × 10 mm die (A = 1 cm²).</p>
          <p className="font-mono text-xs text-muted-foreground">
            P_density = 100 W / 1 cm² = 100 W/cm²
          </p>
        </div>
      }
      relatedConcepts={[
        { label: "Packaging", href: "/semiconductors/learn/packaging" },
        { label: "3D IC", href: "/semiconductors/learn/3d-ic" },
      ]}
      relatedLessons={[
        { label: "HBM", href: "/semiconductors/learn/hbm" },
        { label: "Advanced packaging", href: "/semiconductors/learn/advanced-packaging" },
      ]}
      relatedTools={[
        ...getRelatedSemiToolLinks("power-density"),
        { label: "Explore semiconductor companies", href: "/industry" },
      ]}
    />
  );
}
