"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "./nav-items";

/**
 * Desktop mega menu for a primary-nav section that declares grouped items.
 * Renders the section's groups as columns of links (coming-soon items shown as
 * muted, non-clickable). Opens on hover or click/keyboard; closes on Esc,
 * outside click, route change, or selecting an item. The trigger reflects the
 * active state when the user is anywhere inside the section.
 */
export function MegaMenu({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const ref = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hrefs = (item.groups ?? []).flatMap((g) => g.items.map((i) => i.href).filter(Boolean) as string[]);
  const active =
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`) ||
    hrefs.some((h) => {
      const base = h.split("?")[0];
      return pathname === base || pathname.startsWith(`${base}/`);
    });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const cancelClose = () => closeTimer.current && clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const groups = item.groups ?? [];

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        {item.label}
        <svg viewBox="0 0 20 20" className={cn("h-4 w-4 transition-transform", open && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={item.label}
          className={cn(
            "absolute left-0 top-full z-40 mt-1 rounded-xl border border-border bg-card p-4 shadow-card",
            groups.length > 1 ? "grid w-[34rem] grid-cols-2 gap-x-6 gap-y-2" : "w-72",
          )}
        >
          {groups.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((entry) => {
                  const childActive =
                    entry.href &&
                    (() => {
                      const base = entry.href!.split("?")[0];
                      return pathname === base || pathname.startsWith(`${base}/`);
                    })();
                  if (!entry.href || entry.comingSoon) {
                    return (
                      <li key={entry.label} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
                        <span className="text-sm text-muted-foreground/70">{entry.label}</span>
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          Soon
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li key={entry.label}>
                      <Link
                        role="menuitem"
                        href={entry.href}
                        onClick={() => setOpen(false)}
                        aria-current={childActive ? "page" : undefined}
                        className={cn(
                          "block rounded-lg px-2 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          childActive ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/60",
                        )}
                      >
                        {entry.label}
                        {entry.description && (
                          <span className="mt-0.5 block text-xs font-normal leading-snug text-muted-foreground">
                            {entry.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className={cn("pt-2", groups.length > 1 && "col-span-2 border-t border-border")}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-1.5 text-sm font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              All of {item.label} →
            </Link>
          </div>
        </div>
      )}
    </li>
  );
}
