"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import type { PostBlock } from "@/lib/post-content";
import { BlockAddMenu } from "./block-add-menu";
import { BlockEditorItem } from "./block-editor-item";

interface BlocksEditorProps {
  blocks: PostBlock[];
  onAdd: (type: PostBlock["type"]) => void;
  onInsertAfter: (index: number, type: PostBlock["type"]) => void;
  onUpdate: (index: number, next: PostBlock) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, step: -1 | 1) => void;
  onDuplicate: (index: number) => void;
  onReorder: (from: number, to: number) => void;
}

export function BlocksEditor({
  blocks,
  onAdd,
  onInsertAfter,
  onUpdate,
  onRemove,
  onMove,
  onDuplicate,
  onReorder,
}: BlocksEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function clearDrag() {
    setDragIndex(null);
    setOverIndex(null);
  }

  function handleDrop() {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      onReorder(dragIndex, overIndex);
    }
    clearDrag();
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-black">{POST_FORM_LABELS.contentLabel}</CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">{POST_FORM_LABELS.contentHint}</p>
      </CardHeader>
      <CardContent className="space-y-1">
        {blocks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-8">
            <div className="text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-card text-muted-foreground ring-1 ring-border">
                <FileText className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-3 text-[13px] font-bold">{POST_FORM_LABELS.contentEmptyTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">{POST_FORM_LABELS.contentEmptyHint}</p>
            </div>
            <div className="mt-5">
              <BlockAddMenu onAdd={onAdd} variant="inline" />
            </div>
          </div>
        ) : (
          <>
            <ul className="space-y-2">
              {blocks.map((block, index) => (
                <li key={index} className="space-y-1">
                  <BlockEditorItem
                    index={index}
                    block={block}
                    isDragging={dragIndex === index}
                    isOver={overIndex === index && dragIndex !== index}
                    onChange={onUpdate}
                    onRemove={onRemove}
                    onMove={onMove}
                    onDuplicate={onDuplicate}
                    onSplitParagraph={(splitIndex) => onInsertAfter(splitIndex, "paragraph")}
                    onDragStart={setDragIndex}
                    onDragOver={setOverIndex}
                    onDrop={handleDrop}
                    onDragEnd={clearDrag}
                  />
                  <div className="group/slot flex items-center gap-3 py-0.5">
                    <span className="h-px flex-1 bg-transparent transition-colors group-hover/slot:bg-primary/30" />
                    <div className="opacity-0 transition-opacity group-hover/slot:opacity-100 group-focus-within/slot:opacity-100">
                      <BlockAddMenu
                        label={POST_FORM_LABELS.insertBlock}
                        onAdd={(type) => onInsertAfter(index, type)}
                      />
                    </div>
                    <span className="h-px flex-1 bg-transparent transition-colors group-hover/slot:bg-primary/30" />
                  </div>
                </li>
              ))}
            </ul>

            <div className="group/slot relative flex items-center gap-3 py-2">
              <span className="h-px flex-1 bg-border/60 transition-colors group-hover/slot:bg-primary/30" />
              <BlockAddMenu
                label={POST_FORM_LABELS.insertBlock}
                onAdd={(type) => onInsertAfter(blocks.length - 1, type)}
              />
              <span className="h-px flex-1 bg-border/60 transition-colors group-hover/slot:bg-primary/30" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
