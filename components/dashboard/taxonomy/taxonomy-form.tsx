"use client";

import { useState, useTransition } from "react";

import { ImageUpload } from "@/components/dashboard/shared/image-upload";
import { FieldError, FieldLabel, INPUT_CLASSES } from "@/components/shared/form-controls";
import { Button } from "@/components/ui/button";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { saveTaxonomy } from "@/lib/admin-actions";
import type { TaxonomyInput } from "@/lib/admin-types";
import { cn } from "@/lib/utils";

interface TaxonomyFormProps {
  kind: "category" | "tag";
  mode: "create" | "edit";
  initial: TaxonomyInput;
  initialImageUrl: string | null;
  currentId?: number;
}

export function TaxonomyForm({ kind, mode, initial, initialImageUrl, currentId }: TaxonomyFormProps) {
  const [fields, setFields] = useState({
    name: initial.name,
    slug: initial.slug,
    metaTitle: initial.metaTitle ?? "",
    metaDescription: initial.metaDescription ?? "",
  });
  const [image, setImage] = useState<string | null>(initial.image);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function setField<K extends keyof typeof fields>(key: K, value: string) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input: TaxonomyInput = {
      name: fields.name,
      slug: fields.slug.trim(),
      image,
      metaTitle: fields.metaTitle,
      metaDescription: fields.metaDescription,
    };

    setErrorMessage(null);
    startTransition(async () => {
      const result = await saveTaxonomy(kind, mode === "edit" ? currentId ?? null : null, input);
      if (result.status === "error") {
        setErrorMessage(result.message ?? TAXONOMY_LABELS.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="taxonomy-name">{TAXONOMY_LABELS.nameLabel}</FieldLabel>
          <input
            id="taxonomy-name"
            type="text"
            required
            value={fields.name}
            placeholder={TAXONOMY_LABELS.namePlaceholder}
            className={INPUT_CLASSES}
            onChange={(event) => setField("name", event.target.value)}
          />
        </div>

        <div>
          <FieldLabel htmlFor="taxonomy-slug">{TAXONOMY_LABELS.slugLabel}</FieldLabel>
          <input
            id="taxonomy-slug"
            type="text"
            dir="ltr"
            required
            value={fields.slug}
            placeholder={TAXONOMY_LABELS.slugPlaceholder}
            className={INPUT_CLASSES}
            onChange={(event) => setField("slug", event.target.value)}
          />
        </div>
      </div>

      <ImageUpload
        id="taxonomy-image"
        initialKey={initial.image}
        initialUrl={initialImageUrl}
        onChange={setImage}
      />

      <div className="space-y-4 border-t border-black/[0.06] pt-5">
        <div>
          <p className="text-[13px] font-bold">{TAXONOMY_LABELS.seoTitle}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{TAXONOMY_LABELS.seoHint}</p>
        </div>

        <div>
          <FieldLabel htmlFor="taxonomy-meta-title">{TAXONOMY_LABELS.metaTitleLabel}</FieldLabel>
          <input
            id="taxonomy-meta-title"
            type="text"
            value={fields.metaTitle}
            placeholder={TAXONOMY_LABELS.metaTitlePlaceholder}
            className={INPUT_CLASSES}
            onChange={(event) => setField("metaTitle", event.target.value)}
          />
        </div>

        <div>
          <FieldLabel htmlFor="taxonomy-meta-description">{TAXONOMY_LABELS.metaDescriptionLabel}</FieldLabel>
          <textarea
            id="taxonomy-meta-description"
            rows={3}
            value={fields.metaDescription}
            placeholder={TAXONOMY_LABELS.metaDescriptionPlaceholder}
            className={cn(INPUT_CLASSES, "resize-y")}
            onChange={(event) => setField("metaDescription", event.target.value)}
          />
        </div>
      </div>

      {errorMessage ? (
        <FieldError errorId="taxonomy-form-error" message={errorMessage} />
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-black/[0.06] pt-5">
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 gap-2 rounded-xl px-8 text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90"
        >
          {isPending
            ? TAXONOMY_LABELS.saving
            : mode === "edit"
              ? TAXONOMY_LABELS.submitUpdate
              : TAXONOMY_LABELS.submitCreate}
        </Button>
      </div>
    </form>
  );
}
