import type { Metadata } from "next";
import { Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "تک‌یار | همراه تمرینی تکواندو",
    template: "%s | تک‌یار",
  },
  description:
    "تک‌یار اپلیکیشن همراه تمرین تکواندوست؛ برنامه تمرین شخصی، آموزش گام‌به‌گام فن‌ها و پیگیری ارتقای کمربند، از کمربند سفید تا سیاه.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={cn(
        "h-full antialiased dark font-sans",
        vazirmatn.variable,
        geistMono.variable
      )}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
