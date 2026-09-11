"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  WORLD_BOX,
  WORLD_LAND,
  project,
  allMarkers,
  clusterMarkers,
  type MarkerCluster,
} from "@/lib/industry/geo";
import { COMPANY_TYPE_LABELS, type CompanyType } from "@/lib/industry/types";
import { presentTypes } from "@/lib/industry/companies";
import { cn } from "@/lib/utils/cn";

const CONTINENTS: { label: string; lat: number; long: number }[] = [
  { label: "N. America", lat: 45, long: -100 },
  { label: "S. America", lat: -15, long: -60 },
  { label: "Europe", lat: 52, long: 12 },
  { label: "Africa", lat: 3, long: 22 },
  { label: "Asia", lat: 46, long: 92 },
  { label: "Oceania", lat: -25, long: 134 },
];

const GRID_LONG = [-120, -60, 0, 60, 120];
const GRID_LAT = [60, 30, 0, -30];

export function WorldMap() {
  const [type, setType] = useState<CompanyType | "all">("all");
  const [active, setActive] = useState<MarkerCluster | null>(null);

  const clusters = useMemo(() => {
    const markers = allMarkers().filter(
      (m) => type === "all" || m.company.types.includes(type),
    );
    return clusterMarkers(markers);
  }, [type]);

  const types = presentTypes();

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="world-type" className="text-sm font-medium">
          Filter by type
        </label>
        <select
          id="world-type"
          value={type}
          onChange={(e) => {
            setType(e.target.value as CompanyType | "all");
            setActive(null);
          }}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {COMPANY_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">
          {clusters.reduce((n, c) => n + c.markers.length, 0)} locations · markers
          are city-level
        </span>
      </div>

      {/* Map */}
      <div className="relative w-full overflow-hidden rounded-xl border border-border bg-[rgb(var(--muted))]/40">
        <div className="relative aspect-[1000/460] w-full">
          <svg
            viewBox="0 0 1000 460"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {/* Continent silhouettes (simplified) */}
            {WORLD_LAND.map((poly, i) => {
              const d =
                poly
                  .map(([lng, lat], j) => {
                    const { x, y } = project(lat, lng, WORLD_BOX);
                    return `${j === 0 ? "M" : "L"}${(x * 1000).toFixed(1)} ${(y * 460).toFixed(1)}`;
                  })
                  .join(" ") + " Z";
              return (
                <path
                  key={`land${i}`}
                  d={d}
                  className="fill-muted-foreground/20 stroke-muted-foreground/25"
                  strokeWidth={0.8}
                />
              );
            })}
            {GRID_LONG.map((lng) => {
              const { x } = project(0, lng, WORLD_BOX);
              return (
                <line
                  key={`v${lng}`}
                  x1={x * 1000}
                  y1={0}
                  x2={x * 1000}
                  y2={460}
                  stroke="rgb(var(--border))"
                  strokeWidth={lng === 0 ? 1.2 : 0.6}
                />
              );
            })}
            {GRID_LAT.map((lat) => {
              const { y } = project(lat, 0, WORLD_BOX);
              return (
                <line
                  key={`h${lat}`}
                  x1={0}
                  y1={y * 460}
                  x2={1000}
                  y2={y * 460}
                  stroke="rgb(var(--border))"
                  strokeWidth={lat === 0 ? 1.2 : 0.6}
                />
              );
            })}
          </svg>

          {/* Continent labels */}
          {CONTINENTS.map((c) => {
            const { x, y } = project(c.lat, c.long, WORLD_BOX);
            return (
              <span
                key={c.label}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70"
                style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
              >
                {c.label}
              </span>
            );
          })}

          {/* Pins */}
          {clusters.map((cluster) => {
            const { x, y } = project(cluster.lat, cluster.long, WORLD_BOX);
            const count = cluster.markers.length;
            const cities = new Set(cluster.markers.map((m) => m.point.city));
            const heading = cities.size === 1 ? cluster.city : `${count} locations`;
            const isActive = active?.lat === cluster.lat && active?.long === cluster.long;
            return (
              <button
                key={`${cluster.lat}:${cluster.long}`}
                type="button"
                onClick={() => setActive(isActive ? null : cluster)}
                aria-label={`${heading}${count > 1 ? ` — ${count} companies` : ""}`}
                className={cn(
                  "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-background font-mono text-[10px] font-semibold shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive ? "z-20 scale-110 bg-brand text-brand-foreground" : "z-10 bg-brand text-brand-foreground",
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

      {/* Active cluster detail */}
      {active && (
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold tracking-tight">
              {new Set(active.markers.map((m) => m.point.city)).size === 1
                ? active.city
                : `${active.markers.length} nearby locations`}
            </p>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <ul className="mt-2 space-y-1.5">
            {active.markers.map((m) => (
              <li key={m.company.slug + m.point.label} className="text-sm">
                <Link
                  href={`/industry/companies/${m.company.slug}`}
                  className="font-medium text-brand hover:underline"
                >
                  {m.company.name}
                </Link>
                <span className="text-muted-foreground">
                  {" "}— {m.point.city} · {m.point.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
