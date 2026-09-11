/**
 * Pure builders for social-share links. Kept separate from the (client) ShareBar
 * component so the URL construction can be unit-tested. These are the networks
 * that expose a real web share intent; Instagram has none (app-only), so it is
 * handled in the component via the native share sheet + copy-link fallback.
 */

export type ShareTargetKey = "facebook" | "linkedin" | "x" | "whatsapp" | "email";

export interface ShareTarget {
  key: ShareTargetKey;
  label: string;
  href: string;
  /** Open in a new tab (email uses mailto:, which should not). */
  external: boolean;
}

export function buildShareTargets(url: string, title: string): ShareTarget[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const titleAndUrl = encodeURIComponent(`${title} ${url}`);
  const emailBody = encodeURIComponent(`${title}\n\n${url}`);
  return [
    {
      key: "facebook",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      external: true,
    },
    {
      key: "linkedin",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      external: true,
    },
    {
      key: "x",
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      external: true,
    },
    {
      key: "whatsapp",
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${titleAndUrl}`,
      external: true,
    },
    {
      key: "email",
      label: "Share by email",
      href: `mailto:?subject=${t}&body=${emailBody}`,
      external: false,
    },
  ];
}
