"use client";

import { ImageUpload } from "@/components/dashboard/shared/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BLOCK_TYPE_LABELS, POST_FORM_LABELS } from "@/data/dashboard/ui";
import type { PostBlock } from "@/lib/post-content";
import { r2PublicUrl } from "@/lib/r2-url";

interface BlockFieldProps {
  index: number;
  block: PostBlock;
  onChange: (index: number, next: PostBlock) => void;
  onSplitParagraph: (index: number) => void;
}

export function BlockField({ index, block, onChange, onSplitParagraph }: BlockFieldProps) {
  switch (block.type) {
    case "heading":
      return (
        <Input
          value={block.text}
          aria-label={BLOCK_TYPE_LABELS.heading}
          placeholder="عنوان بخش…"
          className="h-10 rounded-xl font-bold"
          onChange={(event) => onChange(index, { ...block, text: event.target.value })}
        />
      );

    case "list":
      return (
        <Textarea
          rows={4}
          aria-label={BLOCK_TYPE_LABELS.list}
          value={block.items.join("\n")}
          placeholder={POST_FORM_LABELS.listPlaceholder}
          className="min-h-[96px] resize-y rounded-xl"
          onChange={(event) => onChange(index, { ...block, items: event.target.value.split("\n") })}
        />
      );

    case "paragraph":
      return (
        <div>
          <Textarea
            rows={3}
            aria-label={BLOCK_TYPE_LABELS.paragraph}
            value={block.text}
            placeholder={POST_FORM_LABELS.textPlaceholder}
            className="min-h-[72px] resize-y rounded-xl"
            onChange={(event) => onChange(index, { ...block, text: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSplitParagraph(index);
              }
            }}
          />
          <p className="mt-1.5 text-[10.5px] text-muted-foreground/70">{POST_FORM_LABELS.enterToContinue}</p>
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <ImageUpload
            id={`block-image-${index}`}
            initialKey={block.src || null}
            initialUrl={block.src ? r2PublicUrl(block.src) : null}
            onChange={(key) => onChange(index, { ...block, src: key ?? "" })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`block-image-alt-${index}`} className="text-[12px] font-bold">
                {POST_FORM_LABELS.imageAltLabel}
              </Label>
              <Input
                id={`block-image-alt-${index}`}
                value={block.alt}
                placeholder={POST_FORM_LABELS.imageAltPlaceholder}
                className="h-9 rounded-xl"
                onChange={(event) => onChange(index, { ...block, alt: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`block-image-caption-${index}`} className="text-[12px] font-bold">
                {POST_FORM_LABELS.imageCaptionLabel}
              </Label>
              <Input
                id={`block-image-caption-${index}`}
                value={block.caption ?? ""}
                placeholder={POST_FORM_LABELS.imageCaptionPlaceholder}
                className="h-9 rounded-xl"
                onChange={(event) => onChange(index, { ...block, caption: event.target.value })}
              />
            </div>
          </div>
        </div>
      );

    case "divider":
      return (
        <div className="flex items-center gap-3 px-1 py-2">
          <span className="h-px flex-1 border-t border-dashed border-border" />
          <span className="text-[10.5px] font-bold text-muted-foreground/70">{BLOCK_TYPE_LABELS.divider}</span>
          <span className="h-px flex-1 border-t border-dashed border-border" />
        </div>
      );

    default:
      return (
        <Textarea
          rows={3}
          aria-label={BLOCK_TYPE_LABELS[block.type]}
          value={block.text}
          placeholder={POST_FORM_LABELS.textPlaceholder}
          className="min-h-[72px] resize-y rounded-xl"
          onChange={(event) => onChange(index, { type: block.type, text: event.target.value })}
        />
      );
  }
}
