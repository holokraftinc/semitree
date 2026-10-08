import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Submit an industry problem",
  description:
    "Tell Semitree about a gap, bottleneck, or problem in the semiconductor ecosystem. Community-sourced problems help map where the real opportunities are.",
  path: "/submit",
});

export default function SubmitPage() {
  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Submit an industry problem" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Submit an industry problem</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Do you work in semiconductors? Tell us about a problem, supply-chain gap,
          or underserved need. Semitree maps evidence-backed gaps across the
          ecosystem — your input helps the whole community see where the real
          opportunities are.
        </p>
      </div>

      <Card className="max-w-2xl space-y-3 p-6">
        <h2 className="text-lg font-semibold tracking-tight">The structured form is opening soon</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We&apos;re building a structured submission flow (problem, affected participants,
          evidence, and status) so contributions slot straight into the problem
          database. Until it opens, subscribe to be notified, and browse the
          problems and gaps we already track. This is intelligence gathering — no
          paywalls, no ads.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/newsletter"
            className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Get notified
          </Link>
          <Link
            href="/opportunities"
            className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            See tracked opportunities
          </Link>
        </div>
      </Card>

      <p className="text-sm text-muted-foreground">
        Prefer to learn first? Head to <Link href="/explore" className="font-medium text-brand hover:underline">Explore</Link>{" "}
        or browse the <Link href="/industry" className="font-medium text-brand hover:underline">Industry</Link> section.
      </p>
    </Container>
  );
}
