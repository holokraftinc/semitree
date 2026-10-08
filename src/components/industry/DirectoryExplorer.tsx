"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  COMPANIES,
  companyPoints,
  presentTypes,
} from "@/lib/industry/companies";
import {
  segmentsForCompany,
  presentCities,
  presentCapabilities,
} from "@/lib/industry/relationships";
import {
  COMPANY_TYPE_LABELS,
  SITE_KIND_LABELS,
  type CompanyType,
  type SiteKind,
} from "@/lib/industry/types";
import { cn } from "@/lib/utils/cn";

const ALL = "all";

function uniqSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function DirectoryExplorer() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<CompanyType | typeof ALL>(ALL);
  const [segment, setSegment] = useState(ALL);
  const [country, setCountry] = useState(ALL);
  const [stateFilter, setStateFilter] = useState(ALL);
  const [city, setCity] = useState(ALL);
  const [tech, setTech] = useState(ALL);
  const [facility, setFacility] = useState<SiteKind | typeof ALL>(ALL);
  const [capability, setCapability] = useState(ALL);

  const types = presentTypes();
  const countries = useMemo(
    () => uniqSorted(COMPANIES.flatMap((c) => companyPoints(c).map((p) => p.country))),
    [],
  );
  const states = useMemo(
    () =>
      uniqSorted(
        COMPANIES.flatMap((c) =>
          companyPoints(c)
            .map((p) => p.state)
            .filter((s): s is string => Boolean(s)),
        ),
      ),
    [],
  );
  const cities = useMemo(() => presentCities(), []);
  const techs = useMemo(() => uniqSorted(COMPANIES.flatMap((c) => c.technologies ?? [])), []);
  const capabilities = useMemo(() => presentCapabilities(), []);
  // Segments actually present across the registry, in canonical order.
  const segments = useMemo(() => {
    const seen = new Map<string, string>();
    for (const c of COMPANIES) for (const s of segmentsForCompany(c)) seen.set(s.id, s.label);
    return Array.from(seen, ([id, label]) => ({ id, label }));
  }, []);
  // Facility kinds present across all company sites.
  const facilities = useMemo(() => {
    const seen = new Set<SiteKind>();
    for (const c of COMPANIES) for (const p of companyPoints(c)) seen.add(p.kind);
    const order: SiteKind[] = ["hq", "fab", "atmp", "osat", "rd", "office"];
    return order.filter((k) => seen.has(k));
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return COMPANIES.filter((c) => {
      if (type !== ALL && !c.types.includes(type)) return false;
      if (segment !== ALL && !segmentsForCompany(c).some((s) => s.id === segment)) return false;
      const points = companyPoints(c);
      if (country !== ALL && !points.some((p) => p.country === country)) return false;
      if (stateFilter !== ALL && !points.some((p) => p.state === stateFilter)) return false;
      if (city !== ALL && !points.some((p) => p.city === city)) return false;
      if (facility !== ALL && !points.some((p) => p.kind === facility)) return false;
      if (tech !== ALL && !(c.technologies ?? []).includes(tech)) return false;
      if (capability !== ALL && !(c.processes ?? []).includes(capability)) return false;
      if (needle) {
        const hay = [
          c.name,
          c.description,
          ...(c.technologies ?? []),
          ...(c.products ?? []),
          ...(c.processes ?? []),
          ...points.flatMap((p) => [p.city, p.country, p.state ?? ""]),
          ...c.types.map((t) => COMPANY_TYPE_LABELS[t]),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, type, segment, country, stateFilter, city, tech, facility, capability]);

  const reset = () => {
    setQ("");
    setType(ALL);
    setSegment(ALL);
    setCountry(ALL);
    setStateFilter(ALL);
    setCity(ALL);
    setTech(ALL);
    setFacility(ALL);
    setCapability(ALL);
  };

  const selectClass =
    "rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  const active =
    type !== ALL ||
    segment !== ALL ||
    country !== ALL ||
    stateFilter !== ALL ||
    city !== ALL ||
    tech !== ALL ||
    facility !== ALL ||
    capability !== ALL ||
    q.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search companies, technologies, capabilities, cities…"
          aria-label="Search companies"
          className={cn(selectClass, "w-full")}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="sr-only" htmlFor="f-type">Company type</label>
          <select id="f-type" value={type} onChange={(e) => setType(e.target.value as CompanyType | typeof ALL)} className={selectClass}>
            <option value={ALL}>All company types</option>
            {types.map((t) => (
              <option key={t} value={t}>{COMPANY_TYPE_LABELS[t]}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="f-segment">Segment</label>
          <select id="f-segment" value={segment} onChange={(e) => setSegment(e.target.value)} className={selectClass}>
            <option value={ALL}>All segments</option>
            {segments.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="f-country">Country</label>
          <select id="f-country" value={country} onChange={(e) => setCountry(e.target.value)} className={selectClass}>
            <option value={ALL}>All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="f-state">State / region</label>
          <select id="f-state" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className={selectClass}>
            <option value={ALL}>All states / regions</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="f-city">City</label>
          <select id="f-city" value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
            <option value={ALL}>All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="f-tech">Technology</label>
          <select id="f-tech" value={tech} onChange={(e) => setTech(e.target.value)} className={selectClass}>
            <option value={ALL}>All technologies</option>
            {techs.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="f-facility">Facility</label>
          <select id="f-facility" value={facility} onChange={(e) => setFacility(e.target.value as SiteKind | typeof ALL)} className={selectClass}>
            <option value={ALL}>All facilities</option>
            {facilities.map((k) => (
              <option key={k} value={k}>{SITE_KIND_LABELS[k]}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="f-capability">Capability</label>
          <select id="f-capability" value={capability} onChange={(e) => setCapability(e.target.value)} className={selectClass}>
            <option value={ALL}>All capabilities</option>
            {capabilities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count + reset */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {results.length} {results.length === 1 ? "company" : "companies"}
        </p>
        {active && (
          <button type="button" onClick={reset} className="text-sm font-medium text-brand hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {results.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/industry/companies/${c.slug}`}
                className="group block h-full rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold tracking-tight group-hover:text-brand">{c.name}</h2>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {c.hq.city}, {c.hq.country}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.types.map((t) => (
                    <span key={t} className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                      {COMPANY_TYPE_LABELS[t]}
                    </span>
                  ))}
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{c.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <p className="text-sm font-medium">No companies match these filters.</p>
          <button type="button" onClick={reset} className="mt-2 text-sm font-medium text-brand hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
