import type { Metadata } from "next";
import { ClientRedirect } from "@/components/layout/ClientRedirect";
import { pageMeta } from "@/lib/seo";

// "CMS" is internal infrastructure and never a public destination. Forward any
// legacy /cms link to the public Insights experience.
export const metadata: Metadata = pageMeta({
  title: "Insights",
  description: "Semitree Insights — news, explainers, research, and analysis.",
  path: "/insights",
});

export default function CmsRedirect() {
  return <ClientRedirect to="/insights/" />;
}
