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
import { overlayError, type OverlayResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

type FieldKey = "xError" | "yError" | "processError";

const DEFAULTS: Record<FieldKey, MeasurementValue> = {
  xError: { raw: "2", unit: "nm" },
  yError: { raw: "2", unit: "nm" },
  processError: { raw: "1", unit: "nm" },
};

export function OverlayErrorCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<OverlayResult | null>(null);

  const set = (key: FieldKey) => (next: MeasurementValue) => setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const si = {
      xError: measurementToSI(fields.xError),
      yError: measurementToSI(fields.yError),
      processError: measurementToSI(fields.processError),
    };
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    (Object.keys(si) as FieldKey[]).forEach((k) => {
      if (si[k] === null) nextErrors[k] = "Enter a valid number.";
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const res = overlayError(si as Record<FieldKey, number>);
    if (!res.ok) {
      setErrors(res.field ? { [res.field as FieldKey]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "overlay-error", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "overlay-error" });
  };

  return (
    <CalculatorShell
      title="Overlay error budget"
      description="Combine independent overlay contributions in quadrature to see a total overlay error."
      tier="mvp"
      trackSlug="overlay-error"
      categoryLabel="Lithography"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Overlay error budget" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Educational error-budget model">
            Independent contributions combine in quadrature. This illustrates error budgeting — it does not represent
            any specific fab&rsquo;s overlay budget.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="X error" quantity="length" value={fields.xError} onChange={set("xError")} error={errors.xError} />
          <MeasurementField label="Y error" quantity="length" value={fields.yError} onChange={set("yError")} error={errors.yError} />
          <MeasurementField label="Process contribution" quantity="length" value={fields.processError} onChange={set("processError")} error={errors.processError} help="Combined process / distortion term." />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={result ? [{ label: "Combined overlay (RSS)", value: formatNumber(result.total * 1e9), unit: "nm", primary: true }] : []}
        />
      }
      interpretation={
        result ? (
          <p>
            Independent error sources add in <strong>quadrature</strong> (root-sum-square), not linearly, because they
            are uncorrelated — so the total is dominated by the largest contributors. Error budgeting works backwards
            from a total overlay target: each source is allocated a share so the combined result stays within budget.
            Note that <em>correlated</em> or systematic errors do not combine this way and must be corrected separately.
          </p>
        ) : (
          <p>Enter the X, Y, and process contributions (all as lengths).</p>
        )
      }
      formula={{ expression: "total = √(X² + Y² + P²)", label: "Root-sum-square", caption: "Independent contributions combine in quadrature." }}
      variables={[
        { symbol: "total", name: "Combined overlay error", unit: "m (shown as nm)" },
        { symbol: "X", name: "X-direction error", unit: "m" },
        { symbol: "Y", name: "Y-direction error", unit: "m" },
        { symbol: "P", name: "Process/distortion contribution", unit: "m" },
      ]}
      assumptions={[
        "Contributions are independent and combine in quadrature (RSS).",
        "Educational model — not a specific fab's overlay budget.",
        "Correlated/systematic errors are not captured by this combination.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>X = 3 nm, Y = 4 nm, P = 0.</p>
          <p className="font-mono text-xs text-muted-foreground">total = √(3² + 4² + 0²) = 5 nm</p>
        </div>
      }
      relatedConcepts={[
        { label: "Photolithography", href: "/semiconductors/learn/lithography" },
        { label: "Metrology & inspection", href: "/semiconductors/learn/metrology" },
      ]}
      relatedLessons={getSemiToolLearningLinks("overlay-error")}
      relatedTools={getRelatedSemiToolLinks("overlay-error")}
    />
  );
}
