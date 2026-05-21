import { z } from "zod";

import { MEDIA_UPLOAD_PREFIX } from "@/lib/domain/media/constants";



export function isHttpOrHttpsUrl(s: string): boolean {

  try {

    const u = new URL(s);

    return u.protocol === "http:" || u.protocol === "https:";

  } catch {

    return false;

  }

}



/** Site-hosted media library path (e.g. /uploads/media/projects/abc.webp). */

export function isMediaLibraryPath(s: string): boolean {

  const t = s.trim();

  if (!t.startsWith(MEDIA_UPLOAD_PREFIX)) return false;

  if (t.startsWith("//")) return false;

  return !t.includes("..");

}



/** Local asset path or remote http(s) URL (blocks javascript:, data:, etc.). */

export function isSafeImageSource(s: string): boolean {

  if (isMediaLibraryPath(s)) return true;

  if (s.startsWith("/")) return !s.startsWith("//");

  return isHttpOrHttpsUrl(s);

}



/** Empty / missing → null; otherwise http(s) or media library path. */

export const optionalRemoteImageUrl = z.preprocess(

  (v) => {

    if (v === undefined || v === null) return null;

    if (typeof v !== "string") return null;

    const t = v.trim();

    return t === "" ? null : t;

  },

  z.union([z.null(), z.string().max(2000)]).refine((v) => v === null || isSafeImageSource(v), {

    message: "Use a public https URL or select an image from the media library",

  }),

);


