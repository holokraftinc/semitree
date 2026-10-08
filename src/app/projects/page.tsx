import type { Metadata } from "next";
import { SectionHub } from "@/components/platform/SectionHub";
import { getIaSection } from "@/lib/data/ia";
import { pageMeta } from "@/lib/seo";

const section = getIaSection("projects")!;

export const metadata: Metadata = pageMeta({
  title: "Projects",
  description:
    "Semitree's ongoing ecosystem-research projects: the India semiconductor map, company and supplier databases, startup and investment trackers, and the supply-chain explorer.",
  path: "/projects",
});

export default function Page() {
  return (
    <SectionHub
      section={section}
      related={[
        {
          title: "Related sections",
          links: [
            { label: "India", href: "/india" },
            { label: "Companies", href: "/companies" },
            { label: "Supply chain", href: "/supply-chain" },
          ],
        },
      ]}
    />
  );
}
