"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, fieldBase } from "@/components/ui/Input";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/utils/cn";
import { track } from "@/lib/analytics";
import {
  submitIndustryProblem,
  PROBLEM_SUBMISSIONS_ENABLED,
} from "@/lib/wordpress/submit-problem";
import {
  EMPTY_FORM,
  validateProblemForm,
  FIELD_ORDER,
  ROLE_OPTIONS,
  CATEGORY_OPTIONS,
  LOCATION_OPTIONS,
  AFFECTED_OPTIONS,
  IMPACT_OPTIONS,
  TITLE_MAX,
  STATEMENT_MIN,
  STATEMENT_MAX,
  CONTEXT_MAX,
  type ProblemFormValues,
  type FormErrors,
} from "./problem-form";

type Status = "idle" | "submitting" | "success" | "error" | "rate_limited" | "unavailable";

const toOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));
const LABELS: Partial<Record<keyof ProblemFormValues, string>> = {
  fullName: "Full name",
  email: "Work email",
  problemTitle: "Problem title",
  problemStatement: "Problem statement",
  category: "Industry category",
  customCategory: "Category (specify)",
  referenceUrl: "Public reference URL",
  contactConsent: "Consent",
};

function SectionHeading({ step, title, desc }: { step: number; title: string; desc?: string }) {
  return (
    <div className="space-y-1 border-b border-border pb-3">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-semibold text-brand">{step}</span>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
    </div>
  );
}

function Counter({ len, max, min }: { len: number; max: number; min?: number }) {
  const over = len > max;
  const under = min !== undefined && len > 0 && len < min;
  return (
    <span className={cn("tabular-nums", over ? "text-danger" : under ? "text-muted-foreground" : "text-muted-foreground")}>
      {len}/{max}
    </span>
  );
}

export function IndustryProblemForm() {
  const [v, setV] = useState<ProblemFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [showSummary, setShowSummary] = useState(false);

  const set = <K extends keyof ProblemFormValues>(key: K, value: ProblemFormValues[K]) => {
    setV((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleAffected = (opt: string) => {
    setV((prev) => ({
      ...prev,
      affectedParticipants: prev.affectedParticipants.includes(opt)
        ? prev.affectedParticipants.filter((x) => x !== opt)
        : [...prev.affectedParticipants, opt],
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return; // guard against double-submit

    const found = validateProblemForm(v);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setShowSummary(true);
      const first = FIELD_ORDER.find((f) => found[f]);
      if (first) {
        requestAnimationFrame(() => document.getElementById(`ipf-${first}`)?.focus());
      }
      return;
    }

    setErrors({});
    setShowSummary(false);

    if (!PROBLEM_SUBMISSIONS_ENABLED) {
      setStatus("unavailable");
      return;
    }

    setStatus("submitting");
    track("directory_clicked", { entry: "industry-problem", type: "submission" });
    const trimmed: ProblemFormValues = {
      ...v,
      fullName: v.fullName.trim(),
      email: v.email.trim(),
      organization: v.organization?.trim() || undefined,
      problemTitle: v.problemTitle.trim(),
      problemStatement: v.problemStatement.trim(),
      customCategory: v.customCategory?.trim() || undefined,
      locationDetail: v.locationDetail?.trim() || undefined,
      supportingContext: v.supportingContext?.trim() || undefined,
      referenceUrl: v.referenceUrl?.trim() || undefined,
    };
    const result = await submitIndustryProblem(trimmed);
    if (result === "submitted") setStatus("success");
    else if (result === "rate_limited") setStatus("rate_limited");
    else if (result === "invalid") {
      // Server rejected — re-run local validation to surface fields, else generic.
      setStatus("error");
    } else setStatus("error");
  };

  // ---- Confirmation state ----
  if (status === "success") {
    return (
      <div className="max-w-2xl rounded-2xl border border-success/30 bg-success/5 p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Thank you for contributing to Semitree.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your industry problem has been submitted successfully. Our team will review it and may
          contact you if we need more information. Submission does not guarantee publication or
          inclusion in the tracked opportunities database.
        </p>
        <div className="mt-5">
          <ButtonLink href="/opportunities" variant="primary">Explore tracked opportunities</ButtonLink>
        </div>
      </div>
    );
  }

  const summaryFields = FIELD_ORDER.filter((f) => errors[f]);

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-10">
      {/* Error summary */}
      {showSummary && summaryFields.length > 0 && (
        <Alert variant="danger" title="Please fix the following before submitting">
          <ul className="ml-4 list-disc space-y-1">
            {summaryFields.map((f) => (
              <li key={f}>
                <a href={`#ipf-${f}`} className="font-medium underline hover:no-underline">
                  {LABELS[f] ?? f}
                </a>
                : {errors[f]}
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Submission failure states (never a fake success) */}
      {status === "error" && (
        <Alert variant="danger" title="Your submission didn't go through">
          Something went wrong reaching our servers. Your answers are still here — please try again
          in a moment. If it keeps failing, email us via the newsletter page.
        </Alert>
      )}
      {status === "rate_limited" && (
        <Alert variant="warning" title="Too many submissions">
          You&apos;ve submitted a few times in quick succession. Please wait a minute and try again.
        </Alert>
      )}
      {status === "unavailable" && (
        <Alert variant="info" title="Online submission is being connected">
          Your details validated correctly, but the submission channel isn&apos;t live yet. Please
          check back shortly, or{" "}
          <Link href="/newsletter" className="font-medium text-brand underline hover:no-underline">get notified</Link>{" "}
          when it opens. We never record a submission we can&apos;t securely store.
        </Alert>
      )}

      {/* ---- Section A: Your details ---- */}
      <section className="space-y-5">
        <SectionHeading step={1} title="Your details" desc="So we can understand the source and follow up if needed." />
        <Input
          id="ipf-fullName"
          label="Full name"
          required
          placeholder="Enter your full name"
          autoComplete="name"
          value={v.fullName}
          error={errors.fullName}
          onChange={(e) => set("fullName", e.target.value)}
        />
        <Input
          id="ipf-email"
          type="email"
          inputMode="email"
          label="Work email"
          required
          placeholder="you@company.com"
          autoComplete="email"
          help="We may use this only to contact you for clarification. Independent researchers, students, and individuals are welcome — a company-domain email is not required."
          value={v.email}
          error={errors.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <Input
          id="ipf-organization"
          label="Organization"
          placeholder="Company, startup, university, or organization"
          autoComplete="organization"
          value={v.organization ?? ""}
          onChange={(e) => set("organization", e.target.value)}
        />
        <Select
          id="ipf-role"
          label="Your role"
          placeholder="Select a role (optional)"
          options={toOptions(ROLE_OPTIONS)}
          value={v.role ?? ""}
          onChange={(e) => set("role", e.target.value)}
        />
      </section>

      {/* ---- Section B: Describe the problem ---- */}
      <section className="space-y-5">
        <SectionHeading step={2} title="Describe the problem" />

        <div>
          <Input
            id="ipf-problemTitle"
            label="Problem title"
            required
            maxLength={TITLE_MAX}
            placeholder="Briefly describe the problem"
            value={v.problemTitle}
            error={errors.problemTitle}
            onChange={(e) => set("problemTitle", e.target.value)}
          />
          <p className="mt-1 text-right text-xs"><Counter len={v.problemTitle.length} max={TITLE_MAX} /></p>
        </div>

        <div>
          <Field
            id="ipf-problemStatement"
            label="Problem statement"
            required
            error={errors.problemStatement}
            help="Be specific and practical — a concrete bottleneck is far more useful than a general opinion."
          >
            {(aria) => (
              <textarea
                {...aria}
                required
                maxLength={STATEMENT_MAX}
                rows={6}
                placeholder="Describe the problem you have encountered. What is difficult, unavailable, expensive, inefficient, unreliable, or underserved?"
                className={cn(fieldBase, "w-full")}
                value={v.problemStatement}
                onChange={(e) => set("problemStatement", e.target.value)}
              />
            )}
          </Field>
          <p className="mt-1 text-right text-xs"><Counter len={v.problemStatement.length} max={STATEMENT_MAX} min={STATEMENT_MIN} /></p>
        </div>

        <Select
          id="ipf-category"
          label="Which category does this problem belong to?"
          required
          placeholder="Select a category"
          options={toOptions(CATEGORY_OPTIONS)}
          value={v.category}
          error={errors.category}
          onChange={(e) => set("category", e.target.value)}
        />
        {v.category === "Other" && (
          <Input
            id="ipf-customCategory"
            label="Please specify the category"
            required
            placeholder="Describe the category"
            value={v.customCategory ?? ""}
            error={errors.customCategory}
            onChange={(e) => set("customCategory", e.target.value)}
          />
        )}
      </section>

      {/* ---- Section C: Industry context ---- */}
      <section className="space-y-5">
        <SectionHeading step={3} title="Industry context" desc="Optional, but it helps us understand and verify the problem." />

        <Select
          id="ipf-locationScope"
          label="Where are you experiencing this problem?"
          placeholder="Select a scope (optional)"
          options={toOptions(LOCATION_OPTIONS)}
          value={v.locationScope ?? ""}
          onChange={(e) => set("locationScope", e.target.value)}
        />
        {(v.locationScope === "India" || v.locationScope === "Outside India") && (
          <Input
            id="ipf-locationDetail"
            label={v.locationScope === "India" ? "State or city (optional)" : "Country or region (optional)"}
            placeholder={v.locationScope === "India" ? "e.g. Gujarat, Bengaluru" : "e.g. Taiwan, EU"}
            value={v.locationDetail ?? ""}
            onChange={(e) => set("locationDetail", e.target.value)}
          />
        )}

        <fieldset className="space-y-2">
          <legend className="block text-sm font-medium text-foreground">Who is affected by the problem?</legend>
          <p className="text-xs text-muted-foreground">Select all that apply (optional).</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {AFFECTED_OPTIONS.map((opt) => {
              const checked = v.affectedParticipants.includes(opt);
              return (
                <label key={opt} className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm transition-colors hover:border-brand/40">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    checked={checked}
                    onChange={() => toggleAffected(opt)}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <Select
          id="ipf-impactType"
          label="How significant is the problem?"
          placeholder="Select an impact (optional)"
          options={toOptions(IMPACT_OPTIONS)}
          help="Your assessment helps us prioritise; it isn't independently verified."
          value={v.impactType ?? ""}
          onChange={(e) => set("impactType", e.target.value)}
        />

        <div>
          <Field
            id="ipf-supportingContext"
            label="Supporting context or evidence"
            error={errors.supportingContext}
            help="Do not include confidential company information, trade secrets, personal data about third parties, or sensitive technical details."
          >
            {(aria) => (
              <textarea
                {...aria}
                maxLength={CONTEXT_MAX}
                rows={4}
                placeholder="Share an example, observed impact, frequency, workaround, public reference, or other context that helps explain the problem."
                className={cn(fieldBase, "w-full")}
                value={v.supportingContext ?? ""}
                onChange={(e) => set("supportingContext", e.target.value)}
              />
            )}
          </Field>
          <p className="mt-1 text-right text-xs"><Counter len={(v.supportingContext ?? "").length} max={CONTEXT_MAX} /></p>
        </div>

        <Input
          id="ipf-referenceUrl"
          type="url"
          inputMode="url"
          label="Public reference URL"
          placeholder="https://..."
          help="Optional — a public article, report, or documentation that helps contextualise the problem. Not required for problems based on your own professional experience."
          value={v.referenceUrl ?? ""}
          error={errors.referenceUrl}
          onChange={(e) => set("referenceUrl", e.target.value)}
        />
      </section>

      {/* ---- Section D: Review & submit ---- */}
      <section className="space-y-4">
        <SectionHeading step={4} title="Review & submit" />

        <div className="space-y-3">
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              id="ipf-contactConsent"
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-input text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:ring-danger/40"
              aria-invalid={Boolean(errors.contactConsent)}
              aria-describedby={errors.contactConsent ? "ipf-contactConsent-error" : undefined}
              checked={v.contactConsent}
              onChange={(e) => set("contactConsent", e.target.checked)}
            />
            <span>
              I agree that Semitree may store and review this submission and contact me at the email
              address provided for clarification. I have not included confidential or sensitive
              information. <span className="text-danger" aria-hidden="true">*</span>
            </span>
          </label>
          {errors.contactConsent && (
            <p id="ipf-contactConsent-error" role="alert" className="text-xs font-medium text-danger">{errors.contactConsent}</p>
          )}

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-input text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              checked={v.publicationContactConsent}
              onChange={(e) => set("publicationContactConsent", e.target.checked)}
            />
            <span>
              I am open to Semitree contacting me about publishing an anonymized summary of this
              problem. <span className="text-muted-foreground">(This is permission to discuss publication — not to publish your name, email, organization, or full submission.)</span>
            </span>
          </label>
        </div>

        <p className="text-xs text-muted-foreground">
          Submissions are reviewed by the Semitree team. Submitting does not guarantee publication or
          inclusion in the tracked opportunities database, and nothing you submit is published
          automatically.
        </p>

        <div>
          <Button type="submit" variant="primary" disabled={status === "submitting"} aria-busy={status === "submitting"}>
            {status === "submitting" ? "Submitting…" : "Submit Industry Problem"}
          </Button>
        </div>
      </section>
    </form>
  );
}
