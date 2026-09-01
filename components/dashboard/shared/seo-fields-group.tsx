import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/shared/form-controls";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { RobotsFields } from "./robots-fields";

interface SeoFieldConfig {
  title: string;
  hint: string;
  titleLabel: string;
  titlePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  keywordsLabel: string;
  keywordsPlaceholder: string;
  canonicalLabel: string;
  canonicalPlaceholder: string;
  robotsLabel: string;
}

const SEO_FIELD_IDS = {
  title: "seo-title",
  description: "seo-description",
  keywords: "seo-keywords",
  canonical: "seo-canonical",
} as const;

interface SeoFieldsGroupProps {
  idPrefix: string;
  values: {
    seoTitle: string;
    seoDescription: string;
    keywords: string;
    canonical: string;
    robotsTags: string;
  };
  onChange: (key: keyof typeof SEO_FIELD_IDS | "robotsTags", value: string) => void;
  errors?: Partial<Record<"seoTitle" | "seoDescription" | "keywords" | "canonical" | "robotsTags", string>>;
  labels?: Partial<SeoFieldConfig>;
}

export function SeoFieldsGroup({ idPrefix, values, onChange, errors = {}, labels }: SeoFieldsGroupProps) {
  const l = { ...defaultLabels, ...labels };

  function id(key: keyof typeof SEO_FIELD_IDS) {
    return `${idPrefix}-${SEO_FIELD_IDS[key]}`;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-[14px] font-black">{l.title}</CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">{l.hint}</p>
      </CardHeader>
      <Separator className="bg-border/60" />
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-1.5">
          <Label htmlFor={id("title")} className="text-[13px] font-bold">
            {l.titleLabel}
          </Label>
          <Input
            id={id("title")}
            value={values.seoTitle}
            placeholder={l.titlePlaceholder}
            className="h-10 rounded-xl"
            aria-invalid={Boolean(errors.seoTitle)}
            aria-describedby={errors.seoTitle ? `${id("title")}-error` : undefined}
            onChange={(event) => onChange("title", event.target.value)}
          />
          <FieldError errorId={`${id("title")}-error`} message={errors.seoTitle} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={id("description")} className="text-[13px] font-bold">
            {l.descriptionLabel}
          </Label>
          <Textarea
            id={id("description")}
            rows={3}
            value={values.seoDescription}
            placeholder={l.descriptionPlaceholder}
            className="min-h-[84px] resize-y rounded-xl"
            aria-invalid={Boolean(errors.seoDescription)}
            aria-describedby={errors.seoDescription ? `${id("description")}-error` : undefined}
            onChange={(event) => onChange("description", event.target.value)}
          />
          <FieldError errorId={`${id("description")}-error`} message={errors.seoDescription} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={id("keywords")} className="text-[13px] font-bold">
            {l.keywordsLabel}
          </Label>
          <Input
            id={id("keywords")}
            value={values.keywords}
            placeholder={l.keywordsPlaceholder}
            className="h-10 rounded-xl"
            aria-invalid={Boolean(errors.keywords)}
            aria-describedby={errors.keywords ? `${id("keywords")}-error` : undefined}
            onChange={(event) => onChange("keywords", event.target.value)}
          />
          <FieldError errorId={`${id("keywords")}-error`} message={errors.keywords} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={id("canonical")} className="text-[13px] font-bold">
            {l.canonicalLabel}
          </Label>
          <Input
            id={id("canonical")}
            dir="ltr"
            value={values.canonical}
            placeholder={l.canonicalPlaceholder}
            className="h-10 rounded-xl text-start font-mono text-sm"
            aria-invalid={Boolean(errors.canonical)}
            aria-describedby={errors.canonical ? `${id("canonical")}-error` : undefined}
            onChange={(event) => onChange("canonical", event.target.value)}
          />
          <FieldError errorId={`${id("canonical")}-error`} message={errors.canonical} />
        </div>

        <RobotsFields
          idPrefix={idPrefix}
          value={values.robotsTags}
          label={l.robotsLabel}
          error={errors.robotsTags}
          onChange={(value) => onChange("robotsTags", value)}
        />
      </CardContent>
    </Card>
  );
}

const defaultLabels: SeoFieldConfig = {
  title: TAXONOMY_LABELS.seoTitle,
  hint: TAXONOMY_LABELS.seoHint,
  titleLabel: TAXONOMY_LABELS.seoTitleLabel,
  titlePlaceholder: TAXONOMY_LABELS.seoTitlePlaceholder,
  descriptionLabel: TAXONOMY_LABELS.seoDescriptionLabel,
  descriptionPlaceholder: TAXONOMY_LABELS.seoDescriptionPlaceholder,
  keywordsLabel: TAXONOMY_LABELS.seoKeywordsLabel,
  keywordsPlaceholder: TAXONOMY_LABELS.seoKeywordsPlaceholder,
  canonicalLabel: TAXONOMY_LABELS.seoCanonicalLabel,
  canonicalPlaceholder: TAXONOMY_LABELS.seoCanonicalPlaceholder,
  robotsLabel: TAXONOMY_LABELS.seoRobotsLabel,
};
