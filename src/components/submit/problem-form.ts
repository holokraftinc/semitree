/**
 * Options, limits, and pure validation for the industry-problem form.
 * Pure (no React) so it can be unit-tested and mirrored server-side.
 */
import type { IndustryProblemPayload } from "@/lib/wordpress/submit-problem";

export const TITLE_MAX = 120;
export const STATEMENT_MIN = 30;
export const STATEMENT_MAX = 2000;
export const CONTEXT_MAX = 2000;

export const ROLE_OPTIONS = [
  "Founder / Entrepreneur",
  "Engineering / Technical",
  "Manufacturing / Operations",
  "Procurement / Supply Chain",
  "Research / Academia",
  "Design / EDA / IP",
  "Equipment / Materials",
  "Packaging / Testing",
  "Business / Strategy / Investment",
  "Student",
  "Consultant",
  "Other",
  "Prefer not to say",
];

export const CATEGORY_OPTIONS = [
  "Semiconductor Design / Fabless",
  "EDA Tools / Semiconductor IP",
  "Wafer Fabrication / Fabs",
  "Semiconductor Equipment",
  "Semiconductor Materials / Chemicals / Gases",
  "Lithography",
  "Etching / Deposition",
  "Process Control / Metrology / Inspection",
  "Packaging / OSAT / ATMP",
  "Semiconductor Testing",
  "Substrates / Wafers",
  "Cleanroom / Facility Infrastructure",
  "Water / Power / Utilities",
  "Automation / Robotics",
  "Procurement / Supplier Discovery",
  "Supply Chain / Logistics",
  "Quality / Reliability / Yield",
  "Manufacturing Software / Data / AI",
  "Talent / Skills / Training",
  "Research / Laboratory Infrastructure",
  "Government / Policy / Compliance",
  "Electronics / Semiconductor Applications",
  "Other",
  "Not sure",
];

export const LOCATION_OPTIONS = [
  "India",
  "Outside India",
  "Across multiple regions",
  "Not location-specific",
];

export const AFFECTED_OPTIONS = [
  "Semiconductor startups",
  "Fabless / chip design companies",
  "Fabs",
  "OSAT / ATMP companies",
  "Equipment manufacturers",
  "Materials suppliers",
  "Component suppliers",
  "Electronics manufacturers",
  "Research institutions / universities",
  "Procurement teams",
  "Manufacturing teams",
  "Investors",
  "Other",
  "Not sure",
];

export const IMPACT_OPTIONS = [
  "Blocks an important activity",
  "Causes recurring delays",
  "Increases cost",
  "Affects quality or reliability",
  "Limits access to a capability or supplier",
  "Creates a safety, compliance, or operational concern",
  "Other / not sure",
];

export type ProblemFormValues = IndustryProblemPayload;

export const EMPTY_FORM: ProblemFormValues = {
  fullName: "",
  email: "",
  organization: "",
  role: "",
  problemTitle: "",
  problemStatement: "",
  category: "",
  customCategory: "",
  locationScope: "",
  locationDetail: "",
  affectedParticipants: [],
  impactType: "",
  supportingContext: "",
  referenceUrl: "",
  contactConsent: false,
  publicationContactConsent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Lenient http(s) URL check. */
export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export type FormErrors = Partial<Record<keyof ProblemFormValues, string>>;

/** Field order for focusing the first invalid field. */
export const FIELD_ORDER: (keyof ProblemFormValues)[] = [
  "fullName",
  "email",
  "problemTitle",
  "problemStatement",
  "category",
  "customCategory",
  "referenceUrl",
  "contactConsent",
];

/** Validate the form. Returns a map of field → error message (empty = valid). */
export function validateProblemForm(v: ProblemFormValues): FormErrors {
  const e: FormErrors = {};

  if (!v.fullName.trim()) e.fullName = "Please enter your full name.";

  if (!v.email.trim()) e.email = "Please enter your work email.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address, e.g. you@company.com.";

  if (!v.problemTitle.trim()) e.problemTitle = "Please add a short problem title.";
  else if (v.problemTitle.length > TITLE_MAX) e.problemTitle = `Keep the title under ${TITLE_MAX} characters.`;

  const stmt = v.problemStatement.trim();
  if (!stmt) e.problemStatement = "Please describe the problem.";
  else if (stmt.length < STATEMENT_MIN) e.problemStatement = `Please add a little more detail (at least ${STATEMENT_MIN} characters).`;
  else if (v.problemStatement.length > STATEMENT_MAX) e.problemStatement = `Keep the description under ${STATEMENT_MAX} characters.`;

  if (!v.category) e.category = "Please choose a category.";
  if (v.category === "Other" && !v.customCategory?.trim()) e.customCategory = "Please specify the category.";

  if (v.supportingContext && v.supportingContext.length > CONTEXT_MAX)
    e.supportingContext = `Keep the context under ${CONTEXT_MAX} characters.`;

  if (v.referenceUrl?.trim() && !isValidUrl(v.referenceUrl.trim()))
    e.referenceUrl = "Enter a valid URL starting with http:// or https://";

  if (!v.contactConsent) e.contactConsent = "Please agree so we can review and follow up on your submission.";

  return e;
}
