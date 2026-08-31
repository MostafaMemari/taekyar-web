import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/shared/form-controls";
import { POST_FORM_LABELS } from "@/data/dashboard/ui";
import type { PostFieldErrors } from "@/lib/admin-types";
import type { FieldDraft } from "./types";

interface MainInfoFieldsProps {
  fields: FieldDraft;
  onFieldChange: <K extends keyof FieldDraft>(key: K, value: FieldDraft[K]) => void;
  fieldErrors: PostFieldErrors;
}

export function MainInfoFields({ fields, onFieldChange, fieldErrors }: MainInfoFieldsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-black">اطلاعات اصلی</CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">{POST_FORM_LABELS.mainInfoHint}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="post-title" className="text-[13px] font-bold">
            {POST_FORM_LABELS.titleLabel}
          </Label>
          <Input
            id="post-title"
            required
            value={fields.title}
            placeholder={POST_FORM_LABELS.titlePlaceholder}
            className="h-10 rounded-xl"
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? "post-title-error" : undefined}
            onChange={(event) => onFieldChange("title", event.target.value)}
          />
          <FieldError errorId="post-title-error" message={fieldErrors.title} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="post-slug" className="text-[13px] font-bold">
            {POST_FORM_LABELS.slugLabel}
          </Label>
          <Input
            id="post-slug"
            dir="ltr"
            required
            value={fields.slug}
            placeholder={POST_FORM_LABELS.slugPlaceholder}
            className="h-10 rounded-xl text-start font-mono text-sm"
            aria-invalid={Boolean(fieldErrors.slug)}
            aria-describedby={fieldErrors.slug ? "post-slug-error" : undefined}
            onChange={(event) => onFieldChange("slug", event.target.value)}
          />
          <FieldError errorId="post-slug-error" message={fieldErrors.slug} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="post-excerpt" className="text-[13px] font-bold">
            {POST_FORM_LABELS.excerptLabel}
          </Label>
          <Textarea
            id="post-excerpt"
            rows={3}
            value={fields.excerpt}
            placeholder={POST_FORM_LABELS.excerptPlaceholder}
            className="min-h-[84px] resize-y rounded-xl"
            aria-invalid={Boolean(fieldErrors.excerpt)}
            aria-describedby={fieldErrors.excerpt ? "post-excerpt-error" : undefined}
            onChange={(event) => onFieldChange("excerpt", event.target.value)}
          />
          <FieldError errorId="post-excerpt-error" message={fieldErrors.excerpt} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="post-read-time" className="text-[13px] font-bold">
            {POST_FORM_LABELS.readTimeLabel}
          </Label>
          <Input
            id="post-read-time"
            type="number"
            dir="ltr"
            min={1}
            value={fields.readTimeMinutes}
            placeholder="۵"
            className="h-10 rounded-xl text-start font-mono sm:max-w-44"
            aria-invalid={Boolean(fieldErrors.readTimeMinutes)}
            aria-describedby={fieldErrors.readTimeMinutes ? "post-read-time-error" : undefined}
            onChange={(event) => onFieldChange("readTimeMinutes", event.target.value)}
          />
          <FieldError errorId="post-read-time-error" message={fieldErrors.readTimeMinutes} />
        </div>
      </CardContent>
    </Card>
  );
}
