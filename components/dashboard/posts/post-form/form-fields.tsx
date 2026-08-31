import { Check } from "lucide-react";

import { FieldError } from "@/components/shared/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { POST_FORM_LABELS, TAXONOMY_LABELS } from "@/data/dashboard/ui";
import type { PostFieldErrors } from "@/lib/admin-types";
import { cn } from "@/lib/utils";
import type { FieldDraft } from "./types";

const NO_CATEGORY_VALUE = "none";

interface FormFieldsProps {
  fields: FieldDraft;
  onFieldChange: <K extends keyof FieldDraft>(key: K, value: FieldDraft[K]) => void;
  categories: Array<{ id: number; name: string; depth: number }>;
  tags: Array<{ id: number; name: string }>;
  selectedTagIds: number[];
  onToggleTag: (id: number) => void;
  fieldErrors: PostFieldErrors;
}

export function FormFields({
  fields,
  onFieldChange,
  categories,
  tags,
  selectedTagIds,
  onToggleTag,
  fieldErrors,
}: FormFieldsProps) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-black">اطلاعات اصلی</CardTitle>
          <p className="text-xs leading-5 text-muted-foreground">عنوان و نشانی الزامی است؛ بقیه اختیاری.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="post-title" className="text-[13px] font-bold">
              {POST_FORM_LABELS.titleLabel}
            </Label>
            <Input
              id="post-title"
              required
              value={fields.title}
              placeholder={POST_FORM_LABELS.titlePlaceholder}
              className="h-10 rounded-xl"
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={fieldErrors.title ? "post-title-error" : undefined}
              onChange={(event) => onFieldChange("title", event.target.value)}
            />
            <FieldError errorId="post-title-error" message={fieldErrors.title} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="post-slug" className="text-[13px] font-bold">
                {POST_FORM_LABELS.slugLabel}
              </Label>
              <Input
                id="post-slug"
                dir="ltr"
                required
                value={fields.slug}
                placeholder={POST_FORM_LABELS.slugPlaceholder}
                className="h-10 rounded-xl text-start font-mono text-sm"
                aria-invalid={Boolean(fieldErrors.slug)}
                aria-describedby={fieldErrors.slug ? "post-slug-error" : undefined}
                onChange={(event) => onFieldChange("slug", event.target.value)}
              />
              <FieldError errorId="post-slug-error" message={fieldErrors.slug} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="post-category" className="text-[13px] font-bold">
                {POST_FORM_LABELS.categoryLabel}
              </Label>
              <Select value={fields.categoryId} onValueChange={(value) => onFieldChange("categoryId", value)}>
                <SelectTrigger
                  id="post-category"
                  className="h-10 w-full rounded-xl"
                  aria-invalid={Boolean(fieldErrors.categoryId)}
                  aria-describedby={fieldErrors.categoryId ? "post-category-error" : undefined}
                >
                  <SelectValue placeholder="انتخاب دسته‌بندی (اختیاری)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY_VALUE}>بدون دسته‌بندی</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {"— ".repeat(category.depth)}
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errorId="post-category-error" message={fieldErrors.categoryId} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="post-excerpt" className="text-[13px] font-bold">
              {POST_FORM_LABELS.excerptLabel}
            </Label>
            <Textarea
              id="post-excerpt"
              rows={3}
              value={fields.excerpt}
              placeholder={POST_FORM_LABELS.excerptPlaceholder}
              className="min-h-[84px] resize-y rounded-xl"
              aria-invalid={Boolean(fieldErrors.excerpt)}
              aria-describedby={fieldErrors.excerpt ? "post-excerpt-error" : undefined}
              onChange={(event) => onFieldChange("excerpt", event.target.value)}
            />
            <FieldError errorId="post-excerpt-error" message={fieldErrors.excerpt} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="post-date" className="text-[13px] font-bold">
                {POST_FORM_LABELS.dateLabel}
              </Label>
              <Input
                id="post-date"
                value={fields.date}
                placeholder={POST_FORM_LABELS.datePlaceholder}
                className="h-10 rounded-xl"
                aria-invalid={Boolean(fieldErrors.date)}
                aria-describedby={fieldErrors.date ? "post-date-error" : undefined}
                onChange={(event) => onFieldChange("date", event.target.value)}
              />
              <FieldError errorId="post-date-error" message={fieldErrors.date} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="post-read-time" className="text-[13px] font-bold">
                {POST_FORM_LABELS.readTimeLabel}
              </Label>
              <Input
                id="post-read-time"
                type="number"
                dir="ltr"
                min={1}
                value={fields.readTimeMinutes}
                placeholder="۵"
                className="h-10 rounded-xl text-start font-mono"
                aria-invalid={Boolean(fieldErrors.readTimeMinutes)}
                aria-describedby={fieldErrors.readTimeMinutes ? "post-read-time-error" : undefined}
                onChange={(event) => onFieldChange("readTimeMinutes", event.target.value)}
              />
              <FieldError errorId="post-read-time-error" message={fieldErrors.readTimeMinutes} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-black">{POST_FORM_LABELS.tagsLabel}</CardTitle>
          <p className="text-xs leading-5 text-muted-foreground">{POST_FORM_LABELS.tagsHint}</p>
        </CardHeader>
        <CardContent>
          {tags.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-6 text-center">
              <p className="text-[13px] font-medium text-muted-foreground">{POST_FORM_LABELS.tagsEmpty}</p>
            </div>
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
                      "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 motion-reduce:transition-none",
                      selected
                        ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
                    )}
                  >
                    {selected ? <Check className="size-3.5 shrink-0" aria-hidden="true" /> : null}
                    {tag.name}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-black">{TAXONOMY_LABELS.seoTitle}</CardTitle>
          <p className="text-xs leading-5 text-muted-foreground">{TAXONOMY_LABELS.seoHint}</p>
        </CardHeader>
        <Separator className="bg-border/60" />
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="post-meta-title" className="text-[13px] font-bold">
              {TAXONOMY_LABELS.metaTitleLabel}
            </Label>
            <Input
              id="post-meta-title"
              value={fields.metaTitle}
              placeholder={TAXONOMY_LABELS.metaTitlePlaceholder}
              className="h-10 rounded-xl"
              aria-invalid={Boolean(fieldErrors.metaTitle)}
              aria-describedby={fieldErrors.metaTitle ? "post-meta-title-error" : undefined}
              onChange={(event) => onFieldChange("metaTitle", event.target.value)}
            />
            <FieldError errorId="post-meta-title-error" message={fieldErrors.metaTitle} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="post-meta-description" className="text-[13px] font-bold">
              {TAXONOMY_LABELS.metaDescriptionLabel}
            </Label>
            <Textarea
              id="post-meta-description"
              rows={3}
              value={fields.metaDescription}
              placeholder={TAXONOMY_LABELS.metaDescriptionPlaceholder}
              className="min-h-[84px] resize-y rounded-xl"
              aria-invalid={Boolean(fieldErrors.metaDescription)}
              aria-describedby={fieldErrors.metaDescription ? "post-meta-description-error" : undefined}
              onChange={(event) => onFieldChange("metaDescription", event.target.value)}
            />
            <FieldError errorId="post-meta-description-error" message={fieldErrors.metaDescription} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
