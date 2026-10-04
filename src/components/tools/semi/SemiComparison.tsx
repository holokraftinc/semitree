import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Alert } from "@/components/ui/Alert";
import { getRelatedSemiToolLinks, getSemiToolLearningLinks } from "@/lib/data/semi-tools";

/**
 * A conceptual comparison tool: a responsive table plus a "no universal ranking"
 * note and related-learning / related-tool links. Used by the deposition-method
 * and etch-method comparisons. Presentational; data comes from the caller.
 */
export function SemiComparison({
  slug,
  title,
  description,
  columns,
  rows,
  note,
  relatedConcepts = [],
}: {
  slug: string;
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
  note: string;
  relatedConcepts?: { label: string; href: string }[];
}) {
  const learning = getSemiToolLearningLinks(slug);
  const tools = getRelatedSemiToolLinks(slug);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Semiconductors", href: "/explore" },
            { label: "Tools", href: "/semiconductors/tools" },
            { label: title },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-muted/50">
              {columns.map((c, i) => (
                <th key={i} scope="col" className={`p-3 font-semibold text-foreground ${i === 0 ? "" : "border-l border-border"}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="border-t border-border align-top">
                {row.map((cell, c) => (
                  <td key={c} className={`p-3 ${c === 0 ? "font-medium text-foreground" : "border-l border-border text-muted-foreground"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Alert variant="info" title="No universal ranking">{note}</Alert>

      {relatedConcepts.length > 0 && (
        <section aria-labelledby="rc-h" className="space-y-3">
          <h2 id="rc-h" className="text-lg font-semibold tracking-tight">Related concepts</h2>
          <ul className="flex flex-wrap gap-2">
            {relatedConcepts.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {c.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {learning.length > 0 && (
        <section aria-labelledby="rl-h" className="space-y-3">
          <h2 id="rl-h" className="text-lg font-semibold tracking-tight">Related learning</h2>
          <ul className="flex flex-wrap gap-2">
            {learning.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tools.length > 0 && (
        <section aria-labelledby="rt-h" className="space-y-3">
          <h2 id="rt-h" className="text-lg font-semibold tracking-tight">Related tools</h2>
          <ul className="flex flex-wrap gap-2">
            {tools.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {t.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
