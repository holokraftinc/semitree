import type { Metadata } from "next";
import { SectionHub } from "@/components/platform/SectionHub";
import { getIaSection } from "@/lib/data/ia";
import { pageMeta } from "@/lib/seo";

const section = getIaSection("opportunities")!;

export const metadata: Metadata = pageMeta({
  title: "Opportunities",
  description:
    "Evidence-backed industry and supply-chain gaps, problems worth solving, emerging technologies, supplier opportunities, and market signals in the semiconductor ecosystem.",
  path: "/opportunities",
});

export default function Page() {
  return (
    <SectionHub
      section={section}
      intro={
        <p>
          This section will surface gaps and opportunities only where they are backed by evidence from the rest of
          Semitree — the supply-chain model, the company registry, and published insights. It is being built out; nothing
          here is speculative.
        </p>
      }
      related={[
        {
          title: "Related sections",
          links: [
            { label: "Supply chain", href: "/supply-chain" },
            { label: "Industry", href: "/industry" },
            { label: "Insights", href: "/insights" },
          ],
        },
      ]}
    />
  );
}
