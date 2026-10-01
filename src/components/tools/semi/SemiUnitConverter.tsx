"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { fieldBase } from "@/components/ui/Input";
import { CalculatorShell } from "@/components/tools/CalculatorShell";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { unitsForQuantity } from "@/lib/units";
import { convert } from "@/lib/units/convert";
import type { Quantity } from "@/lib/units/types";
import { getRelatedSemiToolLinks } from "@/lib/data/semi-tools";
import { parseNumber, formatNumber } from "@/lib/utils/format";

type Category = { id: Quantity; label: string; from: string; to: string };

// Only the quantities the semiconductor unit converter exposes, with sensible
// default from/to pairs. Units themselves live in the shared units registry.
const CATEGORIES: Category[] = [
  { id: "length", label: "Length", from: "nm", to: "um" },
  { id: "area", label: "Area", from: "mm2", to: "um2" },
  { id: "time", label: "Time", from: "ns", to: "ps" },
  { id: "temperature", label: "Temperature", from: "C", to: "K" },
  { id: "pressure", label: "Pressure", from: "Torr", to: "Pa" },
  { id: "energy", label: "Energy", from: "eV", to: "J" },
  { id: "power", label: "Power", from: "mW", to: "W" },
  { id: "current", label: "Current", from: "mA", to: "uA" },
  { id: "voltage", label: "Voltage", from: "V", to: "mV" },
  { id: "resistance", label: "Resistance", from: "kohm", to: "ohm" },
  { id: "capacitance", label: "Capacitance", from: "pF", to: "nF" },
  { id: "frequency", label: "Frequency", from: "GHz", to: "MHz" },
];

export function SemiUnitConverter() {
  const [categoryId, setCategoryId] = useState<Quantity>("length");
  const category = CATEGORIES.find((c) => c.id === categoryId)!;
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState(category.from);
  const [toUnit, setToUnit] = useState(category.to);

  const options = useMemo(() => unitsForQuantity(categoryId), [categoryId]);
  const unitLabel = (id: string) => options.find((u) => u.id === id)?.label ?? id;

  const selectCategory = (cat: Category) => {
    setCategoryId(cat.id);
    setFromUnit(cat.from);
    setToUnit(cat.to);
    setValue("1");
  };

  const parsed = parseNumber(value);
  let resultValue = "";
  if (parsed !== null) {
    try {
      resultValue = formatNumber(convert(parsed, fromUnit, toUnit), 6);
    } catch {
      resultValue = "";
    }
  }

  const swap = () => {
    if (resultValue) setValue(resultValue);
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const reset = () => selectCategory(category);

  const widget = (
    <div className="space-y-6">
      <div role="tablist" aria-label="Conversion category" className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={cat.id === categoryId}
            onClick={() => selectCategory(cat)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              cat.id === categoryId
                ? "border-brand bg-brand/10 text-brand"
                : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-1.5">
          <label htmlFor="suc-value" className="block text-sm font-medium">From</label>
          <input
            id="suc-value"
            type="number"
            inputMode="decimal"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={cn(fieldBase, "w-full")}
          />
          <label htmlFor="suc-from" className="sr-only">From unit</label>
          <select id="suc-from" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className={cn(fieldBase, "w-full")}>
            {options.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center pb-1 sm:pb-8">
          <button
            type="button"
            onClick={swap}
            aria-label="Swap units"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path d="M7 4L4 7l3 3M4 7h9M13 16l3-3-3-3M16 13H7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="suc-result" className="block text-sm font-medium">To</label>
          <input
            id="suc-result"
            readOnly
            value={resultValue}
            aria-live="polite"
            placeholder="—"
            className={cn(fieldBase, "w-full bg-muted/40 font-mono")}
          />
          <label htmlFor="suc-to" className="sr-only">To unit</label>
          <select id="suc-to" value={toUnit} onChange={(e) => setToUnit(e.target.value)} className={cn(fieldBase, "w-full")}>
            {options.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {resultValue
          ? `${value} ${unitLabel(fromUnit)} = ${resultValue} ${unitLabel(toUnit)}`
          : "Enter a number to convert."}
      </p>

      <CalculatorActions onReset={reset} />
    </div>
  );

  return (
    <CalculatorShell
      title="Unit converter"
      description="Convert between semiconductor units — length, area, time, temperature, pressure, energy, power, current, voltage, resistance, capacitance, and frequency."
      tier="mvp"
      trackSlug="unit-converter"
      categoryLabel="General semiconductor"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Semiconductors", href: "/explore" },
        { label: "Tools", href: "/semiconductors/tools" },
        { label: "Unit converter" },
      ]}
      inputs={widget}
      interpretation={
        <p>
          Every conversion routes through the SI base unit for that quantity, so results are dimensionally correct.
          Temperature uses an affine conversion (°C ↔ K differ by an offset, not just a factor), and energy uses the
          exact elementary charge to relate electron-volts to joules.
        </p>
      }
      formula={{
        expression: "value_to = value_from × (factor_from / factor_to)",
        label: "Linear unit conversion",
        caption: "Affine quantities (temperature) use an offset instead of a pure factor.",
      }}
      variables={[
        { symbol: "factor_from", name: "From-unit size in SI base units", unit: "—" },
        { symbol: "factor_to", name: "To-unit size in SI base units", unit: "—" },
      ]}
      assumptions={[
        "Conversions are between units of the same physical quantity only.",
        "Energy in eV uses the exact elementary charge (1 eV = 1.602176634×10⁻¹⁹ J).",
        "Area factors are the square of the corresponding length factors.",
      ]}
      workedExample={
        <div className="space-y-2">
          <p>Convert 1 nm to ångström.</p>
          <p className="font-mono text-xs text-muted-foreground">1 nm × (10⁻⁹ / 10⁻¹⁰) = 10 Å</p>
        </div>
      }
      relatedConcepts={[{ label: "Explore semiconductor tools", href: "/semiconductors/tools" }]}
      relatedTools={getRelatedSemiToolLinks("unit-converter")}
    />
  );
}
