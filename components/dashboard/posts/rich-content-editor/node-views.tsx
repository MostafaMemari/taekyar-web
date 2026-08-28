"use client";

import Image from "next/image";
import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

import { COACH_TIP_LABEL, IMPORTANT_NOTE_LABEL } from "./extensions";

export function CoachTipView() {
  return (
    <NodeViewWrapper className="my-4">
      <div className="flex gap-3 rounded-xl border border-belt-yellow/40 bg-belt-yellow/[0.09] p-3.5 sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-belt-yellow-fg sm:text-xs">{COACH_TIP_LABEL}</p>
          <NodeViewContent className="mt-1 text-[13px] leading-6 text-foreground/90 outline-none sm:text-sm sm:leading-7" />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export function ImportantNoteView() {
  return (
    <NodeViewWrapper className="my-4">
      <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/[0.06] p-3.5 sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-destructive sm:text-xs">{IMPORTANT_NOTE_LABEL}</p>
          <NodeViewContent className="mt-1 text-[13px] leading-6 text-foreground/90 outline-none sm:text-sm sm:leading-7" />
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export function BlogImageView({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper as="figure" data-type="blog-image" className="my-4 overflow-hidden rounded-2xl bg-muted shadow-sm ring-1 ring-black/[0.06]">
      <Image
        src={node.attrs.src}
        alt={node.attrs.alt}
        width={1200}
        height={675}
        sizes="700px"
        className="h-auto w-full object-cover"
        unoptimized
      />
      <NodeViewContent className="editor-figcaption px-4 py-2.5 text-center text-xs leading-6 text-muted-foreground outline-none" />
    </NodeViewWrapper>
  );
}
