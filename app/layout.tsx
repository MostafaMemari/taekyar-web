import type { Metadata } from "next";
import { Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import { getSiteSettings } from "@/lib/site-settings";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.defaultSeoTitle ?? settings.siteTitle;
  const description = settings.defaultSeoDescription ?? settings.siteDescription;
  const ogImage = settings.ogImage.url
    ? [{ url: settings.ogImage.url, ...(settings.ogImage.alt ? { alt: settings.ogImage.alt } : {}) }]
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${settings.siteName}`,
    },
    description,
    ...(settings.favicon.url ? { icons: { icon: settings.favicon.url } } : {}),
    openGraph: {
      siteName: settings.siteName,
      locale: "fa_IR",
      type: "website",
      ...(ogImage ? { images: ogImage } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      ...(ogImage ? { images: ogImage } : {}),
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={cn("h-full antialiased dark font-sans", vazirmatn.variable, geistMono.variable)}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
