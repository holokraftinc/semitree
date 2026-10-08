import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { latestArticles } from "@/lib/content/articles";
import { CONTENT_TYPE_LABELS } from "@/lib/content/types";

/**
 * Insights — a compact strip of the latest editorial, deliberately not the
 * largest section (the ecosystem stays the hero). Real articles only; hidden
 * when there are none.
 */
export function HomeInsights() {
  const articles = latestArticles(3);
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="insights-h" className="border-b border-border bg-muted/20">
      <Container className="py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Insights</p>
            <h2 id="insights-h" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Explainers, deep dives, and analysis
            </h2>
          </div>
          <Link href="/insights" className="text-sm font-medium text-brand hover:underline">
            All insights →
          </Link>
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link href={`/articles/${a.slug}`} className="group block">
                <Badge variant="neutral">{CONTENT_TYPE_LABELS[a.type]}</Badge>
                <h3 className="mt-2 text-base font-semibold leading-snug tracking-tight text-foreground group-hover:text-brand">
                  {a.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
