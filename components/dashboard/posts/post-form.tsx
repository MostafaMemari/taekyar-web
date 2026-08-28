"use client";

import { useState, useTransition } from "react";
import { Check, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import { FieldError, FieldLabel, INPUT_CLASSES } from "@/components/shared/form-controls";
import { Button } from "@/components/ui/button";
import { BLOCK_TYPE_LABELS, POST_FORM_LABELS, TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { createPost, updatePost } from "@/lib/admin-actions";
import type { PostInput } from "@/lib/admin-types";
import type { PostBlock } from "@/lib/post-content";
import { cn } from "@/lib/utils";

interface PostFormProps {
  mode: "create" | "edit";
  initial: PostInput;
  currentSlug?: string;
  categories: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string }>;
}

interface FieldDraft {
  title: string;
  slug: string;
  excerpt: string;
  categoryId: string;
  date: string;
  readTimeMinutes: string;
  metaTitle: string;
  metaDescription: string;
}

const BLOCK_TYPE_ITEMS: PostBlock["type"][] = ["paragraph", "heading", "list", "tip", "quote"];

function defaultBlock(type: PostBlock["type"]): PostBlock {
  return type === "list" ? { type: "list", items: [""] } : { type, text: "" };
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

      {errorMessage ? (
        <FieldError errorId="post-form-error" message={errorMessage} />
      ) : null}

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

interface FormFieldsProps {
  fields: FieldDraft;
  onFieldChange: <K extends keyof FieldDraft>(key: K, value: FieldDraft[K]) => void;
  categories: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string }>;
  selectedTagIds: number[];
  onToggleTag: (id: number) => void;
}

function FormFields({
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

interface BlocksSectionProps {
  blocks: PostBlock[];
  onAdd: (type: PostBlock["type"]) => void;
  onUpdate: (index: number, next: PostBlock) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, step: -1 | 1) => void;
}

function BlocksSection({ blocks, onAdd, onUpdate, onRemove, onMove }: BlocksSectionProps) {
  return (
    <div className="space-y-3 border-t border-black/[0.06] pt-5">
      <div>
        <p className="text-[13px] font-bold">{POST_FORM_LABELS.contentLabel}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{POST_FORM_LABELS.contentHint}</p>
      </div>

      <ul className="space-y-3">
        {blocks.map((block, index) => (
          <BlockItem
            key={index}
            index={index}
            block={block}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onMove={onMove}
          />
        ))}
      </ul>

      <AddBlockMenu onAdd={onAdd} />
    </div>
  );
}

interface BlockItemProps {
  index: number;
  block: PostBlock;
  onUpdate: (index: number, next: PostBlock) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, step: -1 | 1) => void;
}

const BLOCK_ACTION_BUTTON =
  "flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50";

function BlockItem({ index, block, onUpdate, onRemove, onMove }: BlockItemProps) {
  return (
    <li className="rounded-xl border border-border bg-background p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
          {BLOCK_TYPE_LABELS[block.type]}
        </span>

        <span className="ms-auto flex items-center gap-1">
          <button
            type="button"
            aria-label={POST_FORM_LABELS.blockUp}
            className={BLOCK_ACTION_BUTTON}
            onClick={() => onMove(index, -1)}
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            aria-label={POST_FORM_LABELS.blockDown}
            className={BLOCK_ACTION_BUTTON}
            onClick={() => onMove(index, 1)}
          >
            <ChevronDown className="size-4" />
          </button>
          <button
            type="button"
            aria-label={POST_FORM_LABELS.removeBlock}
            className={cn(BLOCK_ACTION_BUTTON, "hover:border-destructive/40 hover:text-destructive")}
            onClick={() => onRemove(index)}
          >
            <Trash2 className="size-4" />
          </button>
        </span>
      </div>

      <div className="mt-2.5">
        {block.type === "list" ? (
          <textarea
            rows={4}
            aria-label={BLOCK_TYPE_LABELS.list}
            value={block.items.join("\n")}
            placeholder={POST_FORM_LABELS.listPlaceholder}
            className={cn(INPUT_CLASSES, "resize-y")}
            onChange={(event) =>
              onUpdate(index, { type: "list", items: event.target.value.split("\n") })
            }
          />
        ) : (
          <textarea
            rows={block.type === "heading" ? 1 : 3}
            aria-label={BLOCK_TYPE_LABELS[block.type]}
            value={block.text}
            placeholder={POST_FORM_LABELS.textPlaceholder}
            className={cn(INPUT_CLASSES, "resize-y")}
            onChange={(event) => onUpdate(index, { type: block.type, text: event.target.value })}
          />
        )}
      </div>
    </li>
  );
}

function AddBlockMenu({ onAdd }: { onAdd: (type: PostBlock["type"]) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {BLOCK_TYPE_ITEMS.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onAdd(type)}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-dashed border-border px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Plus className="size-3.5" />
          {BLOCK_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
