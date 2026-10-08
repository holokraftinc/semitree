import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Alert } from "@/components/ui/Alert";
import { StatusBadge } from "@/components/industry/StatusBadge";
import {
  SUPPLIER_CATEGORIES,
  companiesForSupplierCategory,
  populatedSupplierCategories,
  researchingSupplierCategories,
} from "@/lib/industry/relationships";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Supplier directory",
  description:
    "Discover the suppliers behind the semiconductor ecosystem — equipment, chemicals, wafers, packaging materials, testing, and the wider support base. Populated from verified public facts; unverified categories are marked as being researched.",
  path: "/suppliers",
});

const linkClass =
  "inline-flex items-baseline gap-1 rounded-sm text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function SuppliersPage() {
  const populated = populatedSupplierCategories();
  const researching = researchingSupplierCategories();

  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Companies", href: "/companies" },
            { label: "Suppliers" },
          ]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Supplier directory</h1>
        <p className="max-w-2xl text-muted-foreground">
          The semiconductor industry runs on a deep supplier base — tools,
          chemicals, wafers, materials, and dozens of support services. This is a
          map of those categories and the suppliers we can verify today.
        </p>
      </div>

      <Alert variant="info" title="Honest coverage">
        Categories with verified suppliers are shown first. The rest of the
        taxonomy is listed as <strong>Researching</strong> — the slots exist, but
        we don&apos;t invent vendors to fill them. {SUPPLIER_CATEGORIES.length}{" "}
        categories, {populated.length} populated so far.
      </Alert>

      {/* Populated categories */}
      <section aria-labelledby="populated-h" className="space-y-6">
        <h2 id="populated-h" className="text-lg font-semibold tracking-tight">
          Suppliers in the registry
        </h2>
        <div className="space-y-5">
          {populated.map((cat) => {
            const companies = companiesForSupplierCategory(cat);
            return (
              <div key={cat.key} id={cat.key} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold tracking-tight">{cat.label}</h3>
                  <StatusBadge status="verified" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {companies.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/industry/companies/${c.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:border-brand/50 hover:text-brand"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Researching categories */}
      <section aria-labelledby="researching-h" className="space-y-4">
        <h2 id="researching-h" className="text-lg font-semibold tracking-tight">
          Being researched
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          These supplier categories are part of the ecosystem map. We&apos;re
          compiling verified entries — nothing here is auto-generated.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {researching.map((cat) => (
            <li key={cat.key} className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{cat.label}</h3>
                <StatusBadge status="researching" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{cat.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Cross-links */}
      <section className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
        Suppliers sit upstream of the manufacturing chain. Explore the{" "}
        <Link href="/industry/companies" className={linkClass}>company directory</Link>, the{" "}
        <Link href="/supply-chain" className={linkClass}>supply-chain explorer</Link>, or{" "}
        <Link href="/opportunities" className={linkClass}>supplier opportunities</Link>{" "}
        where the gaps are. Know a supplier we should add?{" "}
        <Link href="/submit" className={linkClass}>Submit it →</Link>
      </section>
    </Container>
  );
}
