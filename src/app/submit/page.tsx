import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { IndustryProblemForm } from "@/components/submit/IndustryProblemForm";
import { pageMeta, jsonLdGraph, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Submit an industry problem",
  description:
    "Tell Semitree about a gap, bottleneck, or problem in the semiconductor ecosystem. Community-sourced problems help map where the real opportunities are.",
  path: "/submit",
});

export default function SubmitPage() {
  return (
    <Container className="space-y-10 py-10">
      <JsonLd data={jsonLdGraph([breadcrumbLd([{ name: "Home", path: "/" }, { name: "Submit an industry problem", path: "/submit" }])])} />
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

      <IndustryProblemForm />

      <nav aria-label="Keep exploring" className="border-t border-border pt-6 text-sm text-muted-foreground">
        Prefer to look around first? Head to{" "}
        <Link href="/explore" className="font-medium text-brand hover:underline">Explore</Link>, the{" "}
        <Link href="/industry" className="font-medium text-brand hover:underline">Industry</Link> section, or{" "}
        <Link href="/opportunities" className="font-medium text-brand hover:underline">see tracked opportunities</Link>.
      </nav>
    </Container>
  );
}
