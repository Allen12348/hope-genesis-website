import { z } from "zod";
import { entityIdField, optionalEntityIdField } from "@/lib/validations/entity-id";
import { PROJECT_CATEGORIES } from "@/lib/cms/project-categories";
import { PROJECT_STATUSES } from "@/lib/cms/project-status";
import { blogEditorialCategories } from "@/lib/services/marketing/constants";
import { isHttpOrHttpsUrl, isSafeImageSource, optionalRemoteImageUrl } from "@/lib/validations/image-url";

const projectCategoryTuple = PROJECT_CATEGORIES as unknown as [
  (typeof PROJECT_CATEGORIES)[number],
  ...(typeof PROJECT_CATEGORIES)[number][],
];

const projectStatusTuple = PROJECT_STATUSES as unknown as [
  (typeof PROJECT_STATUSES)[number],
  ...(typeof PROJECT_STATUSES)[number][],
];

const projectStatSchema = z.object({
  label: z.string().min(1).max(80),
  value: z.string().min(1).max(40),
  suffix: z.string().max(20).optional().or(z.literal("")),
});

const currentCalendarYear = new Date().getFullYear();

const blogCategoryTuple = blogEditorialCategories as unknown as [
  (typeof blogEditorialCategories)[number],
  ...(typeof blogEditorialCategories)[number][],
];

export const idSchema = z.object({ id: entityIdField });

/** Prisma User.id — accepts cuid() defaults and legacy D1 seed ids (e.g. seed-user-admin). */
export const userIdField = z.string().min(1, "User id is required").max(128);

export const deleteUserSchema = z.object({ id: userIdField });

const localOrRemoteAsset = z
  .string()
  .min(1)
  .max(2000)
  .refine((s) => isSafeImageSource(s), { message: "Must be a valid http(s) URL or a path starting with /" });

const optionalLocalOrRemote = z
  .union([z.literal(""), z.string().max(2000)])
  .optional()
  .transform((v) => (!v || v.trim() === "" ? undefined : v.trim()))
  .refine((v) => v === undefined || isSafeImageSource(v), {
    message: "Must be a valid http(s) URL or a path starting with /",
  });

export const serviceUpsertSchema = z.object({
  id: optionalEntityIdField,
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(2).max(200),
  shortDescription: z.string().min(10).max(500),
  description: z.string().min(20).max(8000),
  iconKey: z.string().min(1).max(40),
  category: z.string().min(1).max(120).optional().default("General"),
  highlights: z.array(z.string().min(1).max(300)).min(1).max(12),
  idealFor: z.array(z.string().min(1).max(80)).min(1).max(20),
  faq: z
    .array(z.object({ q: z.string().min(1).max(500), a: z.string().min(1).max(4000) }))
    .max(40)
    .optional(),
  pricingNote: z.string().max(2000).optional().or(z.literal("")),
  seoTitle: z.string().max(200).optional().or(z.literal("")),
  seoDescription: z.string().max(500).optional().or(z.literal("")),
  heroImage: localOrRemoteAsset,
  imageUrl: optionalRemoteImageUrl,
  heroImageAlt: z.string().min(2).max(300),
  published: z.boolean(),
});

export const projectUpsertSchema = z.object({
  id: optionalEntityIdField,
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(2).max(200),
  category: z.enum(projectCategoryTuple),
  status: z.enum(projectStatusTuple).optional().default("completed"),
  location: z.string().min(2).max(200),
  year: z
    .string()
    .regex(/^\d{4}$/, "Enter a 4-digit year")
    .refine((y) => {
      const n = Number(y);
      return n >= 1990 && n <= currentCalendarYear + 1;
    }, `Year must be between 1990 and ${currentCalendarYear + 1}`),
  galleryImageUrls: z
    .array(
      z.string().max(2000).refine((s) => isHttpOrHttpsUrl(s), {
        message: "Gallery URLs must be public http(s) links",
      }),
    )
    .max(12)
    .optional(),
  summary: z.string().min(10).max(2000),
  scope: z.array(z.string().min(1).max(500)).min(1).max(30),
  image: localOrRemoteAsset,
  imageUrl: optionalRemoteImageUrl,
  imageAlt: z.string().min(2).max(300),
  beforeImage: optionalLocalOrRemote,
  afterImage: optionalLocalOrRemote,
  beforeImageUrl: optionalRemoteImageUrl,
  afterImageUrl: optionalRemoteImageUrl,
  equipmentUsed: z.array(z.string().min(1).max(300)).max(40).optional(),
  installationDuration: z.string().max(200).optional().or(z.literal("")),
  challenge: z.string().max(4000).optional().or(z.literal("")),
  solution: z.string().max(4000).optional().or(z.literal("")),
  results: z.array(z.string().min(1).max(500)).max(40).optional(),
  published: z.boolean(),
  featured: z.boolean().optional().default(false),
  clientLabel: z.string().max(200).optional().or(z.literal("")),
  stats: z.array(projectStatSchema).max(6).optional(),
  testimonialId: z
    .union([z.literal(""), entityIdField])
    .optional()
    .transform((v) => (!v || v.trim() === "" ? null : v)),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
});

export const galleryUpsertSchema = z.object({
  id: optionalEntityIdField,
  src: localOrRemoteAsset,
  imageUrl: optionalRemoteImageUrl,
  alt: z.string().min(2).max(300),
  caption: z.string().min(2).max(500),
  category: z.string().max(120).optional().default(""),
  featured: z.boolean().optional().default(false),
  published: z.boolean(),
});

export const testimonialUpsertSchema = z.object({
  id: optionalEntityIdField,
  clientName: z.string().min(1, "Client name is required").max(120),
  company: z
    .union([z.string(), z.undefined()])
    .optional()
    .transform((v) => (typeof v === "string" ? v.trim() : ""))
    .pipe(z.string().max(200)),
  role: z.string().min(1).max(120),
  review: z.string().min(10, "Review is required").max(2000),
  rating: z.coerce.number().int().min(1).max(5),
  imageUrl: optionalRemoteImageUrl,
  serviceType: z.string().min(1).max(120),
  approved: z.boolean(),
  featured: z.boolean(),
  rejected: z.boolean(),
});

export const blogUpsertSchema = z.object({
  id: optionalEntityIdField,
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(500),
  category: z.enum(blogCategoryTuple),
  publishedAt: z.string().min(4).max(32),
  readingMinutes: z.coerce.number().int().min(1).max(120),
  featured: z.boolean(),
  coverImage: localOrRemoteAsset,
  coverImageUrl: optionalRemoteImageUrl,
  coverAlt: z.string().min(2).max(300),
  body: z.array(z.string().min(1).max(8000)).min(1).max(200),
  tags: z.array(z.string().min(1).max(80)).max(60).optional(),
  metaTitle: z.string().max(200).optional().or(z.literal("")),
  metaDescription: z.string().max(500).optional().or(z.literal("")),
  published: z.boolean(),
});

export const companySettingsSchema = z.object({
  phoneDisplay: z.string().min(3).max(80),
  phoneE164: z.string().min(5).max(24),
  email: z.string().email().max(120),
  addressLine: z.string().min(2).max(200),
  fullAddress: z.string().min(2).max(300),
  hours: z.string().min(2).max(200),
  socialFacebook: z.string().url().max(500).optional().or(z.literal("")),
  socialInstagram: z.string().url().max(500).optional().or(z.literal("")),
  socialLinkedin: z.string().url().max(500).optional().or(z.literal("")),
  mapEmbedUrl: z.string().url().max(4000).optional().or(z.literal("")),
  whatsappUrl: z.string().url().max(500).optional().or(z.literal("")),
  messengerUrl: z.string().url().max(500).optional().or(z.literal("")),
  heroImageUrl: optionalRemoteImageUrl,
  heroImageAlt: z.preprocess(
    (v) => (typeof v !== "string" || v.trim() === "" ? null : v.trim().slice(0, 300)),
    z.union([z.null(), z.string().max(300)]),
  ),
  heroBackgroundBlur: z.coerce.number().int().min(0).max(20),
});

const navHrefSchema = z
  .string()
  .min(1)
  .max(500)
  .refine((s) => s.startsWith("/") || s.startsWith("#") || isHttpOrHttpsUrl(s), {
    message: "Use an internal path (starting with /) or a valid http(s) URL",
  });

export const marketingHeaderSettingsSchema = z.object({
  logoText: z.string().min(1).max(12),
  logoImageUrl: optionalRemoteImageUrl,
  companyName: z.preprocess(
    (v) => (typeof v !== "string" || v.trim() === "" ? null : v.trim()),
    z.union([z.null(), z.string().min(1).max(120)]),
  ),
  companySubtitle: z.preprocess(
    (v) => (typeof v !== "string" || v.trim() === "" ? null : v.trim()),
    z.union([z.null(), z.string().min(1).max(200)]),
  ),
  primaryCtaLabel: z.string().min(1).max(80),
  primaryCtaUrl: navHrefSchema,
  callButtonLabel: z.string().min(1).max(80),
  showPrimaryCta: z.boolean(),
  showCallButton: z.boolean(),
  showThemeToggle: z.boolean(),
  defaultTheme: z.enum(["light", "dark", "system"]),
});

export const navigationItemUpsertSchema = z.object({
  id: optionalEntityIdField,
  label: z.string().min(1).max(80),
  href: navHrefSchema,
  sortOrder: z.coerce.number().int().min(0).max(999),
  isVisible: z.boolean(),
  isActive: z.boolean(),
  isExternal: z.boolean(),
});

export const navigationReorderSchema = z.object({
  orderedIds: z.array(entityIdField).min(1),
});

export const brandPartnerUpsertSchema = z.object({
  id: optionalEntityIdField,
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1).max(120),
  monogram: z.string().min(1).max(12),
  description: z.string().max(2000).optional().or(z.literal("")),
  category: z.string().max(120).optional().default(""),
  featured: z.boolean().optional().default(false),
  imageUrl: optionalRemoteImageUrl,
  imageAlt: z.preprocess(
    (v) => (typeof v !== "string" || v.trim() === "" ? null : v.trim().slice(0, 200)),
    z.union([z.null(), z.string().max(200)]),
  ),
  published: z.boolean(),
});

export const userInviteSchema = z.object({
  email: z.string().email().max(120),
  name: z.string().min(1).max(120).optional().or(z.literal("")),
  password: z.string().min(10).max(200),
  role: z.enum(["ADMIN", "STAFF", "VIEWER"]),
});

export const changeUserPasswordSchema = z
  .object({
    userId: userIdField,
    password: z.string().min(8, "Password must be at least 8 characters").max(200),
    confirmPassword: z.string().min(1, "Please confirm the new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

