import type { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit";
import { NAV_LINKS } from "@/config/navigation";
import { companySettingsUpsertCreate } from "@/lib/admin/admin-defaults";
import {
  marketingHeaderSettingsSchema,
  navigationItemUpsertSchema,
  navigationReorderSchema,
} from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { withCommandError } from "@/lib/services/commands/with-command-error";

export type MarketingHeaderSettingsInput = z.infer<typeof marketingHeaderSettingsSchema>;
export type NavigationItemUpsertInput = z.infer<typeof navigationItemUpsertSchema>;
export type NavigationReorderInput = z.infer<typeof navigationReorderSchema>;

export async function saveMarketingHeaderSettingsCommand(
  actorUserId: string,
  d: MarketingHeaderSettingsInput,
): Promise<ActionResult> {
  return withCommandError(async () => {
  await prisma.companySettings.upsert({
    where: { id: "singleton" },
    create: companySettingsUpsertCreate({
      logoText: d.logoText.trim(),
      logoImageUrl: d.logoImageUrl,
      companyName: d.companyName,
      companySubtitle: d.companySubtitle,
      primaryCtaLabel: d.primaryCtaLabel.trim(),
      primaryCtaUrl: d.primaryCtaUrl.trim(),
      callButtonLabel: d.callButtonLabel.trim(),
      showPrimaryCta: d.showPrimaryCta,
      showCallButton: d.showCallButton,
      showThemeToggle: d.showThemeToggle,
      defaultTheme: d.defaultTheme,
    }),
    update: {
      logoText: d.logoText.trim(),
      logoImageUrl: d.logoImageUrl,
      companyName: d.companyName,
      companySubtitle: d.companySubtitle,
      primaryCtaLabel: d.primaryCtaLabel.trim(),
      primaryCtaUrl: d.primaryCtaUrl.trim(),
      callButtonLabel: d.callButtonLabel.trim(),
      showPrimaryCta: d.showPrimaryCta,
      showCallButton: d.showCallButton,
      showThemeToggle: d.showThemeToggle,
      defaultTheme: d.defaultTheme,
    },
  });

  await writeAuditLog({
    userId: actorUserId,
    action: "update",
    entity: "company_settings",
    entityId: "singleton",
    metadata: { section: "header" },
  });

  return { ok: true, message: "Header settings saved" };
  });
}

export async function resetMarketingHeaderCommand(actorUserId: string): Promise<ActionResult> {
  return withCommandError(async () => {
  await prisma.navigationItem.deleteMany({});

  let order = 0;
  for (const l of NAV_LINKS) {
    await prisma.navigationItem.create({
      data: {
        label: l.label,
        href: l.href,
        sortOrder: order++,
        isVisible: true,
        isActive: true,
        isExternal: false,
      },
    });
  }

  await prisma.companySettings.upsert({
    where: { id: "singleton" },
    create: companySettingsUpsertCreate(),
    update: {
      logoText: "HGE",
      logoImageUrl: null,
      companyName: null,
      companySubtitle: null,
      primaryCtaLabel: "Get Instant Estimate",
      primaryCtaUrl: "/estimate",
      callButtonLabel: "Call Now",
      showPrimaryCta: true,
      showCallButton: true,
      showThemeToggle: true,
      defaultTheme: "light",
    },
  });

  await writeAuditLog({
    userId: actorUserId,
    action: "update",
    entity: "company_settings",
    entityId: "singleton",
    metadata: { section: "header_reset" },
  });

  return { ok: true, message: "Header and navigation reset to defaults" };
  });
}

export async function upsertNavigationItemCommand(
  actorUserId: string,
  d: NavigationItemUpsertInput,
): Promise<ActionResult> {
  return withCommandError(async () => {
  const data = {
    label: d.label.trim(),
    href: d.href.trim(),
    sortOrder: d.sortOrder,
    isVisible: d.isVisible,
    isActive: d.isActive,
    isExternal: d.isExternal,
  };

  if (d.id) {
    await prisma.navigationItem.update({ where: { id: d.id }, data });
    await writeAuditLog({
      userId: actorUserId,
      action: "update",
      entity: "navigation_item",
      entityId: d.id,
    });
  } else {
    const created = await prisma.navigationItem.create({ data });
    await writeAuditLog({
      userId: actorUserId,
      action: "create",
      entity: "navigation_item",
      entityId: created.id,
    });
  }

  return { ok: true, message: "Navigation item saved" };
  });
}

export async function deleteNavigationItemCommand(actorUserId: string, id: string): Promise<ActionResult> {
  return withCommandError(async () => {
  await prisma.navigationItem.delete({ where: { id } });
  await writeAuditLog({
    userId: actorUserId,
    action: "delete",
    entity: "navigation_item",
    entityId: id,
  });
  return { ok: true, message: "Navigation item removed" };
  });
}

export async function reorderNavigationItemsCommand(
  actorUserId: string,
  payload: NavigationReorderInput,
): Promise<ActionResult> {
  return withCommandError(async () => {
  const { orderedIds } = payload;
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.navigationItem.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );

  await writeAuditLog({
    userId: actorUserId,
    action: "update",
    entity: "navigation_item",
    entityId: "reorder",
    metadata: { count: orderedIds.length },
  });

  return { ok: true, message: "Navigation order updated" };
  });
}
