import { Check } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="space-y-5">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-black">اطلاعات اصلی</CardTitle>
          <p className="text-xs leading-5 text-muted-foreground">عنوان، نشانی و خلاصه مقاله — هسته اطلاعات نمایشی در وبلاگ</p>
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
              onChange={(event) => onFieldChange("title", event.target.value)}
            />
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
                onChange={(event) => onFieldChange("slug", event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="post-category" className="text-[13px] font-bold">
                {POST_FORM_LABELS.categoryLabel}
              </Label>
              <Select value={fields.categoryId} onValueChange={(value) => onFieldChange("categoryId", value)}>
                <SelectTrigger id="post-category" className="h-10 w-full rounded-xl">
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="post-excerpt" className="text-[13px] font-bold">
              {POST_FORM_LABELS.excerptLabel}
            </Label>
            <Textarea
              id="post-excerpt"
              rows={3}
              required
              value={fields.excerpt}
              placeholder={POST_FORM_LABELS.excerptPlaceholder}
              className="min-h-[84px] resize-y rounded-xl"
              onChange={(event) => onFieldChange("excerpt", event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="post-date" className="text-[13px] font-bold">
                {POST_FORM_LABELS.dateLabel}
              </Label>
              <Input
                id="post-date"
                required
                value={fields.date}
                placeholder={POST_FORM_LABELS.datePlaceholder}
                className="h-10 rounded-xl"
                onChange={(event) => onFieldChange("date", event.target.value)}
              />
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
                required
                value={fields.readTimeMinutes}
                className="h-10 rounded-xl text-start font-mono"
                onChange={(event) => onFieldChange("readTimeMinutes", event.target.value)}
              />
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
              onChange={(event) => onFieldChange("metaTitle", event.target.value)}
            />
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
              onChange={(event) => onFieldChange("metaDescription", event.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
