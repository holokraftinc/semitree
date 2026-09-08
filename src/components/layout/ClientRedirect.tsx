"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";

/**
 * Static-export-safe redirect. GitHub Pages / `output: export` can't do server
 * redirects, so a moved route renders this: it client-side replaces to the new
 * location (optionally preserving the query string) and shows a visible link as
 * a no-JS fallback. Used to forward legacy /blog and /cms URLs to /insights.
 */
export function ClientRedirect({
  to,
  preserveQuery = false,
}: {
  to: string;
  preserveQuery?: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    const query = preserveQuery && typeof window !== "undefined" ? window.location.search : "";
    router.replace(to + query);
  }, [router, to, preserveQuery]);

  return (
    <Container className="py-16 text-center">
      <p className="text-sm text-muted-foreground">
        This page has moved to Insights.{" "}
        <Link href={to} className="font-medium text-brand hover:underline">
          Continue →
        </Link>
      </p>
    </Container>
  );
}
