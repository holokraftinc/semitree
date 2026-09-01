"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { fieldBase } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { unitsForQuantity } from "@/lib/units";
import type { Quantity } from "@/lib/units/types";
import { convertUnit } from "@/lib/calculations/unitConversion";
import { parseNumber, formatNumber } from "@/lib/utils/format";

type Category = { id: Quantity; label: string; from: string; to: string };

const CATEGORIES: Category[] = [
  { id: "flowRate", label: "Flow", from: "uL_per_min", to: "nL_per_s" },
  { id: "pressure", label: "Pressure", from: "bar", to: "psi" },
  { id: "volume", label: "Volume", from: "uL", to: "nL" },
  { id: "viscosity", label: "Viscosity", from: "mPa_s", to: "Pa_s" },
];

export function UnitConverter() {
  const [categoryId, setCategoryId] = useState<Quantity>("flowRate");
  const category = CATEGORIES.find((c) => c.id === categoryId)!;
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState(category.from);
  const [toUnit, setToUnit] = useState(category.to);
  const [copied, setCopied] = useState(false);

  const options = useMemo(() => unitsForQuantity(categoryId), [categoryId]);

  const selectCategory = (cat: Category) => {
    setCategoryId(cat.id);
    setFromUnit(cat.from);
    setToUnit(cat.to);
    setValue("1");
    setCopied(false);
  };

  // Instant conversion.
  const parsed = parseNumber(value);
  const conversion =
    parsed === null ? null : convertUnit({ value: parsed, from: fromUnit, to: toUnit });
  const resultValue =
    conversion && conversion.ok ? formatNumber(conversion.value.value, 6) : "";

  useEffect(() => {
    setCopied(false);
  }, [value, fromUnit, toUnit]);

  const swap = () => {
    // Put the current result into the input and swap the units, so swapping is a
    // natural round-trip.
    if (conversion && conversion.ok) setValue(String(conversion.value.value));
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copy = async () => {
    if (!resultValue) return;
    let succeeded = false;
    try {
      await navigator.clipboard.writeText(resultValue);
      succeeded = true;
    } catch {
      // Async Clipboard API unavailable (insecure context / permissions) —
      // fall back to selecting the read-only result and execCommand.
      const el = document.getElementById("uc-result");
      if (el instanceof HTMLInputElement) {
        el.select();
        try {
          succeeded = document.execCommand("copy");
        } catch {
          succeeded = false;
        }
        el.setSelectionRange(0, 0);
        el.blur();
      }
    }
    if (succeeded) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  };

  const reset = () => selectCategory(category);

  const unitLabel = (id: string) =>
    options.find((u) => u.id === id)?.label ?? id;

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div
        role="tablist"
        aria-label="Conversion category"
        className="flex flex-wrap gap-2"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={cat.id === categoryId}
            onClick={() => selectCategory(cat)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
        {/* From */}
        <div className="space-y-1.5">
          <label htmlFor="uc-value" className="block text-sm font-medium">
            From
          </label>
          <input
            id="uc-value"
            type="number"
            inputMode="decimal"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={cn(fieldBase, "w-full")}
          />
          <label htmlFor="uc-from" className="sr-only">
            From unit
          </label>
          <select
            id="uc-from"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className={cn(fieldBase, "w-full")}
          >
            {options.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        {/* Swap */}
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

        {/* To */}
        <div className="space-y-1.5">
          <label htmlFor="uc-result" className="block text-sm font-medium">
            To
          </label>
          <div className="relative">
            <input
              id="uc-result"
              readOnly
              value={resultValue}
              aria-live="polite"
              placeholder="—"
              className={cn(fieldBase, "w-full bg-muted/40 pr-10 font-mono")}
            />
            <button
              type="button"
              onClick={copy}
              aria-label="Copy result"
              disabled={!resultValue}
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            >
              {copied ? (
                <svg viewBox="0 0 20 20" className="h-4 w-4 text-success" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="7" y="7" width="9" height="9" rx="1.5" />
                  <path d="M4 13V4h9" />
                </svg>
              )}
            </button>
          </div>
          <label htmlFor="uc-to" className="sr-only">
            To unit
          </label>
          <select
            id="uc-to"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className={cn(fieldBase, "w-full")}
          >
            {options.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {resultValue
          ? `${value} ${unitLabel(fromUnit)} = ${resultValue} ${unitLabel(toUnit)}`
          : "Enter a number to convert."}
        {copied && <span className="ml-2 font-medium text-success">Copied!</span>}
      </p>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
