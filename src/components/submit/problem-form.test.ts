import { describe, expect, it } from "vitest";
import {
  validateProblemForm,
  isValidUrl,
  EMPTY_FORM,
  TITLE_MAX,
  STATEMENT_MIN,
  type ProblemFormValues,
} from "./problem-form";

const valid: ProblemFormValues = {
  ...EMPTY_FORM,
  fullName: "Asha Rao",
  email: "asha@example.com",
  problemTitle: "No local probe-card supplier",
  problemStatement:
    "Sourcing probe cards locally in India is slow and expensive; everything is imported with long lead times.",
  category: "Semiconductor Testing",
  contactConsent: true,
};

describe("validateProblemForm", () => {
  it("passes a complete valid submission", () => {
    expect(validateProblemForm(valid)).toEqual({});
  });

  it("requires name", () => {
    expect(validateProblemForm({ ...valid, fullName: "  " }).fullName).toBeTruthy();
  });

  it("requires a valid email", () => {
    expect(validateProblemForm({ ...valid, email: "" }).email).toBeTruthy();
    expect(validateProblemForm({ ...valid, email: "not-an-email" }).email).toBeTruthy();
  });

  it("requires a problem title within the limit", () => {
    expect(validateProblemForm({ ...valid, problemTitle: "" }).problemTitle).toBeTruthy();
    expect(validateProblemForm({ ...valid, problemTitle: "x".repeat(TITLE_MAX + 1) }).problemTitle).toBeTruthy();
  });

  it("requires a problem statement of a sensible minimum length", () => {
    expect(validateProblemForm({ ...valid, problemStatement: "" }).problemStatement).toBeTruthy();
    expect(validateProblemForm({ ...valid, problemStatement: "too short" }).problemStatement).toBeTruthy();
    expect(("too short").length).toBeLessThan(STATEMENT_MIN);
  });

  it("requires a category", () => {
    expect(validateProblemForm({ ...valid, category: "" }).category).toBeTruthy();
  });

  it("requires a custom category only when Other is chosen", () => {
    expect(validateProblemForm({ ...valid, category: "Other" }).customCategory).toBeTruthy();
    expect(validateProblemForm({ ...valid, category: "Other", customCategory: "Cryogenics" }).customCategory).toBeUndefined();
    // "Not sure" needs no custom category
    expect(validateProblemForm({ ...valid, category: "Not sure" }).category).toBeUndefined();
  });

  it("rejects an invalid reference URL but allows a valid one or none", () => {
    expect(validateProblemForm({ ...valid, referenceUrl: "ftp://x" }).referenceUrl).toBeTruthy();
    expect(validateProblemForm({ ...valid, referenceUrl: "https://example.com/report" }).referenceUrl).toBeUndefined();
    expect(validateProblemForm({ ...valid, referenceUrl: "" }).referenceUrl).toBeUndefined();
  });

  it("requires the contact-consent checkbox", () => {
    expect(validateProblemForm({ ...valid, contactConsent: false }).contactConsent).toBeTruthy();
  });
});

describe("isValidUrl", () => {
  it("accepts http/https only", () => {
    expect(isValidUrl("https://a.com")).toBe(true);
    expect(isValidUrl("http://a.com")).toBe(true);
    expect(isValidUrl("ftp://a.com")).toBe(false);
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("not a url")).toBe(false);
  });
});
