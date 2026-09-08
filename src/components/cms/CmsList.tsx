"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CmsCard } from "./CmsCard";
import { fetchList } from "@/lib/wordpress/client";
import type { CmsArticle } from "@/lib/wordpress/types";
import type { CmsType } from "@/lib/wordpress/config";

type Status = "loading" | "ready" | "error";

/**
 * Client-side paginated list for a CMS content type. Handles loading, error,
 * and empty states gracefully so the public site never crashes if WordPress is
 * unavailable (Step 7). Use `silentWhenEmpty` to render nothing on empty/error
 * (e.g. an optional section on an existing page).
 */
export function CmsList({
  type,
  perPage = 9,
  showSearch = false,
  silentWhenEmpty = false,
  heading,
}: {
  type: CmsType;
  perPage?: number;
  showSearch?: boolean;
  silentWhenEmpty?: boolean;
  heading?: string;
}) {
  const [items, setItems] = useState<CmsArticle[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<Status>("loading");
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const reqId = useRef(0);

  const load = useCallback(
    async (opts: { page: number; search: string; append: boolean }) => {
      const id = ++reqId.current;
      if (opts.append) setLoadingMore(true);
      else setStatus("loading");
      try {
        const res = await fetchList(type, { page: opts.page, perPage, search: opts.search });
        if (id !== reqId.current) return; // stale response
        setTotalPages(res.totalPages || 1);
        setItems((prev) => (opts.append ? [...prev, ...res.items] : res.items));
        setStatus("ready");
      } catch {
        if (id !== reqId.current) return;
        if (!opts.append) setStatus("error");
      } finally {
        if (id === reqId.current) setLoadingMore(false);
      }
    },
    [type, perPage],
  );

  useEffect(() => {
    setPage(1);
    load({ page: 1, search, append: false });
  }, [load, search]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // `search` state change triggers reload via effect.
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    load({ page: next, search, append: true });
  };

  // Silent mode: render nothing until we actually have items.
  if (silentWhenEmpty && (status === "error" || (status === "ready" && items.length === 0))) {
    return null;
  }

  return (
    <section className="space-y-5">
      {heading && <h2 className="text-lg font-semibold tracking-tight">{heading}</h2>}

      {showSearch && (
        <form onSubmit={onSearch}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search CMS content…"
            aria-label="Search CMS content"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </form>
      )}

      {status === "loading" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl border border-border bg-muted/40" />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <p className="text-sm font-medium">Content is temporarily unavailable.</p>
          <p className="mt-1 text-sm text-muted-foreground">Please try again in a moment.</p>
        </div>
      )}

      {status === "ready" && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
          No published content here yet.
        </div>
      )}

      {status === "ready" && items.length > 0 && (
        <>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                <CmsCard item={item} />
              </li>
            ))}
          </ul>
          {page < totalPages && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-brand/50 hover:text-brand disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
