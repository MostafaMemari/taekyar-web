"use server";

import { isMediaKey } from "@/lib/media";
import type { MediaPage } from "@/lib/media-list";
import { getMediaPage } from "@/lib/media-list";
import { deleteImage } from "@/lib/r2";
import { requireSession, revalidateMedia } from "./shared";

export async function listMediaAction(
  options: { query?: string; page?: number } = {},
): Promise<MediaPage> {
  await requireSession();
  return getMediaPage(options);
}

export async function deleteMedia(key: string): Promise<{ ok: boolean }> {
  await requireSession();

  if (!isMediaKey(key)) return { ok: false };

  try {
    await deleteImage(key);
  } catch {
    return { ok: false };
  }

  revalidateMedia();
  return { ok: true };
}
