"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  RESEARCH_TOPICS,
  FACET_DEFS,
  facetOptions,
  topicsForFacet,
  type FacetKey,
} from "@/lib/research/registry";
import { cn } from "@/lib/utils/cn";

/**
 * Browse research topics by facet: Technology, Process, Device, Material,
 * Application, Company. (University browsing is the Universities section, since
 * topic↔university affiliations are not fabricated here.)
 */
export function TopicDiscovery() {
  const [facet, setFacet] = useState<FacetKey>("technology");
  const [value, setValue] = useState<string>("");

  const options = useMemo(() => facetOptions(facet), [facet]);
  const topics = useMemo(
    () => (value ? topicsForFacet(facet, value) : RESEARCH_TOPICS),
    [facet, value],
  );

  return (
    <div className="space-y-5">
      {/* Facet category */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Browse by">
        {FACET_DEFS.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={f.key === facet}
            onClick={() => {
              setFacet(f.key);
              setValue("");
            }}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              f.key === facet
                ? "border-brand bg-brand/10 text-brand"
                : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Facet value */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setValue("")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            value === "" ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
          )}
        >
          All
        </button>
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => setValue(o.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              value === o.value ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {topics.length} {topics.length === 1 ? "topic" : "topics"}
      </p>
      {topics.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {topics.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/research/topics/${t.slug}`}
                className="group block h-full rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <h3 className="font-semibold tracking-tight group-hover:text-brand">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          No topics for this filter yet.
        </p>
      )}
    </div>
  );
}
