"use client";

import { useState } from "react";
import type { ResourceKind } from "@/lib/data/types";
import { RESOURCE_CATEGORIES, resourcesByKind } from "@/lib/data/resources";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResourceCard } from "./ResourceCard";
import { cn } from "@/lib/utils/cn";

type Filter = "all" | ResourceKind;

export function ResourcesExplorer() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all"
      ? RESOURCE_CATEGORIES
      : RESOURCE_CATEGORIES.filter((c) => c.kind === filter);

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
        {RESOURCE_CATEGORIES.map((c) => chip(c.kind, c.label))}
      </div>

      {visible.map((cat) => {
        const items = resourcesByKind(cat.kind);
        return (
          <section
            key={cat.kind}
            aria-labelledby={`res-${cat.kind}`}
            className="space-y-4"
          >
            <div className="space-y-1">
              <h2 id={`res-${cat.kind}`} className="text-xl font-semibold tracking-tight">
                {cat.label}
              </h2>
              <p className="text-sm text-muted-foreground">{cat.description}</p>
            </div>
            {items.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r) => (
                  <ResourceCard key={r.slug} resource={r} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={`No ${cat.label.toLowerCase()} yet`}
                description="Curated, verified entries will appear here."
                className="py-8"
              />
            )}
          </section>
        );
      })}
    </div>
  );
}
