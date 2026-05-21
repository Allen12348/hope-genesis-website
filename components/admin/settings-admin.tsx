"use client";

import * as React from "react";
import Link from "next/link";
import type { CompanySettings, Role, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, PanelTop, Trash2 } from "lucide-react";
import { ChangeUserPasswordDialog } from "@/components/admin/change-user-password-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { canEditCompanySettings, canManageUsers } from "@/lib/permissions";
import { createUserAction, deleteUserAction, updateCompanySettingsAction } from "@/lib/actions/settings";
import type { ResolvedSite } from "@/lib/cms/resolved-site";
import { AdminImageUrlField } from "@/components/admin/admin-image-url-field";
import { AdminFormIntro } from "@/components/admin/ui/admin-form-intro";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";

type CompanyForm = {
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  addressLine: string;
  fullAddress: string;
  hours: string;
  socialFacebook: string;
  socialInstagram: string;
  socialLinkedin: string;
  mapEmbedUrl: string;
  whatsappUrl: string;
  messengerUrl: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroBackgroundBlur: number;
};

export function SettingsAdmin({
  company,
  defaults,
  users,
  role,
}: {
  company: CompanySettings | null;
  defaults: ResolvedSite;
  users: Pick<User, "id" | "email" | "name" | "role" | "createdAt">[];
  role: Role;
}) {
  const router = useRouter();
  const canCompany = canEditCompanySettings(role);
  const canUsers = canManageUsers(role);
  const [form, setForm] = React.useState<CompanyForm>(() => ({
    phoneDisplay: company?.phoneDisplay ?? defaults.phoneDisplay,
    phoneE164: company?.phoneE164 ?? defaults.phoneE164,
    email: company?.email ?? defaults.email,
    addressLine: company?.addressLine ?? defaults.addressLine,
    fullAddress: company?.fullAddress ?? defaults.fullAddress,
    hours: company?.hours ?? defaults.hours,
    socialFacebook: company?.socialFacebook ?? defaults.social.facebook,
    socialInstagram: company?.socialInstagram ?? defaults.social.instagram,
    socialLinkedin: company?.socialLinkedin ?? defaults.social.linkedin,
    mapEmbedUrl: company?.mapEmbedUrl ?? defaults.mapEmbedUrl,
    whatsappUrl: company?.whatsappUrl ?? defaults.whatsapp,
    messengerUrl: company?.messengerUrl ?? defaults.messenger,
    heroImageUrl: company?.heroImageUrl ?? "",
    heroImageAlt: company?.heroImageAlt ?? "",
    heroBackgroundBlur: company?.heroBackgroundBlur ?? 0,
  }));
  const [pending, setPending] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteName, setInviteName] = React.useState("");
  const [invitePassword, setInvitePassword] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<Role>("STAFF");
  const [userToDelete, setUserToDelete] = React.useState<Pick<User, "id" | "email" | "role"> | null>(null);
  const [passwordUser, setPasswordUser] = React.useState<Pick<User, "id" | "email"> | null>(null);

  async function saveCompany() {
    setPending(true);
    const res = await updateCompanySettingsAction(form);
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Saved");
    router.refresh();
  }

  async function invite() {
    setPending(true);
    const res = await createUserAction({
      email: inviteEmail,
      name: inviteName,
      password: invitePassword,
      role: inviteRole,
    });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message ?? "Created");
    setInviteEmail("");
    setInviteName("");
    setInvitePassword("");
    router.refresh();
  }

  async function removeUser() {
    if (!userToDelete?.id) return;
    setPending(true);
    const res = await deleteUserAction({ id: userToDelete.id });
    setPending(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setUserToDelete(null);
    toast.success(res.message ?? "User removed");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Company contact card and team accounts.</p>
      </div>

      <Card className="border-border bg-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Header / Navigation</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Edit logo, company line, menu links, CTAs, and theme defaults.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 rounded-xl border-border">
            <Link href="/admin/settings/header">
              <PanelTop className="h-4 w-4" />
              Open header settings
            </Link>
          </Button>
        </div>
      </Card>

      <Card className="border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Company information</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Displayed across the public marketing site.</p>
        <AdminFormIntro className="mt-3">
          Use the display phone for what visitors see; E.164 format (e.g. +639171234567) is used for click-to-call links.
        </AdminFormIntro>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["phoneDisplay", "Phone (display)"],
              ["phoneE164", "Phone (E.164)"],
              ["email", "Email"],
              ["addressLine", "Address line"],
              ["fullAddress", "Full address"],
              ["hours", "Business hours"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1">
              <Label className="text-muted-foreground">{label}</Label>
              <Input
                value={form[key]}
                disabled={!canCompany}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="border-border bg-background text-foreground"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["socialFacebook", "Facebook URL"],
              ["socialInstagram", "Instagram URL"],
              ["socialLinkedin", "LinkedIn URL"],
              ["mapEmbedUrl", "Map embed URL"],
              ["whatsappUrl", "WhatsApp URL"],
              ["messengerUrl", "Messenger URL"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1">
              <Label className="text-muted-foreground">{label}</Label>
              <Input
                value={form[key]}
                disabled={!canCompany}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="border-border bg-background text-foreground"
              />
            </div>
          ))}
        </div>
        {canCompany ? (
          <>
            <AdminImageUrlField
              id="settings-hero-url"
              label="Homepage hero background URL (optional)"
              value={form.heroImageUrl}
              onChange={(v) => setForm((f) => ({ ...f, heroImageUrl: v }))}
              mediaFolder="hero-backgrounds"
              altLabel="Hero image alt text"
              altValue={form.heroImageAlt}
              onAltChange={(v) => setForm((f) => ({ ...f, heroImageAlt: v }))}
              previewBackgroundBlur={form.heroBackgroundBlur}
              disabled={!canCompany}
              className="mt-6"
            />
            <div className="mt-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="settings-hero-bg-blur">Background blur ({form.heroBackgroundBlur}px)</Label>
              </div>
              <input
                id="settings-hero-bg-blur"
                type="range"
                min={0}
                max={20}
                step={1}
                value={form.heroBackgroundBlur}
                disabled={!canCompany}
                className="h-2 w-full max-w-md cursor-pointer accent-accent"
                onChange={(e) =>
                  setForm((f) => ({ ...f, heroBackgroundBlur: Number.parseInt(e.target.value, 10) || 0 }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Blurs only the homepage hero background image. Overlays and text stay sharp.
              </p>
            </div>
            <Button
              type="button"
              className="mt-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={pending}
              onClick={() => void saveCompany()}
            >
              Save company settings
            </Button>
          </>
        ) : (
          <p className="mt-4 text-sm text-amber-400/90">View only — administrators can edit company settings.</p>
        )}
      </Card>

      {canUsers ? (
        <Card className="border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Team users</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Create accounts with roles. Passwords are stored hashed.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-muted-foreground">Email</Label>
              <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="border-border bg-background" />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Name (optional)</Label>
              <Input value={inviteName} onChange={(e) => setInviteName(e.target.value)} className="border-border bg-background" />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Role</Label>
              <select
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Role)}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="STAFF">STAFF</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-muted-foreground">Initial password (min 10 chars)</Label>
              <Input
                type="password"
                value={invitePassword}
                onChange={(e) => setInvitePassword(e.target.value)}
                className="border-border bg-background"
              />
            </div>
          </div>
          <Button type="button" className="mt-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" disabled={pending} onClick={() => void invite()}>
            Create user
          </Button>

          {users.length === 0 ? (
            <AdminEmptyState
              className="mt-6"
              title="No users found"
              description="Create the first team account below. At least one admin is required to manage the site."
            />
          ) : null}
          <div className="mt-8 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {(users ?? []).map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-2 font-mono text-xs">{u.email}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="rounded-lg text-muted-foreground hover:text-foreground"
                          onClick={() => setPasswordUser({ id: u.id, email: u.email })}
                        >
                          <KeyRound className="mr-1 h-3.5 w-3.5" />
                          Change password
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-red-400"
                          onClick={() => setUserToDelete({ id: u.id, email: u.email, role: u.role })}
                          aria-label={`Delete ${u.email}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Team users</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Only administrators can manage user accounts.</p>
        </Card>
      )}

      <ChangeUserPasswordDialog
        user={passwordUser}
        open={Boolean(passwordUser)}
        onOpenChange={(next) => {
          if (!next) setPasswordUser(null);
        }}
      />

      <AlertDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => {
          if (!open) setUserToDelete(null);
        }}
      >
        <AlertDialogContent className="border-border bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Remove user?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-muted-foreground">
              <p>Are you sure you want to remove this user?</p>
              {userToDelete ? (
                <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Email: </span>
                    <span className="font-mono text-foreground">{userToDelete.email}</span>
                  </p>
                  <p className="mt-1">
                    <span className="text-muted-foreground">Role: </span>
                    <span className="text-foreground">{userToDelete.role}</span>
                  </p>
                </div>
              ) : null}
              <p>They will immediately lose admin access.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-muted/50 text-foreground" disabled={pending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-600/90"
              disabled={pending}
              onClick={(e) => {
                e.preventDefault();
                void removeUser();
              }}
            >
              {pending ? "Removing…" : "Remove user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
