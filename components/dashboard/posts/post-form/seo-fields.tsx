import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import type { PostFieldErrors } from "@/lib/admin-types";
import { SeoFieldsGroup } from "@/components/dashboard/shared/seo-fields-group";
import type { FieldDraft } from "./types";

interface SeoFieldsProps {
  fields: FieldDraft;
  onFieldChange: <K extends keyof FieldDraft>(key: K, value: FieldDraft[K]) => void;
  fieldErrors: PostFieldErrors;
}

export function SeoFields({ fields, onFieldChange, fieldErrors }: SeoFieldsProps) {
  return (
    <SeoFieldsGroup
      idPrefix="post"
      values={{
        seoTitle: fields.seoTitle,
        seoDescription: fields.seoDescription,
        keywords: fields.keywords,
        canonical: fields.canonical,
      }}
      onChange={(key, value) =>
        onFieldChange(
          key === "title" ? "seoTitle" : key === "description" ? "seoDescription" : key,
          value,
        )
      }
      errors={{
        seoTitle: fieldErrors.seoTitle,
        seoDescription: fieldErrors.seoDescription,
        keywords: fieldErrors.keywords,
        canonical: fieldErrors.canonical,
      }}
      labels={{ title: TAXONOMY_LABELS.seoTitle }}
    />
  );
}
