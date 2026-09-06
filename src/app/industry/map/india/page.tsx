import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IndiaMap } from "@/components/industry/IndiaMap";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "India semiconductor map",
  description:
    "India's semiconductor landscape — fabs, ATMP/OSAT facilities, and design centers by state: Gujarat, Maharashtra, Karnataka, Tamil Nadu, Telangana, Uttar Pradesh, and others.",
  path: "/industry/map/india",
});

export default function IndiaMapPage() {
  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industry", href: "/industry" },
            { label: "India map" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">India semiconductor map</h1>
        <p className="max-w-2xl text-muted-foreground">
          India&apos;s emerging semiconductor landscape — fabs, ATMP/OSAT
          facilities, and design centers, grouped by state. See the{" "}
          <Link href="/industry/map" className="font-medium text-brand hover:underline">
            global map
          </Link>{" "}
          for the worldwide view.
        </p>
      </div>

      <IndiaMap />

      <p className="text-sm text-muted-foreground">
        Prefer a list? Browse the{" "}
        <Link href="/industry/companies" className="font-medium text-brand hover:underline">
          company directory
        </Link>
        .
      </p>
    </Container>
  );
}
