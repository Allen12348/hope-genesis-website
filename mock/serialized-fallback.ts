import { services as staticServices } from "@/data/services";
import { projects as staticProjects } from "@/data/projects";
import { testimonials as staticTestimonials } from "@/data/testimonials";
import { serviceIconKeyForSlug } from "@/config/service-icons";
import type { Project, SerializedService, Testimonial } from "@/types";

/** Serialized services for server components when DB is empty or unreachable. */
export function getSerializedServicesFallback(): SerializedService[] {
  return staticServices.map((s) => ({
    slug: s.slug,
    title: s.title,
    shortDescription: s.shortDescription,
    description: s.description,
    iconKey: serviceIconKeyForSlug(s.slug),
    highlights: s.highlights,
    idealFor: s.idealFor,
    heroImage: s.heroImage,
    heroImageAlt: s.heroImageAlt,
  }));
}

export function getProjectsFallback(): Project[] {
  return staticProjects;
}

export function getTestimonialsFallback(): Testimonial[] {
  return staticTestimonials;
}
