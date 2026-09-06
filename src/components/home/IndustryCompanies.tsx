import { Section } from "@/components/ui/Section";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

/** Industry companies — directory not populated yet; honest empty state. */
export function IndustryCompanies() {
  return (
    <Section
      headingId="industry-companies"
      title="Industry & companies"
      description="Foundries, equipment makers, suppliers, and services across the ecosystem."
      action={{ label: "Open the directory", href: "/directory" }}
    >
      <EmptyState
        title="Verified listings coming soon"
        description="The directory is populated only with checked, verified entries — nothing auto-generated."
        action={<ButtonLink href="/industry" variant="outline">Industry overview</ButtonLink>}
      />
    </Section>
  );
}
