"use client";

import { useMemo, useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { publishedArticles, INSIGHT_CATEGORIES, allTags } from "@/lib/content/articles";
import { cn } from "@/lib/utils/cn";

const LATEST = "latest";

/** Search + category + tag discovery over all published articles. */
export function BlogExplorer() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>(LATEST);
  const [tag, setTag] = useState<string>("");

  const tags = allTags();
  const published = publishedArticles();
  // Counts per category (Latest = all).
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of INSIGHT_CATEGORIES) m.set(c.key, published.filter(c.match).length);
    return m;
  }, [published]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const cat = INSIGHT_CATEGORIES.find((c) => c.key === category);
    return published.filter((a) => {
      if (cat && !cat.match(a)) return false;
      if (tag && !a.tags.includes(tag)) return false;
      if (needle) {
        const hay = [a.title, a.subtitle ?? "", a.excerpt, ...a.tags].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, category, tag, published]);

  const active = q.trim() !== "" || category !== LATEST || tag !== "";

  return (
    <div className="space-y-6">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search articles…"
        aria-label="Search articles"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {/* Categories */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categories">
        {INSIGHT_CATEGORIES.map((c) => {
          const n = counts.get(c.key) ?? 0;
          return (
            <FilterChip
              key={c.key}
              label={c.key === "latest" ? c.label : `${c.label} (${n})`}
              active={category === c.key}
              onClick={() => setCategory(c.key)}
            />
          );
        })}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setTag(tag === t ? "" : t)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
              tag === t ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            #{t}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {results.length} {results.length === 1 ? "article" : "articles"}
        </p>
        {active && (
          <button
            onClick={() => { setQ(""); setCategory(LATEST); setTag(""); }}
            className="text-sm font-medium text-brand hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <p className="text-sm font-medium">No articles match these filters yet.</p>
          <button
            onClick={() => { setQ(""); setCategory(LATEST); setTag(""); }}
            className="mt-2 text-sm font-medium text-brand hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-brand bg-brand/10 text-brand" : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
