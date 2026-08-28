import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { BLOCK_TYPE_LABELS, POST_FORM_LABELS } from "@/data/dashboard/ui";
import type { PostBlock } from "@/lib/post-content";
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-black">{POST_FORM_LABELS.contentLabel}</CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">{POST_FORM_LABELS.contentHint}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {blocks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-8 text-center">
            <p className="text-[13px] font-bold">هنوز بخشی اضافه نشده</p>
            <p className="mt-1 text-xs text-muted-foreground">با دکمه‌های زیر اولین بخش را بسازید.</p>
          </div>
        ) : (
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
        )}

        <Separator className="bg-border/60" />
        <AddBlockMenu onAdd={onAdd} />
      </CardContent>
    </Card>
  );
}

interface BlockItemProps {
  index: number;
  block: PostBlock;
  onUpdate: (index: number, next: PostBlock) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, step: -1 | 1) => void;
}

function BlockItem({ index, block, onUpdate, onRemove, onMove }: BlockItemProps) {
  return (
    <li className="rounded-xl border border-border/60 bg-card p-3 shadow-sm shadow-black/[0.02] sm:p-4">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground ring-1 ring-border/60">
          {BLOCK_TYPE_LABELS[block.type]}
        </span>
        <span className="ms-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={POST_FORM_LABELS.blockUp}
            className="size-7 rounded-md border border-border bg-card"
            onClick={() => onMove(index, -1)}
          >
            <ChevronUp className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={POST_FORM_LABELS.blockDown}
            className="size-7 rounded-md border border-border bg-card"
            onClick={() => onMove(index, 1)}
          >
            <ChevronDown className="size-4" aria-hidden="true" />
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
        {block.type === "list" ? (
          <Textarea
            rows={4}
            aria-label={BLOCK_TYPE_LABELS.list}
            value={block.items.join("\n")}
            placeholder={POST_FORM_LABELS.listPlaceholder}
            className="min-h-[96px] resize-y rounded-xl"
            onChange={(event) => onUpdate(index, { type: "list", items: event.target.value.split("\n") })}
          />
        ) : (
          <Textarea
            rows={block.type === "heading" ? 1 : 3}
            aria-label={BLOCK_TYPE_LABELS[block.type]}
            value={block.text}
            placeholder={POST_FORM_LABELS.textPlaceholder}
            className="min-h-[72px] resize-y rounded-xl"
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
        <Button
          key={type}
          type="button"
          variant="outline"
          onClick={() => onAdd(type)}
          className="h-9 gap-1.5 rounded-xl border-dashed px-3 text-[13px] font-bold text-muted-foreground hover:border-primary/30 hover:text-primary"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          {BLOCK_TYPE_LABELS[type]}
        </Button>
      ))}
    </div>
  );
}
