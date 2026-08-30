"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { ImagePlus } from "lucide-react";

import { MediaPicker, type MediaPickerSelection } from "@/components/dashboard/media/media-picker";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import { BlogImage, CoachTip, ImportantNote } from "./extensions";
import { EditorToolbar, ToolbarButton } from "./toolbar";

interface RichContentEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
}

export function RichContentEditor({ initialContent, onChange }: RichContentEditorProps) {
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

  function handleSelect({ src, alt, caption }: MediaPickerSelection) {
    if (!editor) return;
    editor.chain().focus().insertBlogImage({ src, alt, caption }).run();
  }

  const imagePicker = (
    <MediaPicker
      trigger={
        <ToolbarButton label={POST_FORM_LABELS.imageLabel}>
          <ImagePlus className="size-4" aria-hidden="true" />
        </ToolbarButton>
      }
      onSelect={handleSelect}
    />
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm shadow-black/[0.02]">
      {editor ? <EditorToolbar editor={editor} imagePicker={imagePicker} /> : null}

      <EditorContent editor={editor} dir="rtl" />
    </div>
  );
}


