import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { CmsList } from "@/components/cms/CmsList";
import { CMS_TYPES } from "@/lib/wordpress/config";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Newsroom",
  description:
    "Articles, industry news, explainers, research insights, and analysis — published through the Semitree CMS and presented in the Semitree design.",
  path: "/cms",
});

export default function CmsHubPage() {
  return (
    <Container className="space-y-10 py-10">
      <div className="space-y-3">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "CMS" }]} />
        <h1 className="text-3xl font-bold tracking-tight">Newsroom</h1>
        <p className="max-w-2xl text-muted-foreground">
          Fresh content published through the Semitree CMS. WordPress manages the
          content; Semitree controls the presentation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CMS_TYPES.map((t) => (
          <Link key={t.key} href={`/cms/${t.key}/`} className="group">
            <Card className="h-full p-5 transition-colors group-hover:border-brand/50">
              <h2 className="font-semibold tracking-tight group-hover:text-brand">{t.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Browse {t.label.toLowerCase()} →</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Latest across the primary type — silent if the CMS has nothing yet. */}
      <CmsList type="articles" perPage={6} silentWhenEmpty heading="Latest articles" />
    </Container>
  );
}
