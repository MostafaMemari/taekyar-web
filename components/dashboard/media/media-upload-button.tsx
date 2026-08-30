"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MEDIA_LABELS, UPLOAD_ERROR_LABELS } from "@/data/dashboard/ui";
import { toast } from "@/hooks/use-toast";
import { uploadImageAction } from "@/lib/admin-actions";
import { toPersianDigits } from "@/lib/utils";

type UploadError = "UNSUPPORTED_TYPE" | "FILE_TOO_LARGE" | "UPLOAD_FAILED";

function uploadErrorMessage(error?: UploadError): string {
  if (error === "UNSUPPORTED_TYPE") return UPLOAD_ERROR_LABELS.unsupportedType;
  if (error === "FILE_TOO_LARGE") return UPLOAD_ERROR_LABELS.fileTooLarge;
  return UPLOAD_ERROR_LABELS.uploadError;
}

export function MediaUploadButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const batch = Array.from(files);

    startTransition(async () => {
      const results = await Promise.all(batch.map((file) => uploadImageAction(file)));
      const uploaded = results.filter((result) => result.ok).length;
      const failed = results.length - uploaded;

      if (uploaded > 0) router.refresh();

      if (failed === 0) {
        toast({
          tone: "success",
          title: MEDIA_LABELS.uploaded,
          description: `${toPersianDigits(String(uploaded))} ${MEDIA_LABELS.uploadedSuffix}`,
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

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <Button
        type="button"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        className="h-10 gap-2 rounded-xl px-4 text-[13px] font-bold shadow-md shadow-primary/15"
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Upload className="size-4" aria-hidden="true" />
        )}
        {isPending ? MEDIA_LABELS.uploading : MEDIA_LABELS.upload}
      </Button>
    </>
  );
}
