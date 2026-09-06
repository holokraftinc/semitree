/**
 * Knowledge registry — one KnowledgeBase per domain, accessed generically.
 * The UI never hardcodes a domain; it asks the registry for a domain's data.
 */
import type {
  Category,
  KnowledgeBase,
  KnowledgeDomainId,
  Subcategory,
} from "./types";
import { SEMICONDUCTORS } from "./semiconductors";
import { MICROFLUIDICS } from "./microfluidics";

export const KNOWLEDGE: Record<KnowledgeDomainId, KnowledgeBase> = {
  semiconductors: SEMICONDUCTORS,
  microfluidics: MICROFLUIDICS,
};

export function getKnowledge(domainId: KnowledgeDomainId): KnowledgeBase {
  return KNOWLEDGE[domainId];
}

export function getCategories(domainId: KnowledgeDomainId): Category[] {
  return [...getKnowledge(domainId).categories].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
}

export function getCategory(
  domainId: KnowledgeDomainId,
  slug: string,
): Category | undefined {
  return getKnowledge(domainId).categories.find((c) => c.slug === slug);
}

export function subcategoriesOf(
  domainId: KnowledgeDomainId,
  categorySlug: string,
): Subcategory[] {
  return getKnowledge(domainId)
    .subcategories.filter((s) => s.categorySlug === categorySlug)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
