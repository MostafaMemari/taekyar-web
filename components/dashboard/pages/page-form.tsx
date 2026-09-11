"use client";

import { useState, useTransition } from "react";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PAGES_FORM_LABELS } from "@/data/dashboard/ui";
import { createPage, updatePage } from "@/lib/admin-actions";
import type { PageFieldErrors, PageInput } from "@/lib/admin-types";
import { parsePostHtml } from "@/lib/post-content";
import { RichContentEditor } from "@/components/dashboard/posts/rich-content-editor";
import { CoverImageField, type CoverImageValue } from "@/components/dashboard/shared/cover-image-field";
import { SeoFieldsGroup } from "@/components/dashboard/shared/seo-fields-group";
import { PageMainInfoFields } from "./page-form/form-fields";
import type { PageFieldDraft } from "./page-form/types";

interface PageFormProps {
  mode: "create" | "edit";
  initial: PageInput;
  initialCoverUrl?: string | null;
  currentSlug?: string;
}

export function PageForm({ mode, initial, initialCoverUrl, currentSlug }: PageFormProps) {
  const [fields, setFields] = useState<PageFieldDraft>({
    title: initial.title,
    slug: initial.slug,
    seoTitle: initial.seoTitle ?? "",
    seoDescription: initial.seoDescription ?? "",
    keywords: initial.keywords ?? "",
    canonical: initial.canonical ?? "",
    robotsTags: initial.robotsTags ?? "",
  });
  const [coverImage, setCoverImage] = useState<CoverImageValue>({
    key: initial.coverImage ?? null,
    url: initialCoverUrl ?? null,
    alt: initial.coverImageAlt ?? "",
  });
  const [content, setContent] = useState<string>(parsePostHtml(initial.content));
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<PageFieldErrors>({});

  function setField<K extends keyof PageFieldDraft>(key: K, value: PageFieldDraft[K]) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const status = submitter?.getAttribute("value") === "draft" ? "DRAFT" : "PUBLISHED";

    const input: PageInput = {
      title: fields.title,
      slug: fields.slug.trim(),
      content,
      coverImage: coverImage.key,
      coverImageAlt: coverImage.alt.trim() || null,
      seoTitle: fields.seoTitle.trim() || null,
      seoDescription: fields.seoDescription.trim() || null,
      keywords: fields.keywords.trim() || null,
      canonical: fields.canonical.trim() || null,
      robotsTags: fields.robotsTags.trim() || null,
      status,
    };

    setFieldErrors({});
    startTransition(async () => {
      const result =
        mode === "edit"
          ? await updatePage({ status: "idle" }, { ...input, currentSlug: currentSlug ?? "" })
          : await createPage({ status: "idle" }, input);

      if (result.status === "error") {
        setFieldErrors(result.fieldErrors ?? {});
        if (result.message) {
          toast({ tone: "error", title: PAGES_FORM_LABELS.errorToastTitle, description: result.message });
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid items-start gap-5 lg:grid-cols-3">
        <div className="order-1 min-w-0 space-y-5 lg:col-span-2">
          <PageMainInfoFields fields={fields} onFieldChange={setField} fieldErrors={fieldErrors} />
          <RichContentEditor initialContent={content} onChange={setContent} />
        </div>

        <aside
          aria-label={PAGES_FORM_LABELS.sidebarAriaLabel}
          className="order-2 min-w-0 space-y-5 lg:col-span-1 lg:self-start"
        >
          <CoverImageField
            value={coverImage}
            onChange={setCoverImage}
            labels={{
              title: PAGES_FORM_LABELS.coverImageLabel,
              description: PAGES_FORM_LABELS.coverImageDescription,
              select: PAGES_FORM_LABELS.coverImageSelect,
              change: PAGES_FORM_LABELS.coverImageChange,
              remove: PAGES_FORM_LABELS.coverImageRemove,
              dialogTitle: PAGES_FORM_LABELS.coverImageDialogTitle,
              insert: PAGES_FORM_LABELS.coverImageInsert,
            }}
          />
        </aside>

        <div className="order-3 min-w-0 lg:col-span-2">
          <SeoFieldsGroup
            idPrefix="page"
            values={{
              seoTitle: fields.seoTitle,
              seoDescription: fields.seoDescription,
              keywords: fields.keywords,
              canonical: fields.canonical,
              robotsTags: fields.robotsTags,
            }}
            onChange={(key, value) =>
              setField(key === "title" ? "seoTitle" : key === "description" ? "seoDescription" : key, value)
            }
          />
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="h-10 gap-2 rounded-lg px-6 text-[13px] font-bold"
        >
          {isPending
            ? PAGES_FORM_LABELS.saving
            : mode === "edit"
              ? PAGES_FORM_LABELS.submitUpdate
              : PAGES_FORM_LABELS.submitCreate}
        </Button>
        <Button
          type="submit"
          name="intent"
          value="draft"
          disabled={isPending}
          aria-busy={isPending}
          variant="outline"
          className="h-10 gap-2 rounded-lg border-border bg-card px-5 text-[13px] font-bold text-foreground hover:bg-muted hover:text-foreground"
        >
          {mode === "edit" ? PAGES_FORM_LABELS.submitDraftUpdate : PAGES_FORM_LABELS.submitDraftCreate}
        </Button>
      </div>
    </form>
  );
}
