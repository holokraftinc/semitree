import Link from "next/link";
import { CONTENT_TYPE_LABELS, readingTimeMinutes, type Article } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

const ACCENT: Record<NonNullable<Article["accent"]>, string> = {
  teal: "from-teal-500/20 to-teal-500/5",
  indigo: "from-indigo-500/20 to-indigo-500/5",
  amber: "from-amber-500/20 to-amber-500/5",
  rose: "from-rose-500/20 to-rose-500/5",
};

export function accentGradient(accent?: Article["accent"]): string {
  return ACCENT[accent ?? "teal"];
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className={cn("bg-gradient-to-br", accentGradient(article.accent), featured ? "h-32" : "h-20")} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-brand">
            {CONTENT_TYPE_LABELS[article.type]}
          </span>
          <span className="text-muted-foreground">
            {readingTimeMinutes(article.body)} min read
          </span>
        </div>
        <h3 className={cn("mt-2 font-semibold tracking-tight group-hover:text-brand", featured ? "text-xl" : "text-base")}>
          {article.title}
        </h3>
        <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted-foreground">{article.excerpt}</p>
        <p className="mt-3 text-xs text-muted-foreground">{formatDate(article.publishedDate)}</p>
      </div>
    </Link>
  );
}
