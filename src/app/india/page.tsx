import type { Metadata } from "next";
import { SectionHub } from "@/components/platform/SectionHub";
import { getIaSection } from "@/lib/data/ia";
import { pageMeta } from "@/lib/seo";

const section = getIaSection("india")!;

export const metadata: Metadata = pageMeta({
  title: "India semiconductor ecosystem",
  description:
    "India's semiconductor ecosystem — the map, projects, states, companies, fabs, OSAT/ATMP, design centres, suppliers, investments, policy, and talent.",
  path: "/india",
});

export default function Page() {
  return (
    <SectionHub
      section={section}
      related={[
        {
          title: "Related sections",
          links: [
            { label: "Companies", href: "/companies" },
            { label: "Projects", href: "/projects" },
            { label: "Insights", href: "/insights" },
          ],
        },
      ]}
    />
  );
}
