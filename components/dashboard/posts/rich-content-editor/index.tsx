"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { POST_FORM_LABELS, TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { uploadImageAction } from "@/lib/admin-actions";
import { BlogImage, CoachTip, ImportantNote } from "./extensions";
import { EditorToolbar } from "./toolbar";

interface ImageDialogState {
  src: string;
  alt: string;
  caption: string;
}

interface RichContentEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
}

export function RichContentEditor({ initialContent, onChange }: RichContentEditorProps) {
  const [imageDialog, setImageDialog] = useState<ImageDialogState | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CoachTip,
      ImportantNote,
      BlogImage,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
    editorProps: {
      attributes: {
        class:
          "article-content tiptap-area min-h-[420px] max-w-none px-4 py-4 focus:outline-none sm:px-5 sm:py-5",
      },
    },
  });

  function handleFile(file: File) {
    setUploadError(null);
    startUploadTransition(async () => {
      const result = await uploadImageAction(file);
      if (result.ok && result.url) {
        setImageDialog({ src: result.url, alt: "", caption: "" });
        return;
      }
      if (result.error === "UNSUPPORTED_TYPE") setUploadError(TAXONOMY_LABELS.unsupportedType);
      else if (result.error === "FILE_TOO_LARGE") setUploadError(TAXONOMY_LABELS.fileTooLarge);
      else setUploadError(TAXONOMY_LABELS.uploadError);
    });
  }

  function insertImage() {
    if (!editor || !imageDialog) return;
    editor.chain().focus().insertBlogImage({ src: imageDialog.src, alt: imageDialog.alt.trim() }).run();
    setImageDialog(null);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm shadow-black/[0.02]">
      {editor ? <EditorToolbar editor={editor} onImageClick={() => fileInputRef.current?.click()} /> : null}

      <EditorContent editor={editor} dir="rtl" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
          event.target.value = "";
        }}
      />

      {uploadError ? (
        <p className="px-4 pb-2 text-xs font-bold text-destructive">{uploadError}</p>
      ) : null}

      {isUploading ? (
        <p className="flex items-center gap-2 px-4 pb-3 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          {TAXONOMY_LABELS.uploading}
        </p>
      ) : null}

      {imageDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl">
            <p className="text-[14px] font-black">{POST_FORM_LABELS.imageDialogTitle}</p>

            <div className="mt-4 overflow-hidden rounded-xl bg-muted ring-1 ring-border/60">
              <Image src={imageDialog.src} alt="" width={640} height={360} className="h-auto w-full object-cover" unoptimized />
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="editor-image-alt" className="text-[12px] font-bold">
                  {POST_FORM_LABELS.imageAltLabel}
                </Label>
                <Input
                  id="editor-image-alt"
                  value={imageDialog.alt}
                  placeholder={POST_FORM_LABELS.imageAltPlaceholder}
                  className="h-9 rounded-xl"
                  onChange={(event) => setImageDialog({ ...imageDialog, alt: event.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editor-image-caption" className="text-[12px] font-bold">
                  {POST_FORM_LABELS.imageCaptionLabel}
                </Label>
                <Input
                  id="editor-image-caption"
                  value={imageDialog.caption}
                  placeholder={POST_FORM_LABELS.imageCaptionPlaceholder}
                  className="h-9 rounded-xl"
                  onChange={(event) => setImageDialog({ ...imageDialog, caption: event.target.value })}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" className="h-9 rounded-xl px-4 text-[13px] font-bold" onClick={() => setImageDialog(null)}>
                {POST_FORM_LABELS.cancel}
              </Button>
              <Button type="button" className="h-9 rounded-xl px-5 text-[13px] font-bold" onClick={insertImage}>
                {POST_FORM_LABELS.imageInsert}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
