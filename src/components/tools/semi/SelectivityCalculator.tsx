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
import { selectivity, type SelectivityResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

export function SelectivityCalculator() {
  const [target, setTarget] = useState<MeasurementValue>({ raw: "300", unit: "nm_min" });
  const [mask, setMask] = useState<MeasurementValue>({ raw: "15", unit: "nm_min" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<SelectivityResult | null>(null);

  const reset = () => {
    setTarget({ raw: "300", unit: "nm_min" });
    setMask({ raw: "15", unit: "nm_min" });
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tr = measurementToSI(target);
    const mr = measurementToSI(mask);
    const nextErrors: Record<string, string> = {};
    if (tr === null) nextErrors.target = "Enter a valid number.";
    if (mr === null) nextErrors.mask = "Enter a valid number.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = selectivity({ targetRate: tr!, maskRate: mr! });
    if (!res.ok) {
      setErrors(res.field ? { [res.field === "targetRate" ? "target" : "mask"]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "selectivity", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "selectivity" });
  };

  return (
    <CalculatorShell
      title="Etch selectivity"
      description="The ratio of the target material's etch rate to the mask or underlayer's etch rate."
      tier="mvp"
      trackSlug="selectivity"
      categoryLabel="Etching & deposition"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Etch selectivity" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Target etch rate" quantity="depositionRate" value={target} onChange={setTarget} error={errors.target} help="The material you want to remove." />
          <MeasurementField label="Mask / underlayer etch rate" quantity="depositionRate" value={mask} onChange={setMask} error={errors.mask} help="The material you want to protect." />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Selectivity", value: `${formatNumber(result.selectivity)} : 1`, unit: "", primary: true },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            Selectivity is how much faster the etch removes the target than the mask or the layer beneath. A higher
            value gives more margin to clear the target while barely touching what you want to protect — which matters
            most for thin masks, shallow stops, and high-aspect-ratio etches. There is <strong>no universal
            &ldquo;good&rdquo; value</strong>; the selectivity you need depends on the specific layer and stack.
          </p>
        ) : (
          <p>Enter the target and mask (or underlayer) etch rates, in the same units.</p>
        )
      }
      formula={{ expression: "S = target etch rate / mask etch rate", label: "Selectivity", caption: "Dimensionless ratio (same rate units)." }}
      variables={[
        { symbol: "S", name: "Selectivity", unit: "dimensionless" },
        { symbol: "target rate", name: "Target material etch rate", unit: "m/s" },
        { symbol: "mask rate", name: "Mask/underlayer etch rate", unit: "m/s" },
      ]}
      assumptions={[
        "Both rates measured under the same process conditions and units.",
        "No universal 'good' value — required selectivity depends on the layer and stack.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>target = 300 nm/min, mask = 15 nm/min.</p>
          <p className="font-mono text-xs text-muted-foreground">S = 300 / 15 = 20 (i.e. 20:1)</p>
        </div>
      }
      relatedConcepts={[{ label: "Etching & deposition", href: "/semiconductors/learn/etching" }]}
      relatedLessons={getSemiToolLearningLinks("selectivity")}
      relatedTools={getRelatedSemiToolLinks("selectivity")}
    />
  );
}
