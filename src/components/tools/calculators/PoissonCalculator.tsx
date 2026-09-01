"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { Alert } from "@/components/ui/Alert";
import { NumberField } from "@/components/tools/calculator/NumberField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { getRelatedToolLinks } from "@/lib/data/tools";
import { getRelatedConceptLinks } from "@/lib/data/graph";
import { track } from "@/lib/analytics";
import { poissonLoading, type PoissonResult } from "@/lib/calculations/poissonLoading";
import { parseNumber, formatNumber } from "@/lib/utils/format";
import { PoissonBar } from "./PoissonBar";

export function PoissonCalculator() {
  const [lambda, setLambda] = useState("0.1");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PoissonResult | null>(null);

  const reset = () => {
    setLambda("0.1");
    setError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseNumber(lambda);
    if (n === null) {
      setError("Enter a valid number.");
      setResult(null);
      return;
    }
    const res = poissonLoading({ lambda: n });
    if (!res.ok) {
      setError(res.error);
      setResult(null);
      track("calculation_error", {
        tool: "poisson-single-cell-loading",
        field: res.field,
      });
      return;
    }
    setError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "poisson-single-cell-loading" });
  };

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  return (
    <CalculatorShell
      title="Poisson single-cell loading"
      description="Probability that a droplet contains 0, exactly 1, or 2+ cells during encapsulation."
      tier="mvp"
      trackSlug="poisson-single-cell-loading"
      categoryLabel="Droplet"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Poisson single-cell loading" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Model assumptions">
            Cells are assumed independent and randomly distributed (Poisson
            statistics). To keep doublets rare you must run at low λ — which means
            most droplets are empty. There is no λ that gives mostly single-cell
            droplets.
          </Alert>
          {error && (
            <Alert variant="danger" title="Check your input">
              {error}
            </Alert>
          )}
          <NumberField
            label="Mean cells per droplet (λ)"
            value={lambda}
            onChange={(raw) => setLambda(raw)}
            error={error ?? undefined}
            suffix="cells/droplet"
            help="λ = cell concentration × droplet volume. Typical scRNA-seq: λ ≈ 0.1."
          />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-5" aria-live="polite">
          <p className="text-xs font-medium uppercase tracking-wide text-brand">
            Result
          </p>
          {result ? (
            <div className="mt-3 space-y-4">
              <PoissonBar
                p0={result.p0}
                p1={result.p1}
                p2OrMore={result.p2OrMore}
              />
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">P(0 cells) — empty</dt>
                  <dd className="font-mono text-foreground">{pct(result.p0)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">P(1 cell) — single</dt>
                  <dd className="font-mono font-semibold text-foreground">
                    {pct(result.p1)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">P(2+ cells) — multiple</dt>
                  <dd className="font-mono text-foreground">
                    {pct(result.p2OrMore)}
                  </dd>
                </div>
              </dl>
              <p className="text-xs text-muted-foreground">
                Of the occupied droplets, the single-cell fraction is{" "}
                {result.p1 + result.p2OrMore > 0
                  ? pct(result.p1 / (result.p1 + result.p2OrMore))
                  : "—"}
                .
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Enter λ and calculate to see the occupancy distribution.
            </p>
          )}
        </div>
      }
      interpretation={
        result ? (
          <p>
            At λ = {formatNumber(result.lambda)}, {pct(result.p0)} of droplets are
            empty and only {pct(result.p1)} hold exactly one cell. Lowering λ
            reduces doublets (multi-cell droplets) but wastes more droplets as
            empties — the fundamental trade-off of Poisson loading.
          </p>
        ) : (
          <p>
            Single-cell platforms run at low λ so that among occupied droplets,
            very few contain two or more cells. The cost is that most droplets end
            up empty.
          </p>
        )
      }
      formula={{
        expression: "P(k) = λᵏ · e^(−λ) / k!",
        label: "Poisson probability of k cells",
        caption: "λ is the mean number of cells per droplet.",
      }}
      variables={[
        { symbol: "P(k)", name: "Probability of k cells in a droplet", unit: "—" },
        { symbol: "λ", name: "Mean cells per droplet", unit: "—" },
        { symbol: "k", name: "Number of cells", unit: "—" },
      ]}
      assumptions={[
        "Cells are independent and randomly (uniformly) distributed — Poisson statistics.",
        "λ is the mean cells per droplet (= concentration × droplet volume).",
        "No cell–cell interactions, settling, or clumping.",
        "Achieving mostly single-cell occupancy requires low λ, so most droplets are empty.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>At λ = 0.1 cells per droplet:</p>
          <p className="font-mono text-xs text-muted-foreground">
            P(0) = e⁻⁰·¹ ≈ 90.5% · P(1) = 0.1·e⁻⁰·¹ ≈ 9.0% · P(2+) ≈ 0.5%
          </p>
          <p>Doublets are ~0.5% — but ~90% of droplets are wasted as empties.</p>
        </div>
      }
      relatedConcepts={getRelatedConceptLinks("poisson-single-cell-loading")}
      relatedLessons={[{ label: "Level 4 — Applications", href: "/learn" }]}
      relatedTools={getRelatedToolLinks("poisson-single-cell-loading")}
    />
  );
}
