"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  INDIA_BOX,
  project,
  indiaMarkers,
  clusterMarkers,
  indiaMarkersByBucket,
  type MarkerCluster,
} from "@/lib/industry/geo";
import { SITE_KIND_LABELS } from "@/lib/industry/types";
import { cn } from "@/lib/utils/cn";

const STATE_LABELS: { label: string; lat: number; long: number }[] = [
  { label: "Gujarat", lat: 22.7, long: 71.3 },
  { label: "Maharashtra", lat: 19.4, long: 75.8 },
  { label: "Karnataka", lat: 15.0, long: 76.0 },
  { label: "Tamil Nadu", lat: 11.0, long: 78.4 },
  { label: "Telangana", lat: 17.9, long: 79.0 },
  { label: "Uttar Pradesh", lat: 27.2, long: 80.6 },
];

export function IndiaMap() {
  const [active, setActive] = useState<MarkerCluster | null>(null);

  const clusters = useMemo(() => clusterMarkers(indiaMarkers()), []);
  const buckets = useMemo(() => indiaMarkersByBucket(), []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Map */}
        <div>
          <div className="relative w-full overflow-hidden rounded-xl border border-border bg-[rgb(var(--muted))]/40">
            <div className="relative aspect-[31/31] w-full">
              <svg
                viewBox="0 0 500 500"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                {[70, 78, 86, 94].map((lng) => {
                  const { x } = project(0, lng, INDIA_BOX);
                  return (
                    <line key={`v${lng}`} x1={x * 500} y1={0} x2={x * 500} y2={500} stroke="rgb(var(--border))" strokeWidth={0.6} />
                  );
                })}
                {[10, 18, 26, 34].map((lat) => {
                  const { y } = project(lat, 0, INDIA_BOX);
                  return (
                    <line key={`h${lat}`} x1={0} y1={y * 500} x2={500} y2={y * 500} stroke="rgb(var(--border))" strokeWidth={0.6} />
                  );
                })}
              </svg>

              {STATE_LABELS.map((s) => {
                const { x, y } = project(s.lat, s.long, INDIA_BOX);
                return (
                  <span
                    key={s.label}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center text-[9px] font-medium uppercase leading-tight tracking-wide text-muted-foreground/70"
                    style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
                  >
                    {s.label}
                  </span>
                );
              })}

              {clusters.map((cluster) => {
                const { x, y } = project(cluster.lat, cluster.long, INDIA_BOX);
                const count = cluster.markers.length;
                const isActive = active?.city === cluster.city && active?.lat === cluster.lat;
                return (
                  <button
                    key={`${cluster.lat}:${cluster.long}`}
                    type="button"
                    onClick={() => setActive(isActive ? null : cluster)}
                    aria-label={`${cluster.city} — ${count} location${count > 1 ? "s" : ""}`}
                    className={cn(
                      "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-background bg-brand font-mono text-[10px] font-semibold text-brand-foreground shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive && "z-20 scale-110",
                    )}
                    style={{
                      left: `${x * 100}%`,
                      top: `${y * 100}%`,
                      width: count > 1 ? 22 : 14,
                      height: count > 1 ? 22 : 14,
                    }}
                  >
                    {count > 1 ? count : ""}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Markers are placed at city level, not exact addresses. India fab / ATMP /
            OSAT sites reflect publicly announced facilities.
          </p>

          {active && (
            <div className="mt-3 rounded-xl border border-brand/30 bg-brand/5 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold tracking-tight">{active.city}</p>
                <button type="button" onClick={() => setActive(null)} className="text-sm text-muted-foreground hover:text-foreground">
                  Close
                </button>
              </div>
              <ul className="mt-2 space-y-1.5">
                {active.markers.map((m) => (
                  <li key={m.company.slug + m.point.label} className="text-sm">
                    <Link href={`/industry/companies/${m.company.slug}`} className="font-medium text-brand hover:underline">
                      {m.company.name}
                    </Link>
                    <span className="text-muted-foreground">
                      {" "}— {m.point.label} · {SITE_KIND_LABELS[m.point.kind]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* State buckets */}
        <div className="space-y-4">
          {buckets.map(({ bucket, markers }) => (
            <div key={bucket}>
              <h3 className="text-sm font-semibold tracking-tight">
                {bucket}{" "}
                <span className="font-normal text-muted-foreground">({markers.length})</span>
              </h3>
              {markers.length > 0 ? (
                <ul className="mt-1.5 space-y-1">
                  {markers.map((m) => (
                    <li key={m.company.slug + m.point.label} className="text-sm">
                      <Link href={`/industry/companies/${m.company.slug}`} className="font-medium text-brand hover:underline">
                        {m.company.name}
                      </Link>
                      <span className="text-muted-foreground">
                        {" "}— {m.point.city} · {SITE_KIND_LABELS[m.point.kind]}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  No verified listings yet.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
