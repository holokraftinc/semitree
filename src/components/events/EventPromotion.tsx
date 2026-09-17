"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import {
  SEMICON_INDIA_2026 as E,
  EVENT_START,
  EVENT_SLUG,
  eventStatus,
  eventDayNumber,
} from "@/lib/events/semicon-india-2026";

/**
 * Temporary homepage promotion for SEMICON India 2026.
 *
 * Isolated, self-contained, and removable: the homepage renders a single
 * <EventPromotion /> and nothing else on the homepage knows about the event.
 * The countdown/status is computed in India Standard Time at runtime, and the
 * banner automatically stops promoting the event once it has concluded
 * (renders nothing after the end date). No negative countdown is ever shown.
 */

const DISCIPLINES = "Manufacturing • Equipment • Materials • Packaging • Design • Supply Chain";

type Phase =
  | { kind: "before"; label: string }
  | { kind: "live"; label: string }
  | { kind: "after" }
  | null;

function computePhase(): Phase {
  const now = Date.now();
  const status = eventStatus(now);
  if (status === "archive") return { kind: "after" };
  if (status === "live") return { kind: "live", label: `Day ${eventDayNumber(now)} — Live` };
  const diff = EVENT_START - now;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  const label =
    days >= 1
      ? `Starts in ${days} day${days === 1 ? "" : "s"}`
      : `Starts in ${Math.max(hours, 1)} hour${hours === 1 ? "" : "s"}`;
  return { kind: "before", label };
}

function CountdownPill({ phase }: { phase: Phase }) {
  if (!phase || phase.kind === "after") return null;
  if (phase.kind === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand">
        <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
        {phase.label}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {phase.label}
    </span>
  );
}

export function EventPromotion() {
  // Start unresolved so server and first client render match; resolve on mount.
  const [phase, setPhase] = useState<Phase>(null);

  useEffect(() => {
    setPhase(computePhase());
    // Refresh roughly hourly so "starts in X" and the live day stay current.
    const id = setInterval(() => setPhase(computePhase()), 3_600_000);
    return () => clearInterval(id);
  }, []);

  // Stop promoting once the event has concluded.
  if (phase?.kind === "after") return null;

  return (
    <section
      aria-label="SEMICON India 2026 — event promotion"
      className="rounded-2xl border border-brand/30 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-wide text-brand">SEMICON India 2026</span>
            <CountdownPill phase={phase} />
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">{E.theme}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            17–19 September · Yashobhoomi, New Delhi
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Follow India&rsquo;s semiconductor ecosystem across: {DISCIPLINES}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
          <Link href={`/events/${EVENT_SLUG}`} className={buttonClasses()}>
            Explore SEMICON India 2026 →
          </Link>
          <a
            href={E.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-brand hover:underline"
          >
            Official website ↗
          </a>
        </div>
      </div>
    </section>
  );
}
