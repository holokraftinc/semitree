"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { track } from "@/lib/analytics";
import {
  buildSearchIndex,
  search,
  typeLabel,
  type SearchResult,
} from "@/lib/search";

/**
 * Global search command palette. Opens from the header button or ⌘K / Ctrl+K.
 * Client-side/static search across tools, lessons, concepts, and resources.
 */
export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Index is static; build once.
  const index = useMemo(() => buildSearchIndex(), []);
  const results: SearchResult[] = useMemo(
    () => search(query, index),
    [query, index],
  );

  const close = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  // ⌘K / Ctrl+K toggles; "/" opens when not typing elsewhere.
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

  // Focus the input and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keep the active option in range and scrolled into view.
  useEffect(() => {
    setActive(0);
  }, [query]);
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${active}"]`);
    (el as HTMLElement | null)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Analytics: fire once per settled query (debounced).
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q === "") return;
    const id = window.setTimeout(() => {
      const n = search(q, index).length;
      track("search_performed", { query: q, results: n });
      if (n === 0) track("search_no_result", { query: q });
    }, 300);
    return () => window.clearTimeout(id);
  }, [query, open, index]);

  const go = (href: string) => {
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

  const showNoResults = query.trim() !== "" && results.length === 0;

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
        <kbd className="hidden rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Search Semitree"
        >
          <div
            className="fixed inset-0 bg-foreground/30 animate-fade-in"
            aria-hidden="true"
            onClick={close}
          />
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
                aria-activedescendant={
                  results[active] ? `search-opt-${active}` : undefined
                }
                aria-label="Search tools, lessons, concepts, and resources"
                placeholder="Search tools, lessons, concepts…"
                className="h-14 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="shrink-0 rounded px-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Esc
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <ul
                ref={listRef}
                id="search-listbox"
                role="listbox"
                aria-label="Search results"
                className="max-h-[60vh] overflow-y-auto py-2"
              >
                {results.map((r, i) => (
                  <li key={r.id} role="option" aria-selected={i === active}>
                    <button
                      id={`search-opt-${i}`}
                      data-index={i}
                      type="button"
                      onClick={() => go(r.href)}
                      onMouseMove={() => setActive(i)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left",
                        i === active ? "bg-muted" : "hover:bg-muted/50",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {r.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {r.description}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {typeLabel(r.type)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* No results */}
            {showNoResults && (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-medium text-foreground">
                  No results for &ldquo;{query.trim()}&rdquo;
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try a different term, or browse the Tools, Learn, and Concepts
                  sections.
                </p>
              </div>
            )}

            {/* Empty prompt */}
            {query.trim() === "" && (
              <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                Search across tools, lessons, concepts, and resources.
                <div className="mt-2">
                  Use <kbd className="rounded border border-border px-1 font-mono">↑</kbd>{" "}
                  <kbd className="rounded border border-border px-1 font-mono">↓</kbd>{" "}
                  to navigate,{" "}
                  <kbd className="rounded border border-border px-1 font-mono">↵</kbd>{" "}
                  to open.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
