"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { MediaPicker, type MediaPickerSelection } from "@/components/dashboard/media/media-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { IMAGE_REMOVE_BUTTON } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  id: string;
  initialKey?: string | null;
  initialUrl?: string | null;
  onChange: (key: string | null) => void;
}

export function ImageUpload({ id, initialKey, initialUrl, onChange }: ImageUploadProps) {
  const [image, setImage] = useState<{ key: string; url: string } | null>(
    initialKey && initialUrl ? { key: initialKey, url: initialUrl } : null,
  );

  function handleSelect({ key, src }: MediaPickerSelection) {
    setImage({ key, url: src });
    onChange(key);
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
                className={IMAGE_REMOVE_BUTTON}
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
            <MediaPicker
              trigger={
                <Button
                  type="button"
                  id={id}
                  variant={image ? "outline" : "default"}
                  className="h-10 gap-2 rounded-xl px-4 text-[13px] font-bold shadow-sm"
                >
                  <ImagePlus className="size-4" aria-hidden="true" />
                  {TAXONOMY_LABELS.upload}
                </Button>
              }
              onSelect={handleSelect}
              fields={{ alt: false, caption: false }}
              dialogTitle={TAXONOMY_LABELS.mediaDialogTitle}
              insertLabel={TAXONOMY_LABELS.mediaInsertLabel}
            />

            <span className="text-xs font-medium text-muted-foreground">
              JPG، PNG یا WebP — تا ۱ مگابایت
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
