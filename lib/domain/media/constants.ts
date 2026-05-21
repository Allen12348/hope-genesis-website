/** Media library folder slugs — used in storage paths and admin filters. */
export const MEDIA_FOLDERS = [
  { id: "hero-backgrounds", label: "Hero Backgrounds" },
  { id: "projects", label: "Projects" },
  { id: "gallery", label: "Gallery" },
  { id: "testimonials", label: "Testimonials" },
  { id: "blog-covers", label: "Blog Covers" },
  { id: "brands", label: "Brands" },
  { id: "team", label: "Team" },
  { id: "before-after", label: "Before / After" },
] as const;

export type MediaFolderId = (typeof MEDIA_FOLDERS)[number]["id"];

export const MEDIA_FOLDER_IDS = MEDIA_FOLDERS.map((f) => f.id) as MediaFolderId[];

export function mediaFolderLabel(id: string): string {
  return MEDIA_FOLDERS.find((f) => f.id === id)?.label ?? id;
}

export function isMediaFolderId(id: string): id is MediaFolderId {
  return (MEDIA_FOLDER_IDS as readonly string[]).includes(id);
}

export const MEDIA_UPLOAD_PREFIX = "/uploads/media";
