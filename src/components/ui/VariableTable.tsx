import { cn } from "@/lib/utils/cn";

export type VariableRow = {
  /** Symbol, e.g. "Re", "ρ", "Dₕ". */
  symbol: string;
  /** Plain-language name. */
  name: string;
  /** Typical unit, e.g. "kg/m³" (optional for dimensionless). */
  unit?: string;
};

/** Semantic table describing the variables used in a formula. */
export function VariableTable({
  rows,
  caption,
  className,
}: {
  rows: VariableRow[];
  caption?: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-border", className)}>
      <table className="w-full text-left text-sm">
        {caption && (
          <caption className="px-4 pt-3 text-left text-xs text-muted-foreground">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="px-4 py-2 font-medium">
              Symbol
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Variable
            </th>
            <th scope="col" className="px-4 py-2 font-medium">
              Unit
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.symbol} className="border-b border-border last:border-0">
              <th
                scope="row"
                className="px-4 py-2 font-mono font-normal text-foreground"
              >
                {row.symbol}
              </th>
              <td className="px-4 py-2 text-foreground">{row.name}</td>
              <td className="px-4 py-2 font-mono text-muted-foreground">
                {row.unit ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
