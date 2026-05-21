/**
 * Single source of truth for blog editorial categories (CMS, validation, static seed copy).
 * Marketing filters prepend `"All"` — see `blogCategories`.
 */
export const blogEditorialCategories = [
  "Buying Guide",
  "Maintenance",
  "Energy",
  "Troubleshooting",
] as const;

export type BlogEditorialCategory = (typeof blogEditorialCategories)[number];

/** Public blog index filter labels — includes `"All"`. */
export const blogCategories = ["All", ...blogEditorialCategories] as const;
