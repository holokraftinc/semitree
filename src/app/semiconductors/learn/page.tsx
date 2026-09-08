import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { LEARNING_PATHS, lessonsOfPath } from "@/lib/knowledge/semi-lessons";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor learning paths",
  description:
    "Structured semiconductor learning paths: fundamentals, chip manufacturing, IC design flow, and advanced packaging.",
  path: "/semiconductors/learn",
});

export default function SemiconductorLearnPage() {
  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Learn", href: "/learn" },
            { label: "Semiconductors" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Learn semiconductors</h1>
        <p className="max-w-2xl text-muted-foreground">
          Four structured paths from first principles to advanced packaging.
          Each lesson links to the next, so you always know where to go.
        </p>
      </div>

      <ol className="space-y-6">
        {LEARNING_PATHS.map((path, i) => {
          const lessons = lessonsOfPath(path.id);
          return (
            <li key={path.id}>
              <Card className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="sm:w-56 sm:shrink-0">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 font-mono text-base font-semibold text-brand">
                        {i + 1}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {lessons.length} lessons
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold tracking-tight">{path.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{path.summary}</p>
                    {lessons[0] && (
                      <Link
                        href={`/semiconductors/learn/${lessons[0].slug}`}
                        className="mt-3 inline-block rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Start path →
                      </Link>
                    )}
                  </div>

                  <ol className="flex-1 space-y-1 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    {lessons.map((l) => (
                      <li key={l.slug}>
                        <Link
                          href={`/semiconductors/learn/${l.slug}`}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted/60 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span className="font-mono text-xs text-muted-foreground">
                            {l.order}.
                          </span>
                          {l.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              </Card>
            </li>
          );
        })}
      </ol>
    </Container>
  );
}
