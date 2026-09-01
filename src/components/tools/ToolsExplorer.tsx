"use client";

import { useMemo, useState } from "react";
import type { Tool } from "@/lib/data/types";
import type { CalculationCategory } from "@/lib/calculations/types";
import { CATEGORY_LABELS, isToolAvailable } from "@/lib/data/tools";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { ToolCard } from "./ToolCard";
import { cn } from "@/lib/utils/cn";

type Filter = "all" | CalculationCategory;

/** Search + category filter over the tool catalogue, rendered as a card grid. */
export function ToolsExplorer({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  // Categories that actually have tools, in registry order.
  const categories = useMemo(() => {
    const present = new Set(tools.map((t) => t.category));
    return (Object.keys(CATEGORY_LABELS) as CalculationCategory[]).filter((c) =>
      present.has(c),
    );
  }, [tools]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q);
      const matchesFilter = filter === "all" || t.category === filter;
      return matchesQuery && matchesFilter;
    });
  }, [tools, query, filter]);

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
            id="tools-search"
            label="Search tools"
            placeholder="Search tools…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {chip("all", "All")}
          {categories.map((c) => chip(c, CATEGORY_LABELS[c]))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              available={isToolAvailable(tool.slug)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tools match your search"
          description="Try a different term or clear the filters."
        />
      )}
    </div>
  );
}
