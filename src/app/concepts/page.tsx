import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GlossarySearch } from "@/components/concepts/GlossarySearch";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Concepts",
  description:
    "A searchable glossary of microfluidics concepts — the terms and dimensionless numbers that run the field.",
  path: "/concepts",
});

export default function ConceptsPage() {
  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Concepts" }]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Concepts</h1>
        <p className="max-w-2xl text-muted-foreground">
          A searchable glossary of the ideas behind the tools. Each concept links
          to the calculator that applies it once that tool ships. This is the
          starting set — the glossary grows alongside the curriculum.
        </p>
      </div>

      <GlossarySearch />
    </Container>
  );
}
