"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { ImagePlus, X } from "lucide-react";

import { MediaPicker } from "@/components/dashboard/media/media-picker";
import { FieldError } from "@/components/shared/form-controls";
import { Button } from "@/components/ui/button";import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SETTINGS_LABELS } from "@/data/dashboard/settings";
import { saveSiteSettings } from "@/lib/admin-actions";
import type { SiteSettingsFieldErrors, SiteSettingsInput } from "@/lib/admin-types";
import { IMAGE_REMOVE_BUTTON } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type FormFields = {
  [K in keyof SiteSettingsInput]: string;
};

interface SettingsImageValue {
  key: string | null;
  url: string | null;
}

interface SettingsImageFieldProps {
  label: string;
  hint: string;
  dialogTitle: string;
  withAlt: boolean;
  altLabel: string;
  value: SettingsImageValue;
  alt: string;
  error?: string;
  onChange: (value: SettingsImageValue) => void;
  onAltChange: (alt: string) => void;
}

function SettingsImageField({
  label,
  hint,
  dialogTitle,
  withAlt,
  altLabel,
  value,
  alt,
  error,
  onChange,
  onAltChange,
}: SettingsImageFieldProps) {
  function handleSelect(selection: { key: string; src: string }) {
    onChange({ key: selection.key, url: selection.src });
  }

  function handleRemove() {
    onChange({ key: null, url: null });
    if (withAlt) onAltChange("");
  }

  return (
    <div className="space-y-2">
      <Label className="text-[13px] font-bold">{label}</Label>
      {value.key && value.url ? (
        <div className="relative w-fit">
          <MediaPicker
            trigger={
              <button
                type="button"
                title={SETTINGS_LABELS.imageChange}
                aria-label={`${label} — ${SETTINGS_LABELS.imageChange}`}
                className="group relative block cursor-pointer overflow-hidden rounded-xl bg-muted/40 ring-1 ring-border/60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 hover:ring-primary/40 motion-reduce:transition-none"
              >
                <Image
                  src={value.url}
                  alt={withAlt && alt ? alt : label}
                  width={192}
                  height={108}
                  className="h-[76px] w-[136px] object-cover transition-opacity group-hover:opacity-90 motion-reduce:transition-none"
                  unoptimized
                />
              </button>
            }
            onSelect={handleSelect}
            fields={{ alt: false, caption: false }}
            dialogTitle={dialogTitle}
            insertLabel={SETTINGS_LABELS.imageChange}
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label={SETTINGS_LABELS.imageRemove}
            className={cn(IMAGE_REMOVE_BUTTON, "cursor-pointer")}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <MediaPicker
          trigger={
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-muted/20 px-4 py-3 text-start ring-1 ring-border/60 transition-all hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
                <ImagePlus className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-bold text-foreground">{label}</span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">{hint}</span>
              </span>
            </button>
          }
          onSelect={handleSelect}
          fields={{ alt: false, caption: false }}
          dialogTitle={dialogTitle}
          insertLabel={SETTINGS_LABELS.imageChange}
        />
      )}

      {withAlt && value.key ? (
        <div className="space-y-1.5">
          <Input
            value={alt}
            placeholder={altLabel}
            aria-label={altLabel}
            aria-invalid={Boolean(error)}
            className="h-10 rounded-xl"
            onChange={(event) => onAltChange(event.target.value)}
          />
          <FieldError errorId={`${label}-alt-error`} message={error} />
        </div>
      ) : null}
      {!withAlt ? <FieldError errorId={`${label}-error`} message={error} /> : null}
    </div>
  );
}

interface SettingsFormProps {
  initial: FormFields;
  initialLogoUrl: string | null;
  initialFaviconUrl: string | null;
  initialOgImageUrl: string | null;
}

export function SettingsForm({ initial, initialLogoUrl, initialFaviconUrl, initialOgImageUrl }: SettingsFormProps) {
  const [fields, setFields] = useState<FormFields>(initial);
  const [logo, setLogo] = useState<SettingsImageValue>({
    key: initial.logoImage,
    url: initialLogoUrl,
  });
  const [favicon, setFavicon] = useState<SettingsImageValue>({
    key: initial.faviconImage,
    url: initialFaviconUrl,
  });
  const [ogImage, setOgImage] = useState<SettingsImageValue>({
    key: initial.defaultOgImage,
    url: initialOgImageUrl,
  });
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<SiteSettingsFieldErrors>({});

  function setField<K extends keyof FormFields>(key: K, value: string) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input: SiteSettingsInput = {
      siteName: fields.siteName,
      siteTitle: fields.siteTitle,
      siteDescription: fields.siteDescription,
      defaultSeoTitle: fields.defaultSeoTitle.trim() || null,
      defaultSeoDescription: fields.defaultSeoDescription.trim() || null,
      logoImage: logo.key,
      logoImageAlt: fields.logoImageAlt.trim() || null,
      faviconImage: favicon.key,
      defaultOgImage: ogImage.key,
      defaultOgImageAlt: fields.defaultOgImageAlt.trim() || null,
      telegramUrl: fields.telegramUrl.trim() || null,
      instagramUrl: fields.instagramUrl.trim() || null,
      youtubeUrl: fields.youtubeUrl.trim() || null,
      twitterUrl: fields.twitterUrl.trim() || null,
    };

    setFieldErrors({});
    startTransition(async () => {
      const result = await saveSiteSettings(input);
      if (result.status === "error") {
        setFieldErrors(result.fieldErrors ?? {});
        toast({ tone: "error", title: SETTINGS_LABELS.errorToastTitle, description: result.message });
      } else if (result.status === "success") {
        toast({ tone: "success", title: SETTINGS_LABELS.saved });
      }
    });
  }

  const textFieldClass = "h-10 rounded-xl";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[14px] font-black">{SETTINGS_LABELS.siteInfoTitle}</CardTitle>
              <p className="text-xs leading-5 text-muted-foreground">{SETTINGS_LABELS.siteInfoHint}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="settings-site-name" className="text-[13px] font-bold">
                  {SETTINGS_LABELS.siteNameLabel}
                </Label>
                <Input
                  id="settings-site-name"
                  value={fields.siteName}
                  placeholder={SETTINGS_LABELS.siteNamePlaceholder}
                  className={textFieldClass}
                  aria-invalid={Boolean(fieldErrors.siteName)}
                  onChange={(event) => setField("siteName", event.target.value)}
                />
                <FieldError errorId="settings-site-name-error" message={fieldErrors.siteName} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="settings-site-title" className="text-[13px] font-bold">
                  {SETTINGS_LABELS.siteTitleLabel}
                </Label>
                <Input
                  id="settings-site-title"
                  value={fields.siteTitle}
                  placeholder={SETTINGS_LABELS.siteTitlePlaceholder}
                  className={textFieldClass}
                  aria-invalid={Boolean(fieldErrors.siteTitle)}
                  onChange={(event) => setField("siteTitle", event.target.value)}
                />
                <p className="text-xs leading-5 text-muted-foreground">{SETTINGS_LABELS.siteTitleHint}</p>
                <FieldError errorId="settings-site-title-error" message={fieldErrors.siteTitle} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="settings-site-description" className="text-[13px] font-bold">
                  {SETTINGS_LABELS.siteDescriptionLabel}
                </Label>
                <Textarea
                  id="settings-site-description"
                  rows={3}
                  value={fields.siteDescription}
                  placeholder={SETTINGS_LABELS.siteDescriptionPlaceholder}
                  className="min-h-[84px] resize-y rounded-xl"
                  aria-invalid={Boolean(fieldErrors.siteDescription)}
                  onChange={(event) => setField("siteDescription", event.target.value)}
                />
                <FieldError errorId="settings-site-description-error" message={fieldErrors.siteDescription} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[14px] font-black">{SETTINGS_LABELS.seoTitle}</CardTitle>
              <p className="text-xs leading-5 text-muted-foreground">{SETTINGS_LABELS.seoHint}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="settings-seo-title" className="text-[13px] font-bold">
                  {SETTINGS_LABELS.defaultSeoTitleLabel}
                </Label>
                <Input
                  id="settings-seo-title"
                  value={fields.defaultSeoTitle}
                  className={textFieldClass}
                  aria-invalid={Boolean(fieldErrors.defaultSeoTitle)}
                  onChange={(event) => setField("defaultSeoTitle", event.target.value)}
                />
                <FieldError errorId="settings-seo-title-error" message={fieldErrors.defaultSeoTitle} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="settings-seo-description" className="text-[13px] font-bold">
                  {SETTINGS_LABELS.defaultSeoDescriptionLabel}
                </Label>
                <Textarea
                  id="settings-seo-description"
                  rows={3}
                  value={fields.defaultSeoDescription}
                  className="min-h-[84px] resize-y rounded-xl"
                  aria-invalid={Boolean(fieldErrors.defaultSeoDescription)}
                  onChange={(event) => setField("defaultSeoDescription", event.target.value)}
                />
                <FieldError errorId="settings-seo-description-error" message={fieldErrors.defaultSeoDescription} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[14px] font-black">{SETTINGS_LABELS.imagesTitle}</CardTitle>
              <p className="text-xs leading-5 text-muted-foreground">{SETTINGS_LABELS.imagesHint}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <SettingsImageField
                label={SETTINGS_LABELS.logoLabel}
                hint={SETTINGS_LABELS.logoHint}
                dialogTitle={SETTINGS_LABELS.logoLabel}
                withAlt
                altLabel={SETTINGS_LABELS.altLabel}
                value={logo}
                alt={fields.logoImageAlt}
                error={fieldErrors.logoImageAlt}
                onChange={setLogo}
                onAltChange={(alt) => setField("logoImageAlt", alt)}
              />

              <SettingsImageField
                label={SETTINGS_LABELS.faviconLabel}
                hint={SETTINGS_LABELS.faviconHint}
                dialogTitle={SETTINGS_LABELS.faviconLabel}
                withAlt={false}
                altLabel={SETTINGS_LABELS.altLabel}
                value={favicon}
                alt=""
                onChange={setFavicon}
                onAltChange={() => undefined}
              />

              <SettingsImageField
                label={SETTINGS_LABELS.ogImageLabel}
                hint={SETTINGS_LABELS.ogImageHint}
                dialogTitle={SETTINGS_LABELS.ogImageLabel}
                withAlt
                altLabel={SETTINGS_LABELS.altLabel}
                value={ogImage}
                alt={fields.defaultOgImageAlt}
                error={fieldErrors.defaultOgImageAlt}
                onChange={setOgImage}
                onAltChange={(alt) => setField("defaultOgImageAlt", alt)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[14px] font-black">{SETTINGS_LABELS.socialTitle}</CardTitle>
              <p className="text-xs leading-5 text-muted-foreground">{SETTINGS_LABELS.socialHint}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {(
                [
                  ["telegramUrl", SETTINGS_LABELS.telegramLabel],
                  ["instagramUrl", SETTINGS_LABELS.instagramLabel],
                  ["youtubeUrl", SETTINGS_LABELS.youtubeLabel],
                  ["twitterUrl", SETTINGS_LABELS.twitterLabel],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`settings-${key}`} className="text-[13px] font-bold">
                    {label}
                  </Label>
                  <Input
                    id={`settings-${key}`}
                    dir="ltr"
                    value={fields[key]}
                    placeholder={SETTINGS_LABELS.urlPlaceholder}
                    className={`${textFieldClass} text-start font-mono text-sm`}
                    aria-invalid={Boolean(fieldErrors[key])}
                    onChange={(event) => setField(key, event.target.value)}
                  />
                  <FieldError errorId={`settings-${key}-error`} message={fieldErrors[key]} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>


      <Button type="submit" disabled={isPending} className="h-11 gap-2 rounded-xl px-8 text-[13px] font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 motion-reduce:transition-none">
        {isPending ? SETTINGS_LABELS.saving : SETTINGS_LABELS.save}
      </Button>
    </form>
  );
}
