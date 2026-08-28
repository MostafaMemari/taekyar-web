"use client";

import { useState, useTransition } from "react";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { createPost, updatePost } from "@/lib/admin-actions";
import type { PostInput } from "@/lib/admin-types";
import type { PostBlock } from "@/lib/post-content";
import { BlocksEditor } from "./post-form/blocks-editor";
import { FormFields } from "./post-form/form-fields";
import { defaultBlock, type FieldDraft } from "./post-form/types";

interface PostFormProps {
  mode: "create" | "edit";
  initial: PostInput;
  currentSlug?: string;
  categories: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string }>;
}

export function PostForm({ mode, initial, currentSlug, categories, tags }: PostFormProps) {
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
  const [blocks, setBlocks] = useState<PostBlock[]>(initial.content);
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

  function addBlock(type: PostBlock["type"]) {
    setBlocks((previous) => [...previous, defaultBlock(type)]);
  }

  function insertBlockAfter(index: number, type: PostBlock["type"]) {
    setBlocks((previous) => {
      const next = [...previous];
      next.splice(index + 1, 0, defaultBlock(type));
      return next;
    });
  }

  function updateBlock(index: number, next: PostBlock) {
    setBlocks((previous) => previous.map((block, i) => (i === index ? next : block)));
  }

  function removeBlock(index: number) {
    setBlocks((previous) => previous.filter((_, i) => i !== index));
  }

  function duplicateBlock(index: number) {
    setBlocks((previous) => {
      const next = [...previous];
      next.splice(index + 1, 0, structuredClone(previous[index]));
      return next;
    });
  }

  function moveBlock(index: number, step: -1 | 1) {
    setBlocks((previous) => {
      const target = index + step;
      if (target < 0 || target >= previous.length) return previous;
      const next = [...previous];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function reorderBlocks(from: number, to: number) {
    setBlocks((previous) => {
      const next = [...previous];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
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
      content: blocks,
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
      <FormFields
        fields={fields}
        onFieldChange={setField}
        categories={categories}
        tags={tags}
        selectedTagIds={selectedTagIds}
        onToggleTag={toggleTag}
      />
      <BlocksEditor
        blocks={blocks}
        onAdd={addBlock}
        onInsertAfter={insertBlockAfter}
        onUpdate={updateBlock}
        onRemove={removeBlock}
        onMove={moveBlock}
        onDuplicate={duplicateBlock}
        onReorder={reorderBlocks}
      />

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
