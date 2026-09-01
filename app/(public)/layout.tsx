import { Suspense } from "react";
import { AdminBar } from "@/components/layout/admin-bar";
import { Footer } from "@/components/layout/footer/footer";
import { Header } from "@/components/layout/header/header";
import { ScrollReset } from "@/components/layout/scroll-reset";
import { ReadingProgress } from "@/components/shared/reading-progress";
import { Toaster } from "@/components/ui/toast";
import { getSiteSettings } from "@/lib/site-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <Suspense fallback={null}>
        <ScrollReset />
      </Suspense>
      <ReadingProgress />
      <Suspense fallback={null}>
        <AdminBar />
      </Suspense>
      <Header siteName={settings.siteName} logoImage={settings.logo.url} logoImageAlt={settings.logo.alt} />
      <main className="theme-light flex-1 bg-background text-foreground">{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}
