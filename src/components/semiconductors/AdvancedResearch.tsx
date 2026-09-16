/**
 * The "Advanced & research" section for equipment and material topics.
 *
 * Renders each item with a maturity label so readers can tell established
 * practice from emerging and research directions. An item may begin with a
 * maturity tag in either form — "ESTABLISHED — ...", "EMERGING — ...",
 * "RESEARCH — ..." or the legacy "Established: ..." / "Emerging: ..." — and the
 * tag is rendered as a small pill. Items without a tag render plain.
 */

type Maturity = "ESTABLISHED" | "EMERGING" | "RESEARCH";

const PILL: Record<Maturity, string> = {
  ESTABLISHED: "bg-muted text-muted-foreground",
  EMERGING: "bg-brand/10 text-brand",
  RESEARCH: "bg-info/10 text-info",
};

function parseMaturity(item: string): { tag?: Maturity; text: string } {
  const m = item.match(/^(ESTABLISHED|EMERGING|RESEARCH)\s*[—:-]\s*(.*)$/i);
  if (m) return { tag: m[1].toUpperCase() as Maturity, text: m[2] };
  return { text: item };
}

export function AdvancedResearch({ items }: { items: string[] }) {
  return (
    <details id="advanced" className="group scroll-mt-20 rounded-xl border border-border bg-muted/20 p-5">
      <summary className="cursor-pointer list-none text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="text-brand transition-transform group-open:rotate-90">▸</span>
          Advanced &amp; research
        </span>
      </summary>
      <p className="mt-2 text-sm text-muted-foreground">
        Emerging and research directions, beyond today&rsquo;s established practice.
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
        {items.map((raw, i) => {
          const { tag, text } = parseMaturity(raw);
          return (
            <li key={i} className="flex gap-2">
              <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
              <span>
                {tag && (
                  <span className={`mr-2 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PILL[tag]}`}>
                    {tag}
                  </span>
                )}
                {text}
              </span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
