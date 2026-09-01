"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

/**
 * Newsletter signup. Phase 02 is UI-only: it validates the email client-side and
 * shows a confirmation. No data is sent anywhere yet — the email-service
 * integration lands in a later phase.
 */
export function NewsletterSignup() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track("newsletter_clicked", {});
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setStatus(valid ? "done" : "error");
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="rounded-2xl border border-border bg-brand/5 p-6 sm:p-10"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2
          id="newsletter-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          The weekly microfluidics roundup
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Papers, products, jobs, and one featured tool or lesson — once a week.
        </p>

        {status === "done" ? (
          <p
            role="status"
            className="mx-auto mt-6 max-w-sm rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm text-foreground"
          >
            Thanks — you&rsquo;re on the list. (Preview only; delivery is wired
            up in a later phase.)
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
                placeholder="you@lab.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? `${id}-error` : undefined}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-danger"
              />
              {status === "error" && (
                <p
                  id={`${id}-error`}
                  role="alert"
                  className="mt-1 text-xs font-medium text-danger"
                >
                  Please enter a valid email address.
                </p>
              )}
            </div>
            <Button type="submit" size="lg" className="sm:h-11">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
