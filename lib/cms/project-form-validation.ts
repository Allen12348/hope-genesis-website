import { slugifyTitle } from "@/lib/cms/slug";

export type ProjectFormField =
  | "slug"
  | "title"
  | "year"
  | "location"
  | "summary"
  | "scope"
  | "image"
  | "imageAlt";

export type ProjectFormErrors = Partial<Record<ProjectFormField, string>>;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const YEAR_RE = /^\d{4}$/;
const currentYear = new Date().getFullYear();

export function validateProjectForm(input: {
  slug: string;
  title: string;
  year: string;
  location: string;
  summary: string;
  scope: string;
  image: string;
  imageAlt: string;
}): ProjectFormErrors {
  const errors: ProjectFormErrors = {};
  const title = input.title.trim();
  const slug = input.slug.trim();
  const year = input.year.trim();
  const location = input.location.trim();
  const summary = input.summary.trim();
  const scopeLines = input.scope
    .split("\n")
    .map((l) => l.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);
  const image = input.image.trim();
  const imageAlt = input.imageAlt.trim();

  if (!title) errors.title = "Title is required";
  if (!slug) errors.slug = "Slug is required";
  else if (!SLUG_RE.test(slug)) errors.slug = "Use lowercase letters, numbers, and hyphens only";
  if (!year) errors.year = "Year is required";
  else if (!YEAR_RE.test(year)) errors.year = "Enter a 4-digit year";
  else {
    const y = Number(year);
    if (y < 1990 || y > currentYear + 1) {
      errors.year = `Year must be between 1990 and ${currentYear + 1}`;
    }
  }
  if (!location) errors.location = "Location is required";
  if (!summary) errors.summary = "Summary is required";
  else if (summary.length < 10) errors.summary = "Summary should be at least 10 characters";
  if (scopeLines.length === 0) errors.scope = "Add at least one scope item";
  if (!image) errors.image = "Fallback cover image is required";
  if (!imageAlt) errors.imageAlt = "Cover image alt text is required";
  else if (imageAlt.length < 2) errors.imageAlt = "Alt text should describe the cover image";

  return errors;
}

export { slugifyTitle };
