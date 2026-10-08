import type { Metadata } from "next";
import { SectionHub } from "@/components/platform/SectionHub";
import { getIaSection } from "@/lib/data/ia";
import { pageMeta } from "@/lib/seo";

const section = getIaSection("companies")!;

export const metadata: Metadata = pageMeta({
  title: "Companies",
  description:
    "Discover the companies participating in India's semiconductor ecosystem — fabs, OSAT, design, equipment, materials, suppliers, testing, startups, and research organizations.",
  path: "/companies",
});

export default function Page() {
  return (
    <SectionHub
      section={section}
      related={[
      { title: "Related sections", links: [
        { label: "Industry", href: "/industry" },
        { label: "India", href: "/india" },
        { label: "Supply chain", href: "/supply-chain" },
      ] },
    ]}
    />
  );
}
