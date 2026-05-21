import type { MediaFolderId } from "@/lib/domain/media/constants";
import { getSafeMediaItems } from "@/lib/admin/safe-admin-data";

export async function getAdminMediaAssets(params?: {
  folder?: MediaFolderId;
  limit?: number;
}) {
  const { items, total } = await getSafeMediaItems(params?.limit ?? 120);
  if (!params?.folder) return { items, total };
  const filtered = items.filter((i) => i.folder === params.folder);
  return { items: filtered, total: filtered.length };
}
