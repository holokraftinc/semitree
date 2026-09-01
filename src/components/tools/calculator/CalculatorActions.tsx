"use client";

import { Button } from "@/components/ui/Button";

/** Shared Calculate + Reset action row for every calculator. */
export function CalculatorActions({
  onReset,
  calculateLabel = "Calculate",
}: {
  onReset: () => void;
  calculateLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button type="submit" variant="primary">
        {calculateLabel}
      </Button>
      <Button type="button" variant="outline" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
