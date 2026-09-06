import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TopicDiscovery } from "@/components/research/TopicDiscovery";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Research topics",
  description:
    "Browse active semiconductor research topics — EUV, gate-all-around transistors, advanced packaging, HBM, wide-bandgap, and more — by technology, process, device, material, application, or company.",
  path: "/research/topics",
});

export default function ResearchTopicsPage() {
  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Research", href: "/research" },
            { label: "Topics" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Research topics</h1>
        <p className="max-w-2xl text-muted-foreground">
          Active areas of semiconductor research, each linked to the concepts,
          processes, tools, and companies behind it. Browse by technology,
          process, device, material, application, or company. Looking for
          institutions? See{" "}
          <Link href="/research#sec-university" className="font-medium text-brand hover:underline">
            universities
          </Link>{" "}
          and{" "}
          <Link href="/research#sec-lab" className="font-medium text-brand hover:underline">
            labs
          </Link>
          .
        </p>
      </div>

      <TopicDiscovery />
    </Container>
  );
}
