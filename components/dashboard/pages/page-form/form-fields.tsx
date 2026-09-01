import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/form-controls";
import { PAGES_FORM_LABELS } from "@/data/dashboard/ui";
import type { PageFieldErrors } from "@/lib/admin-types";
import type { PageFieldDraft } from "./types";

interface PageMainInfoFieldsProps {
  fields: PageFieldDraft;
  onFieldChange: <K extends keyof PageFieldDraft>(key: K, value: PageFieldDraft[K]) => void;
  fieldErrors: PageFieldErrors;
}

export function PageMainInfoFields({ fields, onFieldChange, fieldErrors }: PageMainInfoFieldsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-black">اطلاعات اصلی</CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">{PAGES_FORM_LABELS.mainInfoHint}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="page-title" className="text-[13px] font-bold">
            {PAGES_FORM_LABELS.titleLabel}
          </Label>
          <Input
            id="page-title"
            required
            value={fields.title}
            placeholder={PAGES_FORM_LABELS.titlePlaceholder}
            className="h-10 rounded-xl"
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? "page-title-error" : undefined}
            onChange={(event) => onFieldChange("title", event.target.value)}
          />
          <FieldError errorId="page-title-error" message={fieldErrors.title} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="page-slug" className="text-[13px] font-bold">
            {PAGES_FORM_LABELS.slugLabel}
          </Label>
          <Input
            id="page-slug"
            dir="ltr"
            value={fields.slug}
            placeholder={PAGES_FORM_LABELS.slugPlaceholder}
            className="h-10 rounded-xl text-start font-mono text-sm"
            aria-invalid={Boolean(fieldErrors.slug)}
            aria-describedby={fieldErrors.slug ? "page-slug-error" : undefined}
            onChange={(event) => onFieldChange("slug", event.target.value)}
          />
          <FieldError errorId="page-slug-error" message={fieldErrors.slug} />
          <p className="text-[11px] leading-5 text-muted-foreground">{PAGES_FORM_LABELS.slugHint}</p>
        </div>
      </CardContent>
    </Card>
  );
}
