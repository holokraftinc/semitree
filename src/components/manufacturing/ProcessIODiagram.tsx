/**
 * A compact "inputs → process → outputs" diagram for a single process step.
 * Purely presentational and responsive: three columns on wider screens, stacked
 * with directional arrows on mobile. No animation — the arrows alone convey flow.
 */
export function ProcessIODiagram({
  name,
  inputs,
  outputs,
}: {
  name: string;
  inputs: string[];
  outputs: string[];
}) {
  return (
    <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <IoColumn title="Inputs" items={inputs} tone="input" />

      <Arrow />

      <div className="flex flex-col items-center justify-center rounded-xl border border-brand/40 bg-brand/5 p-4 text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-brand">
          Process
        </span>
        <span className="mt-1 font-semibold tracking-tight">{name}</span>
      </div>

      <Arrow />

      <IoColumn title="Outputs" items={outputs} tone="output" />
    </div>
  );
}

function IoColumn({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "input" | "output";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p
        className={
          "text-xs font-medium uppercase tracking-wide " +
          (tone === "input" ? "text-muted-foreground" : "text-success")
        }
      >
        {title}
      </p>
      <ul className="mt-2 space-y-1.5 text-sm text-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="text-muted-foreground">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Right-pointing on wide screens, down-pointing when stacked. */
function Arrow() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center text-brand/60"
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5 rotate-90 sm:rotate-0" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
