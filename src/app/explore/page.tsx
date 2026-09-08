import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PopularTopics } from "@/components/home/PopularTopics";
import { ManufacturingOverview } from "@/components/home/ManufacturingOverview";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { getAllDomains, sectionPath } from "@/lib/domains";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Explore",
  description:
    "Explore Semitree: semiconductor topics and manufacturing, tools, research, resources, companies, and the microfluidics domain.",
  path: "/explore",
});

const DISCOVER = [
  { label: "Tools", href: "/tools", status: "live", desc: "Calculators & design utilities." },
  { label: "Research", href: "/research", status: "live", desc: "Papers, references, and signals." },
  { label: "Resources", href: "/resources", status: "live", desc: "Guides, cheat sheets, downloads." },
  { label: "Companies", href: "/industry/companies", status: "live", desc: "Foundries, suppliers, services." },
  { label: "Supply chain", href: "/supply-chain", status: "live", desc: "The chain, end to end." },
  { label: "Insights", href: "/insights", status: "live", desc: "News, explainers, research & analysis." },
] as const;

export default function ExplorePage() {
  const domains = getAllDomains();
  return (
    <Container className="space-y-16 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Explore" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Explore Semitree</h1>
        <p className="max-w-2xl text-muted-foreground">
          Discover topics, tools, research, and the industry. Microfluidics is
          live today; the semiconductor domain is being built.
        </p>
      </div>

      {/* Domains */}
      <Section headingId="domains" title="Domains" description="Specialised areas within Semitree.">
        <div className="grid gap-4 sm:grid-cols-2">
          {domains.map((d) => (
            <Card key={d.id} className="p-5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold tracking-tight">{d.name}</h3>
                <Badge variant={d.status === "live" ? "success" : "neutral"}>
                  {d.status === "live" ? "Live" : "Coming soon"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{d.tagline}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {d.sections.map((s) => {
                  const href = sectionPath(d.id, s.key);
                  return s.status === "live" && href ? (
                    <li key={s.key}>
                      <Link
                        href={href}
                        className="rounded-full border border-border px-3 py-1 text-sm text-foreground hover:border-brand/50 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {s.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={s.key}>
                      <span className="rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted-foreground">
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <PopularTopics />
      <ManufacturingOverview />

      {/* Discover grid */}
      <Section headingId="discover" title="Discover more" description="Everything else on the platform.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DISCOVER.map((d) =>
            d.status === "live" && d.href ? (
              <Card key={d.label} className="relative p-5 transition-shadow hover:shadow-card-hover">
                <CardHeader className="p-0">
                  <CardTitle as="h3">
                    <Link
                      href={d.href}
                      className="rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:text-brand"
                    >
                      {d.label}
                    </Link>
                  </CardTitle>
                  <CardDescription>{d.desc}</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card key={d.label} className="p-5">
                <CardHeader className="p-0">
                  <div className="flex items-center gap-2">
                    <CardTitle as="h3">{d.label}</CardTitle>
                    <Badge variant="neutral">Soon</Badge>
                  </div>
                  <CardDescription>{d.desc}</CardDescription>
                </CardHeader>
              </Card>
            ),
          )}
        </div>
      </Section>

      <NewsletterSignup />
    </Container>
  );
}
