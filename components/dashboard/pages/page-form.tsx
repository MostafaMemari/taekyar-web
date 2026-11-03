"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PAGES_FORM_LABELS } from "@/data/dashboard/ui";
import { ApiClientError } from "@/lib/api/client";
import { pagesApi } from "@/lib/api/endpoints";
import type { PageFieldErrors, PageInput } from "@/types/api";
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
  const router = useRouter();
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
      try {
        const result =
          mode === "edit" ? await pagesApi.update(currentSlug ?? "", input) : await pagesApi.create(input);
        if (result.slug) {
          router.push("/dashboard/pages");
          router.refresh();
        }
      } catch (error) {
        if (error instanceof ApiClientError) {
          setFieldErrors((error.fieldErrors ?? {}) as PageFieldErrors);
          if (error.message && error.message !== error.code) {
            toast({ tone: "error", title: PAGES_FORM_LABELS.errorToastTitle, description: error.message });
          }
        } else {
          toast({ tone: "error", title: PAGES_FORM_LABELS.errorToastTitle, description: PAGES_FORM_LABELS.error });
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid items-start gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          <PageMainInfoFields fields={fields} onFieldChange={setField} fieldErrors={fieldErrors} />
          <RichContentEditor initialContent={content} onChange={setContent} />
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

        <aside
          aria-label={PAGES_FORM_LABELS.sidebarAriaLabel}
          className="min-w-0 space-y-5 lg:col-span-1 lg:self-start"
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
      </div>

      <Separator className="bg-border/60" />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 gap-2 rounded-xl px-8 text-[13px] font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 motion-reduce:transition-none"
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
          variant="outline"
          className="h-11 gap-2 rounded-xl border-border bg-card px-6 text-[13px] font-bold text-foreground hover:bg-muted hover:text-foreground"
        >
          {mode === "edit" ? PAGES_FORM_LABELS.submitDraftUpdate : PAGES_FORM_LABELS.submitDraftCreate}
        </Button>
      </div>
    </form>
  );
}
