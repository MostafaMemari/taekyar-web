"use client";

import { useState, useTransition } from "react";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { POST_FORM_LABELS, TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { createPost, updatePost } from "@/lib/admin-actions";
import type { PostInput } from "@/lib/admin-types";
import { parsePostHtml } from "@/lib/post-content";
import { RichContentEditor } from "./rich-content-editor";
import { CoverImageField, type CoverImageValue } from "./post-form/cover-image-field";
import { PostDetailsFields, PostSeoFields, PostTagsFields } from "./post-form/form-fields";
import type { FieldDraft } from "./post-form/types";

interface PostFormProps {
  mode: "create" | "edit";
  initial: PostInput;
  initialCoverUrl?: string | null;
  currentSlug?: string;
  categories: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string }>;
}

export function PostForm({ mode, initial, initialCoverUrl, currentSlug, categories, tags }: PostFormProps) {
  const [fields, setFields] = useState<FieldDraft>({
    title: initial.title,
    slug: initial.slug,
    excerpt: initial.excerpt,
    categoryId: String(initial.categoryId),
    date: initial.date,
    readTimeMinutes: String(initial.readTimeMinutes),
    metaTitle: initial.metaTitle ?? "",
    metaDescription: initial.metaDescription ?? "",
  });
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(initial.tagIds);
  const [coverImage, setCoverImage] = useState<CoverImageValue>({
    key: initial.coverImage ?? null,
    url: initialCoverUrl ?? null,
    alt: initial.coverImageAlt ?? "",
  });
  const [content, setContent] = useState<string>(parsePostHtml(initial.content));
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function setField<K extends keyof FieldDraft>(key: K, value: FieldDraft[K]) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function toggleTag(id: number) {
    setSelectedTagIds((previous) =>
      previous.includes(id) ? previous.filter((tagId) => tagId !== id) : [...previous, id],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input: PostInput = {
      title: fields.title,
      slug: fields.slug.trim(),
      excerpt: fields.excerpt,
      categoryId: Number(fields.categoryId),
      tagIds: selectedTagIds,
      date: fields.date,
      readTimeMinutes: Number(fields.readTimeMinutes),
      content,
      coverImage: coverImage.key,
      coverImageAlt: coverImage.alt.trim() || null,
      metaTitle: fields.metaTitle,
      metaDescription: fields.metaDescription,
    };

    setErrorMessage(null);
    startTransition(async () => {
      const result =
        mode === "edit"
          ? await updatePost({ status: "idle" }, { ...input, currentSlug: currentSlug ?? "" })
          : await createPost({ status: "idle" }, input);

      if (result.status === "error") {
        setErrorMessage(result.message ?? POST_FORM_LABELS.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Card>
        <CardContent className="pt-4">
          <Tabs defaultValue="details">
            <TabsList className="w-full sm:w-fit">
              <TabsTrigger value="details">{POST_FORM_LABELS.detailsTabLabel}</TabsTrigger>
              <TabsTrigger value="cover">{POST_FORM_LABELS.coverImageLabel}</TabsTrigger>
              <TabsTrigger value="tags">{POST_FORM_LABELS.tagsLabel}</TabsTrigger>
              <TabsTrigger value="seo">{TAXONOMY_LABELS.seoTitle}</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-2">
              <PostDetailsFields
                fields={fields}
                onFieldChange={setField}
                categories={categories}
              />
            </TabsContent>

            <TabsContent value="cover" className="pt-2">
              <CoverImageField value={coverImage} onChange={setCoverImage} />
            </TabsContent>

            <TabsContent value="tags" className="pt-2">
              <PostTagsFields tags={tags} selectedTagIds={selectedTagIds} onToggleTag={toggleTag} />
            </TabsContent>

            <TabsContent value="seo" className="pt-2">
              <PostSeoFields fields={fields} onFieldChange={setField} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <RichContentEditor initialContent={content} onChange={setContent} />

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
            ? POST_FORM_LABELS.saving
            : mode === "edit"
              ? POST_FORM_LABELS.submitUpdate
              : POST_FORM_LABELS.submitCreate}
        </Button>
        <span className="text-xs text-muted-foreground">ذخیره پس از اعتبارسنجی انجام می‌شود</span>
      </div>
    </form>
  );
}
