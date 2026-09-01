import Link from "next/link";
import { headers } from "next/headers";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";

import { AdminBarContextLink } from "@/components/layout/admin-bar-context-link";
import { ADMIN_BAR_LABELS } from "@/data/layout/admin-bar";
import { logout } from "@/lib/admin-actions";
import { resolveAdminBarEditContext } from "@/lib/admin/admin-bar-context";
import { getSession } from "@/lib/auth";
import { dashboardHref, PATHNAME_HEADER } from "@/lib/routes";

function AdminBarLink({ href, label, Icon }: { href: string; label: string; Icon: typeof LayoutDashboard }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 motion-reduce:transition-none"
    >
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {label}
    </Link>
  );
}

export async function AdminBar() {
  const session = await getSession();
  if (!session) return null;

  const pathname = (await headers()).get(PATHNAME_HEADER) ?? "/";
  const edit = await resolveAdminBarEditContext(pathname);

  return (
    <div className="border-b border-white/10 bg-belt-black text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-0.5 px-4 text-[12px] sm:px-6 lg:px-8">
        <nav aria-label={ADMIN_BAR_LABELS.navLabel} className="flex items-center gap-0.5">
          <AdminBarLink href={dashboardHref()} label={ADMIN_BAR_LABELS.dashboard} Icon={LayoutDashboard} />
          <AdminBarContextLink initialPathname={pathname} initialEdit={edit} />
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <span
            title={session.username}
            className="hidden min-h-7 items-center gap-1.5 rounded-md px-2 font-medium text-white/60 sm:inline-flex"
          >
            <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="max-w-40 truncate">{session.username}</span>
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex min-h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 motion-reduce:transition-none"
            >
              <LogOut className="size-3.5 shrink-0" aria-hidden="true" />
              {ADMIN_BAR_LABELS.logout}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
