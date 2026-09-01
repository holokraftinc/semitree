import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { LessonView } from "@/components/learn/LessonView";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import { LESSONS, getLesson } from "@/lib/data/lessons";
import { pageMeta, jsonLdGraph, breadcrumbLd, learningResourceLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Lesson not found" };
  return pageMeta({
    title: `${lesson.title} · Learn`,
    description: lesson.summary,
    path: `/learn/${slug}`,
  });
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const path = `/learn/${slug}`;
  return (
    <Container className="py-10">
      <TrackView
        event="lesson_opened"
        payload={{ lesson: slug, level: lesson.level }}
      />
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Learn", path: "/learn" },
            { name: lesson.title, path },
          ]),
          learningResourceLd({
            name: lesson.title,
            description: lesson.summary,
            path,
            level: lesson.level,
          }),
        ])}
      />
      <LessonView lesson={lesson} />
    </Container>
  );
}
