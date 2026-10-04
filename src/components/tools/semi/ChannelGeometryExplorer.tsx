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
import { formatNumber } from "@/lib/utils/format";

export function ChannelGeometryExplorer() {
  const [width, setWidth] = useState<MeasurementValue>({ raw: "1", unit: "um" });
  const [length, setLength] = useState<MeasurementValue>({ raw: "0.1", unit: "um" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [wl, setWl] = useState<number | null>(null);

  const reset = () => { setWidth({ raw: "1", unit: "um" }); setLength({ raw: "0.1", unit: "um" }); setErrors({}); setFormError(null); setWl(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = measurementToSI(width); const l = measurementToSI(length);
    const nextErrors: Record<string, string> = {};
    if (w === null) nextErrors.width = "Enter a valid number.";
    if (l === null) nextErrors.length = "Enter a valid number.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setFormError(null); setWl(null); return; }
    if (w! <= 0 || l! <= 0) { setFormError("Width and length must be greater than zero."); setWl(null); return; }
    setErrors({}); setFormError(null); setWl(w! / l!); track("calculation_completed", { tool: "channel-geometry-explorer" });
  };

  return (
    <CalculatorShell
      title="Channel length / geometry explorer"
      description="How a transistor's width and length set the W/L ratio that scales its long-channel drive current."
      tier="mvp"
      trackSlug="channel-geometry-explorer"
      categoryLabel="Device physics"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Channel length / geometry explorer" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <Alert variant="info" title="Educational long-channel scaling">
            In the long-channel model the drive current scales with W/L. This shows that geometric trend only — it does
            not include short-channel effects or velocity saturation, which change the picture at very small L.
          </Alert>
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Channel width (W)" quantity="length" value={width} onChange={setWidth} error={errors.width} />
          <MeasurementField label="Channel length (L)" quantity="length" value={length} onChange={setLength} error={errors.length} />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            wl !== null
              ? [
                  { label: "W / L ratio", value: formatNumber(wl), unit: "", primary: true },
                  { label: "Relative drive current (∝ W/L)", value: `${formatNumber(wl)}×`, unit: "per unit W/L" },
                ]
              : []
          }
        />
      }
      interpretation={
        wl !== null ? (
          <p>
            In the long-channel model the drive current is proportional to W/L: a <strong>wider</strong> channel carries
            more current, and a <strong>shorter</strong> channel also carries more (for the same bias). That is one reason
            channel length was scaled down for speed. At very short lengths, though, short-channel effects and velocity
            saturation break this simple proportionality — real devices gain less than W/L predicts.
          </p>
        ) : (
          <p>Enter the channel width and length.</p>
        )
      }
      formula={{ expression: "Id ∝ W / L", label: "Geometry scaling", caption: "Long-channel drive current." }}
      variables={[
        { symbol: "W", name: "Channel width", unit: "m" },
        { symbol: "L", name: "Channel length", unit: "m" },
        { symbol: "W/L", name: "Aspect ratio driving current", unit: "dimensionless" },
      ]}
      assumptions={[
        "Educational long-channel model; drive current ∝ W/L.",
        "Ignores short-channel effects and velocity saturation (significant at small L).",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>W = 1 µm, L = 0.1 µm.</p>
          <p className="font-mono text-xs text-muted-foreground">W/L = 10 → ~10× the drive of a W/L = 1 device (long-channel)</p>
        </div>
      }
      relatedConcepts={[{ label: "MOSFET", href: "/semiconductors/learn/mosfet" }]}
      relatedLessons={getSemiToolLearningLinks("channel-geometry-explorer")}
      relatedTools={getRelatedSemiToolLinks("channel-geometry-explorer")}
    />
  );
}
