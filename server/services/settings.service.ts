import { SETTINGS_LABELS } from "@/data/dashboard/settings";
import type { SettingsMutationResult, SiteSettingsFieldErrors, SiteSettingsInput } from "@/types/api";
import { prisma } from "@/server/config/prisma";

function normalizeUrl(value: unknown): string | null | "invalid" {
  const text = String(value ?? "").trim();
  if (!text) return null;
  try {
    const url = new URL(text);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "invalid";
    return text;
  } catch {
    return "invalid";
  }
}

function normalizeSettingsInput(input: SiteSettingsInput):
  | { ok: true; data: SiteSettingsInput }
  | { ok: false; fieldErrors: SiteSettingsFieldErrors } {
  const errors: SiteSettingsFieldErrors = {};

  const siteName = String(input.siteName ?? "").trim();
  const siteTitle = String(input.siteTitle ?? "").trim();
  const siteDescription = String(input.siteDescription ?? "").trim();
  if (!siteName) errors.siteName = SETTINGS_LABELS.required;
  if (!siteTitle) errors.siteTitle = SETTINGS_LABELS.required;
  if (!siteDescription) errors.siteDescription = SETTINGS_LABELS.required;

  const socials = {
    telegramUrl: normalizeUrl(input.telegramUrl),
    instagramUrl: normalizeUrl(input.instagramUrl),
    youtubeUrl: normalizeUrl(input.youtubeUrl),
    twitterUrl: normalizeUrl(input.twitterUrl),
    appDownloadUrl: normalizeUrl(input.appDownloadUrl),
  };
  for (const [key, result] of Object.entries(socials)) {
    if (result === "invalid") {
      errors[key as keyof SiteSettingsFieldErrors] = SETTINGS_LABELS.urlInvalid;
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };

  const optionalText = (value: unknown) => {
    const text = String(value ?? "").trim();
    return text.length > 0 ? text : null;
  };

  return {
    ok: true,
    data: {
      siteName,
      siteTitle,
      siteDescription,
      defaultSeoTitle: optionalText(input.defaultSeoTitle),
      defaultSeoDescription: optionalText(input.defaultSeoDescription),
      logoImage: optionalText(input.logoImage),
      logoImageAlt: optionalText(input.logoImageAlt),
      faviconImage: optionalText(input.faviconImage),
      defaultOgImage: optionalText(input.defaultOgImage),
      defaultOgImageAlt: optionalText(input.defaultOgImageAlt),
      telegramUrl: socials.telegramUrl === "invalid" ? null : socials.telegramUrl,
      instagramUrl: socials.instagramUrl === "invalid" ? null : socials.instagramUrl,
      youtubeUrl: socials.youtubeUrl === "invalid" ? null : socials.youtubeUrl,
      twitterUrl: socials.twitterUrl === "invalid" ? null : socials.twitterUrl,
      appDownloadUrl: socials.appDownloadUrl === "invalid" ? null : socials.appDownloadUrl,
    },
  };
}

export async function saveSiteSettings(input: SiteSettingsInput): Promise<SettingsMutationResult> {
  const result = normalizeSettingsInput(input);
  if (!result.ok) return { ok: false, fieldErrors: result.fieldErrors };

  try {
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: result.data,
      create: { id: 1, ...result.data },
    });
  } catch (error) {
    console.error("saveSiteSettings failed:", error);
    return { ok: false, message: SETTINGS_LABELS.error };
  }

  return { ok: true, message: SETTINGS_LABELS.saved };
}
