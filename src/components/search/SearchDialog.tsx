"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { track } from "@/lib/analytics";
import {
  search,
  typeLabel,
  categoryFor,
  whyRelevant,
  type SearchDoc,
  type SearchResult,
} from "@/lib/search/types";

/**
 * Global discovery search across the whole Semitree ecosystem — companies,
 * people, facilities, states, projects, investments, insights, supply-chain
 * stages, opportunities, learning topics, tools, and more. Opens from the header
 * button or ⌘K / Ctrl+K. The index is a static JSON file fetched on first open,
 * so no heavy data ships in the page bundle.
 */

// Module-level cache so the index is fetched at most once per session.
let INDEX_CACHE: SearchDoc[] | null = null;

const EXAMPLES = ["Tata", "OSAT", "Photolithography", "EUV", "Gujarat"];
const RECENT_KEY = "semitree:recent-searches";

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]).slice(0, 6) : [];
  } catch {
    return [];
  }
}
function saveRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6)));
  } catch {
    /* ignore (private mode etc.) */
  }
}

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [docs, setDocs] = useState<SearchDoc[] | null>(INDEX_CACHE);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results: SearchResult[] = useMemo(
    () => (docs ? search(query, docs) : []),
    [query, docs],
  );

  // Group results by category, preserving rank order, and track flat indices.
  const groups = useMemo(() => {
    const map = new Map<string, { r: SearchResult; i: number }[]>();
    results.forEach((r, i) => {
      const cat = categoryFor(r.type);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push({ r, i });
    });
    return Array.from(map, ([category, items]) => ({ category, items }));
  }, [results]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  // ⌘K / Ctrl+K toggles.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // On first open: focus, lock scroll, load recent, and fetch the index.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    setRecent(loadRecent());
    document.body.style.overflow = "hidden";
    if (!INDEX_CACHE) {
      fetch("/search-index.json")
        .then((r) => (r.ok ? r.json() : []))
        .then((data: SearchDoc[]) => {
          INDEX_CACHE = data;
          setDocs(data);
        })
        .catch(() => setDocs([]));
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${active}"]`);
    (el as HTMLElement | null)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Analytics: one event per settled query.
  useEffect(() => {
    if (!open || !docs) return;
    const q = query.trim();
    if (q === "") return;
    const id = window.setTimeout(() => {
      const n = search(q, docs).length;
      track("search_performed", { query: q, results: n });
      if (n === 0) track("search_no_result", { query: q });
    }, 300);
    return () => window.clearTimeout(id);
  }, [query, open, docs]);

  const rememberQuery = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((x) => x.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecent(next);
    saveRecent(next);
  };

  const go = (href: string) => {
    rememberQuery(query);
    close();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[active];
      if (r) go(r.href);
    }
  };

  const showNoResults = query.trim() !== "" && docs !== null && results.length === 0;
  const loading = open && docs === null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        aria-keyshortcuts="Meta+K Control+K"
        className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <circle cx="9" cy="9" r="6" />
          <path d="M14 14l3 3" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground sm:inline">⌘K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Search Semitree"
        >
          <div className="fixed inset-0 bg-foreground/30 animate-fade-in" aria-hidden="true" onClick={close} />
          <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-card-hover animate-fade-in">
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-border px-4">
              <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <circle cx="9" cy="9" r="6" />
                <path d="M14 14l3 3" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                type="text"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-listbox"
                aria-label="Search the Semitree ecosystem"
                placeholder="Search companies, technologies, states, insights…"
                className="h-14 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <button type="button" onClick={close} aria-label="Close search" className="shrink-0 rounded px-1 text-xs text-muted-foreground hover:text-foreground">Esc</button>
            </div>

            {/* Results (grouped by category) */}
            {results.length > 0 && (
              <div ref={listRef} id="search-listbox" role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto py-2">
                {groups.map((g) => (
                  <div key={g.category} className="pb-1">
                    <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{g.category}</p>
                    <ul>
                      {g.items.map(({ r, i }) => (
                        <li key={r.id} role="option" aria-selected={i === active}>
                          <button
                            data-index={i}
                            type="button"
                            onClick={() => go(r.href)}
                            onMouseMove={() => setActive(i)}
                            className={cn(
                              "flex w-full items-start gap-3 px-4 py-2.5 text-left",
                              i === active ? "bg-muted" : "hover:bg-muted/50",
                            )}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-foreground">{r.title}</span>
                              {r.description && (
                                <span className="block truncate text-xs text-muted-foreground">{r.description}</span>
                              )}
                              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground/80">{whyRelevant(r)}</span>
                            </span>
                            <span className="mt-0.5 shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              {typeLabel(r.type)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && query.trim() !== "" && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">Searching…</div>
            )}

            {/* No results */}
            {showNoResults && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-foreground">We couldn&apos;t find an exact match for &ldquo;{query.trim()}&rdquo;.</p>
                <p className="mt-1 text-xs text-muted-foreground">Try browsing a section:</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {[
                    { label: "Companies", href: "/industry/companies" },
                    { label: "Technologies", href: "/explore" },
                    { label: "Supply chain", href: "/supply-chain" },
                    { label: "Insights", href: "/insights" },
                    { label: "Opportunities", href: "/opportunities" },
                  ].map((s) => (
                    <Link key={s.href} href={s.href} onClick={close} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/10">
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Empty prompt: recent + examples */}
            {query.trim() === "" && !loading && (
              <div className="space-y-4 px-4 py-6">
                {recent.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Recent</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recent.map((q) => (
                        <button key={q} type="button" onClick={() => setQuery(q)} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground hover:bg-muted/70">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Try searching</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {EXAMPLES.map((q) => (
                      <button key={q} type="button" onClick={() => setQuery(q)} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-brand hover:bg-brand/10">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-center text-[11px] text-muted-foreground">
                  Searches across companies, people, states, projects, insights, supply-chain stages, opportunities, learning topics, and tools.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
