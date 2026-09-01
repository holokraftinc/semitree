import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/home/Hero";
import { PopularTools } from "@/components/home/PopularTools";
import { LearnFromZero } from "@/components/home/LearnFromZero";
import { LearnToCalculate } from "@/components/home/LearnToCalculate";
import { ResearchResources } from "@/components/home/ResearchResources";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

export default function HomePage() {
  return (
    <Container className="space-y-20 pb-8">
      <Hero />
      <PopularTools />
      <LearnFromZero />
      <LearnToCalculate />
      <ResearchResources />
      <NewsletterSignup />
    </Container>
  );
}
