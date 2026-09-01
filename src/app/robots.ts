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
        // Design preview duplicates a real tool — keep it out of crawls.
        disallow: ["/tools/preview"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
