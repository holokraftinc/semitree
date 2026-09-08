"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { unsubscribe, type UnsubscribeResult } from "@/lib/wordpress/subscribe";

type State = "working" | "missing" | UnsubscribeResult;

/** Handles a one-click unsubscribe link (?token=…) from a newsletter. */
export function UnsubscribeClient() {
  const token = useSearchParams().get("token");
  const [state, setState] = useState<State>("working");

  useEffect(() => {
    if (!token) {
      setState("missing");
      return;
    }
    let active = true;
    unsubscribe(token).then((r) => active && setState(r));
    return () => {
      active = false;
    };
  }, [token]);

  const message: Record<State, { title: string; body: string }> = {
    working: { title: "Processing…", body: "One moment while we update your preferences." },
    missing: { title: "Invalid link", body: "This unsubscribe link is missing its token." },
    invalid: { title: "Invalid link", body: "This unsubscribe link isn’t valid." },
    not_found: { title: "Already updated", body: "We couldn’t find an active subscription for this link — you may already be unsubscribed." },
    unsubscribed: { title: "You’re unsubscribed", body: "You won’t receive further Semitree emails. You can resubscribe anytime." },
    error: { title: "Something went wrong", body: "Please try again in a moment." },
  };

  const m = message[state];

  return (
    <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-card">
      <h1 className="text-xl font-semibold tracking-tight">{m.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{m.body}</p>
      <Link href="/" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
        Back to Semitree →
      </Link>
    </div>
  );
}
