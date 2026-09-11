"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { buildShareTargets, type ShareTargetKey } from "./share-targets";

/**
 * Social-share row for editorial content (all CMS types). Facebook, LinkedIn,
 * X, WhatsApp and Email use real web share intents. Instagram has no web
 * link-share, so it (and "anything else") is handled through the device's
 * native share sheet when available, falling back to copy-link on desktop.
 * Uses the live page URL, so it works on this static, client-rendered route.
 */

const btn =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      {children}
    </svg>
  );
}

const ICONS: Record<ShareTargetKey, React.ReactNode> = {
  facebook: <Icon><path d="M13.5 21v-7h2.35l.4-2.8H13.5V9.4c0-.8.22-1.36 1.4-1.36h1.45V5.6c-.7-.1-1.4-.14-2.1-.13-2.13 0-3.6 1.3-3.6 3.68v2.05H8.2V14h2.45v7z" /></Icon>,
  linkedin: <Icon><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.28-.03-2.94-1.8-2.94-1.8 0-2.07 1.4-2.07 2.85V21H9z" /></Icon>,
  x: <Icon><path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-7-6.1 7H1.7l8-9.2L1 2h7l4.8 6.4zm-1.2 18h1.9L7.1 4H5.1z" /></Icon>,
  whatsapp: <Icon><path d="M20 3.9A10 10 0 003.5 15.8L2 22l6.3-1.6A10 10 0 1020 3.9zM12 20a8 8 0 01-4.1-1.1l-.3-.2-3.7 1 1-3.6-.2-.3A8 8 0 1112 20zm4.4-6c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.4-1.32-1.64-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.02.4 1.37.5.58.19 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" /></Icon>,
  email: <Icon><path d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 7l8-5.5V6l-8 5.2L4 6v.5z" /></Icon>,
};

const InstagramIcon = (
  <Icon>
    <path d="M12 2c2.7 0 3 0 4.06.06 1.05.05 1.77.22 2.4.47.65.25 1.2.6 1.74 1.14.54.54.89 1.09 1.14 1.74.25.63.42 1.35.47 2.4C21.99 8.87 22 9.2 22 12s0 3.13-.06 4.19c-.05 1.05-.22 1.77-.47 2.4-.25.65-.6 1.2-1.14 1.74-.54.54-1.09.89-1.74 1.14-.63.25-1.35.42-2.4.47-1.06.05-1.39.06-4.19.06s-3.13 0-4.19-.06c-1.05-.05-1.77-.22-2.4-.47a4.8 4.8 0 01-1.74-1.14 4.8 4.8 0 01-1.14-1.74c-.25-.63-.42-1.35-.47-2.4C2.01 15.13 2 14.8 2 12s0-3.13.06-4.19c.05-1.05.22-1.77.47-2.4.25-.65.6-1.2 1.14-1.74A4.8 4.8 0 015.41 2.53c.63-.25 1.35-.42 2.4-.47C8.87 2.01 9.2 2 12 2zm0 1.8c-2.65 0-2.96.01-4 .06-.9.04-1.38.19-1.7.32-.43.16-.73.36-1.05.68-.32.32-.52.62-.68 1.05-.13.32-.28.8-.32 1.7-.05 1.04-.06 1.35-.06 4s.01 2.96.06 4c.04.9.19 1.38.32 1.7.16.43.36.73.68 1.05.32.32.62.52 1.05.68.32.13.8.28 1.7.32 1.04.05 1.35.06 4 .06s2.96-.01 4-.06c.9-.04 1.38-.19 1.7-.32.43-.16.73-.36 1.05-.68.32-.32.52-.62.68-1.05.13-.32.28-.8.32-1.7.05-1.04.06-1.35.06-4s-.01-2.96-.06-4c-.04-.9-.19-1.38-.32-1.7a2.8 2.8 0 00-.68-1.05 2.8 2.8 0 00-1.05-.68c-.32-.13-.8-.28-1.7-.32-1.04-.05-1.35-.06-4-.06zm0 3.4a4.8 4.8 0 110 9.6 4.8 4.8 0 010-9.6zm0 1.8a3 3 0 100 6 3 3 0 000-6zm4.95-2.05a1.12 1.12 0 110 2.25 1.12 1.12 0 010-2.25z" />
  </Icon>
);

const LinkIcon = (
  <Icon>
    <path d="M10.6 13.4a1 1 0 001.4 0l4-4a2.5 2.5 0 10-3.5-3.5l-1 1a1 1 0 001.4 1.4l1-1a.5.5 0 11.7.7l-4 4a1 1 0 000 1.4zm2.8-2.8a1 1 0 00-1.4 0l-4 4a2.5 2.5 0 103.5 3.5l1-1a1 1 0 10-1.4-1.4l-1 1a.5.5 0 11-.7-.7l4-4a1 1 0 000-1.4z" />
  </Icon>
);

const CheckIcon = (
  <Icon>
    <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" />
  </Icon>
);

export function ShareBar({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const targets = url ? buildShareTargets(url, title) : [];

  async function copyLink() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  async function nativeShare() {
    if (!url) return;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else await copyLink();
    } catch {
      /* user dismissed the share sheet — no-op */
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 border-y border-border py-3"
      role="group"
      aria-label="Share this article"
    >
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Share
      </span>

      {targets.map((tgt) => (
        <a
          key={tgt.key}
          href={tgt.href}
          {...(tgt.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label={tgt.label}
          title={tgt.label}
          className={btn}
        >
          {ICONS[tgt.key]}
        </a>
      ))}

      {/* Instagram: no web link-share — use the native share sheet (Instagram
          appears there on mobile), or copy the link on desktop. */}
      <button
        type="button"
        onClick={nativeShare}
        aria-label="Share on Instagram or more apps"
        title="Instagram & more"
        className={btn}
      >
        {InstagramIcon}
      </button>

      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
        className={cn(btn, copied && "border-brand text-brand")}
      >
        {copied ? CheckIcon : LinkIcon}
      </button>

      {canNativeShare && (
        <button
          type="button"
          onClick={nativeShare}
          aria-label="More sharing options"
          title="More options"
          className="ml-1 text-sm font-medium text-brand hover:underline"
        >
          More…
        </button>
      )}
    </div>
  );
}
