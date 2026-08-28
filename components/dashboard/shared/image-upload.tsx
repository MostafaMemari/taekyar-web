"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { AlertCircle, ImagePlus, Loader2, X } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-3">
      <Label htmlFor={id} className="text-[13px] font-bold">
        {TAXONOMY_LABELS.imageLabel}
      </Label>

      <Card className={cn("overflow-hidden", !image && "border-dashed border-border/70 bg-muted/20")}>
        <CardContent className="p-3 sm:p-4">
          {image ? (
            <div className="relative overflow-hidden rounded-xl bg-card ring-1 ring-border/60">
              <Image
                src={image.url}
                alt={TAXONOMY_LABELS.imageAlt}
                width={640}
                height={360}
                className="aspect-[16/9] w-full object-cover"
                unoptimized
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-3">
                <p className="truncate text-xs font-medium text-white">{image.key}</p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                aria-label={TAXONOMY_LABELS.removeImage}
                className={REMOVE_BUTTON}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl bg-card px-6 py-8 text-center ring-1 ring-border/60">
              <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
                <ImagePlus className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-3 text-[13px] font-bold">تصویری انتخاب نشده</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{TAXONOMY_LABELS.imageHint}</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
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
              variant={image ? "outline" : "default"}
              disabled={isPending}
              onClick={() => inputRef.current?.click()}
              className="h-10 gap-2 rounded-xl px-4 text-[13px] font-bold shadow-sm"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <ImagePlus className="size-4" aria-hidden="true" />
              )}
              {isPending ? TAXONOMY_LABELS.uploading : image ? "تغییر تصویر" : TAXONOMY_LABELS.upload}
            </Button>

            <span className="text-xs font-medium text-muted-foreground">
              JPG، PNG یا WebP — تا ۵ مگابایت
            </span>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5">
          <AlertCircle className="size-4" aria-hidden="true" />
          <AlertTitle className="text-[13px] font-bold">خطا در آپلود</AlertTitle>
          <AlertDescription className="text-[13px] leading-5">{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
