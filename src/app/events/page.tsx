import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";
import { SEMICON_INDIA_2026 as E } from "@/lib/events/semicon-india-2026";

export const metadata: Metadata = pageMeta({
  title: "Events",
  description:
    "Semitree's coverage and learning hubs for semiconductor industry events, connecting event topics to Semitree learning across the value chain.",
  path: "/events",
});

export default function EventsIndexPage() {
  return (
    <Container className="space-y-8 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
          ]),
        ])}
      />
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Events" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Semitree&rsquo;s coverage and learning hubs for semiconductor industry
          events — connecting what happens at an event to Semitree learning.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <Badge variant="brand">Event coverage</Badge>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">{E.name}</h2>
          <p className="mt-1 text-sm font-medium text-brand">{E.theme}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {E.dates} · Yashobhoomi, New Delhi
          </p>
          <Link
            href={`/events/${E.slug}`}
            className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
          >
            Explore SEMICON India 2026 →
          </Link>
        </Card>
      </div>
    </Container>
  );
}
