import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import { INPUT_CLASSES } from "@/components/shared/form-controls";
import { BLOCK_TYPE_LABELS, POST_FORM_LABELS } from "@/data/dashboard/ui";
import type { PostBlock } from "@/lib/post-content";
import { cn } from "@/lib/utils";
import { BLOCK_TYPE_ITEMS } from "./types";

interface BlocksSectionProps {
  blocks: PostBlock[];
  onAdd: (type: PostBlock["type"]) => void;
  onUpdate: (index: number, next: PostBlock) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, step: -1 | 1) => void;
}

export function BlocksSection({ blocks, onAdd, onUpdate, onRemove, onMove }: BlocksSectionProps) {
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
            onChange={(event) => onUpdate(index, { type: "list", items: event.target.value.split("\n") })}
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
