import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Alert } from "@/components/ui/Alert";
import { DirectoryExplorer } from "@/components/industry/DirectoryExplorer";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Semiconductor company directory",
  description:
    "A structured directory of the semiconductor industry — foundries, fabless, IDMs, OSAT/ATMP, EDA, equipment, materials, and more. Search and filter by category, country, state, and technology.",
  path: "/industry/companies",
});

export default function CompaniesPage() {
  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industry", href: "/industry" },
            { label: "Companies" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Company directory</h1>
        <p className="max-w-2xl text-muted-foreground">
          A structured map of the semiconductor ecosystem. Search or filter by
          category, country, state, and technology. Also view the{" "}
          <Link href="/industry/map" className="font-medium text-brand hover:underline">
            global map
          </Link>{" "}
          or the{" "}
          <Link href="/industry/map/india" className="font-medium text-brand hover:underline">
            India map
          </Link>
          .
        </p>
      </div>

      <Alert variant="info" title="Public information, compiled — not fabricated">
        Entries use well-established public facts only. Locations are city-level
        (not exact addresses), and fields that can&apos;t be stated with
        confidence are left blank rather than guessed.
      </Alert>

      <DirectoryExplorer />
    </Container>
  );
}
