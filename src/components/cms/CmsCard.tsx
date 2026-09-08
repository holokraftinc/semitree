import Link from "next/link";
import { cmsTypeMeta } from "@/lib/wordpress/config";
import type { CmsArticle } from "@/lib/wordpress/types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** Card for an editorial item — matches the Semitree article-card look. */
export function CmsCard({ item, basePath = "/insights" }: { item: CmsArticle; basePath?: string }) {
  return (
    <Link
      href={`${basePath}/${item.type}/?slug=${encodeURIComponent(item.slug)}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {item.featuredImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.featuredImage.url}
          alt={item.featuredImage.alt || ""}
          loading="lazy"
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-20 w-full bg-gradient-to-br from-brand/20 to-brand/5" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-brand">
            {cmsTypeMeta(item.type).label}
          </span>
          {item.readingTime && <span className="text-muted-foreground">{item.readingTime} min read</span>}
        </div>
        <h3 className="mt-2 font-semibold tracking-tight group-hover:text-brand">{item.title}</h3>
        {item.excerpt && <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted-foreground">{item.excerpt}</p>}
        <p className="mt-3 text-xs text-muted-foreground">
          {item.author?.name ? `${item.author.name} · ` : ""}
          {formatDate(item.publishedDate)}
        </p>
      </div>
    </Link>
  );
}
