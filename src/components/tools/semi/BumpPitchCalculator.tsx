"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { fieldBase } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { bumpArray, type BumpArrayResult } from "@/lib/calculations/semi";
import { formatNumber, parseNumber } from "@/lib/utils/format";

export function BumpPitchCalculator() {
  const [rows, setRows] = useState("20");
  const [columns, setColumns] = useState("20");
  const [pitch, setPitch] = useState<MeasurementValue>({ raw: "130", unit: "um" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<BumpArrayResult | null>(null);

  const reset = () => {
    setRows("20");
    setColumns("20");
    setPitch({ raw: "130", unit: "um" });
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = parseNumber(rows);
    const c = parseNumber(columns);
    const p = measurementToSI(pitch);
    const nextErrors: Record<string, string> = {};
    if (r === null) nextErrors.rows = "Enter a valid number.";
    if (c === null) nextErrors.columns = "Enter a valid number.";
    if (p === null) nextErrors.pitch = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = bumpArray({ rows: r!, columns: c!, pitch: p! });
    if (!res.ok) {
      setErrors(res.field ? { [res.field]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "bump-pitch", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "bump-pitch" });
  };

  const numField = (id: string, label: string, value: string, onChange: (v: string) => void, error?: string) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
      <input id={id} type="number" inputMode="numeric" step="1" min="1" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} className={cn(fieldBase, "w-full")} />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );

  return (
    <CalculatorShell
      title="Bump / interconnect pitch"
      description="Connection count, array span, and areal density from a bump array's rows, columns, and pitch."
      tier="mvp"
      trackSlug="bump-pitch"
      categoryLabel="Packaging"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Bump / interconnect pitch" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          {numField("bp-rows", "Rows", rows, setRows, errors.rows)}
          {numField("bp-cols", "Columns", columns, setColumns, errors.columns)}
          <MeasurementField label="Pitch" quantity="length" value={pitch} onChange={setPitch} error={errors.pitch} help="Centre-to-centre bump spacing." />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Total connections", value: formatNumber(result.count), unit: "", primary: true },
                  { label: "Array span", value: `${formatNumber(result.arrayWidth * 1e3)} × ${formatNumber(result.arrayHeight * 1e3)}`, unit: "mm" },
                  { label: "Areal density", value: formatNumber(result.density / 1e6), unit: "per mm²" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            A rows × columns bump array gives rows·columns connections; the array spans (columns−1)·pitch by
            (rows−1)·pitch. The <strong>areal density</strong> (1/pitch²) is set by the pitch alone — tighter pitch packs
            more connections per unit area, which is exactly why advanced packaging pushes pitch down. This is a
            geometric maximum; real designs use fewer for power, ground, and keep-outs.
          </p>
        ) : (
          <p>Enter the number of rows and columns and the bump pitch.</p>
        )
      }
      formula={{ expression: "count = rows × columns ;  density = 1 / pitch²", label: "Bump array", caption: "Density depends only on pitch." }}
      variables={[
        { symbol: "count", name: "Total connections", unit: "dimensionless" },
        { symbol: "rows, columns", name: "Array dimensions", unit: "whole numbers" },
        { symbol: "pitch", name: "Bump pitch", unit: "m" },
        { symbol: "density", name: "Connections per area", unit: "1/m² (shown per mm²)" },
      ]}
      assumptions={[
        "Full rectangular grid of connections.",
        "Geometric maximum; real designs reserve many bumps for power/ground and keep-outs.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>20 × 20 array, 130 µm pitch.</p>
          <p className="font-mono text-xs text-muted-foreground">count = 400; density = 1/(130 µm)² ≈ 59 per mm²</p>
        </div>
      }
      relatedConcepts={[
        { label: "Chip packaging", href: "/semiconductors/learn/packaging" },
        { label: "Flip-chip", href: "/semiconductors/learn/flip-chip" },
      ]}
      relatedLessons={getSemiToolLearningLinks("bump-pitch")}
      relatedTools={getRelatedSemiToolLinks("bump-pitch")}
    />
  );
}
