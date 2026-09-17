import Link from "next/link";
import { ArticleCard } from "@/components/content/ArticleCard";
import { Card } from "@/components/ui/Card";
import type { Article } from "@/lib/content/types";

/**
 * Renders Semitree's SEMICON India 2026 coverage on the event hub by grouping
 * articles tagged for the event (from the existing content registry) into
 * buckets. No separate blog, no scraping, no fabricated timestamps — cards use
 * the standard ArticleCard (headline, date, category, summary, read time). When
 * nothing is tagged yet, a clear empty state is shown instead.
 */

const ANALYSIS_TYPES: Article["type"][] = [
  "industry-analysis",
  "company-analysis",
  "technology-deep-dive",
];

function Grid({ articles }: { articles: Article[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard key={a.slug} article={a} />
      ))}
    </div>
  );
}

function Bucket({ title, articles }: { title: string; articles: Article[] }) {
  if (articles.length === 0) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <Grid articles={articles} />
    </div>
  );
}

export function SemiconCoverage({
  articles,
  days,
}: {
  articles: Article[];
  days: { label: string; iso: string }[];
}) {
  const analysis = articles.filter((a) => ANALYSIS_TYPES.includes(a.type));
  const explainers = articles.filter((a) => a.type === "explainer");

  return (
    <div className="space-y-6">
      {/* Editorial standard — how Semitree labels event coverage. */}
      <Card className="bg-muted/20 p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Editorial standard:</span>{" "}
          every Semitree update separates <span className="font-medium text-foreground">fact</span>,{" "}
          <span className="font-medium text-foreground">source</span>, and{" "}
          <span className="font-medium text-foreground">Semitree analysis</span>, and prioritizes
          official SEMICON India, then government, company announcements, and reputable reporting.
          We do not present rumors as facts.
        </p>
      </Card>

      {articles.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Semitree&rsquo;s coverage will appear here as it is published during the
            event. In the meantime, browse everything Semitree publishes in{" "}
            <Link href="/insights" className="font-medium text-brand hover:underline">Insights</Link>.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <Bucket title="Latest coverage" articles={articles} />
          {days.map((d) => (
            <Bucket
              key={d.iso}
              title={d.label}
              articles={articles.filter((a) => a.publishedDate === d.iso)}
            />
          ))}
          <Bucket title="Analysis" articles={analysis} />
          <Bucket title="Explainers" articles={explainers} />
        </div>
      )}
    </div>
  );
}
