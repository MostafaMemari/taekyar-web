import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/shared/form-controls";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import type { PostFieldErrors } from "@/lib/admin-types";
import type { FieldDraft } from "./types";

interface SeoFieldsProps {
  fields: FieldDraft;
  onFieldChange: <K extends keyof FieldDraft>(key: K, value: FieldDraft[K]) => void;
  fieldErrors: PostFieldErrors;
}

export function SeoFields({ fields, onFieldChange, fieldErrors }: SeoFieldsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-black">{TAXONOMY_LABELS.seoTitle}</CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">{TAXONOMY_LABELS.seoHint}</p>
      </CardHeader>
      <Separator className="bg-border/60" />
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-1.5">
          <Label htmlFor="post-meta-title" className="text-[13px] font-bold">
            {TAXONOMY_LABELS.metaTitleLabel}
          </Label>
          <Input
            id="post-meta-title"
            value={fields.metaTitle}
            placeholder={TAXONOMY_LABELS.metaTitlePlaceholder}
            className="h-10 rounded-xl"
            aria-invalid={Boolean(fieldErrors.metaTitle)}
            aria-describedby={fieldErrors.metaTitle ? "post-meta-title-error" : undefined}
            onChange={(event) => onFieldChange("metaTitle", event.target.value)}
          />
          <FieldError errorId="post-meta-title-error" message={fieldErrors.metaTitle} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="post-meta-description" className="text-[13px] font-bold">
            {TAXONOMY_LABELS.metaDescriptionLabel}
          </Label>
          <Textarea
            id="post-meta-description"
            rows={3}
            value={fields.metaDescription}
            placeholder={TAXONOMY_LABELS.metaDescriptionPlaceholder}
            className="min-h-[84px] resize-y rounded-xl"
            aria-invalid={Boolean(fieldErrors.metaDescription)}
            aria-describedby={fieldErrors.metaDescription ? "post-meta-description-error" : undefined}
            onChange={(event) => onFieldChange("metaDescription", event.target.value)}
          />
          <FieldError errorId="post-meta-description-error" message={fieldErrors.metaDescription} />
        </div>
      </CardContent>
    </Card>
  );
}
