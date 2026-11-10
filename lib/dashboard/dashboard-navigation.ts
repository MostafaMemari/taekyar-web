import { DASHBOARD_LABELS } from "@/data/dashboard/layout";
import {
  DASHBOARD_CREATE_LABELS,
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_ROUTE_LABELS,
} from "@/data/dashboard/navigation";

export interface DashboardCrumb {
  label: string;
  href: string;
}

export function resolveDashboardCrumbs(pathname: string): DashboardCrumb[] {
  const crumbs: DashboardCrumb[] = [{ label: DASHBOARD_LABELS.homeCrumb, href: "/dashboard" }];
  const [, section, ...rest] = pathname.split("/").filter(Boolean);
  if (!section) return crumbs;

  const root = DASHBOARD_NAV_ITEMS.find((item) => item.href === `/dashboard/${section}`);
  if (!root) return crumbs;

  crumbs.push({ label: root.label, href: root.href });
  if (rest.length === 0) return crumbs;

  const leafHref = `${root.href}/${rest.join("/")}`;
  const [second, third] = rest;

  if (second === "new") {
    crumbs.push({ label: DASHBOARD_CREATE_LABELS[section] ?? DASHBOARD_ROUTE_LABELS.new, href: leafHref });
  } else if (second === "trash") {
    crumbs.push({ label: DASHBOARD_ROUTE_LABELS.trash, href: leafHref });
  } else if (third === "edit") {
    crumbs.push({ label: DASHBOARD_ROUTE_LABELS.edit, href: leafHref });
  } else {
    crumbs.push({ label: DASHBOARD_ROUTE_LABELS.detail, href: leafHref });
  }

  return crumbs;
}

export function resolveDashboardTitle(pathname: string): string {
  const crumbs = resolveDashboardCrumbs(pathname);
  return crumbs[crumbs.length - 1]?.label ?? DASHBOARD_LABELS.panel;
}
