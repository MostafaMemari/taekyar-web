"use server";

import { MEDIA_PREFIX } from "@/lib/media";
import { deleteImage } from "@/lib/r2";
import { requireSession, revalidateMedia } from "./shared";

const MEDIA_KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9/_.-]{0,299}$/;

function isDeletableMediaKey(key: string): boolean {
  return (
    key.startsWith(MEDIA_PREFIX) &&
    !key.includes("..") &&
    !key.includes("//") &&
    MEDIA_KEY_PATTERN.test(key)
  );
}

export async function deleteMedia(key: string): Promise<{ ok: boolean }> {
  await requireSession();

  if (!isDeletableMediaKey(key)) return { ok: false };

  try {
    await deleteImage(key);
  } catch {
    return { ok: false };
  }

  revalidateMedia();
  return { ok: true };
}
