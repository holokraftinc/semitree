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
import { halfPitch, type HalfPitchResult } from "@/lib/calculations/semi";
import { formatNumber } from "@/lib/utils/format";

export function PitchHalfPitchCalculator() {
  const [pitch, setPitch] = useState<MeasurementValue>({ raw: "80", unit: "nm" });
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<HalfPitchResult | null>(null);

  const reset = () => {
    setPitch({ raw: "80", unit: "nm" });
    setError(undefined);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const si = measurementToSI(pitch);
    if (si === null) {
      setError("Enter a valid number.");
      setResult(null);
      return;
    }
    const res = halfPitch({ pitch: si });
    if (!res.ok) {
      setError(res.error);
      setResult(null);
      track("calculation_error", { tool: "pitch-half-pitch", field: res.field });
      return;
    }
    setError(undefined);
    setResult(res.value);
    track("calculation_completed", { tool: "pitch-half-pitch" });
  };

  return (
    <CalculatorShell
      title="Pitch / half-pitch"
      description="Convert a feature pitch into half-pitch and the line/space interpretation."
      tier="mvp"
      trackSlug="pitch-half-pitch"
      categoryLabel="Lithography"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Pitch / half-pitch" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <MeasurementField label="Pitch" quantity="length" value={pitch} onChange={setPitch} error={error} help="Centre-to-centre distance between repeating features." />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Half-pitch", value: formatNumber(result.halfPitch * 1e9), unit: "nm", primary: true },
                  { label: "Line width (equal line/space)", value: formatNumber(result.lineWidth * 1e9), unit: "nm" },
                  { label: "Space (equal line/space)", value: formatNumber(result.space * 1e9), unit: "nm" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <div className="space-y-2">
            <p>
              <strong>Pitch</strong> is the centre-to-centre distance of a repeating pattern. <strong>Half-pitch</strong>{" "}
              is half of that — the figure most often quoted for density, because for a dense pattern of equal lines and
              spaces, the line width and the space each equal the half-pitch.
            </p>
            <Alert variant="info" title="Terminology">
              A &ldquo;40 nm half-pitch&rdquo; pattern has an 80 nm pitch: 40 nm lines separated by 40 nm spaces.
            </Alert>
          </div>
        ) : (
          <p>Enter a pitch to get its half-pitch.</p>
        )
      }
      formula={{ expression: "half-pitch = pitch / 2", label: "Half-pitch", caption: "Equal line/space: line = space = half-pitch." }}
      variables={[
        { symbol: "pitch", name: "Centre-to-centre spacing", unit: "m" },
        { symbol: "half-pitch", name: "Half of the pitch", unit: "m" },
      ]}
      assumptions={[
        "Line width = space is assumed for the equal line/space interpretation.",
        "Asymmetric patterns (unequal line and space) are not represented by half-pitch alone.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>pitch = 80 nm.</p>
          <p className="font-mono text-xs text-muted-foreground">half-pitch = 80 / 2 = 40 nm (40 nm line + 40 nm space)</p>
        </div>
      }
      relatedConcepts={[{ label: "Photolithography", href: "/semiconductors/learn/lithography" }]}
      relatedLessons={getSemiToolLearningLinks("pitch-half-pitch")}
      relatedTools={getRelatedSemiToolLinks("pitch-half-pitch")}
    />
  );
}
