import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { issuesNewestFirst } from "@/lib/content/newsletter";

export const metadata: Metadata = pageMeta({
  title: "Newsletter",
  description:
    "The Semitree newsletter: what's new across semiconductor learning, tools, manufacturing, supply chain, industry, and research. Read the archive or subscribe.",
  path: "/newsletter",
});

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

export default function NewsletterPage() {
  const issues = issuesNewestFirst();

  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Newsletter" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Newsletter</h1>
        <p className="max-w-2xl text-muted-foreground">
          A periodic roundup of what&apos;s new on Semitree — new tools, explorers,
          lessons, and research. Read past issues below or subscribe to get the next one.
        </p>
      </div>

      <NewsletterSignup />

      <section aria-labelledby="archive" className="space-y-4">
        <h2 id="archive" className="text-lg font-semibold tracking-tight">Archive</h2>
        {issues.length > 0 ? (
          <ul className="space-y-4">
            {issues.map((issue) => (
              <li key={issue.slug}>
                <Link
                  href={`/newsletter/${issue.slug}`}
                  className="group block rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-brand">Issue #{issue.number}</span>
                    <time dateTime={issue.date}>{formatDate(issue.date)}</time>
                  </div>
                  <h3 className="mt-2 font-semibold tracking-tight group-hover:text-brand">{issue.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{issue.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            No issues published yet. Subscribe to get the first one.
          </div>
        )}
      </section>
    </Container>
  );
}
