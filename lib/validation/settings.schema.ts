import { z } from "zod";

const optionalText = z.string().max(3000).nullable().default(null);

export const settingsSchema = z.object({
  siteName: z.string().max(200),
  siteTitle: z.string().max(300),
  siteDescription: z.string().max(3000),
  defaultSeoTitle: optionalText,
  defaultSeoDescription: optionalText,
  logoImage: z.string().max(600).nullable().default(null),
  logoImageAlt: optionalText,
  faviconImage: z.string().max(600).nullable().default(null),
  defaultOgImage: z.string().max(600).nullable().default(null),
  defaultOgImageAlt: optionalText,
  telegramUrl: z.union([z.string().max(1000), z.null()]).default(null),
  instagramUrl: z.union([z.string().max(1000), z.null()]).default(null),
  youtubeUrl: z.union([z.string().max(1000), z.null()]).default(null),
  twitterUrl: z.union([z.string().max(1000), z.null()]).default(null),
  appDownloadUrl: z.union([z.string().max(1000), z.null()]).default(null),
});

export type SettingsBody = z.infer<typeof settingsSchema>;
