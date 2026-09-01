import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CURRICULUM } from "@/lib/data/curriculum";
import { getLesson } from "@/lib/data/lessons";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Learn",
  description:
    "A zero-to-competent microfluidics curriculum in six levels, from orientation to designing your own chip.",
  path: "/learn",
});

export default function LearnPage() {
  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Learn from zero</h1>
        <p className="max-w-2xl text-muted-foreground">
          A structured path from knowing nothing to designing with confidence.
          Every module pairs a plain-English explainer with the key equation and
          a direct link to the calculator that applies it. Levels 0 and 1 are
          written; the rest are on the way.
        </p>
      </div>

      <ol className="space-y-6">
        {CURRICULUM.map((level) => (
          <li key={level.level}>
            <Card className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="sm:w-56 sm:shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 font-mono text-base font-semibold text-brand">
                      {level.level}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Level {level.level}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold tracking-tight">
                    {level.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {level.summary}
                  </p>
                </div>

                <ul className="flex-1 space-y-1 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                  {level.modules.map((mod) => {
                    const lesson = mod.lessonSlug
                      ? getLesson(mod.lessonSlug)
                      : undefined;
                    if (lesson) {
                      return (
                        <li key={mod.title}>
                          <Link
                            href={`/learn/${lesson.slug}`}
                            className="group flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <span className="font-medium text-foreground group-hover:text-brand">
                              {mod.title}
                            </span>
                            <span className="flex shrink-0 items-center gap-2">
                              {lesson.estimatedMinutes && (
                                <span className="text-xs text-muted-foreground">
                                  {lesson.estimatedMinutes} min
                                </span>
                              )}
                              <span aria-hidden="true" className="text-brand">
                                →
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    }
                    return (
                      <li
                        key={mod.title}
                        className="flex items-start justify-between gap-3 px-2 py-1.5 text-sm"
                      >
                        <span className="text-muted-foreground">{mod.title}</span>
                        <Badge variant="neutral" className="mt-0.5 shrink-0">
                          Soon
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </Container>
  );
}
