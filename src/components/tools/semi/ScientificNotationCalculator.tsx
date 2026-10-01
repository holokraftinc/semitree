"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { fieldBase } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { getRelatedSemiToolLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { scientificForms, type ScientificForms } from "@/lib/utils/sci-notation";
import { parseNumber } from "@/lib/utils/format";

const DEFAULT = "0.0000015";

export function ScientificNotationCalculator() {
  const [raw, setRaw] = useState(DEFAULT);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScientificForms | null>(null);

  const reset = () => {
    setRaw(DEFAULT);
    setError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseNumber(raw);
    if (n === null) {
      setError("Enter a valid number.");
      setResult(null);
      track("calculation_error", { tool: "scientific-notation" });
      return;
    }
    const forms = scientificForms(n);
    if (!forms) {
      setError("Enter a finite number.");
      setResult(null);
      track("calculation_error", { tool: "scientific-notation" });
      return;
    }
    setError(null);
    setResult(forms);
    track("calculation_completed", { tool: "scientific-notation" });
  };

  return (
    <CalculatorShell
      title="Scientific notation"
      description="Convert any number to scientific, engineering, and SI-prefix forms — handy for semiconductor dimensions and concentrations."
      tier="mvp"
      trackSlug="scientific-notation"
      categoryLabel="General semiconductor"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Scientific notation" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {error && <Alert variant="danger" title="Check your input">{error}</Alert>}
          <div className="space-y-1.5">
            <label htmlFor="sn-value" className="block text-sm font-medium text-foreground">
              Number
            </label>
            <input
              id="sn-value"
              type="text"
              inputMode="decimal"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              aria-invalid={Boolean(error)}
              className={cn(fieldBase, "w-full font-mono")}
              placeholder="e.g. 0.0000015 or 1.5e-6"
            />
            <p className="text-xs text-muted-foreground">Accepts decimals and existing exponent notation (e.g. 1.5e-6).</p>
          </div>
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Scientific notation", value: result.scientific, unit: "", primary: true },
                  { label: "Engineering notation", value: result.engineering, unit: "" },
                  { label: "SI prefix", value: result.siPrefix, unit: "" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            <strong>Scientific</strong> notation uses a single digit before the decimal point (mantissa 1–10).{" "}
            <strong>Engineering</strong> notation keeps the exponent a multiple of three, which lines up with{" "}
            <strong>SI prefixes</strong> (n, µ, m, k, M, …) — the way semiconductor dimensions (nm) and
            concentrations are usually written and spoken.
          </p>
        ) : (
          <p>Enter a number — for example a feature size like 0.0000015 m.</p>
        )
      }
      formula={{ expression: "a × 10ⁿ  (1 ≤ |a| < 10)", label: "Scientific notation", caption: "Engineering notation restricts n to multiples of 3." }}
      variables={[
        { symbol: "a", name: "Mantissa (significand)", unit: "dimensionless" },
        { symbol: "n", name: "Exponent (power of ten)", unit: "integer" },
      ]}
      assumptions={[
        "Values are shown to 6 significant figures with trailing zeros trimmed.",
        "SI-prefix form is only shown for exponents within the y (10⁻²⁴) … Y (10²⁴) range; otherwise the engineering form is used.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>Input 0.0000015 (= 1.5 µm as a length).</p>
          <p className="font-mono text-xs text-muted-foreground">Scientific 1.5 × 10⁻⁶ · Engineering 1.5 × 10⁻⁶ · SI 1.5 µ</p>
        </div>
      }
      relatedConcepts={[{ label: "Explore semiconductor tools", href: "/semiconductors/tools" }]}
      relatedTools={getRelatedSemiToolLinks("scientific-notation")}
    />
  );
}
