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
import { getRelatedToolLinks } from "@/lib/data/tools";
import { getRelatedConceptLinks } from "@/lib/data/graph";
import { track } from "@/lib/analytics";
import { measurementToSI } from "@/components/tools/calculator/helpers";
import { ChannelDiagram } from "./ChannelDiagram";
import { hydraulicDiameter } from "@/lib/calculations/hydraulicDiameter";
import { convert } from "@/lib/units";
import { formatNumber } from "@/lib/utils/format";

type FieldKey = "width" | "height";

const DEFAULTS: Record<FieldKey, MeasurementValue> = {
  width: { raw: "100", unit: "um" },
  height: { raw: "50", unit: "um" },
};

export function HydraulicDiameterCalculator() {
  const [fields, setFields] = useState<Record<FieldKey, MeasurementValue>>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [dhSI, setDhSI] = useState<number | null>(null);

  const set = (key: FieldKey) => (next: MeasurementValue) =>
    setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setDhSI(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const si = {
      width: measurementToSI(fields.width),
      height: measurementToSI(fields.height),
    };
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    (Object.keys(si) as FieldKey[]).forEach((k) => {
      if (si[k] === null) nextErrors[k] = "Enter a valid number.";
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setDhSI(null);
      return;
    }

    const res = hydraulicDiameter(si as Record<FieldKey, number>);
    if (!res.ok) {
      const field = res.field as FieldKey | undefined;
      setErrors(field ? { [field]: res.error } : {});
      setFormError(field ? null : res.error);
      setDhSI(null);
      track("calculation_error", { tool: "hydraulic-diameter", field });
      return;
    }
    setErrors({});
    setFormError(null);
    setDhSI(res.value.hydraulicDiameter);
    track("calculation_completed", { tool: "hydraulic-diameter" });
  };

  return (
    <CalculatorShell
      title="Hydraulic diameter"
      description="Effective diameter of a rectangular channel, for use in Reynolds-number and resistance formulas."
      tier="mvp"
      trackSlug="hydraulic-diameter"
      categoryLabel="Fluid mechanics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Hydraulic diameter" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && (
            <Alert variant="danger" title="Check your inputs">
              {formError}
            </Alert>
          )}
          <ChannelDiagram />
          <MeasurementField
            label="Channel width (w)"
            quantity="length"
            value={fields.width}
            onChange={set("width")}
            error={errors.width}
          />
          <MeasurementField
            label="Channel height (h)"
            quantity="length"
            value={fields.height}
            onChange={set("height")}
            error={errors.height}
          />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          results={
            dhSI !== null
              ? [
                  {
                    label: "Hydraulic diameter",
                    value: formatNumber(convert(dhSI, "m", "um")),
                    unit: "µm",
                    primary: true,
                  },
                  {
                    label: "In millimetres",
                    value: formatNumber(convert(dhSI, "m", "mm")),
                    unit: "mm",
                  },
                ]
              : []
          }
        />
      }
      interpretation={
        dhSI !== null ? (
          <p>
            This hydraulic diameter can be dropped into the Reynolds-number and
            pressure/resistance formulas in place of a circular pipe diameter.
            For a rectangle it always lies between the height and the width.
          </p>
        ) : (
          <p>
            Enter the channel width and height to get the hydraulic diameter — the
            single length scale that lets circular-pipe formulas apply to a
            rectangular channel.
          </p>
        )
      }
      formula={{
        expression: "Dₕ = 2wh / (w + h)",
        label: "Hydraulic diameter (rectangular)",
        caption: "Equivalent to 4·Area / Perimeter for a rectangle (exact).",
      }}
      variables={[
        { symbol: "Dₕ", name: "Hydraulic diameter", unit: "m" },
        { symbol: "w", name: "Channel width", unit: "m" },
        { symbol: "h", name: "Channel height", unit: "m" },
      ]}
      assumptions={[
        "Rectangular cross-section.",
        "Dₕ = 2wh/(w+h) is the exact specialisation of Dₕ = 4·Area/Perimeter to a rectangle.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>A channel is 100 µm wide and 50 µm tall.</p>
          <p className="font-mono text-xs text-muted-foreground">
            Dₕ = 2 × 100 × 50 / (100 + 50) = 10000 / 150 ≈ 66.7 µm
          </p>
        </div>
      }
      relatedConcepts={getRelatedConceptLinks("hydraulic-diameter")}
      relatedLessons={[
        { label: "Level 1 — Physics foundations", href: "/learn" },
      ]}
      relatedTools={getRelatedToolLinks("hydraulic-diameter")}
    />
  );
}
