import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { canManageMedia } from "@/lib/permissions";
import { createId } from "@/lib/utils/id";
import { isMediaFolderId, type MediaFolderId } from "@/lib/domain/media/constants";
import { listMediaAssets } from "@/lib/data/media/media.repository";
import { createMediaAssetCommand } from "@/lib/services/commands/media.commands";
import { canUseLocalMediaStorage, saveMediaFilesLocal } from "@/lib/media/storage";
import { mediaListQuerySchema } from "@/lib/validations/media";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canManageMedia(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const parsed = mediaListQuerySchema.safeParse({
    folder: url.searchParams.get("folder") ?? undefined,
    q: url.searchParams.get("q") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    offset: url.searchParams.get("offset") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid query" }, { status: 400 });
  }

  const { folder, q, limit, offset } = parsed.data;
  try {
    const data = await listMediaAssets({
      folder: folder as MediaFolderId | undefined,
      q,
      limit,
      offset,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[ADMIN_MEDIA_LIST_ERROR]", error);
    return NextResponse.json(
      { error: "Media library is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canManageMedia(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!canUseLocalMediaStorage()) {
    return NextResponse.json(
      {
        error:
          "File uploads are not available in this environment. Use direct image URLs or configure media storage.",
      },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const folderRaw = String(form.get("folder") ?? "");
  if (!isMediaFolderId(folderRaw)) {
    return NextResponse.json({ error: "Invalid media folder" }, { status: 400 });
  }
  const folder = folderRaw as MediaFolderId;

  const full = form.get("full");
  const thumb = form.get("thumb");
  if (!(full instanceof Blob) || !(thumb instanceof Blob)) {
    return NextResponse.json({ error: "Missing image files" }, { status: 400 });
  }
  if (full.size > MAX_UPLOAD_BYTES || thumb.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const mimeType = String(form.get("mimeType") ?? full.type ?? "image/webp");
  const filename = String(form.get("filename") ?? "upload").slice(0, 200);
  const altRaw = form.get("alt");
  const alt = typeof altRaw === "string" && altRaw.trim() ? altRaw.trim().slice(0, 500) : null;
  const width = Number(form.get("width") ?? 0) || null;
  const height = Number(form.get("height") ?? 0) || null;

  const assetId = createId();
  const fullBuffer = Buffer.from(await full.arrayBuffer());
  const thumbBuffer = Buffer.from(await thumb.arrayBuffer());

  let stored;
  try {
    stored = await saveMediaFilesLocal(folder, assetId, mimeType, fullBuffer, thumbBuffer);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save files" },
      { status: 500 },
    );
  }

  const result = await createMediaAssetCommand({
    id: assetId,
    folder,
    filename,
    mimeType,
    publicUrl: stored.publicUrl,
    thumbnailUrl: stored.thumbnailUrl,
    alt,
    width: width ?? 0,
    height: height ?? 0,
    sizeBytes: fullBuffer.length,
    thumbSizeBytes: thumbBuffer.length,
    uploadedById: session.user.id,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ asset: result.asset });
}
