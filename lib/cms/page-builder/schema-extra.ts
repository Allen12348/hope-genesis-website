import { z } from "zod";
import { flexibleMediaUrlSchema, hrefSchema } from "@/lib/cms/page-builder/schema-shared";

const textAlign = z.enum(["left", "center", "right"]).default("left");
const sectionSpacing = z.enum(["compact", "normal", "relaxed"]).default("normal");

const layoutFields = {
  textAlign,
  sectionSpacing,
  backgroundColor: z.string().max(120).optional().default(""),
};

export const richTextPropsSchema = z.object({
  ...layoutFields,
  title: z.string().max(240).optional().default(""),
  subtitle: z.string().max(500).optional().default(""),
  body: z.string().min(1).max(24_000),
});

export const imagePropsSchema = z.object({
  ...layoutFields,
  imageUrl: flexibleMediaUrlSchema,
  alt: z.string().max(300).optional().default(""),
  caption: z.string().max(500).optional().default(""),
});

export const twoColumnPropsSchema = z.object({
  ...layoutFields,
  leftTitle: z.string().max(240).optional().default(""),
  leftBody: z.string().max(8000).optional().default(""),
  rightTitle: z.string().max(240).optional().default(""),
  rightBody: z.string().max(8000).optional().default(""),
});

export const serviceCardItemSchema = z.object({
  icon: z.string().max(80).optional().default(""),
  title: z.string().min(1).max(120),
  description: z.string().max(800).optional().default(""),
  href: hrefSchema,
});

export const serviceCardPropsSchema = z.object({
  ...layoutFields,
  eyebrow: z.string().max(200).optional().default(""),
  title: z.string().max(240).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  cards: z.array(serviceCardItemSchema).min(1).max(24),
});

export const contactInfoPropsSchema = z.object({
  ...layoutFields,
  title: z.string().max(240).optional().default("Contact"),
  phone: z.string().max(80).optional().default(""),
  email: z.string().max(200).optional().default(""),
  address: z.string().max(500).optional().default(""),
  hours: z.string().max(500).optional().default(""),
});

export const contactFormPropsSchema = z.object({
  ...layoutFields,
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
  submitLabel: z.string().max(80).optional().default("Send message"),
});

export const estimateCtaPropsSchema = z.object({
  ...layoutFields,
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
  primaryLabel: z.string().max(120).optional().default("Get Instant Estimate"),
  primaryHref: hrefSchema.optional().default("/estimate"),
  secondaryLabel: z.string().max(120).optional().default("Book survey"),
  secondaryHref: hrefSchema.optional().default("/contact"),
});

export const contactCtaPropsSchema = z.object({
  ...layoutFields,
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
  primaryLabel: z.string().max(120).optional().default("Contact"),
  primaryHref: hrefSchema.optional().default("/contact"),
  phone: z.string().max(80).optional().default(""),
});

export const timelineItemSchema = z.object({
  year: z.string().max(20),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().default(""),
});

export const timelinePropsSchema = z.object({
  ...layoutFields,
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
  items: z.array(timelineItemSchema).min(1).max(30),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1).max(120),
  role: z.string().max(120).optional().default(""),
  imageUrl: flexibleMediaUrlSchema,
  bio: z.string().max(2000).optional().default(""),
});

export const teamPropsSchema = z.object({
  ...layoutFields,
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
  members: z.array(teamMemberSchema).min(1).max(24),
});

export const certificationItemSchema = z.object({
  title: z.string().min(1).max(200),
  imageUrl: flexibleMediaUrlSchema,
});

export const certificationsPropsSchema = z.object({
  ...layoutFields,
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional().default(""),
  items: z.array(certificationItemSchema).min(1).max(24),
});

export const footerLinkSchema = z.object({
  label: z.string().min(1).max(120),
  href: hrefSchema,
});

export const footerColumnSchema = z.object({
  title: z.string().min(1).max(120),
  links: z.array(footerLinkSchema).max(20),
});

export const footerColumnsPropsSchema = z.object({
  columns: z.array(footerColumnSchema).min(1).max(6),
  copyright: z.string().max(500).optional().default(""),
  tagline: z.string().max(500).optional().default(""),
});

export const navItemSchema = z.object({
  label: z.string().min(1).max(80),
  href: hrefSchema,
  visible: z.boolean().optional().default(true),
});

export const navigationMenuPropsSchema = z.object({
  logoText: z.string().max(80).optional().default("HGE"),
  logoUrl: flexibleMediaUrlSchema,
  items: z.array(navItemSchema).max(20).optional().default([]),
  ctaLabel: z.string().max(80).optional().default("Get estimate"),
  ctaHref: hrefSchema.optional().default("/estimate"),
  callLabel: z.string().max(80).optional().default("Call now"),
  showCallButton: z.boolean().optional().default(true),
});

export const seoMetaPropsSchema = z.object({
  pageTitle: z.string().min(1).max(120),
  metaDescription: z.string().max(320).optional().default(""),
  keywords: z.string().max(500).optional().default(""),
  ogImage: flexibleMediaUrlSchema,
});

export const spacerPropsSchema = z.object({
  height: z.enum(["sm", "md", "lg", "xl"]).optional().default("md"),
});

export const dividerPropsSchema = z.object({
  style: z.enum(["solid", "dashed"]).optional().default("solid"),
});
