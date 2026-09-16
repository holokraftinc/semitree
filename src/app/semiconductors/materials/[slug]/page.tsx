import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MaterialTopicView } from "@/components/semiconductors/MaterialTopicView";
import {
  MATERIAL_TOPICS,
  getMaterialTopic,
} from "@/lib/knowledge/material-topics";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return MATERIAL_TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getMaterialTopic(slug);
  if (!topic) return { title: "Material not found" };
  return pageMeta({
    title: `${topic.title} · Materials`,
    description: topic.summary,
    path: `/semiconductors/materials/${slug}`,
  });
}

export default async function MaterialTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getMaterialTopic(slug);
  if (!topic) notFound();
  return <MaterialTopicView topic={topic} />;
}
