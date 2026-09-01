"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";

/** Route-level error boundary (Next.js App Router convention). */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // A real logger is wired in a later phase.
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16">
      <ErrorState
        title="Something went wrong"
        description="An unexpected error occurred while loading this page. You can try again."
        onRetry={reset}
      />
    </Container>
  );
}
