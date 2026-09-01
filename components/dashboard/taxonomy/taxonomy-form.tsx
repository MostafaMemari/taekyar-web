"use client";

import { useState, useTransition } from "react";
import { Link2 } from "lucide-react";

import { CoverImageField, type CoverImageValue } from "@/components/dashboard/shared/cover-image-field";
import { SeoFieldsGroup } from "@/components/dashboard/shared/seo-fields-group";
import { FieldError } from "@/components/shared/form-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { saveTaxonomy } from "@/lib/admin-actions";
import { toast } from "@/hooks/use-toast";
import type { TaxonomyFieldErrors, TaxonomyInput } from "@/lib/admin-types";

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
    seoTitle: initial.seoTitle ?? "",
    seoDescription: initial.seoDescription ?? "",
    keywords: initial.keywords ?? "",
    canonical: initial.canonical ?? "",
    robotsTags: initial.robotsTags ?? "",
  });
  const [coverImage, setCoverImage] = useState<CoverImageValue>({
    key: initial.image ?? null,
    url: initialImageUrl ?? null,
    alt: initial.imageAlt ?? "",
  });
  const [parentId, setParentId] = useState<string>(
    initial.parentId !== null && initial.parentId !== undefined ? String(initial.parentId) : ROOT_PARENT_VALUE,
  );
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<TaxonomyFieldErrors>({});

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
      image: coverImage.key,
      imageAlt: coverImage.alt.trim() || null,
      description: fields.description,
      seoTitle: fields.seoTitle.trim() || null,
      seoDescription: fields.seoDescription.trim() || null,
      keywords: fields.keywords.trim() || null,
      canonical: fields.canonical.trim() || null,
      robotsTags: fields.robotsTags.trim() || null,
    };

    setFieldErrors({});
    startTransition(async () => {
      const result = await saveTaxonomy(kind, mode === "edit" ? currentId ?? null : null, input);
      if (result.status === "error") {
        setFieldErrors(result.fieldErrors ?? {});
        if (result.message) {
          toast({ tone: "error", title: TAXONOMY_LABELS.errorTitle, description: result.message });
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid items-start gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[14px] font-black">اطلاعات اصلی</CardTitle>
              <p className="text-xs leading-5 text-muted-foreground">{TAXONOMY_LABELS.mainInfoHint}</p>
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
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? "taxonomy-name-error" : undefined}
                    onChange={(event) => setField("name", event.target.value)}
                  />
                  <FieldError errorId="taxonomy-name-error" message={fieldErrors.name} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="taxonomy-slug" className="text-[13px] font-bold">
                    {TAXONOMY_LABELS.slugLabel}
                  </Label>
                  <Input
                    id="taxonomy-slug"
                    dir="ltr"
                    value={fields.slug}
                    placeholder={TAXONOMY_LABELS.slugPlaceholder}
                    className="h-10 rounded-xl text-start font-mono text-sm"
                    aria-invalid={Boolean(fieldErrors.slug)}
                    aria-describedby={fieldErrors.slug ? "taxonomy-slug-error" : undefined}
                    onChange={(event) => setField("slug", event.target.value)}
                  />
                  <FieldError errorId="taxonomy-slug-error" message={fieldErrors.slug} />
                  <p className="text-[11px] leading-5 text-muted-foreground">{TAXONOMY_LABELS.slugHint}</p>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[14px] font-black">{TAXONOMY_LABELS.descriptionLabel}</CardTitle>
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
            </CardContent>
          </Card>

          <SeoFieldsGroup
            idPrefix="taxonomy"
            values={{
              seoTitle: fields.seoTitle,
              seoDescription: fields.seoDescription,
              keywords: fields.keywords,
              canonical: fields.canonical,
              robotsTags: fields.robotsTags,
            }}
            onChange={(key, value) =>
              setField(
                key === "title"
                  ? "seoTitle"
                  : key === "description"
                    ? "seoDescription"
                    : key === "robots"
                      ? "robotsTags"
                      : key,
                value,
              )
            }
          />
        </div>

        <aside
          aria-label={TAXONOMY_LABELS.sidebarAriaLabel}
          className="min-w-0 space-y-5 lg:sticky lg:top-8 lg:col-span-1 lg:self-start"
        >
          <CoverImageField
            value={coverImage}
            onChange={setCoverImage}
            labels={{
              title: TAXONOMY_LABELS.imageLabel,
              description: TAXONOMY_LABELS.imageHint,
              select: TAXONOMY_LABELS.upload,
              change: TAXONOMY_LABELS.imageChange,
              remove: TAXONOMY_LABELS.removeImage,
              dialogTitle: TAXONOMY_LABELS.mediaDialogTitle,
              insert: TAXONOMY_LABELS.mediaInsertLabel,
              fallbackAlt: TAXONOMY_LABELS.imageLabel,
            }}
          />
        </aside>
      </div>

      <Separator className="bg-border/60" />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 gap-2 rounded-xl px-8 text-[13px] font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 motion-reduce:transition-none"
        >
          {isPending
            ? TAXONOMY_LABELS.saving
            : mode === "edit"
              ? TAXONOMY_LABELS.submitUpdate
              : TAXONOMY_LABELS.submitCreate}
        </Button>
        <span className="text-xs text-muted-foreground">{TAXONOMY_LABELS.submitHint}</span>
      </div>
    </form>
  );
}
