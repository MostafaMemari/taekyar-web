"use client";

import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import { MEDIA_LABELS, UPLOAD_ERROR_LABELS } from "@/data/dashboard/ui";
import { ApiClientError } from "@/lib/api/client";
import { mediaApi } from "@/lib/api/endpoints";
import { MEDIA_MAX_BYTES } from "@/lib/media";
import { toPersianDigits } from "@/lib/utils";

type UploadError = "UNSUPPORTED_TYPE" | "FILE_TOO_LARGE" | "UPLOAD_FAILED";

interface UploadResult {
  ok: boolean;
  key?: string;
  error?: UploadError;
}

function uploadErrorMessage(error?: UploadError): string {
  if (error === "UNSUPPORTED_TYPE") return UPLOAD_ERROR_LABELS.unsupportedType;
  if (error === "FILE_TOO_LARGE") return UPLOAD_ERROR_LABELS.fileTooLarge;
  return UPLOAD_ERROR_LABELS.uploadError;
}

interface UseMediaUploadOptions {
  onUploaded?: (keys: string[]) => void;
}

export function useMediaUpload({ onUploaded }: UseMediaUploadOptions = {}) {
  const [isPending, startTransition] = useTransition();

  function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const batch = Array.from(files);
    const valid = batch.filter((file) => file.size <= MEDIA_MAX_BYTES);
    const oversized = batch.filter((file) => file.size > MEDIA_MAX_BYTES);

    startTransition(async () => {
      let results: UploadResult[];
      try {
        const uploaded = await Promise.all(
          valid.map(async (file): Promise<UploadResult> => {
            try {
              const result = await mediaApi.upload(file);
              return { ok: result.ok, key: result.key };
            } catch (error) {
              if (error instanceof ApiClientError) {
                return { ok: false, error: error.code as UploadError } as UploadResult;
              }
              return { ok: false, error: "UPLOAD_FAILED" } as UploadResult;
            }
          }),
        );
        results = [
          ...uploaded,
          ...oversized.map((): UploadResult => ({ ok: false, error: "FILE_TOO_LARGE" })),
        ];
      } catch {
        toast({
          tone: "error",
          title: UPLOAD_ERROR_LABELS.uploadError,
          description: `${toPersianDigits(String(batch.length))} ${MEDIA_LABELS.uploadFailedSuffix}`,
        });
        return;
      }

      const keys = results
        .filter((result) => result.ok && result.key)
        .map((result) => result.key as string);
      const failed = results.length - keys.length;

      if (keys.length > 0) onUploaded?.(keys);

      if (failed === 0) {
        toast({
          tone: "success",
          title: MEDIA_LABELS.uploaded,
          description: `${toPersianDigits(String(keys.length))} ${MEDIA_LABELS.uploadedSuffix}`,
        });
        return;
      }

      toast({
        tone: "error",
        title: uploadErrorMessage(results.find((result) => !result.ok)?.error),
        description: `${toPersianDigits(String(failed))} ${MEDIA_LABELS.uploadFailedSuffix}`,
      });
    });
  }

  return { isPending, upload };
}
