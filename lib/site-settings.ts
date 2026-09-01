import { cache } from "react";

import { SOCIAL_PLATFORMS, type SocialIconName } from "@/data/socials";
import { prisma } from "@/lib/prisma";
import { r2PublicUrl } from "@/lib/r2-url";
import { FALLBACK_SITE_SETTINGS } from "@/lib/site";

export interface SiteSocialLink {
  label: string;
  href: string;
  iconName: SocialIconName;
}

export interface SiteSettingsImage {
  key: string | null;
  url: string | null;
}

export interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  defaultSeoTitle: string | null;
  defaultSeoDescription: string | null;
  logo: SiteSettingsImage & { alt: string | null };
  favicon: SiteSettingsImage;
  ogImage: SiteSettingsImage & { alt: string | null };
  socials: SiteSocialLink[];
}

function buildSocials(row: {
  telegramUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  twitterUrl: string | null;
}): SiteSocialLink[] {
  const urls: Record<SocialIconName, string | null> = {
    telegram: row.telegramUrl,
    instagram: row.instagramUrl,
    youtube: row.youtubeUrl,
    x: row.twitterUrl,
  };

  return SOCIAL_PLATFORMS.flatMap(({ iconName, label }) => {
    const href = urls[iconName]?.trim();
    return href ? [{ iconName, label, href }] : [];
  });
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const fallback: SiteSettings = {
    ...FALLBACK_SITE_SETTINGS,
    defaultSeoTitle: null,
    defaultSeoDescription: null,
    logo: { key: null, url: null, alt: null },
    favicon: { key: null, url: null },
    ogImage: { key: null, url: null, alt: null },
    socials: [],
  };

  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!row) return fallback;

    return {
      siteName: row.siteName,
      siteTitle: row.siteTitle,
      siteDescription: row.siteDescription,
      defaultSeoTitle: row.defaultSeoTitle,
      defaultSeoDescription: row.defaultSeoDescription,
      logo: {
        key: row.logoImage,
        url: row.logoImage ? r2PublicUrl(row.logoImage) : null,
        alt: row.logoImageAlt,
      },
      favicon: {
        key: row.faviconImage,
        url: row.faviconImage ? r2PublicUrl(row.faviconImage) : null,
      },
      ogImage: {
        key: row.defaultOgImage,
        url: row.defaultOgImage ? r2PublicUrl(row.defaultOgImage) : null,
        alt: row.defaultOgImageAlt,
      },
      socials: buildSocials(row),
    };
  } catch {
    return fallback;
  }
});
