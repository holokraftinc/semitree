import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EquipmentTopicView } from "@/components/semiconductors/EquipmentTopicView";
import {
  EQUIPMENT_TOPICS,
  getEquipmentTopic,
} from "@/lib/knowledge/equipment-topics";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, jsonLdGraph, breadcrumbLd, definedTermLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return EQUIPMENT_TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getEquipmentTopic(slug);
  if (!topic) return { title: "Equipment not found" };
  return pageMeta({
    title: `${topic.title} · Equipment`,
    description: topic.summary,
    path: `/semiconductors/equipment/${slug}`,
  });
}

export default async function EquipmentTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getEquipmentTopic(slug);
  if (!topic) notFound();
  const path = `/semiconductors/equipment/${slug}`;
  return (
    <>
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Explore", path: "/explore" },
            { name: "Equipment", path: "/semiconductors/equipment" },
            { name: topic.title, path },
          ]),
          definedTermLd({
            name: topic.title,
            description: topic.quickAnswer ?? topic.summary,
            path,
            setPath: "/semiconductors/equipment",
          }),
        ])}
      />
      <EquipmentTopicView topic={topic} />
    </>
  );
}
