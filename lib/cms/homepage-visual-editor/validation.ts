import { z } from "zod";
import type { HomepageEditorState } from "@/lib/cms/homepage-visual-editor/types";
import { HOMEPAGE_SECTION_BLOCKS } from "@/lib/cms/homepage-visual-editor/registry";

const urlSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), {
    message: "URL must be a path (/contact) or http(s) link",
  });

const imageUrlSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), {
    message: "Image URL must be a path or http(s) link",
  });

const shellSchema = z.object({
  eyebrow: z.string().max(120),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000),
});

const heroStatSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1, "Stat label is required").max(80),
  value: z.number().finite(),
  suffix: z.string().max(12).optional(),
  sortOrder: z.number().int(),
  visible: z.boolean(),
});

const heroSchema = z.object({
  eyebrowBrand: z.string().max(120),
  eyebrowRegion: z.string().max(120),
  titleLine1: z.string().min(1, "Headline is required").max(200),
  titleAccent: z.string().max(40),
  titleLine2: z.string().max(200),
  subtitle: z.string().min(1, "Subtitle is required").max(600),
  heroPrimaryButtonLabel: z.string().max(80).optional(),
  heroPrimaryButtonUrl: urlSchema.optional(),
  heroSecondaryButtonLabel: z.string().max(80).optional(),
  heroSecondaryButtonUrl: urlSchema.optional(),
  heroBackgroundImageUrl: imageUrlSchema.optional(),
  heroOverlayOpacity: z.number().min(0).max(1).optional(),
  stats: z.array(heroStatSchema),
});

const homeSchema = z.object({
  v: z.literal(1),
  hero: heroSchema,
  customerPlatform: shellSchema,
  contactCta: shellSchema,
  aboutPreview: shellSchema.extend({
    ctaHref: urlSchema,
    imageUrl: imageUrlSchema,
  }),
  homeSectionShells: z.object({
    servicesPreview: shellSchema,
    heroServices: shellSchema,
    coverage: shellSchema,
    lifecycle: shellSchema,
    people: shellSchema,
    projectsPreview: shellSchema,
    testimonialsPreview: shellSchema,
    brandsPreview: shellSchema,
    businessTrust: shellSchema,
    beforeAfter: shellSchema,
    instantEstimate: shellSchema,
  }),
});

const visibilitySchema = z.record(z.boolean());

const orderSchema = z.array(z.string()).refine(
  (arr) => new Set(arr).size === arr.length,
  { message: "Duplicate section IDs in order" },
);

export type HomepageValidationResult =
  | { ok: true }
  | { ok: false; errors: { path: string; message: string }[] };

export function validateHomepageForPublish(state: HomepageEditorState): HomepageValidationResult {
  const errors: { path: string; message: string }[] = [];

  const homeResult = homeSchema.safeParse(state.home);
  if (!homeResult.success) {
    for (const issue of homeResult.error.issues) {
      errors.push({ path: issue.path.join("."), message: issue.message });
    }
  }

  const orderResult = orderSchema.safeParse(state.order);
  if (!orderResult.success) {
    errors.push({ path: "order", message: orderResult.error.issues[0]?.message ?? "Invalid section order" });
  }

  visibilitySchema.safeParse(state.visibility);

  // Required sections must remain in order
  for (const block of HOMEPAGE_SECTION_BLOCKS) {
    if (block.required && block.id !== "hero" && !state.order.includes(block.id as never)) {
      errors.push({ path: `order.${block.id}`, message: `${block.label} is required on the homepage` });
    }
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

export function validateHomepageForDraft(state: HomepageEditorState): HomepageValidationResult {
  // Draft allows partial hero but still blocks completely broken JSON
  try {
    JSON.stringify(state);
  } catch {
    return { ok: false, errors: [{ path: "root", message: "Content could not be serialized" }] };
  }
  return { ok: true };
}
