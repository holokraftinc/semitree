import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

export const metadata: Metadata = pageMeta({
  title: "Newsletter",
  description:
    "The weekly microfluidics roundup: papers, products, jobs, and one featured tool or lesson.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Newsletter" }]}
        />
        <h1 className="text-3xl font-bold tracking-tight">Newsletter</h1>
        <p className="max-w-2xl text-muted-foreground">
          A weekly roundup of what matters in microfluidics — papers, products,
          jobs, and one featured tool or lesson. It&rsquo;s the best way to
          follow Semitree as tools and lessons go live.
        </p>
      </div>

      <NewsletterSignup />
    </Container>
  );
}
