import { prisma } from "@/lib/db/prisma";
import { testimonials as staticTestimonials } from "@/data/testimonials";

/**
 * When the database is reachable but has no testimonial rows, import the same
 * catalog used for static fallback so admin and public stay in sync.
 */
export async function ensureTestimonialsSeeded(): Promise<void> {
  const count = await prisma.testimonial.count();
  if (count > 0) return;

  for (const t of staticTestimonials) {
    const remote = t.avatar.trim().startsWith("http") ? t.avatar.trim() : null;
    await prisma.testimonial.create({
      data: {
        clientName: t.name,
        role: t.role,
        company: t.company,
        review: t.quote,
        rating: t.rating,
        imageUrl: remote,
        approved: true,
        featured: false,
        serviceType: "General",
        source: "LEGACY",
      },
    });
  }
}
