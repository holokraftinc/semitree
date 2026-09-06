import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SemiLessonView } from "@/components/semiconductors/SemiLessonView";
import { TrackView } from "@/components/analytics/TrackView";
import { JsonLd } from "@/components/seo/JsonLd";
import { SEMI_LESSONS, getSemiLesson } from "@/lib/knowledge/semi-lessons";
import { pageMeta, jsonLdGraph, breadcrumbLd, learningResourceLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return SEMI_LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getSemiLesson(slug);
  if (!lesson) return { title: "Lesson not found" };
  return pageMeta({
    title: `${lesson.title} · Semiconductors`,
    description: lesson.summary,
    path: `/semiconductors/learn/${slug}`,
  });
}

export default async function SemiLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getSemiLesson(slug);
  if (!lesson) notFound();

  const path = `/semiconductors/learn/${slug}`;
  return (
    <Container className="py-10">
      <TrackView event="lesson_opened" payload={{ lesson: `semi:${slug}` }} />
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Learn", path: "/semiconductors/learn" },
            { name: lesson.title, path },
          ]),
          learningResourceLd({
            name: lesson.title,
            description: lesson.summary,
            path,
            level: 0,
          }),
        ])}
      />
      <SemiLessonView lesson={lesson} />
    </Container>
  );
}
