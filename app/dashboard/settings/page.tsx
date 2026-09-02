import { SettingsForm } from "@/components/dashboard/settings/settings-form";
import { SETTINGS_LABELS } from "@/data/dashboard/settings";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: SETTINGS_LABELS.title,
};

export default async function DashboardSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-black tracking-tight text-foreground sm:text-2xl">{SETTINGS_LABELS.title}</h1>
        <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-muted-foreground sm:text-sm">
          {SETTINGS_LABELS.description}
        </p>
      </div>

      <SettingsForm
        initial={{
          siteName: settings.siteName,
          siteTitle: settings.siteTitle,
          siteDescription: settings.siteDescription,
          defaultSeoTitle: settings.defaultSeoTitle ?? "",
          defaultSeoDescription: settings.defaultSeoDescription ?? "",
          logoImage: settings.logo.key ?? "",
          logoImageAlt: settings.logo.alt ?? "",
          faviconImage: settings.favicon.key ?? "",
          defaultOgImage: settings.ogImage.key ?? "",
          defaultOgImageAlt: settings.ogImage.alt ?? "",
          telegramUrl: settings.socials.find((social) => social.iconName === "telegram")?.href ?? "",
          instagramUrl: settings.socials.find((social) => social.iconName === "instagram")?.href ?? "",
          youtubeUrl: settings.socials.find((social) => social.iconName === "youtube")?.href ?? "",
          twitterUrl: settings.socials.find((social) => social.iconName === "x")?.href ?? "",
          appDownloadUrl: settings.appDownloadUrl ?? "",
        }}
        initialLogoUrl={settings.logo.url}
        initialFaviconUrl={settings.favicon.url}
        initialOgImageUrl={settings.ogImage.url}
      />
    </div>
  );
}
