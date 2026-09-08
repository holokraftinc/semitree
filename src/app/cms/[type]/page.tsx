import type { Metadata } from "next";
import { ClientRedirect } from "@/components/layout/ClientRedirect";
import { CMS_TYPES, isCmsType } from "@/lib/wordpress/config";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return CMS_TYPES.map((t) => ({ type: t.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const path = isCmsType(type) ? `/insights/${type}` : "/insights";
  return pageMeta({ title: "Insights", description: "", path });
}

// Legacy /cms/<type> → /insights/<type>, preserving any ?slug= for deep links.
export default async function CmsTypeRedirect({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const to = isCmsType(type) ? `/insights/${type}/` : "/insights/";
  return <ClientRedirect to={to} preserveQuery />;
}
