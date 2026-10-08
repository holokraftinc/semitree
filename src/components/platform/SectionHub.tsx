import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { IaSection } from "@/lib/data/ia";
import { RelatedRail, type RelatedGroup } from "./RelatedRail";

/**
 * Reusable landing layout for a top-level IA section. It answers the three
 * wayfinding questions by construction: a breadcrumb ("where am I?"), a grid of
 * sub-section cards ("where can I go next?"), and a Related rail ("what else is
 * related?"). Available items link out; coming-soon items render as a labelled,
 * non-clickable card so the full hierarchy is visible without dead links.
 */
export function SectionHub({
  section,
  intro,
  related = [],
}: {
  section: IaSection;
  intro?: ReactNode;
  related?: RelatedGroup[];
}) {
  return (
    <Container className="space-y-12 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: section.label },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">{section.label}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{section.tagline}</p>
        {intro && <div className="max-w-2xl text-sm text-muted-foreground">{intro}</div>}
      </div>

      <section aria-label={`${section.label} sections`}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.items.map((item) => {
            const available = item.status === "available" && item.href;
            const card = (hover: boolean) => (
              <Card className={`flex h-full flex-col p-5 transition-colors${hover ? " group-hover:border-brand/50" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className={`text-base font-semibold tracking-tight${hover ? " group-hover:text-brand" : ""}`}>{item.label}</h2>
                  {available ? (
                    <span aria-hidden="true" className="text-brand">→</span>
                  ) : (
                    <Badge variant="neutral">Coming soon</Badge>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                )}
              </Card>
            );
            return (
              <li key={item.label}>
                {available ? (
                  <Link
                    href={item.href!}
                    className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {card(true)}
                  </Link>
                ) : (
                  <div className="h-full opacity-80">{card(false)}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <RelatedRail groups={related} />
    </Container>
  );
}
