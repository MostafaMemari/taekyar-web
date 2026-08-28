"use client";

import { useState, useTransition } from "react";

import { FieldError } from "@/components/shared/form-controls";
import { Button } from "@/components/ui/button";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { createPost, updatePost } from "@/lib/admin-actions";
import type { PostInput } from "@/lib/admin-types";
import type { PostBlock } from "@/lib/post-content";
import { BlocksSection } from "./post-form/blocks-section";
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

  function updateBlock(index: number, next: PostBlock) {
    setBlocks((previous) => previous.map((block, i) => (i === index ? next : block)));
  }

  function removeBlock(index: number) {
    setBlocks((previous) => previous.filter((_, i) => i !== index));
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
      <BlocksSection
        blocks={blocks}
        onAdd={addBlock}
        onUpdate={updateBlock}
        onRemove={removeBlock}
        onMove={moveBlock}
      />

      {errorMessage ? <FieldError errorId="post-form-error" message={errorMessage} /> : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-black/[0.06] pt-5">
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 gap-2 rounded-xl px-8 text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90"
        >
          {isPending
            ? POST_FORM_LABELS.saving
            : mode === "edit"
              ? POST_FORM_LABELS.submitUpdate
              : POST_FORM_LABELS.submitCreate}
        </Button>
      </div>
    </form>
  );
}
