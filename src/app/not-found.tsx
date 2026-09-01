import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

/** 404 page (Next.js App Router convention). */
export default function NotFound() {
  return (
    <Container className="py-16">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={<ButtonLink href="/">Back to home</ButtonLink>}
      />
    </Container>
  );
}
