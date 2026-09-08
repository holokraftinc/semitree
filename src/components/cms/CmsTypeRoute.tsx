"use client";

import { useSearchParams } from "next/navigation";
import { CmsList } from "./CmsList";
import { CmsArticleView } from "./CmsArticleView";
import { cmsTypeMeta, type CmsType } from "@/lib/wordpress/config";

/**
 * Renders a single editorial content type: a paginated list, or — when a
 * `?slug=` is present — the detail view. Kept client-side because this static
 * site resolves slugs at runtime (no rebuild needed when content changes).
 */
export function CmsTypeRoute({ type, basePath = "/insights" }: { type: CmsType; basePath?: string }) {
  const slug = useSearchParams().get("slug");
  if (slug) {
    return <CmsArticleView type={type} slug={slug} basePath={basePath} />;
  }
  return <CmsList type={type} perPage={9} showSearch heading={`Latest ${cmsTypeMeta(type).label}`} basePath={basePath} />;
}
