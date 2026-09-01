"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GLOSSARY, type GlossaryGroup, type GlossaryTerm } from "@/lib/data/glossary";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

const GROUP_LABELS: Record<GlossaryGroup, string> = {
  fundamentals: "Fundamentals",
  "dimensionless-numbers": "Dimensionless numbers",
  transport: "Transport",
  droplets: "Droplets",
  fabrication: "Fabrication",
};

type Filter = "all" | GlossaryGroup;

/**
 * Searchable glossary. Client-side filtering over the seed term set — the
 * architecture for the concepts index. A static or hosted search backend can
 * replace the in-memory filter later without changing this component's inputs.
 */
export function GlossarySearch({
  terms = GLOSSARY,
}: {
  terms?: GlossaryTerm[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const groups = useMemo(() => {
    const present = new Set(terms.map((t) => t.group));
    return (Object.keys(GROUP_LABELS) as GlossaryGroup[]).filter((g) =>
      present.has(g),
    );
  }, [terms]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms
      .filter((t) => filter === "all" || t.group === filter)
      .filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q),
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [terms, query, filter]);

  const chip = (value: Filter, label: string) => (
    <button
      key={value}
      type="button"
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={cn(
        "rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        filter === value
          ? "border-brand bg-brand/10 text-brand"
          : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="max-w-md">
          <SearchInput
            id="glossary-search"
            label="Search concepts"
            placeholder="Search concepts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {chip("all", "All")}
          {groups.map((g) => chip(g, GROUP_LABELS[g]))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {results.length} {results.length === 1 ? "concept" : "concepts"}
      </p>

      {results.length > 0 ? (
        <dl className="grid gap-4 sm:grid-cols-2">
          {results.map((term) => (
            <div
              key={term.slug}
              id={term.slug}
              className="group relative scroll-mt-24 rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/50"
            >
              <div className="flex items-center justify-between gap-2">
                <dt className="text-base font-semibold tracking-tight">
                  <Link
                    href={`/concepts/${term.slug}`}
                    className="rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:text-brand"
                  >
                    {term.title}
                  </Link>
                </dt>
                <Badge variant="neutral">{GROUP_LABELS[term.group]}</Badge>
              </div>
              <dd className="mt-2 text-sm text-muted-foreground">
                {term.summary}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <EmptyState
          title="No concepts match your search"
          description="Try a different term or clear the filters."
        />
      )}
    </div>
  );
}
