import { Suspense } from "react";
import { AdminBar } from "@/components/layout/admin-bar";
import { Footer } from "@/components/layout/footer/footer";
import { Header } from "@/components/layout/header/header";
import { ScrollReset } from "@/components/layout/scroll-reset";
import { ReadingProgress } from "@/components/shared/reading-progress";
import { Toaster } from "@/components/ui/toast";
import { getMenuTree } from "@/lib/menu";
import { MOBILE_NAV_FALLBACK, navLinks } from "@/data/layout/navigation";
import { getSiteSettings } from "@/lib/site-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, desktopItems, mobileItems] = await Promise.all([
    getSiteSettings(),
    getMenuTree("HEADER_DESKTOP"),
    getMenuTree("HEADER_MOBILE"),
  ]);

  const desktopNav =
    desktopItems.length > 0
      ? desktopItems
      : navLinks.map(({ href, label }, index) => ({ id: -(index + 1), title: label, href, children: [] }));
  const mobileNav = mobileItems.length > 0 ? mobileItems : MOBILE_NAV_FALLBACK;

  return (
    <>
      <Suspense fallback={null}>
        <ScrollReset />
      </Suspense>
      <ReadingProgress />
      <Suspense fallback={null}>
        <AdminBar />
      </Suspense>
      <Header
        siteName={settings.siteName}
        logoImage={settings.logo.url}
        logoImageAlt={settings.logo.alt}
        navItems={desktopNav}
        mobileNavItems={mobileNav}
      />
      <main className="theme-light flex-1 bg-background text-foreground">{children}</main>
      <Footer />
      <Toaster />
    </>
  );
}
