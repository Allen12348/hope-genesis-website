import { z } from "zod";
import {
  certificationsPropsSchema,
  contactCtaPropsSchema,
  contactFormPropsSchema,
  contactInfoPropsSchema,
  dividerPropsSchema,
  estimateCtaPropsSchema,
  footerColumnsPropsSchema,
  imagePropsSchema,
  navigationMenuPropsSchema,
  richTextPropsSchema,
  seoMetaPropsSchema,
  serviceCardPropsSchema,
  spacerPropsSchema,
  teamPropsSchema,
  timelinePropsSchema,
  twoColumnPropsSchema,
} from "@/lib/cms/page-builder/schema-extra";
import { buttonSchema, flexibleMediaUrlSchema, hrefSchema } from "@/lib/cms/page-builder/schema-shared";

export { buttonSchema, flexibleMediaUrlSchema, hrefSchema } from "@/lib/cms/page-builder/schema-shared";

export const BUILDER_BLOCK_TYPES = [
  "hero",
  "text",
  "richText",
  "image",
  "imageText",
  "twoColumn",
  "servicesGrid",
  "serviceCard",
  "galleryGrid",
  "projectsGrid",
  "testimonials",
  "brandsCarousel",
  "contactInfo",
  "contactForm",
  "map",
  "cta",
  "estimateCTA",
  "contactCTA",
  "faq",
  "buttonGroup",
  "stats",
  "timeline",
  "team",
  "certifications",
  "footerColumns",
  "navigationMenu",
  "seoMeta",
  "spacer",
  "divider",
  "contact",
  "blogFeed",
] as const;

export type BuilderBlockType = (typeof BUILDER_BLOCK_TYPES)[number];

const textAlign = z.enum(["left", "center", "right"]).default("left");
const sectionSpacing = z.enum(["compact", "normal", "relaxed"]).default("normal");

const layoutFields = {
  textAlign,
  sectionSpacing,
  backgroundColor: z.string().max(120).optional().default(""),
};

const shellSchema = z.object({
  eyebrow: z.string().max(200).optional().default(""),
  title: z.string().max(240).optional().default(""),
  description: z.string().max(2000).optional().default(""),
});

const heroPropsSchema = z.object({
  ...layoutFields,
  title: z.string().min(1).max(240),
  subtitle: z.string().max(2000).optional().default(""),
  eyebrow: z.string().max(200).optional().default(""),
  backgroundImageUrl: flexibleMediaUrlSchema,
  overlayOpacity: z.number().min(0).max(1).optional().default(0.45),
  buttons: z.array(buttonSchema).max(8).optional().default([]),
});

const textPropsSchema = z.object({
  ...layoutFields,
  title: z.string().max(240).optional().default(""),
  subtitle: z.string().max(500).optional().default(""),
  body: z.string().min(1).max(12_000),
});

const imageTextPropsSchema = z.object({
  ...layoutFields,
  title: z.string().max(240).optional().default(""),
  body: z.string().max(8000).optional().default(""),
  imageUrl: flexibleMediaUrlSchema,
  imageAlt: z.string().max(300).optional().default(""),
  imagePosition: z.enum(["left", "right"]).optional().default("right"),
});

const gridShellPropsSchema = shellSchema.extend({ ...layoutFields });

const ctaPropsSchema = z.object({
  ...layoutFields,
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
  primaryLabel: z.string().max(120).optional().default("Contact"),
  primaryHref: hrefSchema,
  secondaryLabel: z.string().max(120).optional().default(""),
  secondaryHref: hrefSchema.optional().default(""),
});

const statItemSchema = z.object({
  label: z.string().min(1).max(120),
  value: z.union([z.string().max(40), z.number()]),
  suffix: z.string().max(20).optional().default(""),
});

const statsPropsSchema = z.object({
  ...layoutFields,
  eyebrow: z.string().max(200).optional().default(""),
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
  items: z.array(statItemSchema).min(1).max(12),
});

const faqItemSchema = z.object({
  q: z.string().min(1).max(300),
  a: z.string().min(1).max(4000),
});

const faqPropsSchema = z.object({
  ...layoutFields,
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
  items: z.array(faqItemSchema).min(1).max(40),
});

const contactPropsSchema = z.object({
  ...layoutFields,
  eyebrow: z.string().max(200).optional().default(""),
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
});

const mapPropsSchema = z.object({
  ...layoutFields,
  eyebrow: z.string().max(200).optional().default(""),
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
});

const buttonGroupPropsSchema = z.object({
  ...layoutFields,
  title: z.string().max(240).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  buttons: z.array(buttonSchema).min(1).max(12),
});

const blogFeedPropsSchema = z.object({
  ...layoutFields,
  eyebrow: z.string().max(200).optional().default(""),
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
});

const sectionBase = z.object({
  id: z.string().min(4).max(120),
  visible: z.boolean(),
  order: z.number().int().min(0).max(999),
});

export const builderSectionSchema = z.discriminatedUnion("type", [
  sectionBase.extend({ type: z.literal("hero"), props: heroPropsSchema }),
  sectionBase.extend({ type: z.literal("text"), props: textPropsSchema }),
  sectionBase.extend({ type: z.literal("richText"), props: richTextPropsSchema }),
  sectionBase.extend({ type: z.literal("image"), props: imagePropsSchema }),
  sectionBase.extend({ type: z.literal("imageText"), props: imageTextPropsSchema }),
  sectionBase.extend({ type: z.literal("twoColumn"), props: twoColumnPropsSchema }),
  sectionBase.extend({ type: z.literal("servicesGrid"), props: gridShellPropsSchema }),
  sectionBase.extend({ type: z.literal("serviceCard"), props: serviceCardPropsSchema }),
  sectionBase.extend({ type: z.literal("projectsGrid"), props: gridShellPropsSchema }),
  sectionBase.extend({ type: z.literal("galleryGrid"), props: gridShellPropsSchema }),
  sectionBase.extend({ type: z.literal("testimonials"), props: gridShellPropsSchema }),
  sectionBase.extend({ type: z.literal("brandsCarousel"), props: gridShellPropsSchema }),
  sectionBase.extend({ type: z.literal("cta"), props: ctaPropsSchema }),
  sectionBase.extend({ type: z.literal("estimateCTA"), props: estimateCtaPropsSchema }),
  sectionBase.extend({ type: z.literal("contactCTA"), props: contactCtaPropsSchema }),
  sectionBase.extend({ type: z.literal("stats"), props: statsPropsSchema }),
  sectionBase.extend({ type: z.literal("faq"), props: faqPropsSchema }),
  sectionBase.extend({ type: z.literal("contact"), props: contactPropsSchema }),
  sectionBase.extend({ type: z.literal("contactInfo"), props: contactInfoPropsSchema }),
  sectionBase.extend({ type: z.literal("contactForm"), props: contactFormPropsSchema }),
  sectionBase.extend({ type: z.literal("map"), props: mapPropsSchema }),
  sectionBase.extend({ type: z.literal("buttonGroup"), props: buttonGroupPropsSchema }),
  sectionBase.extend({ type: z.literal("blogFeed"), props: blogFeedPropsSchema }),
  sectionBase.extend({ type: z.literal("timeline"), props: timelinePropsSchema }),
  sectionBase.extend({ type: z.literal("team"), props: teamPropsSchema }),
  sectionBase.extend({ type: z.literal("certifications"), props: certificationsPropsSchema }),
  sectionBase.extend({ type: z.literal("footerColumns"), props: footerColumnsPropsSchema }),
  sectionBase.extend({ type: z.literal("navigationMenu"), props: navigationMenuPropsSchema }),
  sectionBase.extend({ type: z.literal("seoMeta"), props: seoMetaPropsSchema }),
  sectionBase.extend({ type: z.literal("spacer"), props: spacerPropsSchema }),
  sectionBase.extend({ type: z.literal("divider"), props: dividerPropsSchema }),
]);

export const pageBuilderDocumentSchema = z.object({
  v: z.literal(2),
  sections: z.array(builderSectionSchema).min(0).max(80),
});

export type PageBuilderDocument = z.infer<typeof pageBuilderDocumentSchema>;
export type BuilderSection = z.infer<typeof builderSectionSchema>;

export function validatePageBuilderDocument(input: unknown): z.SafeParseReturnType<unknown, PageBuilderDocument> {
  return pageBuilderDocumentSchema.safeParse(input);
}

export function newSectionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `sec_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
