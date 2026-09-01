/**
 * Tiny className combiner. Joins truthy class fragments with spaces.
 *
 * Deliberately dependency-free (no clsx / tailwind-merge) — Semitree's usage is
 * controlled, so a later duplicate-utility "merge" is not needed. Keep call
 * sites from passing conflicting Tailwind classes for the same property.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
