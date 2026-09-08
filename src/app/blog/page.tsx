import type { Metadata } from "next";
import { ClientRedirect } from "@/components/layout/ClientRedirect";
import { pageMeta } from "@/lib/seo";

// The blog experience is now unified under Insights. Preserve the old URL with
// a redirect so existing links keep working.
export const metadata: Metadata = pageMeta({
  title: "Insights",
  description: "Semitree Insights — news, explainers, research, and analysis.",
  path: "/insights",
});

export default function BlogRedirect() {
  return <ClientRedirect to="/insights/" />;
}
