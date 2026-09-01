"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";
import { fieldBase } from "@/components/ui/Input";

/** A labelled number input without a unit selector (for dimensionless inputs). */
export function NumberField({
  label,
  value,
  onChange,
  help,
  error,
  required = true,
  placeholder,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (raw: string) => void;
  help?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  /** Static unit/label shown to the right (e.g. "cells/droplet"). */
  suffix?: string;
}) {
  const id = useId();
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

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
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(e) => onChange(e.target.value)}
          className={cn(fieldBase, "flex-1")}
        />
        {suffix && (
          <span className="flex shrink-0 items-center px-1 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
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
