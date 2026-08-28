"use client";

import { ChevronDown, ChevronUp, Copy, GripVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BLOCK_TYPE_LABELS, POST_FORM_LABELS } from "@/data/dashboard/ui";
import type { PostBlock } from "@/lib/post-content";
import { cn } from "@/lib/utils";
import { BlockField } from "./block-editor-field";

const TOOLBAR_BUTTON =
  "size-7 rounded-md border border-border bg-card";

interface BlockEditorItemProps {
  index: number;
  block: PostBlock;
  isDragging: boolean;
  isOver: boolean;
  onChange: (index: number, next: PostBlock) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, step: -1 | 1) => void;
  onDuplicate: (index: number) => void;
  onSplitParagraph: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

export function BlockEditorItem({
  index,
  block,
  isDragging,
  isOver,
  onChange,
  onRemove,
  onMove,
  onDuplicate,
  onSplitParagraph,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: BlockEditorItemProps) {
  return (
    <li
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver(index);
      }}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        "group rounded-xl border border-border/60 bg-card p-3 shadow-sm shadow-black/[0.02] transition-shadow sm:p-4",
        isDragging && "opacity-40",
        isOver && "ring-2 ring-primary/40",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          aria-label={POST_FORM_LABELS.dragBlock}
          title={POST_FORM_LABELS.dragBlock}
          className="cursor-grab text-muted-foreground/60 transition-colors hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground ring-1 ring-border/60">
          {BLOCK_TYPE_LABELS[block.type]}
        </span>

        {block.type === "heading" ? <HeadingLevelPicker index={index} block={block} onChange={onChange} /> : null}
        {block.type === "list" ? <ListKindPicker index={index} block={block} onChange={onChange} /> : null}

        <span className="ms-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <Button type="button" variant="ghost" size="icon-sm" aria-label={POST_FORM_LABELS.blockUp} className={TOOLBAR_BUTTON} onClick={() => onMove(index, -1)}>
            <ChevronUp className="size-4" aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" aria-label={POST_FORM_LABELS.blockDown} className={TOOLBAR_BUTTON} onClick={() => onMove(index, 1)}>
            <ChevronDown className="size-4" aria-hidden="true" />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" aria-label={POST_FORM_LABELS.duplicateBlock} className={TOOLBAR_BUTTON} onClick={() => onDuplicate(index)}>
            <Copy className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={POST_FORM_LABELS.removeBlock}
            className="size-7 rounded-md border border-border bg-card text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </span>
      </div>

      <div className="mt-3">
        <BlockField index={index} block={block} onChange={onChange} onSplitParagraph={onSplitParagraph} />
      </div>
    </li>
  );
}

function HeadingLevelPicker({
  index,
  block,
  onChange,
}: {
  index: number;
  block: Extract<PostBlock, { type: "heading" }>;
  onChange: (index: number, next: PostBlock) => void;
}) {
  return (
    <span className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5">
      {([1, 2, 3, 4] as const).map((level) => (
        <button
          key={level}
          type="button"
          aria-pressed={block.level === level}
          aria-label={`سرفصل ${level}`}
          onClick={() => onChange(index, { ...block, level })}
          className={cn(
            "size-6 rounded-md text-[11px] font-black transition-colors",
            block.level === level
              ? "bg-primary text-white"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          H{level}
        </button>
      ))}
    </span>
  );
}

function ListKindPicker({
  index,
  block,
  onChange,
}: {
  index: number;
  block: Extract<PostBlock, { type: "list" }>;
  onChange: (index: number, next: PostBlock) => void;
}) {
  return (
    <span className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5 text-[11px] font-bold">
      <button
        type="button"
        aria-pressed={!block.ordered}
        onClick={() => onChange(index, { ...block, ordered: false })}
        className={cn(
          "rounded-md px-2 py-0.5 transition-colors",
          !block.ordered ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted",
        )}
      >
        {POST_FORM_LABELS.listUnordered}
      </button>
      <button
        type="button"
        aria-pressed={block.ordered}
        onClick={() => onChange(index, { ...block, ordered: true })}
        className={cn(
          "rounded-md px-2 py-0.5 transition-colors",
          block.ordered ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted",
        )}
      >
        {POST_FORM_LABELS.listOrdered}
      </button>
    </span>
  );
}
