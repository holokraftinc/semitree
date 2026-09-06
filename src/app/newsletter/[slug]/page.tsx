import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleBody } from "@/components/content/ArticleBody";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import { NEWSLETTER_ISSUES, getIssue } from "@/lib/content/newsletter";
import { getArticle } from "@/lib/content/articles";
import { getSemiTool } from "@/lib/data/semi-tools";
import { getTopic } from "@/lib/research/registry";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return NEWSLETTER_ISSUES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssue(slug);
  if (!issue) return pageMeta({ title: "Newsletter", description: "", path: "/newsletter" });
  return pageMeta({
    title: `Issue #${issue.number}: ${issue.title}`,
    description: issue.summary,
    path: `/newsletter/${issue.slug}`,
  });
}

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

export default async function IssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = getIssue(slug);
  if (!issue) notFound();

  return (
    <Container className="py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Newsletter", path: "/newsletter" },
            { name: `Issue #${issue.number}`, path: `/newsletter/${issue.slug}` },
          ]),
        ])}
      />
      <TrackView event="newsletter_issue_opened" payload={{ issue: issue.slug }} />

      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Newsletter", href: "/newsletter" },
              { label: `Issue #${issue.number}` },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-brand">Issue #{issue.number}</span>
            <time dateTime={issue.date}>{formatDate(issue.date)}</time>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{issue.title}</h1>
          <p className="text-lg text-muted-foreground">{issue.summary}</p>
        </header>

        <ArticleBody blocks={issue.body} />

        {/* Related */}
        <section className="grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Related articles</h2>
            <ul className="space-y-1.5">
              {(issue.relatedArticles ?? []).map((s) => {
                const a = getArticle(s);
                if (!a) return null;
                return <li key={s}><Link href={`/articles/${s}`} className={linkClass}>{a.title} →</Link></li>;
              })}
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Related tools</h2>
            <ul className="space-y-1.5">
              {(issue.relatedTools ?? []).map((s) => {
                const t = getSemiTool(s);
                if (!t) return null;
                return <li key={s}><Link href={`/semiconductors/tools/${s}`} className={linkClass}>{t.name} →</Link></li>;
              })}
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Related research</h2>
            <ul className="space-y-1.5">
              {(issue.relatedResearch ?? []).map((s) => {
                const topic = getTopic(s);
                if (!topic) return null;
                return <li key={s}><Link href={`/research/topics/${s}`} className={linkClass}>{topic.name} →</Link></li>;
              })}
            </ul>
          </div>
        </section>

        <NewsletterSignup />

        <p className="text-sm text-muted-foreground">
          <Link href="/newsletter" className={linkClass}>← All issues</Link>
        </p>
      </article>
    </Container>
  );
}
