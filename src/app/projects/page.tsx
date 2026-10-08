import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PROJECTS, PROJECT_STATUS_META, headlineStat } from "@/lib/projects/projects";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Projects",
  description:
    "What Semitree is actively researching and mapping — the India semiconductor map, company and supplier databases, startup and investment trackers, the manufacturing tracker, and the supply-chain explorer. Research assets with live coverage stats.",
  path: "/projects",
});

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
  });
}

export default function ProjectsPage() {
  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects" }]} />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Projects</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          What Semitree is actively researching and mapping. Each project is a
          living research asset with its own coverage, findings, and open
          questions — and live statistics drawn straight from the data.
        </p>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2">
        {PROJECTS.map((p) => {
          const meta = PROJECT_STATUS_META[p.status];
          const stat = headlineStat(p);
          return (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
                    {meta.label}
                  </span>
                  <span className="text-xs text-muted-foreground">Updated {formatDate(p.lastUpdated)}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-brand">{p.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                {stat && (
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="text-sm text-muted-foreground">
        These projects feed the{" "}
        <Link href="/india" className="font-medium text-brand hover:underline">India ecosystem</Link>,{" "}
        <Link href="/supply-chain" className="font-medium text-brand hover:underline">supply chain</Link>, and{" "}
        <Link href="/opportunities" className="font-medium text-brand hover:underline">opportunities</Link>. Spot a gap?{" "}
        <Link href="/submit" className="font-medium text-brand hover:underline">Tell us →</Link>
      </p>
    </Container>
  );
}
