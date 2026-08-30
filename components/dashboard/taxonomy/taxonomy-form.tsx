"use client";

import { useState, useTransition } from "react";
import { AlertCircle, Link2 } from "lucide-react";

import { ImageUpload } from "@/components/dashboard/shared/image-upload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { saveTaxonomy } from "@/lib/admin-actions";
import type { TaxonomyInput } from "@/lib/admin-types";

export interface CategoryParentOption {
  id: number;
  name: string;
  path: string;
  depth: number;
}

interface TaxonomyFormProps {
  kind: "category" | "tag";
  mode: "create" | "edit";
  initial: TaxonomyInput;
  initialImageUrl: string | null;
  currentId?: number;
  parentOptions?: CategoryParentOption[];
}

const ROOT_PARENT_VALUE = "root";

function buildCategoryPath(parentPath: string | null, slug: string): string {
  const normalizedSlug = slug.trim() || TAXONOMY_LABELS.slugPlaceholder;
  return parentPath ? `${parentPath}/${normalizedSlug}` : normalizedSlug;
}

export function TaxonomyForm({
  kind,
  mode,
  initial,
  initialImageUrl,
  currentId,
  parentOptions = [],
}: TaxonomyFormProps) {
  const [fields, setFields] = useState({
    name: initial.name,
    slug: initial.slug,
    description: initial.description ?? "",
    metaTitle: initial.metaTitle ?? "",
    metaDescription: initial.metaDescription ?? "",
  });
  const [image, setImage] = useState<string | null>(initial.image);
  const [parentId, setParentId] = useState<string>(
    initial.parentId !== null && initial.parentId !== undefined ? String(initial.parentId) : ROOT_PARENT_VALUE,
  );
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCategory = kind === "category";
  const selectedParent = parentOptions.find((option) => String(option.id) === parentId);
  const categoryPath =
    isCategory && selectedParent ? buildCategoryPath(selectedParent.path, fields.slug) : null;

  function setField<K extends keyof typeof fields>(key: K, value: string) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input: TaxonomyInput = {
      name: fields.name,
      slug: fields.slug.trim(),
      parentId: isCategory && parentId !== ROOT_PARENT_VALUE ? Number(parentId) : null,
      image,
      description: fields.description,
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[14px] font-black">اطلاعات اصلی</CardTitle>
          <p className="text-xs leading-5 text-muted-foreground">نام، نشانی و تصویر — نمایش در وبلاگ و کارت‌ها</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="taxonomy-name" className="text-[13px] font-bold">
                {TAXONOMY_LABELS.nameLabel}
              </Label>
              <Input
                id="taxonomy-name"
                required
                value={fields.name}
                placeholder={TAXONOMY_LABELS.namePlaceholder}
                className="h-10 rounded-xl"
                onChange={(event) => setField("name", event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="taxonomy-slug" className="text-[13px] font-bold">
                {TAXONOMY_LABELS.slugLabel}
              </Label>
              <Input
                id="taxonomy-slug"
                dir="ltr"
                required
                value={fields.slug}
                placeholder={TAXONOMY_LABELS.slugPlaceholder}
                className="h-10 rounded-xl text-start font-mono text-sm"
                onChange={(event) => setField("slug", event.target.value)}
              />
            </div>
          </div>

          {isCategory ? (
            <div className="space-y-1.5">
              <Label htmlFor="taxonomy-parent" className="text-[13px] font-bold">
                {TAXONOMY_LABELS.parentLabel}
              </Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger id="taxonomy-parent" className="h-10 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ROOT_PARENT_VALUE}>{TAXONOMY_LABELS.parentRootOption}</SelectItem>
                  {parentOptions.map((option) => (
                    <SelectItem key={option.id} value={String(option.id)}>
                      {"— ".repeat(option.depth)}
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {categoryPath ? (
            <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5 ring-1 ring-border/60">
              <Link2 className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="text-[11px] font-bold text-muted-foreground">{TAXONOMY_LABELS.urlPreviewLabel}:</span>
              <span dir="ltr" className="truncate font-mono text-[12px] text-foreground">
                /blog/category/{categoryPath}
              </span>
            </div>
          ) : null}

          <Separator className="bg-border/60" />

          <ImageUpload
            id="taxonomy-image"
            initialKey={initial.image}
            initialUrl={initialImageUrl}
            onChange={setImage}
          />
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
            <Label htmlFor="taxonomy-description" className="text-[13px] font-bold">
              {TAXONOMY_LABELS.descriptionLabel}
            </Label>
            <Textarea
              id="taxonomy-description"
              rows={4}
              value={fields.description}
              placeholder={TAXONOMY_LABELS.descriptionPlaceholder}
              className="min-h-[104px] resize-y rounded-xl"
              onChange={(event) => setField("description", event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="taxonomy-meta-title" className="text-[13px] font-bold">
              {TAXONOMY_LABELS.metaTitleLabel}
            </Label>
            <Input
              id="taxonomy-meta-title"
              value={fields.metaTitle}
              placeholder={TAXONOMY_LABELS.metaTitlePlaceholder}
              className="h-10 rounded-xl"
              onChange={(event) => setField("metaTitle", event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="taxonomy-meta-description" className="text-[13px] font-bold">
              {TAXONOMY_LABELS.metaDescriptionLabel}
            </Label>
            <Textarea
              id="taxonomy-meta-description"
              rows={3}
              value={fields.metaDescription}
              placeholder={TAXONOMY_LABELS.metaDescriptionPlaceholder}
              className="min-h-[84px] resize-y rounded-xl"
              onChange={(event) => setField("metaDescription", event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {errorMessage ? (
        <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5">
          <AlertCircle className="size-4" aria-hidden="true" />
          <AlertTitle className="text-[13px] font-bold">خطا در ذخیره</AlertTitle>
          <AlertDescription className="text-[13px] leading-5">{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Separator className="bg-border/60" />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 gap-2 rounded-xl px-8 text-[13px] font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 motion-reduce:transition-none"
        >
          {isPending
            ? TAXONOMY_LABELS.saving
            : mode === "edit"
              ? TAXONOMY_LABELS.submitUpdate
              : TAXONOMY_LABELS.submitCreate}
        </Button>
        <span className="text-xs text-muted-foreground">ذخیره و انتشار آنی</span>
      </div>
    </form>
  );
}
