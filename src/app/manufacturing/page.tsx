import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProcessFlow } from "@/components/manufacturing/ProcessFlow";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrackView } from "@/components/analytics/TrackView";
import { MFG_PROCESSES } from "@/lib/knowledge/manufacturing";
import { pageMeta, jsonLdGraph, breadcrumbLd, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor Manufacturing Explorer",
  description:
    "An interactive walk through how a chip is made — from raw silica sand to a packaged, tested chip. Click any of the 17 process steps for inputs, outputs, equipment, defects, and the concepts behind it.",
  path: "/manufacturing",
});

const LOOP = [
  { label: "Learn", desc: "Read the lesson behind the step." },
  { label: "Understand", desc: "Follow the related concepts." },
  { label: "Explore", desc: "See equipment, materials & industry." },
  { label: "Calculate", desc: "Run the tool that models it." },
];

export default function ManufacturingPage() {
  const itemListLd = {
    "@type": "ItemList",
    name: "Semiconductor manufacturing process steps",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: MFG_PROCESSES.length,
    itemListElement: MFG_PROCESSES.map((p) => ({
      "@type": "ListItem",
      position: p.order,
      name: p.name,
      url: new URL(`/manufacturing/${p.slug}`, SITE.url).toString(),
    })),
  };

  return (
    <Container className="space-y-10 py-10">
      <JsonLd
        data={jsonLdGraph([
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Semiconductors", path: "/explore" },
            { name: "Manufacturing", path: "/manufacturing" },
          ]),
          itemListLd,
        ])}
      />
      <TrackView event="manufacturing_opened" payload={{}} />

      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Semiconductors", href: "/explore" },
            { label: "Manufacturing" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Semiconductor Manufacturing Explorer
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          How does a chip get made? Follow the full journey — from raw silica
          sand to a packaged, tested chip — one process at a time. Tap any step
          to see what it does, why it&apos;s needed, how it works, and the
          equipment, defects, concepts, and tools behind it.
        </p>
      </div>

      {/* Learning loop */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <p className="text-sm font-semibold tracking-tight">
          At every step: Learn → Understand → Explore → Calculate
        </p>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LOOP.map((s, i) => (
            <li key={s.label} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-semibold text-brand">
                {i + 1}
              </span>
              <span>
                <span className="block text-sm font-medium">{s.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {s.desc}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* The flow */}
      <section aria-label="Manufacturing process flow">
        <ProcessFlow />
      </section>
    </Container>
  );
}
