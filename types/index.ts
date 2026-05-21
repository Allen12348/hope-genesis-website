import type { LucideIcon } from "lucide-react";
import type { BlogEditorialCategory } from "@/lib/services/marketing/constants";

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  highlights: string[];
  idealFor: string[];
  /** Full-bleed hero + default Open Graph image (remote URL ok for static export). */
  heroImage: string;
  heroImageAlt: string;
};

/** Serializable across the server → client boundary (no Lucide components). */
export type SerializedService = Omit<Service, "icon"> & {
  iconKey: string;
  category?: string;
  faq?: { q: string; a: string }[];
  pricingNote?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type ProjectCategory =
  | "Residential"
  | "Commercial"
  | "VRF/VRV"
  | "Refrigeration"
  | "Preventive Maintenance"
  | "AC Cleaning"
  | "Installation";

export type ProjectStatus = "completed" | "in_progress" | "planned";

export type ProjectStat = {
  label: string;
  value: string;
  suffix?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  status?: ProjectStatus;
  location: string;
  year: string;
  summary: string;
  scope: string[];
  image: string;
  imageAlt: string;
  beforeImage?: string;
  afterImage?: string;
  /** Additional gallery frames (parsed from `galleryImageUrls` JSON column). */
  galleryImages?: string[];
  /** Detailed case study fields (optional for legacy entries). */
  equipmentUsed?: string[];
  installationDuration?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  stats?: ProjectStat[];
  /** Homepage / marketing featured strip. */
  featured?: boolean;
  /** Optional client or company label for case studies. */
  clientLabel?: string;
  /** Linked approved testimonial for this case study. */
  testimonial?: Testimonial;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  /** Remote image URL, or empty string to show generated initials */
  avatar: string;
  /** CMS: show in featured-only homepage rows when true. */
  featured?: boolean;
};

export type Brand = {
  id: string;
  name: string;
  /** Short monogram-style mark for premium typographic treatment */
  monogram: string;
  /** Optional logo URL from admin (http/https). */
  imageUrl?: string | null;
  imageAlt?: string | null;
  /** CMS: surface in featured brand rows when true. */
  featured?: boolean;
};

export type HeroStat = {
  label: string;
  value: number;
  suffix?: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category?: string;
  featured?: boolean;
};

export type BlogCategory = BlogEditorialCategory;

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  publishedAt: string;
  readingMinutes: number;
  featured?: boolean;
  coverImage: string;
  coverAlt: string;
  body: string[];
  tags?: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
};

/** Card / index payloads — omit article body to cut DB I/O and RSC payload size. */
export type BlogPostSummary = Omit<BlogPost, "body">;

export type TechnicianProfile = {
  id: string;
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  yearsExperience: number;
  certifications: string[];
  specialties: string[];
  completedProjects: number;
  bio: string;
};

export type BeforeAfterShowcase = {
  id: string;
  title: string;
  segment: "Installation" | "Cleaning" | "Commercial" | "Residential";
  beforeSrc: string;
  afterSrc: string;
  alt: string;
};

export type ServiceArea = {
  id: string;
  name: string;
  /** 0–100 SVG viewBox coordinates for marker placement */
  x: number;
  y: number;
  tagline: string;
};
