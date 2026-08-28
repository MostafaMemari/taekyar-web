"use client";

import { useRef, useState } from "react";
import type { Editor } from "@tiptap/core";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Link2,
  Quote,
  Redo2,
  Undo2,
  TriangleAlert,
  Lightbulb,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  editor: Editor;
  onImageClick: () => void;
}

function ToolbarButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "size-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground",
        active && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
      )}
    >
      {children}
    </Button>
  );
}

const Divider = () => <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-border" />;

export function EditorToolbar({ editor, onImageClick }: ToolbarProps) {
  const [linkOpen, setLinkOpen] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  function applyLink() {
    const url = linkInputRef.current?.value.trim();
    setLinkOpen(false);
    if (!url) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const safeUrl = /^(https?:\/\/|mailto:|\/)/i.test(url) ? url : `https://${url}`;
    editor.chain().focus().setLink({ href: safeUrl }).run();
  }

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 rounded-t-2xl border-b border-border/60 bg-muted/60 p-1.5 backdrop-blur">
      <ToolbarButton label={POST_FORM_LABELS.bold} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label={POST_FORM_LABELS.italic} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="size-4" aria-hidden="true" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label="پاراگراف" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
        <span className="text-[11px] font-black">P</span>
      </ToolbarButton>
      {([1, 2, 3, 4] as const).map((level) => (
        <ToolbarButton
          key={level}
          label={`سرفصل ${level}`}
          active={editor.isActive("heading", { level })}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        >
          {level === 1 ? <Heading1 className="size-4" aria-hidden="true" /> : null}
          {level === 2 ? <Heading2 className="size-4" aria-hidden="true" /> : null}
          {level === 3 ? <Heading3 className="size-4" aria-hidden="true" /> : null}
          {level === 4 ? <Heading4 className="size-4" aria-hidden="true" /> : null}
        </ToolbarButton>
      ))}

      <Divider />

      <ToolbarButton label={POST_FORM_LABELS.listUnordered} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label={POST_FORM_LABELS.listOrdered} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="size-4" aria-hidden="true" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label="راست‌چین" active={editor.isActive({ textAlign: "start" })} onClick={() => editor.chain().focus().setTextAlign("start").run()}>
        <AlignRight className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="وسط‌چین" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <AlignCenter className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label="چپ‌چین" active={editor.isActive({ textAlign: "end" })} onClick={() => editor.chain().focus().setTextAlign("end").run()}>
        <AlignLeft className="size-4" aria-hidden="true" />
      </ToolbarButton>

      <Divider />

      <div className="relative shrink-0">
        <ToolbarButton label={POST_FORM_LABELS.linkLabel} active={editor.isActive("link")} onClick={() => setLinkOpen((previous) => !previous)}>
          <Link2 className="size-4" aria-hidden="true" />
        </ToolbarButton>
        {linkOpen ? (
          <div className="absolute top-9 start-0 z-30 flex items-center gap-1.5 rounded-xl border border-border/70 bg-card p-2 shadow-xl">
            <input
              ref={linkInputRef}
              dir="ltr"
              autoFocus
              placeholder="https://…"
              defaultValue={(editor.getAttributes("link").href as string | undefined) ?? ""}
              className="h-8 w-44 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring/40"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyLink();
                }
              }}
            />
            <Button type="button" size="sm" className="h-8 rounded-lg px-3 text-xs font-bold" onClick={applyLink}>
              تأیید
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 rounded-lg px-3 text-xs font-bold"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setLinkOpen(false);
              }}
            >
              حذف
            </Button>
          </div>
        ) : null}
      </div>

      <ToolbarButton label={POST_FORM_LABELS.quoteLabel} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label={POST_FORM_LABELS.coachTipLabel} active={editor.isActive("coachTip")} onClick={() => editor.chain().focus().toggleCoachTip().run()}>
        <Lightbulb className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label={POST_FORM_LABELS.importantNoteLabel} active={editor.isActive("importantNote")} onClick={() => editor.chain().focus().toggleImportantNote().run()}>
        <TriangleAlert className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label={POST_FORM_LABELS.imageLabel} onClick={onImageClick}>
        <ImagePlus className="size-4" aria-hidden="true" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton label={POST_FORM_LABELS.undo} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="size-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton label={POST_FORM_LABELS.redo} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="size-4" aria-hidden="true" />
      </ToolbarButton>
    </div>
  );
}
