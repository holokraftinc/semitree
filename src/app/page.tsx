import { EcosystemHero } from "@/components/home/EcosystemHero";
import { IndiaToday } from "@/components/home/IndiaToday";
import { ValueChainJourney } from "@/components/home/ValueChainJourney";
import { IndiaMapSection } from "@/components/home/IndiaMapSection";
import { EcosystemStats } from "@/components/home/EcosystemStats";
import { WhatsChanging } from "@/components/home/WhatsChanging";
import { ProblemsWorthSolving } from "@/components/home/ProblemsWorthSolving";
import { HomeInsights } from "@/components/home/HomeInsights";
import { IndustryVoices } from "@/components/home/IndustryVoices";
import { FinalCta } from "@/components/home/FinalCta";
import { EventPromotion } from "@/components/events/EventPromotion";

/**
 * The Semitree homepage — the entry point to India's semiconductor ecosystem.
 * Full-bleed, storytelling sections (each self-contained, mobile order = reading
 * order): hero → India today → value chain → India map → stats → what's changing
 * → problems → insights → voices → final CTA. The ecosystem is the hero;
 * editorial is deliberately secondary.
 */
export default function HomePage() {
  return (
    <>
      {/* Temporary SEMICON India takeover — removes itself after the event. */}
      <EventPromotion />
      <EcosystemHero />
      <IndiaToday />
      <ValueChainJourney />
      <IndiaMapSection />
      <EcosystemStats />
      <WhatsChanging />
      <ProblemsWorthSolving />
      <HomeInsights />
      <IndustryVoices />
      <FinalCta />
    </>
  );
}
