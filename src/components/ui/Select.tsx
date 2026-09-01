"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/cn";
import { Field, fieldBase } from "./Input";

export type SelectOption = { value: string; label: string };

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  help?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, help, error, id, required, options, placeholder, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <Field id={fieldId} label={label} help={help} error={error} required={required}>
        {(aria) => (
          <div className="relative">
            <select
              ref={ref}
              required={required}
              className={cn(fieldBase, "w-full appearance-none pr-9", className)}
              {...aria}
              {...props}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </Field>
    );
  },
);
Select.displayName = "Select";
