"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SEMICON_INDIA_2026 as E,
  EVENT_SLUG,
  eventStatus,
  type EventStatus,
} from "@/lib/events/semicon-india-2026";

/**
 * Temporary full-width SEMICON India 2026 homepage takeover hero.
 *
 * Isolated, self-contained, and removable: the homepage renders a single
 * <EventPromotion /> above the normal page and nothing else on the homepage
 * knows about the event. Status is derived from the centralized event dates in
 * India Standard Time; the hero shows "Starts soon" before, "LIVE" during, and
 * automatically removes itself from the homepage once the event has concluded
 * (renders nothing) — the event page itself is never removed. Status resolves
 * after mount so the server/client markup matches and the core event content is
 * present in the static HTML while the hero is active (crawlable).
 *
 * Visuals are pure CSS/SVG (no images, no animation library); the pulsing live
 * dot honours reduced-motion.
 */

const DISCIPLINES = ["Manufacturing", "Equipment", "Materials", "Packaging", "Design", "Supply Chain"];

/** Decorative circuit-trace + chip background. Not announced to assistive tech. */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1120] via-[#0b1426] to-[#070c17]" />
      {/* brand glow */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_18%_18%,rgba(16,185,129,0.16),transparent_60%)]" />
      {/* circuit grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ep-grid" width="46" height="46" patternUnits="userSpaceOnUse">
            <path d="M46 0H0V46" fill="none" stroke="rgb(148 163 184)" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="1.4" fill="rgb(45 212 191)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ep-grid)" />
      </svg>
    </div>
  );
}

/** Decorative chip package illustration (desktop side visual). */
function ChipVisual() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 240"
      className="h-auto w-full max-w-sm text-teal-300/80"
    >
      {/* pins */}
      {[...Array(6)].map((_, i) => {
        const p = 54 + i * 24;
        return (
          <g key={i} className="stroke-current" strokeWidth="3">
            <line x1={p} y1="40" x2={p} y2="58" />
            <line x1={p} y1="182" x2={p} y2="200" />
            <line x1="40" y1={p} x2="58" y2={p} />
            <line x1="182" y1={p} x2="200" y2={p} />
          </g>
        );
      })}
      {/* package body */}
      <rect x="58" y="58" width="124" height="124" rx="10" className="fill-white/5 stroke-current" strokeWidth="3" />
      {/* die */}
      <rect x="88" y="88" width="64" height="64" rx="4" className="fill-teal-400/10 stroke-current" strokeWidth="2" />
      {/* traces */}
      <g className="stroke-current opacity-70" strokeWidth="1.5" fill="none">
        <path d="M120 88V72" />
        <path d="M120 152v16" />
        <path d="M88 120H72" />
        <path d="M152 120h16" />
      </g>
      <circle cx="120" cy="120" r="6" className="fill-current" />
    </svg>
  );
}

function StatusPill({ status }: { status: EventStatus | null }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
        <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" />
        Live — September 17–19
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80 ring-1 ring-inset ring-white/15">
        Starts soon
      </span>
    );
  }
  return null;
}

export function EventPromotion() {
  // null until mounted so SSR and first client render match.
  const [status, setStatus] = useState<EventStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(eventStatus());
    update();
    const id = setInterval(update, 3_600_000);
    return () => clearInterval(id);
  }, []);

  // Temporary takeover: once concluded, remove the hero from the homepage.
  if (status === "archive") return null;

  return (
    <section
      aria-label="SEMICON India 2026 — Semitree event coverage"
      className="relative isolate mb-10 w-full overflow-hidden border-b border-white/10 sm:mb-14"
    >
      <HeroBackdrop />
      <div className="relative mx-auto grid max-w-content items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.35fr_1fr] lg:py-28">
        <div className="text-white">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={status} />
            <span className="text-xs font-medium uppercase tracking-wide text-white/60">
              Semitree&rsquo;s coverage
            </span>
          </div>

          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            SEMICON India 2026
          </h2>

          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
            17–19 September 2026 · Yashobhoomi, New Delhi
          </p>

          <p className="mt-5 max-w-2xl text-xl font-semibold text-white/90 sm:text-2xl">
            {E.theme}
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            Follow India&rsquo;s semiconductor ecosystem across{" "}
            {DISCIPLINES.map((d, i) => (
              <span key={d}>
                <span className="text-white/90">{d}</span>
                {i < DISCIPLINES.length - 1 ? " • " : ""}
              </span>
            ))}
            .
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href={`/events/${EVENT_SLUG}`}
              className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1426]"
            >
              Explore SEMICON India 2026 →
            </Link>
            <a
              href={E.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Official website ↗
            </a>
          </div>
        </div>

        {/* Side visual (desktop only) */}
        <div className="hidden justify-center lg:flex">
          <ChipVisual />
        </div>
      </div>
    </section>
  );
}
