import { cn } from "@/lib/utils/cn";

/**
 * Displays an equation. In Phase 02 the formula is rendered as monospace text
 * (the `expression` string). A math renderer (e.g. KaTeX) can be swapped in
 * later without changing call sites — the props stay the same.
 */
export function FormulaBlock({
  expression,
  label,
  caption,
  className,
}: {
  expression: string;
  /** Optional name shown above, e.g. "Reynolds number". */
  label?: string;
  /** Optional note shown below, e.g. variable legend summary. */
  caption?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-x-auto rounded-lg border border-border bg-muted/40 p-4",
        className,
      )}
    >
      {label && (
        <figcaption className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </figcaption>
      )}
      <div className="font-mono text-base leading-relaxed text-foreground sm:text-lg">
        {expression}
      </div>
      {caption && (
        <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
      )}
    </figure>
  );
}
