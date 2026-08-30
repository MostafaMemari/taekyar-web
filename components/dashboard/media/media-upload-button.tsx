"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Upload } from "lucide-react";

import { useMediaUpload } from "./hooks/use-media-upload";
import { Button } from "@/components/ui/button";
import { MEDIA_LABELS } from "@/data/dashboard/ui";

export function MediaUploadButton() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isPending, upload } = useMediaUpload({ onUploaded: () => router.refresh() });

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          upload(event.target.files);
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
