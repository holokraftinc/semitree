"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBySlug } from "@/lib/wordpress/client";
import { cmsTypeMeta, type CmsType } from "@/lib/wordpress/config";
import type { CmsArticle } from "@/lib/wordpress/types";
import { ShareBar } from "./ShareBar";

type Status = "loading" | "ready" | "notfound" | "error";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** Applies best-effort SEO on the client (static export can't do it at build). */
function applySeo(item: CmsArticle) {
  if (typeof document === "undefined") return;
  const seo = item.seo;
  document.title = `${seo?.title || item.title} · Semitree`;
  const setMeta = (attr: "name" | "property", key: string, content: string) => {
    if (!content) return;
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };
  setMeta("name", "description", seo?.description || item.excerpt);
  setMeta("property", "og:title", seo?.ogTitle || seo?.title || item.title);
  setMeta("property", "og:description", seo?.ogDescription || seo?.description || item.excerpt);
  if (seo?.socialImage) setMeta("property", "og:image", seo.socialImage);
  // Canonical always points at the public domain (enforced by the CMS plugin).
  if (seo?.canonical) {
    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = seo.canonical;
  }
}

export function CmsArticleView({ type, slug, basePath = "/insights" }: { type: CmsType; slug: string | null; basePath?: string }) {
  const [item, setItem] = useState<CmsArticle | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;
    if (!slug) {
      setStatus("notfound");
      return;
    }
    setStatus("loading");
    fetchBySlug(type, slug)
      .then((res) => {
        if (!active) return;
        if (!res) {
          setStatus("notfound");
          return;
        }
        setItem(res);
        setStatus("ready");
        applySeo(res);
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [type, slug]);

  const backHref = `${basePath}/${type}/`;
  const backLabel = `All ${cmsTypeMeta(type).label}`;

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-40 animate-pulse rounded-2xl bg-muted/50" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-muted/50" />
        <div className="h-4 w-full animate-pulse rounded bg-muted/40" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted/40" />
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center">
        <p className="text-base font-medium">This article isn&apos;t available.</p>
        <p className="mt-1 text-sm text-muted-foreground">It may be unpublished or moved.</p>
        <Link href={backHref} className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
          ← {backLabel}
        </Link>
      </div>
    );
  }

  if (status === "error" || !item) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center">
        <p className="text-base font-medium">Content is temporarily unavailable.</p>
        <p className="mt-1 text-sm text-muted-foreground">Please try again in a moment.</p>
        <Link href={backHref} className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
          ← {backLabel}
        </Link>
      </div>
    );
  }

  const subtitle = typeof item.fields.st_subtitle === "string" ? item.fields.st_subtitle : "";
  const allTerms = [...item.terms.domains, ...item.terms.topics, ...item.terms.tags];

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      {item.featuredImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.featuredImage.url}
          alt={item.featuredImage.alt || ""}
          className="-mx-4 max-h-80 w-[calc(100%+2rem)] rounded-none object-cover sm:mx-0 sm:w-full sm:rounded-2xl"
        />
      ) : (
        <div className="-mx-4 h-36 rounded-none bg-gradient-to-br from-brand/20 to-brand/5 sm:mx-0 sm:rounded-2xl" />
      )}

      <header className="space-y-3">
        <nav className="text-sm text-muted-foreground">
          <Link href={basePath} className="hover:text-brand">Insights</Link>
          <span aria-hidden="true"> / </span>
          <Link href={backHref} className="hover:text-brand">{cmsTypeMeta(item.type).label}</Link>
        </nav>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-brand">
            {cmsTypeMeta(item.type).label}
          </span>
          {item.readingTime && <span className="text-muted-foreground">{item.readingTime} min read</span>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>
        {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {item.author?.name && <span>By {item.author.name}</span>}
          {item.author?.name && <span aria-hidden="true">·</span>}
          <time dateTime={item.publishedDate}>{formatDate(item.publishedDate)}</time>
        </div>
      </header>

      <ShareBar title={item.title} />

      {/* Body: sanitized WordPress HTML rendered with Semitree typography.
          Overflow-safe: images/tables/code from the CMS can't cause horizontal
          scroll on mobile. */}
      <div
        className="prose-semitree space-y-4 break-words text-[15px] leading-relaxed [&_a]:break-words [&_a]:text-brand [&_a]:underline [&_h2]:pt-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: item.contentHtml }}
      />

      {allTerms.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-border pt-6">
          {allTerms.map((t) => (
            <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm">
        <Link href={backHref} className="font-medium text-brand hover:underline">← {backLabel}</Link>
      </p>
    </article>
  );
}
