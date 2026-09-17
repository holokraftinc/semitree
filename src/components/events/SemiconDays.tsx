"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { EventDay, EventSession } from "@/lib/events/semicon-india-2026";

/**
 * Client-side day switcher for the SEMICON India 2026 hub. Lets a visitor move
 * between the three days without leaving the page (event context is preserved).
 * Upcoming / Live / Completed status is derived from the real date in India
 * Standard Time — there is no fake live data. Status is computed after mount to
 * avoid any server/client mismatch (nothing time-dependent renders on the
 * server).
 */

type Status = "UPCOMING" | "LIVE" | "COMPLETED";

/** Today's date in Asia/Kolkata as YYYY-MM-DD (string-comparable). */
function istToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

function statusFor(iso: string, today: string | null): Status | null {
  if (!today) return null;
  if (today < iso) return "UPCOMING";
  if (today === iso) return "LIVE";
  return "COMPLETED";
}

function StatusPill({ status }: { status: Status | null }) {
  if (!status) return null;
  if (status === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand">
        <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
        Live
      </span>
    );
  }
  return (
    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {status === "UPCOMING" ? "Upcoming" : "Completed"}
    </span>
  );
}

function SessionCard({
  session,
  date,
  status,
  officialUrl,
}: {
  session: EventSession;
  date: string;
  status: Status | null;
  officialUrl: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="neutral">{session.track}</Badge>
        <StatusPill status={status} />
      </div>
      <h3 className="mt-2 text-base font-semibold tracking-tight">{session.title}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{date}</p>

      {session.description && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Why it matters</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{session.description}</p>
        </div>
      )}

      {session.related && session.related.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Learn on Semitree</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {session.related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {r.label} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* After-session content — appears once Semitree coverage is added. */}
      {session.summary && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Semitree summary</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{session.summary}</p>
        </div>
      )}
      {session.takeaway && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key takeaway</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{session.takeaway}</p>
        </div>
      )}
      {session.technologies && session.technologies.length > 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Technologies:</span> {session.technologies.join(", ")}
        </p>
      )}
      {session.companies && session.companies.length > 0 && (
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Companies:</span> {session.companies.join(", ")}
        </p>
      )}

      <a
        href={officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-xs font-medium text-brand hover:underline"
      >
        Official source ↗
      </a>
    </Card>
  );
}

export function SemiconDays({ days, officialUrl }: { days: EventDay[]; officialUrl: string }) {
  const [today, setToday] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = istToday();
    setToday(t);
    // Open on the live day if the event is running; otherwise keep Day 1.
    const liveIdx = days.findIndex((d) => d.iso === t);
    if (liveIdx >= 0) setActive(liveIdx);
  }, [days]);

  const day = days[active];
  const activeStatus = statusFor(day.iso, today);

  return (
    <div className="space-y-5">
      {/* Day navigation */}
      <div className="flex flex-wrap gap-3" role="tablist" aria-label="Event days">
        {days.map((d, i) => {
          const st = statusFor(d.iso, today);
          const isActive = i === active;
          return (
            <button
              key={d.iso}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={[
                "rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-brand bg-brand/10"
                  : "border-border hover:bg-muted/40",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{d.label}</span>
                <StatusPill status={st} />
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {d.date.replace(" 2026", "")}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active day */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold tracking-tight">{day.label} — {day.date}</h3>
          <StatusPill status={activeStatus} />
        </div>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{day.summary}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {day.sessions.map((s) => (
            <SessionCard
              key={s.title}
              session={s}
              date={day.date}
              status={activeStatus}
              officialUrl={officialUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
