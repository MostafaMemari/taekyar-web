import Link from "next/link";

import { Send } from "lucide-react";

import { BeltDivider } from "@/components/shared/belt-divider";
import { getCategoryTree } from "@/lib/blog";
import { getMenuTree } from "@/lib/menu";
import { flattenPublicCategoryTree, type PublicCategoryNode } from "@/lib/blog/categories";
import { categoryHref } from "@/lib/routes";
import { FOOTER_BLURB, FOOTER_COPYRIGHT } from "@/data/layout/footer";
import { navLinks } from "@/data/layout/navigation";
import { getSiteSettings } from "@/lib/site-settings";
import { InstagramIcon, XIcon, YoutubeIcon } from "@/components/shared/icons";
import type { MenuItemNode } from "@/lib/menu";

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  telegram: Send,
  youtube: YoutubeIcon,
  x: XIcon,
} as const;

const staticQuickLinks: MenuItemNode[] = navLinks.map(({ href, label }, index) => ({
  id: -(index + 1),
  title: label,
  href,
  children: [],
}));

function LinkColumn({
  title,
  links,
  ariaLabel,
}: {
  title: string;
  links: MenuItemNode[];
  ariaLabel: string;
}) {
  return (
    <nav aria-label={ariaLabel} className="space-y-3">
      <p className="text-sm font-bold text-foreground">{title}</p>
      <ul className="space-y-2.5">
        {links.map(({ id, title: label, href }) => (
          <li key={id}>
            <Link
              href={href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function CategoryLinks({ nodes }: { nodes: PublicCategoryNode[] }) {
  const items = flattenPublicCategoryTree(nodes);

  return (
    <nav aria-label="دسته‌بندی‌های وبلاگ" className="space-y-3">
      <p className="text-sm font-bold text-foreground">موضوعات وبلاگ</p>
      <ul className="space-y-2.5">
        {items.map(({ item, depth }) => (
          <li key={item.id} style={depth > 0 ? { marginInlineStart: `${depth * 14}px` } : undefined}>
            <Link
              href={categoryHref(item.path)}
              className={depth > 0 ? "text-[13px] text-muted-foreground/80 transition-colors hover:text-foreground" : "text-sm text-muted-foreground transition-colors hover:text-foreground"}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterMenuColumn({ title, links, ariaLabel, fallback }: { title: string; links: MenuItemNode[]; ariaLabel: string; fallback: React.ReactNode }) {
  if (links.length > 0) {
    return <LinkColumn title={title} links={links} ariaLabel={ariaLabel} />;
  }
  return fallback;
}

export async function Footer() {
  const [categoryTree, settings, quickLinks, blogLinks] = await Promise.all([
    getCategoryTree(),
    getSiteSettings(),
    getMenuTree("FOOTER_QUICK"),
    getMenuTree("FOOTER_BLOG"),
  ]);

  return (
    <footer className="bg-belt-black">
      <BeltDivider />
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          <div className="col-span-2 space-y-3 lg:col-span-1">
            <p className="text-lg font-black text-foreground">
              {settings.siteName}
              <span
                aria-hidden="true"
                className="ms-1.5 inline-block size-1.5 rounded-[2px] bg-primary align-middle"
              />
            </p>
            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              {FOOTER_BLURB}
            </p>
          </div>

          <FooterMenuColumn
            title="دسترسی سریع"
            links={quickLinks}
            ariaLabel="دسترسی سریع"
            fallback={<LinkColumn title="دسترسی سریع" links={staticQuickLinks} ariaLabel="دسترسی سریع" />}
          />

          <FooterMenuColumn
            title="موضوعات وبلاگ"
            links={blogLinks}
            ariaLabel="دسته‌بندی‌های وبلاگ"
            fallback={<CategoryLinks nodes={categoryTree} />}
          />

          <div className="col-span-2 space-y-3 text-center lg:col-span-1 lg:text-start">
            {settings.socials.length > 0 ? (
              <>
                <p className="text-sm font-bold text-foreground">{settings.siteName} را دنبال کنید</p>
                <div className="flex items-center justify-center gap-2.5 lg:justify-start">
                  {settings.socials.map(({ label, href, iconName }) => {
                    const Icon = SOCIAL_ICONS[iconName];
                    return (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        <Icon className="!size-[18px]" />
                      </a>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          {FOOTER_COPYRIGHT}
        </div>
      </div>
    </footer>
  );
}
