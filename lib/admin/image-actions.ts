"use server";

import { uploadImage } from "@/lib/r2";
import { r2PublicUrl } from "@/lib/r2-url";
import { requireSession } from "./shared";

export async function uploadImageAction(
  file: File,
): Promise<{
  ok: boolean;
  key?: string;
  url?: string;
  error?: "UNSUPPORTED_TYPE" | "FILE_TOO_LARGE" | "UPLOAD_FAILED";
}> {
  await requireSession();

  try {
    const key = await uploadImage(file);
    return { ok: true, key, url: r2PublicUrl(key) };
  } catch (error) {
    const code = error instanceof Error ? error.message : "UPLOAD_FAILED";
    if (code === "UNSUPPORTED_TYPE" || code === "FILE_TOO_LARGE" || code === "UPLOAD_FAILED") {
      return { ok: false, error: code };
    }
    return { ok: false, error: "UPLOAD_FAILED" };
  }
}
