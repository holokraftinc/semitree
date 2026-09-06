import { getSemiTool } from "@/lib/data/semi-tools";
import { JsonLd } from "./JsonLd";
import { jsonLdGraph, breadcrumbLd, softwareApplicationLd } from "@/lib/seo";

/** BreadcrumbList + SoftwareApplication structured data for a semiconductor tool. */
export function SemiToolSeo({ slug }: { slug: string }) {
  const tool = getSemiTool(slug);
  if (!tool) return null;
  const path = `/semiconductors/tools/${slug}`;
  return (
    <JsonLd
      data={jsonLdGraph([
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Semiconductors", path: "/explore" },
          { name: "Tools", path: "/semiconductors/tools" },
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
