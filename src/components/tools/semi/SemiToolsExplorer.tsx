"use client";

import { useMemo, useState } from "react";
import type { SemiTool, SemiToolCategory, SemiToolDifficulty } from "@/lib/data/semi-tools";
import {
  SEMI_CATEGORY_LABELS,
  SEMI_CATEGORY_ORDER,
  SEMI_DIFFICULTY_LABELS,
} from "@/lib/data/semi-tools";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { SemiToolCard } from "./SemiToolCard";
import { cn } from "@/lib/utils/cn";

type CategoryFilter = "all" | SemiToolCategory;
type DifficultyFilter = "all" | SemiToolDifficulty;

/**
 * Discover + filter the semiconductor tools: free-text search, category, and
 * difficulty. Category chips cover the full taxonomy so the roadmap is visible;
 * selecting a category with no tools yet shows a friendly "coming soon" state
 * rather than a fake tool. Reuses SearchInput / EmptyState / SemiToolCard.
 */
export function SemiToolsExplorer({ tools }: { tools: SemiTool[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        SEMI_CATEGORY_LABELS[t.category].toLowerCase().includes(q);
      const matchesCategory = category === "all" || t.category === category;
      const matchesDifficulty = difficulty === "all" || t.difficulty === difficulty;
      return matchesQuery && matchesCategory && matchesDifficulty;
    });
  }, [tools, query, category, difficulty]);

  const chip = (
    active: boolean,
    onClick: () => void,
    label: string,
    key: string,
  ) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-brand bg-brand/10 text-brand"
          : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );

  const difficulties: DifficultyFilter[] = ["all", "beginner", "engineering", "advanced"];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="max-w-md">
          <SearchInput
            id="semi-tools-search"
            label="Search tools"
            placeholder="Search semiconductor tools…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</p>
          <div className="flex flex-wrap gap-2">
            {chip(category === "all", () => setCategory("all"), "All", "cat-all")}
            {SEMI_CATEGORY_ORDER.map((c) =>
              chip(category === c, () => setCategory(c), SEMI_CATEGORY_LABELS[c], `cat-${c}`),
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((d) =>
              chip(
                difficulty === d,
                () => setDifficulty(d),
                d === "all" ? "All" : SEMI_DIFFICULTY_LABELS[d],
                `diff-${d}`,
              ),
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <SemiToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            category !== "all"
              ? `${SEMI_CATEGORY_LABELS[category as SemiToolCategory]} tools are coming soon`
              : "No tools match your search"
          }
          description={
            category !== "all"
              ? "We're expanding this category. Try another category, or clear the filters."
              : "Try a different term or clear the filters."
          }
        />
      )}
    </div>
  );
}
