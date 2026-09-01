"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/cn";

const fieldBase =
  "rounded-md border border-input bg-background px-3 py-2 text-sm " +
  "text-foreground placeholder:text-muted-foreground shadow-sm transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/40";

type FieldWrapperProps = {
  id: string;
  label?: string;
  help?: string;
  error?: string;
  required?: boolean;
  /** Right-aligned adornment inside the field row (e.g. a unit label). */
  suffix?: React.ReactNode;
  children: (ariaProps: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  }) => React.ReactNode;
};

/** Shared label + help + error scaffolding used by Input and Select. */
export function Field({
  id,
  label,
  help,
  error,
  required,
  suffix,
  children,
}: FieldWrapperProps) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className={suffix ? "flex items-stretch gap-2" : undefined}>
        {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
        {suffix}
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

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  help?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, help, error, id, required, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <Field id={fieldId} label={label} help={help} error={error} required={required}>
        {(aria) => (
          <input
            ref={ref}
            required={required}
            className={cn(fieldBase, "w-full", className)}
            {...aria}
            {...props}
          />
        )}
      </Field>
    );
  },
);
Input.displayName = "Input";

export { fieldBase };
