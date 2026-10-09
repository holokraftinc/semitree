import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

// Required for `output: "export"` — emit a static robots.txt.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Design preview duplicates a real tool; the search index is a data
        // file, not a page — keep both out of crawls.
        disallow: ["/tools/preview", "/search-index.json"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
