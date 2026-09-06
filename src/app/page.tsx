import { Container } from "@/components/ui/Container";
import { PlatformHero } from "@/components/home/PlatformHero";
import { WhereToStart } from "@/components/home/WhereToStart";
import { ContinueLearning } from "@/components/home/ContinueLearning";
import { PopularTopics } from "@/components/home/PopularTopics";
import { LearnFromZero } from "@/components/home/LearnFromZero";
import { PopularTools } from "@/components/home/PopularTools";
import { ManufacturingOverview } from "@/components/home/ManufacturingOverview";
import { IndustryCompanies } from "@/components/home/IndustryCompanies";
import { ResearchResources } from "@/components/home/ResearchResources";
import { LatestArticles } from "@/components/home/LatestArticles";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

export default function HomePage() {
  return (
    <Container className="space-y-20 pb-8">
      <PlatformHero />
      <WhereToStart />
      <ContinueLearning />
      <PopularTopics />
      <LearnFromZero />
      <PopularTools />
      <ManufacturingOverview />
      <IndustryCompanies />
      <ResearchResources />
      <LatestArticles />
      <NewsletterSignup />
    </Container>
  );
}
