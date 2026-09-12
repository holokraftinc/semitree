"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { subscribe } from "@/lib/wordpress/subscribe";

type Status = "idle" | "loading" | "success" | "already" | "invalid" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter signup. Posts to the Semitree CMS subscribe endpoint and shows
 * success / already-subscribed / validation / error states. If the CMS is
 * unreachable, it degrades to a friendly error — it never crashes the page.
 */
export function NewsletterSignup() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    track("newsletter_clicked", {});
    const result = await subscribe(email.trim());
    if (result === "subscribed") setStatus("success");
    else if (result === "already") setStatus("already");
    else if (result === "invalid") setStatus("invalid");
    else setStatus("error");
  };

  const done = status === "success" || status === "already";

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="rounded-2xl border border-border bg-brand/5 p-6 sm:p-10"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 id="newsletter-heading" className="text-2xl font-semibold tracking-tight">
          Get Semitree in your inbox
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Semiconductor insights, research, and industry updates.
        </p>

        {done ? (
          <p
            role="status"
            className="mx-auto mt-6 max-w-sm rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm text-foreground"
          >
            {status === "success"
              ? "Thanks — you’re subscribed!"
              : "You’re already on the list — thanks for your interest!"}
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1 text-left">
              <label htmlFor={id} className="sr-only">
                Email address
              </label>
              <input
                id={id}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "invalid" || status === "error") setStatus("idle");
                }}
                disabled={status === "loading"}
                aria-invalid={status === "invalid"}
                aria-describedby={status === "invalid" || status === "error" ? `${id}-msg` : undefined}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-danger disabled:opacity-60"
              />
              {status === "invalid" && (
                <p id={`${id}-msg`} role="alert" className="mt-1 text-xs font-medium text-danger">
                  Please enter a valid email address.
                </p>
              )}
              {status === "error" && (
                <p id={`${id}-msg`} role="alert" className="mt-1 text-xs font-medium text-danger">
                  Something went wrong. Please try again in a moment.
                </p>
              )}
            </div>
            <Button type="submit" size="lg" className="sm:h-11" disabled={status === "loading"}>
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
