import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createSeedPrisma } from "./create-seed-prisma";
import { loadSeedEnv } from "./seed-env";
import { seedProductionBaseline } from "./seed-baseline";
import { services as staticServices } from "../data/services";
import { projects as staticProjects, galleryImages as staticGallery } from "../data/projects";
import { testimonials as staticTestimonials } from "../data/testimonials";
import { blogPosts as staticBlogPosts } from "../data/blog-posts";
import { brands as staticBrands } from "../data/brands";
import { SITE } from "../constants/site";
import { SERVICE_ICON_KEY_BY_SLUG } from "../config/service-icons";
import { NAV_LINKS } from "../config/navigation";
import { DEFAULT_HEADER_SUBTITLE } from "../lib/cms/resolved-site";

const UPSERT_BASELINE =
  process.env.SEED_MODE === "upsert" || process.argv.includes("--upsert");

async function main() {
  loadSeedEnv();
  const prisma = await createSeedPrisma();

  try {
  if (UPSERT_BASELINE) {
    await seedProductionBaseline(prisma);
    return;
  }

  await prisma.auditLog.deleteMany();
  await prisma.brandPartner.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.navigationItem.deleteMany();
  await prisma.companySettings.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("ChangeMe_Admin123!", 12);
  await prisma.user.create({
    data: {
      email: "admin@localhost",
      passwordHash,
      name: "Site Admin",
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      email: "staff@localhost",
      passwordHash: await bcrypt.hash("ChangeMe_Staff123!", 12),
      name: "Staff User",
      role: Role.STAFF,
    },
  });

  await prisma.user.create({
    data: {
      email: "viewer@localhost",
      passwordHash: await bcrypt.hash("ChangeMe_Viewer123!", 12),
      name: "Read-only",
      role: Role.VIEWER,
    },
  });

  await prisma.companySettings.create({
    data: {
      id: "singleton",
      phoneDisplay: SITE.phoneDisplay,
      phoneE164: SITE.phoneE164,
      email: SITE.email,
      addressLine: SITE.addressLine,
      fullAddress: SITE.fullAddress,
      hours: SITE.hours,
      socialFacebook: SITE.social.facebook,
      socialInstagram: SITE.social.instagram,
      socialLinkedin: SITE.social.linkedin,
      mapEmbedUrl: SITE.mapEmbedUrl,
      whatsappUrl: SITE.whatsapp,
      messengerUrl: SITE.messenger,
      logoText: "HGE",
      companyName: SITE.name,
      companySubtitle: DEFAULT_HEADER_SUBTITLE,
      primaryCtaLabel: "Get Instant Estimate",
      primaryCtaUrl: "/estimate",
      callButtonLabel: "Call Now",
    },
  });

  let navOrder = 0;
  for (const l of NAV_LINKS) {
    await prisma.navigationItem.create({
      data: {
        label: l.label,
        href: l.href,
        sortOrder: navOrder++,
        isVisible: true,
        isActive: true,
        isExternal: false,
      },
    });
  }

  let sort = 0;
  for (const s of staticServices) {
    await prisma.service.create({
      data: {
        slug: s.slug,
        title: s.title,
        shortDescription: s.shortDescription,
        description: s.description,
        iconKey: SERVICE_ICON_KEY_BY_SLUG[s.slug] ?? "sparkles",
        highlights: JSON.stringify(s.highlights),
        idealFor: JSON.stringify(s.idealFor),
        heroImage: s.heroImage,
        heroImageAlt: s.heroImageAlt,
        published: true,
        sortOrder: sort++,
      },
    });
  }

  sort = 0;
  for (const p of staticProjects) {
    await prisma.project.create({
      data: {
        slug: p.slug,
        title: p.title,
        category: p.category,
        location: p.location,
        year: p.year,
        summary: p.summary,
        scope: JSON.stringify(p.scope),
        image: p.image,
        imageAlt: p.imageAlt,
        beforeImage: p.beforeImage ?? null,
        afterImage: p.afterImage ?? null,
        equipmentUsed: p.equipmentUsed ? JSON.stringify(p.equipmentUsed) : null,
        installationDuration: p.installationDuration ?? null,
        challenge: p.challenge ?? null,
        solution: p.solution ?? null,
        results: p.results ? JSON.stringify(p.results) : null,
        published: true,
        sortOrder: sort++,
      },
    });
  }

  sort = 0;
  for (const g of staticGallery) {
    await prisma.galleryItem.create({
      data: {
        src: g.src,
        alt: g.alt,
        caption: g.caption,
        published: true,
        sortOrder: sort++,
      },
    });
  }

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

  for (const b of staticBlogPosts) {
    await prisma.blogPost.create({
      data: {
        slug: b.slug,
        title: b.title,
        description: b.description,
        category: b.category,
        publishedAt: b.publishedAt,
        readingMinutes: b.readingMinutes,
        featured: Boolean(b.featured),
        coverImage: b.coverImage,
        coverAlt: b.coverAlt,
        body: JSON.stringify(b.body),
        published: true,
      },
    });
  }

  let brandOrder = 0;
  for (const b of staticBrands) {
    await prisma.brandPartner.create({
      data: {
        slug: b.id,
        name: b.name,
        monogram: b.monogram,
        published: true,
        sortOrder: brandOrder++,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      userId: null,
      action: "seed",
      entity: "database",
      entityId: null,
      metadata: JSON.stringify({ message: "Initial seed completed" }),
    },
  });

  console.log("Seed OK — users: admin@localhost / ChangeMe_Admin123!");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
