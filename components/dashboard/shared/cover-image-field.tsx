"use client";

import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

import { MediaPicker, type MediaPickerSelection } from "@/components/dashboard/media/media-picker";
import { FieldError } from "@/components/shared/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { IMAGE_REMOVE_BUTTON } from "@/lib/styles";
import { cn } from "@/lib/utils";

export interface CoverImageValue {
  key: string | null;
  url: string | null;
  alt: string;
}

export interface CoverImageLabels {
  title: string;
  description: string;
  select: string;
  change: string;
  remove: string;
  dialogTitle: string;
  insert: string;
  altLabel: string;
  altPlaceholder: string;
  fallbackAlt: string;
}

const DEFAULT_LABELS: CoverImageLabels = {
  title: POST_FORM_LABELS.coverImageLabel,
  description: POST_FORM_LABELS.coverImageDescription,
  select: POST_FORM_LABELS.coverImageSelect,
  change: POST_FORM_LABELS.coverImageChange,
  remove: POST_FORM_LABELS.coverImageRemove,
  dialogTitle: POST_FORM_LABELS.coverImageDialogTitle,
  insert: POST_FORM_LABELS.coverImageInsert,
  altLabel: POST_FORM_LABELS.imageAltLabel,
  altPlaceholder: POST_FORM_LABELS.imageAltPlaceholder,
  fallbackAlt: POST_FORM_LABELS.coverImageLabel,
};

interface CoverImageFieldProps {
  value: CoverImageValue;
  onChange: (value: CoverImageValue) => void;
  labels?: Partial<CoverImageLabels>;
  error?: string;
  altError?: string;
}

export function CoverImageField({ value, onChange, labels, error, altError }: CoverImageFieldProps) {
  const t = { ...DEFAULT_LABELS, ...labels };

  function handleSelect({ key, src, alt }: MediaPickerSelection) {
    onChange({ key, url: src, alt });
  }

  function handleRemove() {
    onChange({ key: null, url: null, alt: "" });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-black">{t.title}</CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">{t.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldError errorId="cover-image-error" message={error} />
        {value.key && value.url ? (
          <div className="relative">
            <MediaPicker
              trigger={
                <button
                  type="button"
                  title={t.change}
                  aria-label={t.change}
                  className="group relative block w-full cursor-pointer overflow-hidden rounded-xl bg-card ring-1 ring-border/60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 hover:ring-primary/40 hover:shadow-md motion-reduce:transition-none"
                >
                  <Image
                    src={value.url}
                    alt={value.alt || t.fallbackAlt}
                    width={640}
                    height={360}
                    className="aspect-[16/9] w-full object-cover transition-opacity group-hover:opacity-90 motion-reduce:transition-none"
                    unoptimized
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors group-hover:bg-foreground/15 motion-reduce:transition-none"
                  >
                    <span className="rounded-full bg-black/60 px-3 py-1.5 text-[12px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none">
                      {t.change}
                    </span>
                  </span>
                </button>
              }
              onSelect={handleSelect}
              fields={{ alt: true, caption: false }}
              dialogTitle={t.dialogTitle}
              insertLabel={t.insert}
            />
            <button
              type="button"
              onClick={handleRemove}
              aria-label={t.remove}
              className={cn(IMAGE_REMOVE_BUTTON, "cursor-pointer")}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <MediaPicker
            trigger={
              <button
                type="button"
                className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-muted/20 px-6 py-8 text-center ring-1 ring-border/60 transition-all hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
                  <ImagePlus className="size-6" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[13px] font-bold">{t.select}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.description}</p>
              </button>
            }
            onSelect={handleSelect}
            fields={{ alt: true, caption: false }}
            dialogTitle={t.dialogTitle}
            insertLabel={t.insert}
          />
        )}

        {value.key ? (
          <div className="space-y-1.5">
            <Label htmlFor="cover-image-alt" className="text-[13px] font-bold">
              {t.altLabel}
            </Label>
            <Input
              id="cover-image-alt"
              value={value.alt}
              placeholder={t.altPlaceholder}
              className="h-10 rounded-xl"
              aria-invalid={Boolean(altError)}
              aria-describedby={altError ? "cover-image-alt-error" : undefined}
              onChange={(event) => onChange({ ...value, alt: event.target.value })}
            />
            <FieldError errorId="cover-image-alt-error" message={altError} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
