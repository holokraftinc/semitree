"use client";

import { useState } from "react";
import type { DirectoryEntryType } from "@/lib/data/types";
import { DIRECTORY_CATEGORIES, entriesByType } from "@/lib/data/directory";
import { EmptyState } from "@/components/ui/EmptyState";
import { DirectoryEntryCard } from "./DirectoryEntryCard";
import { cn } from "@/lib/utils/cn";

type Filter = "all" | DirectoryEntryType;

export function DirectoryExplorer() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? DIRECTORY_CATEGORIES
      : DIRECTORY_CATEGORIES.filter((c) => c.type === filter);

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
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {chip("all", "All")}
        {DIRECTORY_CATEGORIES.map((c) => chip(c.type, c.label))}
      </div>

      {visible.map((cat) => {
        const items = entriesByType(cat.type);
        return (
          <section
            key={cat.type}
            aria-labelledby={`dir-${cat.type}`}
            className="space-y-4"
          >
            <div className="space-y-1">
              <h2 id={`dir-${cat.type}`} className="text-xl font-semibold tracking-tight">
                {cat.label}
              </h2>
              <p className="text-sm text-muted-foreground">{cat.description}</p>
            </div>
            {items.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((e) => (
                  <DirectoryEntryCard key={e.id} entry={e} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No verified listings yet"
                description="Listings are added only after they are checked and verified."
                className="py-8"
              />
            )}
          </section>
        );
      })}
    </div>
  );
}
