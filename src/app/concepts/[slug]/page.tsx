import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ConceptView } from "@/components/concepts/ConceptView";
import { JsonLd } from "@/components/seo/JsonLd";
import { GLOSSARY, getConcept } from "@/lib/data/glossary";
import { pageMeta, jsonLdGraph, breadcrumbLd, definedTermLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return GLOSSARY.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) return { title: "Concept not found" };
  return pageMeta({
    title: `${concept.title} · Concepts`,
    description: concept.summary,
    path: `/concepts/${slug}`,
  });
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) notFound();

  const path = `/concepts/${slug}`;
  return (
    <Container className="py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Concepts", path: "/concepts" },
            { name: concept.title, path },
          ]),
          definedTermLd({
            name: concept.title,
            description: concept.summary,
            path,
          }),
        ])}
      />
      <ConceptView concept={concept} />
    </Container>
  );
}
