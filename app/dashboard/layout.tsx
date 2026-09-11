import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/layout/dashboard-topbar";
import { Toaster } from "@/components/ui/toast";
import { DASHBOARD_LABELS } from "@/data/dashboard/ui";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "پیشخوان مدیریت",
};

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const [session, settings, pendingCount] = await Promise.all([
    requireAdmin(),
    getSiteSettings(),
    prisma.comment.count({ where: { status: "PENDING" } }),
  ]);

  const brand = {
    siteName: settings.siteName,
    logoImage: settings.logo.url,
    logoImageAlt: settings.logo.alt,
  };

  return (
    <div className="theme-light theme-admin flex min-h-screen flex-col text-foreground lg:flex-row">
      <a
        href="#dashboard-main"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:start-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:border focus-visible:border-border focus-visible:bg-card focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-bold focus-visible:text-foreground focus-visible:shadow-lg"
      >
        {DASHBOARD_LABELS.skipToContent}
      </a>

      <div className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[280px] lg:shrink-0 lg:border-e lg:border-border">
        <DashboardSidebar username={session.username} pendingCount={pendingCount} {...brand} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar username={session.username} pendingCount={pendingCount} {...brand} />
        <main
          id="dashboard-main"
          tabIndex={-1}
          className="min-w-0 flex-1 px-4 py-5 outline-none sm:px-6 lg:px-8 lg:py-7"
        >
          <div className="mx-auto w-full max-w-[1200px]">{children}</div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
