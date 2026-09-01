import { DashboardMobileNav } from "@/components/dashboard/layout/dashboard-mobile-nav";
import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { Toaster } from "@/components/ui/toast";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "پیشخوان مدیریت",
};

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const [session, settings] = await Promise.all([requireAdmin(), getSiteSettings()]);
  const brand = {
    siteName: settings.siteName,
    logoImage: settings.logo.url,
    logoImageAlt: settings.logo.alt,
  };

  return (
    <div className="theme-light flex min-h-screen flex-col bg-background text-foreground lg:flex-row">
      <div className="hidden lg:flex lg:w-[280px] lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:border-e lg:border-border/60 lg:bg-card">
        <div className="flex min-h-0 flex-1 flex-col">
          <DashboardSidebar username={session.username} {...brand} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardMobileNav username={session.username} {...brand} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
