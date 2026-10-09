import Link from "next/link";
import { getNode, neighbors, connectionCount, type GraphRef } from "@/lib/graph/graph";

/**
 * Renders a node's neighbourhood from the knowledge graph as grouped "Related X"
 * lists — the Phase 14 UI directive (no giant graph; just the relationships).
 * Backed entirely by lib/graph, so the same component works for any entity and
 * a future visual graph can reuse the exact same query layer.
 */
const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function RelatedEntities({ node, showHeader = true }: { node: GraphRef; showHeader?: boolean }) {
  const n = getNode(node);
  if (!n) return null;
  const groups = neighbors(node);
  const count = connectionCount(node);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      {showHeader && (
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand">{node.type}</span>
            <span className="text-xs text-muted-foreground">{count} connection{count === 1 ? "" : "s"}</span>
          </div>
          <h3 className="text-lg font-semibold tracking-tight">
            <Link href={n.href} className="hover:text-brand">{n.label}</Link>
          </h3>
          {n.description && <p className="max-w-2xl text-sm text-muted-foreground line-clamp-2">{n.description}</p>}
        </div>
      )}

      {groups.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title} className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.title}</h4>
              <ul className="space-y-1">
                {g.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className={linkClass}>{l.label} →</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No mapped connections yet.</p>
      )}
    </div>
  );
}
