import { getTool } from "@/lib/data/tools";
import { JsonLd } from "./JsonLd";
import { jsonLdGraph, breadcrumbLd, softwareApplicationLd } from "@/lib/seo";

/** BreadcrumbList + SoftwareApplication structured data for a tool page. */
export function ToolSeo({ slug }: { slug: string }) {
  const tool = getTool(slug);
  if (!tool) return null;
  const path = `/tools/${slug}`;
  return (
    <JsonLd
      data={jsonLdGraph([
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: tool.name, path },
        ]),
        softwareApplicationLd({
          name: tool.name,
          description: tool.summary,
          path,
        }),
      ])}
    />
  );
}
