"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { HOME_ITEM, PRIMARY_NAV, SECONDARY_NAV, type NavItem } from "./nav-items";

/**
 * Mobile / tablet navigation: a disclosure button that toggles a nav panel.
 * - button carries aria-expanded / aria-controls
 * - Escape closes it; navigating (route change) closes it
 * - body scroll is locked while open
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const renderLink = (item: NavItem) => {
    const active =
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "block rounded-md px-3 py-2.5 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "bg-muted text-foreground"
              : "text-foreground hover:bg-muted/60",
          )}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-30 bg-foreground/20 animate-fade-in"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav-panel"
            aria-label="Primary"
            className="fixed inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-background p-4 shadow-card animate-fade-in"
          >
            <ul className="space-y-1">
              {renderLink(HOME_ITEM)}
              {PRIMARY_NAV.map(renderLink)}
            </ul>
            <p className="px-3 pb-1 pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              More
            </p>
            <ul className="space-y-1">{SECONDARY_NAV.map(renderLink)}</ul>
          </nav>
        </>
      )}
    </div>
  );
}
