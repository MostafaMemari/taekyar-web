import { Check } from "lucide-react";

import { FieldLabel, INPUT_CLASSES } from "@/components/shared/form-controls";
import { POST_FORM_LABELS, TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { cn } from "@/lib/utils";
import type { FieldDraft } from "./types";

interface FormFieldsProps {
  fields: FieldDraft;
  onFieldChange: <K extends keyof FieldDraft>(key: K, value: FieldDraft[K]) => void;
  categories: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string }>;
  selectedTagIds: number[];
  onToggleTag: (id: number) => void;
}

export function FormFields({
  fields,
  onFieldChange,
  categories,
  tags,
  selectedTagIds,
  onToggleTag,
}: FormFieldsProps) {
  return (
    <>
      <div>
        <FieldLabel htmlFor="post-title">{POST_FORM_LABELS.titleLabel}</FieldLabel>
        <input
          id="post-title"
          type="text"
          required
          value={fields.title}
          placeholder={POST_FORM_LABELS.titlePlaceholder}
          className={INPUT_CLASSES}
          onChange={(event) => onFieldChange("title", event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="post-slug">{POST_FORM_LABELS.slugLabel}</FieldLabel>
          <input
            id="post-slug"
            type="text"
            dir="ltr"
            required
            value={fields.slug}
            placeholder={POST_FORM_LABELS.slugPlaceholder}
            className={INPUT_CLASSES}
            onChange={(event) => onFieldChange("slug", event.target.value)}
          />
        </div>

        <div>
          <FieldLabel htmlFor="post-category">{POST_FORM_LABELS.categoryLabel}</FieldLabel>
          <select
            id="post-category"
            value={fields.categoryId}
            className={INPUT_CLASSES}
            onChange={(event) => onFieldChange("categoryId", event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="post-excerpt">{POST_FORM_LABELS.excerptLabel}</FieldLabel>
        <textarea
          id="post-excerpt"
          rows={3}
          required
          value={fields.excerpt}
          placeholder={POST_FORM_LABELS.excerptPlaceholder}
          className={cn(INPUT_CLASSES, "resize-y")}
          onChange={(event) => onFieldChange("excerpt", event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="post-date">{POST_FORM_LABELS.dateLabel}</FieldLabel>
          <input
            id="post-date"
            type="text"
            required
            value={fields.date}
            placeholder={POST_FORM_LABELS.datePlaceholder}
            className={INPUT_CLASSES}
            onChange={(event) => onFieldChange("date", event.target.value)}
          />
        </div>

        <div>
          <FieldLabel htmlFor="post-read-time">{POST_FORM_LABELS.readTimeLabel}</FieldLabel>
          <input
            id="post-read-time"
            type="number"
            dir="ltr"
            min={1}
            required
            value={fields.readTimeMinutes}
            className={INPUT_CLASSES}
            onChange={(event) => onFieldChange("readTimeMinutes", event.target.value)}
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-[13px] font-bold text-foreground">
          {POST_FORM_LABELS.tagsLabel}
        </legend>

        {tags.length === 0 ? (
          <p className="text-xs text-muted-foreground">{POST_FORM_LABELS.tagsEmpty}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = selectedTagIds.includes(tag.id);

              return (
                <button
                  key={tag.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onToggleTag(tag.id)}
                  className={cn(
                    "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    selected
                      ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
                  )}
                >
                  {selected ? <Check className="size-3.5" aria-hidden="true" /> : null}
                  {tag.name}
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-1.5 text-xs text-muted-foreground">{POST_FORM_LABELS.tagsHint}</p>
      </fieldset>

      <div className="space-y-4 border-t border-black/[0.06] pt-5">
        <div>
          <p className="text-[13px] font-bold">{TAXONOMY_LABELS.seoTitle}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{TAXONOMY_LABELS.seoHint}</p>
        </div>

        <div>
          <FieldLabel htmlFor="post-meta-title">{TAXONOMY_LABELS.metaTitleLabel}</FieldLabel>
          <input
            id="post-meta-title"
            type="text"
            value={fields.metaTitle}
            placeholder={TAXONOMY_LABELS.metaTitlePlaceholder}
            className={INPUT_CLASSES}
            onChange={(event) => onFieldChange("metaTitle", event.target.value)}
          />
        </div>

        <div>
          <FieldLabel htmlFor="post-meta-description">{TAXONOMY_LABELS.metaDescriptionLabel}</FieldLabel>
          <textarea
            id="post-meta-description"
            rows={3}
            value={fields.metaDescription}
            placeholder={TAXONOMY_LABELS.metaDescriptionPlaceholder}
            className={cn(INPUT_CLASSES, "resize-y")}
            onChange={(event) => onFieldChange("metaDescription", event.target.value)}
          />
        </div>
      </div>
    </>
  );
}
