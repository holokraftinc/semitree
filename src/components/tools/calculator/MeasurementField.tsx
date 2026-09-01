"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";
import { fieldBase } from "@/components/ui/Input";
import { unitsForQuantity } from "@/lib/units";
import type { Quantity } from "@/lib/units/types";

export type MeasurementValue = { raw: string; unit: string };

/**
 * A labelled numeric input paired with a unit selector for a given physical
 * quantity. Shared by every calculator so inputs look and behave identically.
 * The parent owns the value; conversion to SI happens at calculate time.
 */
export function MeasurementField({
  label,
  quantity,
  value,
  onChange,
  help,
  error,
  required = true,
  placeholder,
}: {
  label: string;
  quantity: Quantity;
  value: MeasurementValue;
  onChange: (next: MeasurementValue) => void;
  help?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;
  const options = unitsForQuantity(quantity);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="flex items-stretch gap-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step="any"
          required={required}
          placeholder={placeholder}
          value={value.raw}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(e) => onChange({ ...value, raw: e.target.value })}
          className={cn(fieldBase, "flex-1")}
        />
        <select
          aria-label={`${label} unit`}
          value={value.unit}
          onChange={(e) => onChange({ ...value, unit: e.target.value })}
          className={cn(fieldBase, "w-auto shrink-0 appearance-none pr-8")}
        >
          {options.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
      {help && !error && (
        <p id={helpId} className="text-xs text-muted-foreground">
          {help}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
