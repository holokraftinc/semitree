import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CmsTypeRoute } from "@/components/cms/CmsTypeRoute";
import { CMS_TYPES, cmsTypeMeta, isCmsType } from "@/lib/wordpress/config";
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
  if (!isCmsType(type)) return pageMeta({ title: "CMS", description: "", path: "/cms" });
  const label = cmsTypeMeta(type).label;
  return pageMeta({
    title: label,
    description: `${label} on Semitree, published through the Semitree CMS.`,
    path: `/cms/${type}`,
  });
}

export default async function CmsTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isCmsType(type)) notFound();
  const label = cmsTypeMeta(type).label;

  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "CMS", href: "/cms" },
            { label },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">{label}</h1>
        <p className="max-w-2xl text-muted-foreground">
          Published through the Semitree CMS and rendered in the Semitree design.
        </p>
      </div>

      <Suspense fallback={<div className="h-56 animate-pulse rounded-xl bg-muted/40" />}>
        <CmsTypeRoute type={type} />
      </Suspense>
    </Container>
  );
}
