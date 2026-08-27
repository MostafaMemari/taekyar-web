import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { Toaster } from "@/components/ui/toast";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "پیشخوان مدیریت",
};

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const session = await requireAdmin();

  return (
    <div className="theme-light flex min-h-full flex-col bg-muted/30 lg:flex-row">
      <DashboardSidebar username={session.username} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
