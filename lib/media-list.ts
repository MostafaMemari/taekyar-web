import { MEDIA_PREFIX, toMediaItem, type MediaItem } from "@/lib/media";
import { listObjects, type R2Object } from "@/lib/r2";
import { r2PublicUrl } from "@/lib/r2-url";

export const MEDIA_PAGE_SIZE = 24;

export interface MediaPage {
  items: MediaItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  failed: boolean;
}

function toSortedItems(objects: R2Object[]): MediaItem[] {
  return objects
    .map((object) => toMediaItem(object, r2PublicUrl(object.key)))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function getMediaPage(
  options: { query?: string; page?: number; perPage?: number } = {},
): Promise<MediaPage> {
  const perPage = options.perPage ?? MEDIA_PAGE_SIZE;

  let objects: R2Object[] = [];
  let failed = false;
  try {
    objects = await listObjects(MEDIA_PREFIX);
  } catch {
    failed = true;
  }

  const query = (options.query ?? "").trim().toLowerCase();
  const items = toSortedItems(objects).filter(
    (item) => !query || item.name.toLowerCase().includes(query),
  );

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(Number(options.page) || 1, 1), totalPages);

  return {
    items: items.slice((currentPage - 1) * perPage, currentPage * perPage),
    total,
    totalPages,
    currentPage,
    failed,
  };
}
