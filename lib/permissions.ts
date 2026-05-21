import type { Role } from "@prisma/client";

export function canManageUsers(role: Role): boolean {
  return role === "ADMIN";
}

export function canChangeUserPassword(role: Role): boolean {
  return role === "ADMIN";
}

export function canEditCompanySettings(role: Role): boolean {
  return role === "ADMIN";
}

export function canDeleteContent(role: Role): boolean {
  return role === "ADMIN";
}

export function canManageGallery(role: Role): boolean {
  return role === "ADMIN" || role === "STAFF";
}

/** Brand logos — same roles as gallery editorial. */
export function canManageBrands(role: Role): boolean {
  return role === "ADMIN" || role === "STAFF";
}

export function canManageProjects(role: Role): boolean {
  return role === "ADMIN" || role === "STAFF";
}

export function canManageTestimonials(role: Role): boolean {
  return role === "ADMIN" || role === "STAFF";
}

export function canManageServices(role: Role): boolean {
  return role === "ADMIN" || role === "STAFF";
}

export function canManageBlog(role: Role): boolean {
  return role === "ADMIN" || role === "STAFF";
}

/** Media library — upload, pick, and organize site images. */
export function canManageMedia(role: Role): boolean {
  return role === "ADMIN" || role === "STAFF";
}

/** VIEWER: dashboard read-only; no create/update/delete except profile none */
export function canMutateContent(role: Role): boolean {
  return role === "ADMIN" || role === "STAFF";
}
