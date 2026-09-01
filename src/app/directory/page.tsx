import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Alert } from "@/components/ui/Alert";
import { DirectoryExplorer } from "@/components/hub/DirectoryExplorer";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Directory",
  description:
    "A directory of the microfluidics ecosystem: foundries, fabrication services, suppliers, equipment, software, designers, courses, journals, and conferences.",
  path: "/directory",
});

export default function DirectoryPage() {
  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Directory" }]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Directory</h1>
        <p className="max-w-2xl text-muted-foreground">
          An evergreen directory of the microfluidics ecosystem. These are the
          categories it will cover; listings are added only once verified.
        </p>
      </div>

      <Alert variant="info" title="Being built — verified listings only">
        To keep the directory trustworthy, entries appear only after they are
        checked and verified. Nothing here is auto-generated or fabricated.
      </Alert>

      <DirectoryExplorer />
    </Container>
  );
}
