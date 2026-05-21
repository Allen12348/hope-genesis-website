import type { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit";
import { companySettingsUpsertCreate } from "@/lib/admin/admin-defaults";
import { changeUserPasswordSchema, companySettingsSchema, userInviteSchema } from "@/lib/validations/cms";
import type { ActionResult } from "@/lib/actions/types";
import { withCommandError } from "@/lib/services/commands/with-command-error";

export type CompanySettingsInput = z.infer<typeof companySettingsSchema>;
export type UserInviteInput = z.infer<typeof userInviteSchema>;
export type ChangeUserPasswordInput = z.infer<typeof changeUserPasswordSchema>;

export async function updateCompanySettingsCommand(
  actorUserId: string,
  d: CompanySettingsInput,
): Promise<ActionResult> {
  return withCommandError(async () => {
  await prisma.companySettings.upsert({
    where: { id: "singleton" },
    create: companySettingsUpsertCreate({
      phoneDisplay: d.phoneDisplay,
      phoneE164: d.phoneE164,
      email: d.email,
      addressLine: d.addressLine,
      fullAddress: d.fullAddress,
      hours: d.hours,
      socialFacebook: d.socialFacebook || null,
      socialInstagram: d.socialInstagram || null,
      socialLinkedin: d.socialLinkedin || null,
      mapEmbedUrl: d.mapEmbedUrl || null,
      whatsappUrl: d.whatsappUrl || null,
      messengerUrl: d.messengerUrl || null,
      heroImageUrl: d.heroImageUrl,
      heroImageAlt: d.heroImageAlt,
      heroBackgroundBlur: d.heroBackgroundBlur,
    }),
    update: {
      phoneDisplay: d.phoneDisplay,
      phoneE164: d.phoneE164,
      email: d.email,
      addressLine: d.addressLine,
      fullAddress: d.fullAddress,
      hours: d.hours,
      socialFacebook: d.socialFacebook || null,
      socialInstagram: d.socialInstagram || null,
      socialLinkedin: d.socialLinkedin || null,
      mapEmbedUrl: d.mapEmbedUrl || null,
      whatsappUrl: d.whatsappUrl || null,
      messengerUrl: d.messengerUrl || null,
      heroImageUrl: d.heroImageUrl,
      heroImageAlt: d.heroImageAlt,
      heroBackgroundBlur: d.heroBackgroundBlur,
    },
  });

  await writeAuditLog({
    userId: actorUserId,
    action: "update",
    entity: "company_settings",
    entityId: "singleton",
  });

  return { ok: true, message: "Company settings updated" };
  });
}

export async function createUserCommand(actorUserId: string, d: UserInviteInput): Promise<ActionResult> {
  return withCommandError(async () => {
  const email = d.email.trim().toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { ok: false, error: "A user with this email already exists" };

  const passwordHash = await bcrypt.hash(d.password, 12);
  const created = await prisma.user.create({
    data: {
      email,
      name: d.name?.trim() || null,
      passwordHash,
      role: d.role,
    },
  });

  await writeAuditLog({
    userId: actorUserId,
    action: "create",
    entity: "user",
    entityId: created.id,
    metadata: { email },
  });

  return { ok: true, message: "User created" };
  });
}

export async function changeUserPasswordCommand(
  actorUserId: string,
  d: ChangeUserPasswordInput,
): Promise<ActionResult> {
  return withCommandError(async () => {
  const target = await prisma.user.findUnique({
    where: { id: d.userId },
    select: { id: true, email: true },
  });
  if (!target) return { ok: false, error: "User not found" };

  const passwordHash = await bcrypt.hash(d.password, 12);
  await prisma.user.update({
    where: { id: d.userId },
    data: { passwordHash },
  });

  await writeAuditLog({
    userId: actorUserId,
    action: "change_password",
    entity: "user",
    entityId: target.id,
    metadata: { message: `Admin changed password for ${target.email}` },
  });

  return { ok: true, message: `Password updated for ${target.email}` };
  });
}

export async function deleteUserCommand(
  actorUserId: string,
  targetUserId: string,
  currentUserId: string,
): Promise<ActionResult> {
  return withCommandError(async () => {
  if (targetUserId === currentUserId) {
    return { ok: false, error: "You cannot delete your own account while signed in." };
  }

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, email: true, role: true },
  });
  if (!target) return { ok: false, error: "User not found" };

  if (target.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return { ok: false, error: "You cannot delete the last admin account." };
    }
  }

  await prisma.user.delete({ where: { id: targetUserId } });
  await writeAuditLog({
    userId: actorUserId,
    action: "delete",
    entity: "user",
    entityId: targetUserId,
    metadata: { email: target.email },
  });
  return { ok: true, message: "User removed" };
  });
}
