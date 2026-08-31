"use client";

import { useState, useTransition } from "react";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { createPost, updatePost } from "@/lib/admin-actions";
import type { PostFieldErrors, PostInput } from "@/lib/admin-types";
import { parsePostHtml } from "@/lib/post-content";
import { RichContentEditor } from "./rich-content-editor";
import { CoverImageField, type CoverImageValue } from "./post-form/cover-image-field";
import { FormFields } from "./post-form/form-fields";
import type { FieldDraft } from "./post-form/types";

interface PostFormProps {
  mode: "create" | "edit";
  initial: PostInput;
  initialCoverUrl?: string | null;
  currentSlug?: string;
  categories: Array<{ id: number; name: string; depth: number }>;
  tags: Array<{ id: number; name: string }>;
}

export function PostForm({ mode, initial, initialCoverUrl, currentSlug, categories, tags }: PostFormProps) {
  const [fields, setFields] = useState<FieldDraft>({
    title: initial.title,
    slug: initial.slug,
    excerpt: initial.excerpt ?? "",
    categoryId: initial.categoryId === null ? "" : String(initial.categoryId),
    date: initial.date ?? "",
    readTimeMinutes: initial.readTimeMinutes === null ? "" : String(initial.readTimeMinutes),
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
  const [fieldErrors, setFieldErrors] = useState<PostFieldErrors>({});

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
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const status = submitter?.getAttribute("value") === "draft" ? "DRAFT" : "PUBLISHED";

    const input: PostInput = {
      title: fields.title,
      slug: fields.slug.trim(),
      excerpt: fields.excerpt.trim() || null,
      categoryId: fields.categoryId === "" || fields.categoryId === "none" ? null : Number(fields.categoryId),
      tagIds: selectedTagIds,
      date: fields.date.trim() || null,
      readTimeMinutes: fields.readTimeMinutes.trim() === "" ? null : Number(fields.readTimeMinutes),
      content,
      coverImage: coverImage.key,
      coverImageAlt: coverImage.alt.trim() || null,
      metaTitle: fields.metaTitle.trim() || null,
      metaDescription: fields.metaDescription.trim() || null,
      status,
    };

    setFieldErrors({});
    startTransition(async () => {
      const result =
        mode === "edit"
          ? await updatePost({ status: "idle" }, { ...input, currentSlug: currentSlug ?? "" })
          : await createPost({ status: "idle" }, input);

      if (result.status === "error") {
        setFieldErrors(result.fieldErrors ?? {});
        if (result.message) {
          toast({ tone: "error", title: POST_FORM_LABELS.errorToastTitle, description: result.message });
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormFields
        fields={fields}
        onFieldChange={setField}
        categories={categories}
        tags={tags}
        selectedTagIds={selectedTagIds}
        onToggleTag={toggleTag}
        fieldErrors={fieldErrors}
      />
      <CoverImageField
        value={coverImage}
        onChange={setCoverImage}
        error={fieldErrors.coverImage}
        altError={fieldErrors.coverImageAlt}
      />
      <RichContentEditor initialContent={content} onChange={setContent} error={fieldErrors.content} />

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
        <Button
          type="submit"
          name="intent"
          value="draft"
          disabled={isPending}
          variant="outline"
          className="h-11 gap-2 rounded-xl px-6 text-[13px] font-bold"
        >
          {mode === "edit" ? POST_FORM_LABELS.submitDraftUpdate : POST_FORM_LABELS.submitDraftCreate}
        </Button>
      </div>
    </form>
  );
}
