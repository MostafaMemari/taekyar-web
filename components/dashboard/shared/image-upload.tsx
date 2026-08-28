"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { FieldError, FieldLabel } from "@/components/shared/form-controls";
import { Button } from "@/components/ui/button";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { uploadImageAction } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  id: string;
  initialKey?: string | null;
  initialUrl?: string | null;
  onChange: (key: string | null) => void;
}

const REMOVE_BUTTON =
  "absolute -end-2 -top-2 flex size-7 items-center justify-center rounded-full bg-card text-destructive shadow-md ring-1 ring-black/[0.06] transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function ImageUpload({ id, initialKey, initialUrl, onChange }: ImageUploadProps) {
  const [image, setImage] = useState<{ key: string; url: string } | null>(
    initialKey && initialUrl ? { key: initialKey, url: initialUrl } : null,
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError(null);
    startTransition(async () => {
      const result = await uploadImageAction(file);
      if (result.ok && result.key && result.url) {
        setImage({ key: result.key, url: result.url });
        onChange(result.key);
        return;
      }

      if (result.error === "UNSUPPORTED_TYPE") setError(TAXONOMY_LABELS.unsupportedType);
      else if (result.error === "FILE_TOO_LARGE") setError(TAXONOMY_LABELS.fileTooLarge);
      else setError(TAXONOMY_LABELS.uploadError);
    });
  }

  function handleRemove() {
    setImage(null);
    onChange(null);
  }

  return (
    <div className="space-y-2.5">
      <FieldLabel htmlFor={id}>{TAXONOMY_LABELS.imageLabel}</FieldLabel>

      {image ? (
        <div className="relative w-fit">
          <img
            src={image.url}
            alt={TAXONOMY_LABELS.imageAlt}
            className="h-32 w-auto rounded-xl object-cover shadow-sm ring-1 ring-black/[0.06]"
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label={TAXONOMY_LABELS.removeImage}
            className={REMOVE_BUTTON}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
            event.target.value = "";
          }}
        />

        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
          className={cn("h-10 gap-2 rounded-xl text-[13px] font-bold", !image && "border-dashed")}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="size-4" />
          )}
          {isPending ? TAXONOMY_LABELS.uploading : TAXONOMY_LABELS.upload}
        </Button>

        <span className="text-xs text-muted-foreground">{TAXONOMY_LABELS.imageHint}</span>
      </div>

      {error ? <FieldError errorId={`${id}-error`} message={error} /> : null}
    </div>
  );
}
