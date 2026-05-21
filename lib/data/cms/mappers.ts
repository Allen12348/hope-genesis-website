import type {
  BlogPost as PrismaBlogPost,
  GalleryItem,
  Project as PrismaProject,
  Service,
  Testimonial,
} from "@prisma/client";
import { normalizeProjectCategory } from "@/lib/cms/project-categories";
import { normalizeProjectStatus } from "@/lib/cms/project-status";
import {
  parseJsonArray,
  parseJsonStringArray,
  parseProjectStatsJson,
  parseServiceFaqJson,
} from "@/lib/data/cms/json-fields";
import type {
  BlogCategory,
  BlogPost,
  BlogPostSummary,
  GalleryImage,
  Project,
  SerializedService,
  Testimonial as TestimonialDTO,
} from "@/types";

export function mapServiceToSerialized(r: Service): SerializedService {
  return {
    slug: r.slug,
    title: r.title,
    shortDescription: r.shortDescription,
    description: r.description,
    iconKey: r.iconKey,
    category: r.category,
    highlights: parseJsonArray(r.highlights),
    idealFor: parseJsonArray(r.idealFor),
    heroImage: r.imageUrl || r.heroImage,
    heroImageAlt: r.heroImageAlt,
    faq: parseServiceFaqJson(r.faqJson),
    pricingNote: r.pricingNote,
    seoTitle: r.seoTitle,
    seoDescription: r.seoDescription,
  };
}

type ProjectWithTestimonial = PrismaProject & {
  testimonial?: Testimonial | null;
};

export function mapProjectRow(r: ProjectWithTestimonial): Project {
  const equipmentUsed = r.equipmentUsed ? parseJsonArray(r.equipmentUsed) : undefined;
  const results = r.results ? parseJsonArray(r.results) : undefined;
  const galleryImages = parseJsonStringArray(r.galleryImageUrls);
  const stats = parseProjectStatsJson(r.statsJson);
  const linked =
    r.testimonial && r.testimonial.approved && !r.testimonial.rejected
      ? mapTestimonialRow(r.testimonial)
      : undefined;
  return {
    slug: r.slug,
    title: r.title,
    category: normalizeProjectCategory(r.category),
    status: normalizeProjectStatus(r.status),
    location: r.location ?? "",
    year: r.year ?? "",
    summary: r.summary ?? "",
    scope: r.scope ? parseJsonArray(r.scope) : [],
    image: r.imageUrl || r.image || "",
    imageAlt: r.imageAlt ?? "",
    galleryImages: galleryImages.length ? galleryImages : undefined,
    beforeImage: (r.beforeImageUrl || r.beforeImage) ?? undefined,
    afterImage: (r.afterImageUrl || r.afterImage) ?? undefined,
    equipmentUsed: equipmentUsed?.length ? equipmentUsed : undefined,
    installationDuration: r.installationDuration ?? undefined,
    challenge: r.challenge ?? undefined,
    solution: r.solution ?? undefined,
    results: results?.length ? results : undefined,
    stats: stats.length ? stats : undefined,
    featured: r.featured,
    clientLabel: r.clientLabel?.trim() || undefined,
    testimonial: linked,
  };
}

export function mapGalleryItem(r: GalleryItem): GalleryImage {
  return {
    id: r.id,
    src: r.imageUrl || r.src,
    alt: r.alt,
    caption: r.caption,
    category: r.category || undefined,
    featured: r.featured,
  };
}

export function mapTestimonialRow(r: Testimonial): TestimonialDTO {
  return {
    id: r.id,
    name: r.clientName,
    role: r.role,
    company: r.company,
    quote: r.review,
    rating: r.rating,
    avatar: (r.imageUrl ?? "").trim(),
    featured: r.featured,
  };
}

export function mapBlogRow(r: PrismaBlogPost): BlogPost {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    category: r.category as BlogCategory,
    publishedAt: r.publishedAt,
    readingMinutes: r.readingMinutes,
    featured: r.featured,
    coverImage: r.coverImageUrl || r.coverImage,
    coverAlt: r.coverAlt,
    body: parseJsonArray(r.body),
    tags: parseJsonStringArray(r.tags, []),
    metaTitle: r.metaTitle,
    metaDescription: r.metaDescription,
  };
}

type BlogSummaryRow = Pick<
  PrismaBlogPost,
  | "slug"
  | "title"
  | "description"
  | "category"
  | "publishedAt"
  | "readingMinutes"
  | "featured"
  | "coverImage"
  | "coverImageUrl"
  | "coverAlt"
>;

export function mapBlogSummaryRow(r: BlogSummaryRow): BlogPostSummary {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    category: r.category as BlogPost["category"],
    publishedAt: r.publishedAt,
    readingMinutes: r.readingMinutes,
    featured: r.featured,
    coverImage: r.coverImageUrl || r.coverImage,
    coverAlt: r.coverAlt,
  };
}
