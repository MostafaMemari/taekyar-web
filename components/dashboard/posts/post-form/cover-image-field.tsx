"use client";

import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

import { MediaPicker, type MediaPickerSelection } from "@/components/dashboard/media/media-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { IMAGE_REMOVE_BUTTON } from "@/lib/styles";

export interface CoverImageValue {
  key: string | null;
  url: string | null;
  alt: string;
}

interface CoverImageFieldProps {
  value: CoverImageValue;
  onChange: (value: CoverImageValue) => void;
}

export function CoverImageField({ value, onChange }: CoverImageFieldProps) {
  function handleSelect({ key, src, alt }: MediaPickerSelection) {
    onChange({ key, url: src, alt });
  }

  function handleRemove() {
    onChange({ key: null, url: null, alt: "" });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-black">{POST_FORM_LABELS.coverImageLabel}</CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">{POST_FORM_LABELS.coverImageDescription}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {value.key && value.url ? (
          <div className="relative overflow-hidden rounded-xl bg-card ring-1 ring-border/60">
            <Image
              src={value.url}
              alt={value.alt || POST_FORM_LABELS.coverImageLabel}
              width={640}
              height={360}
              className="aspect-[16/9] w-full object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={handleRemove}
              aria-label={POST_FORM_LABELS.coverImageRemove}
              className={IMAGE_REMOVE_BUTTON}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl bg-muted/20 px-6 py-8 text-center ring-1 ring-border/60">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
              <ImagePlus className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-3 text-[13px] font-bold">{POST_FORM_LABELS.coverImageSelect}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{POST_FORM_LABELS.coverImageDescription}</p>
          </div>
        )}

        {value.key ? (
          <div className="space-y-1.5">
            <Label htmlFor="cover-image-alt" className="text-[13px] font-bold">
              {POST_FORM_LABELS.imageAltLabel}
            </Label>
            <Input
              id="cover-image-alt"
              value={value.alt}
              placeholder={POST_FORM_LABELS.imageAltPlaceholder}
              className="h-10 rounded-xl"
              onChange={(event) => onChange({ ...value, alt: event.target.value })}
            />
          </div>
        ) : null}

        <MediaPicker
          trigger={
            <Button
              type="button"
              variant={value.key ? "outline" : "default"}
              className="h-10 gap-2 rounded-xl px-4 text-[13px] font-bold shadow-sm"
            >
              <ImagePlus className="size-4" aria-hidden="true" />
              {value.key ? POST_FORM_LABELS.coverImageChange : POST_FORM_LABELS.coverImageSelect}
            </Button>
          }
          onSelect={handleSelect}
          fields={{ alt: true, caption: false }}
          dialogTitle={POST_FORM_LABELS.coverImageDialogTitle}
          insertLabel={POST_FORM_LABELS.coverImageInsert}
        />
      </CardContent>
    </Card>
  );
}
