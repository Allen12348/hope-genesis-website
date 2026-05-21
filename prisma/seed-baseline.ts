import { Role } from "@prisma/client";
import type { SeedPrismaClient } from "./create-seed-prisma";
import bcrypt from "bcryptjs";
import { SITE } from "../constants/site";
import { NAV_LINKS } from "../config/navigation";
import { services as staticServices } from "../data/services";
import { SERVICE_ICON_KEY_BY_SLUG } from "../config/service-icons";
import {
  ADMIN_SINGLETON_ID,
  BASELINE_CMS_PAGE_SEEDS,
  companySettingsUpsertCreate,
  defaultFooterPayloadJson,
  defaultNavigationSeed,
  defaultSiteSettingsPayload,
} from "../lib/admin/admin-defaults";

/**
 * Idempotent baseline seed for production — upserts singletons and seeds empty tables.
 * Does not delete existing content.
 */
export async function seedProductionBaseline(prisma: SeedPrismaClient): Promise<void> {
  const adminEmail = (process.env.ADMIN_SEED_EMAIL ?? "admin@localhost").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe_Admin123!";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Site Admin",
      role: Role.ADMIN,
    },
    update: {},
  });

  await prisma.companySettings.upsert({
    where: { id: ADMIN_SINGLETON_ID },
    create: companySettingsUpsertCreate(),
    update: {},
  });

  const navCount = await prisma.navigationItem.count();
  if (navCount === 0) {
    for (const item of defaultNavigationSeed) {
      await prisma.navigationItem.create({ data: item });
    }
  }

  await prisma.siteSettings.upsert({
    where: { id: ADMIN_SINGLETON_ID },
    create: {
      id: ADMIN_SINGLETON_ID,
      sectionVisibilityJson: defaultSiteSettingsPayload.sectionVisibilityJson,
      floatingActionsJson: defaultSiteSettingsPayload.floatingActionsJson,
    },
    update: {},
  });

  await prisma.footerSection.upsert({
    where: { id: ADMIN_SINGLETON_ID },
    create: { id: ADMIN_SINGLETON_ID, payloadJson: defaultFooterPayloadJson },
    update: {},
  });

  for (const page of BASELINE_CMS_PAGE_SEEDS) {
    await prisma.pageContent.upsert({
      where: { pageKey: page.pageKey },
      create: {
        pageKey: page.pageKey,
        publishedData: page.publishedData,
        status: "PUBLISHED",
      },
      update: {},
    });
  }

  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
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
  }

  console.log(`Baseline seed OK — admin: ${adminEmail} (set ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD to override)`);
  console.log(`Company: ${SITE.name}`);
}
