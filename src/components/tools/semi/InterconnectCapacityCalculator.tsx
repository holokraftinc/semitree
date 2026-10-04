"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { interconnectCapacity, type InterconnectCapacityResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type Key = "areaWidth" | "areaHeight" | "pitch";

const DEFAULTS: Record<Key, MeasurementValue> = {
  areaWidth: { raw: "10", unit: "mm" },
  areaHeight: { raw: "10", unit: "mm" },
  pitch: { raw: "400", unit: "um" },
};

export function InterconnectCapacityCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<InterconnectCapacityResult | null>(null);

  const set = (key: Key) => (next: MeasurementValue) => setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const si = {
      areaWidth: measurementToSI(fields.areaWidth),
      areaHeight: measurementToSI(fields.areaHeight),
      pitch: measurementToSI(fields.pitch),
    };
    const nextErrors: Partial<Record<Key, string>> = {};
    (Object.keys(si) as Key[]).forEach((k) => {
      if (si[k] === null) nextErrors[k] = "Enter a valid number.";
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = interconnectCapacity(si as Record<Key, number>);
    if (!res.ok) {
      setErrors(res.field ? { [res.field as Key]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "interconnect-count", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "interconnect-count" });
  };

  return (
    <CalculatorShell
      title="Interconnect capacity"
      description="The theoretical geometric number of connections that fit in an area at a given pitch."
      tier="mvp"
      trackSlug="interconnect-count"
      categoryLabel="Packaging"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Interconnect capacity" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Geometric capacity, not actual capability">
            This is the maximum full grid that fits — a ceiling. Real packages use far fewer: power and ground pins,
            keep-out zones, routing, and reliability rules all reduce the usable count.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Area width" quantity="length" value={fields.areaWidth} onChange={set("areaWidth")} error={errors.areaWidth} />
          <MeasurementField label="Area height" quantity="length" value={fields.areaHeight} onChange={set("areaHeight")} error={errors.areaHeight} />
          <MeasurementField label="Pitch" quantity="length" value={fields.pitch} onChange={set("pitch")} error={errors.pitch} help="Centre-to-centre spacing between connections." />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Max connections (geometric)", value: formatNumber(result.count), unit: "", primary: true },
                  { label: "Columns × rows", value: `${formatNumber(result.columns)} × ${formatNumber(result.rows)}`, unit: "" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Dividing each side by the pitch (and rounding down) gives the biggest full grid that fits — a{" "}
            <strong>theoretical geometric ceiling</strong>. Actual packages deliver far fewer signal connections, because
            many pads go to power and ground, edges are kept clear, and routing and reliability constrain the usable
            array. Use this to understand how pitch and area bound connection count, not to size a real package.
          </p>
        ) : (
          <p>Enter the available area and the connection pitch.</p>
        )
      }
      formula={{ expression: "count ≈ ⌊W / pitch⌋ × ⌊H / pitch⌋", label: "Geometric capacity", caption: "Full grid at the given pitch." }}
      variables={[
        { symbol: "count", name: "Maximum connections (geometric)", unit: "dimensionless" },
        { symbol: "W, H", name: "Area width and height", unit: "m" },
        { symbol: "pitch", name: "Connection pitch", unit: "m" },
      ]}
      assumptions={[
        "A full, uniform grid across the whole area.",
        "Geometric ceiling only — ignores power/ground, keep-outs, routing, and reliability.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>10 mm × 10 mm area, 400 µm pitch.</p>
          <p className="font-mono text-xs text-muted-foreground">⌊10/0.4⌋ = 25 per side → 25 × 25 = 625 connections</p>
        </div>
      }
      relatedConcepts={[
        { label: "Chip packaging", href: "/semiconductors/learn/packaging" },
        { label: "Electrical connections", href: "/semiconductors/learn/electrical-connections" },
      ]}
      relatedLessons={getSemiToolLearningLinks("interconnect-count")}
      relatedTools={getRelatedSemiToolLinks("interconnect-count")}
    />
  );
}
