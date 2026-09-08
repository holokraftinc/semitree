import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { UnsubscribeClient } from "@/components/cms/UnsubscribeClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Unsubscribe",
  description: "Manage your Semitree newsletter subscription.",
  path: "/unsubscribe",
});

export default function UnsubscribePage() {
  return (
    <Container className="py-16">
      <Suspense fallback={<div className="mx-auto h-40 max-w-md animate-pulse rounded-xl bg-muted/40" />}>
        <UnsubscribeClient />
      </Suspense>
    </Container>
  );
}
