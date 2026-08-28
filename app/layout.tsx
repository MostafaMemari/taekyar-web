import type { Metadata } from "next";
import { Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "تک‌یار | همراه تمرینی تکواندو",
    template: "%s | تک‌یار",
  },
  description:
    "تک‌یار اپلیکیشن همراه تمرین تکواندوست؛ برنامه تمرین شخصی، آموزش گام‌به‌گام فن‌ها و پیگیری ارتقای کمربند، از کمربند سفید تا مشکی",
};

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
