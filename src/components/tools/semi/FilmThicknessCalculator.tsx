"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { ResultCard } from "@/components/tools/ResultCard";
import { Alert } from "@/components/ui/Alert";
import { MeasurementField, type MeasurementValue } from "@/components/tools/calculator/MeasurementField";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";
import { track } from "@/lib/analytics";
import { filmThickness, type FilmThicknessResult } from "@/lib/calculations/semi";
import { toSI } from "@/lib/units";
import { parseNumber, formatNumber } from "@/lib/utils/format";

type Key = "thickness" | "area" | "volume";

const DEFAULTS: Record<Key, MeasurementValue> = {
  thickness: { raw: "100", unit: "nm" },
  area: { raw: "100", unit: "mm2" },
  volume: { raw: "", unit: "nL" },
};

/** Empty raw → not provided (undefined); invalid raw → error. */
function readField(m: MeasurementValue): "empty" | number | null {
  if (m.raw.trim() === "") return "empty";
  const n = parseNumber(m.raw);
  if (n === null) return null;
  try {
    return toSI(n, m.unit);
  } catch {
    return null;
  }
}

export function FilmThicknessCalculator() {
  const [fields, setFields] = useState(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<FilmThicknessResult | null>(null);

  const set = (key: Key) => (next: MeasurementValue) => setFields((f) => ({ ...f, [key]: next }));

  const reset = () => {
    setFields(DEFAULTS);
    setErrors({});
    setFormError(null);
    setResult(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed: Record<Key, "empty" | number | null> = {
      thickness: readField(fields.thickness),
      area: readField(fields.area),
      volume: readField(fields.volume),
    };
    const nextErrors: Partial<Record<Key, string>> = {};
    (Object.keys(parsed) as Key[]).forEach((k) => {
      if (parsed[k] === null) nextErrors[k] = "Enter a valid number or leave blank.";
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      setResult(null);
      return;
    }
    const provided = (Object.keys(parsed) as Key[]).filter((k) => parsed[k] !== "empty");
    if (provided.length !== 2) {
      setErrors({});
      setFormError("Enter exactly two of thickness, area, and volume — leave the third blank.");
      setResult(null);
      return;
    }
    const input = {
      thickness: parsed.thickness === "empty" ? undefined : (parsed.thickness as number),
      area: parsed.area === "empty" ? undefined : (parsed.area as number),
      volume: parsed.volume === "empty" ? undefined : (parsed.volume as number),
    };
    const res = filmThickness(input);
    if (!res.ok) {
      setErrors(res.field ? { [res.field as Key]: res.error } : {});
      setFormError(res.field ? null : res.error);
      setResult(null);
      track("calculation_error", { tool: "film-thickness", field: res.field });
      return;
    }
    setErrors({});
    setFormError(null);
    setResult(res.value);
    track("calculation_completed", { tool: "film-thickness" });
  };

  return (
    <CalculatorShell
      title="Film thickness / volume"
      description="Relate a film's thickness, area, and volume (V = thickness × area). Fill any two and the third is computed."
      tier="mvp"
      trackSlug="film-thickness"
      categoryLabel="Etching & deposition"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Film thickness / volume" },
      ]}
      inputs={
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <Alert variant="danger" title="Check your inputs">{formError}</Alert>}
          <MeasurementField label="Thickness" quantity="length" value={fields.thickness} onChange={set("thickness")} error={errors.thickness} required={false} />
          <MeasurementField label="Area" quantity="area" value={fields.area} onChange={set("area")} error={errors.area} required={false} />
          <MeasurementField label="Volume" quantity="volume" value={fields.volume} onChange={set("volume")} error={errors.volume} required={false} help="Fill any two fields; leave the one you want to compute blank." />
          <CalculatorActions onReset={reset} />
        </form>
      }
      result={
        <ResultCard
          copyable
          results={
            result
              ? [
                  { label: "Thickness", value: formatNumber(result.thickness * 1e9), unit: "nm", primary: result.computed === "thickness" },
                  { label: "Area", value: formatNumber(result.area * 1e6), unit: "mm²", primary: result.computed === "area" },
                  { label: "Volume", value: formatNumber(result.volume * 1e12), unit: "nL", primary: result.computed === "volume" },
                ]
              : []
          }
        />
      }
      interpretation={
        result ? (
          <p>
            For a uniform film, volume = thickness × area. This relates how much material a film contains to how it is
            spread out — useful for estimating deposited material or converting between a measured volume and a film
            thickness over a known area.
          </p>
        ) : (
          <p>Fill any two of thickness, area, and volume; leave the third blank to compute it.</p>
        )
      }
      formula={{ expression: "V = thickness × area", label: "Film volume", caption: "Uniform film over the given area." }}
      variables={[
        { symbol: "V", name: "Volume", unit: "m³ (shown as nL)" },
        { symbol: "thickness", name: "Film thickness", unit: "m" },
        { symbol: "area", name: "Film area", unit: "m²" },
      ]}
      assumptions={["Uniform film, gap-free coverage of the given area."]}
      workedExample={
        <div className="space-y-2">
          <p>thickness = 100 nm, area = 100 mm² (= 1 cm²).</p>
          <p className="font-mono text-xs text-muted-foreground">V = 100 nm × 100 mm² = 1×10⁻¹¹ m³ = 10 nL</p>
        </div>
      }
      relatedConcepts={[
        { label: "Etching & deposition", href: "/semiconductors/learn/etching" },
        { label: "Deposition", href: "/semiconductors/learn/deposition" },
      ]}
      relatedLessons={getSemiToolLearningLinks("film-thickness")}
      relatedTools={getRelatedSemiToolLinks("film-thickness")}
    />
  );
}
