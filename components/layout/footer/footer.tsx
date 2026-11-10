import Link from "next/link";

import { Download, Send } from "lucide-react";

import { BeltDivider } from "@/components/shared/belt-divider";
import { Button } from "@/components/ui/button";
import { getCategoryTree } from "@/lib/blog";
import { getMenuTree } from "@/lib/site/menu";
import { flattenPublicCategoryTree, type PublicCategoryNode } from "@/lib/blog/categories";
import { categoryHref } from "@/lib/routes";
import { FOOTER_BLURB, FOOTER_COPYRIGHT, FOOTER_SUGGESTED_PHRASES } from "@/data/layout/footer";
import { navLinks } from "@/data/layout/navigation";
import { getSiteSettings } from "@/lib/site/site-settings";
import { getPublishedPageBySlug } from "@/lib/site/pages";
import { pageHref } from "@/lib/routes";
import { InstagramIcon, XIcon, YoutubeIcon } from "@/components/shared/icons";
import type { MenuItemNode } from "@/lib/site/menu";

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  telegram: Send,
  youtube: YoutubeIcon,
  x: XIcon,
} as const;

const staticQuickLinks: MenuItemNode[] = [
  ...navLinks.map(({ href, label }, index) => ({
    id: -(index + 1),
    title: label,
    href,
    children: [],
  })),
  { id: -101, title: "درباره ما", href: "/about", children: [] },
  { id: -103, title: "دانشنامه فن‌ها", href: "/techniques", children: [] },
  { id: -104, title: "سوالات متداول", href: "/faq", children: [] },
  { id: -105, title: "همکاری با ما", href: "/collab", children: [] },
].filter((link, index, all) => all.findIndex((item) => item.href === link.href) === index);

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
  const [categoryTree, settings, quickLinks, blogLinks, privacyPage, termsPage] = await Promise.all([
    getCategoryTree(),
    getSiteSettings(),
    getMenuTree("FOOTER_QUICK"),
    getMenuTree("FOOTER_BLOG"),
    getPublishedPageBySlug("privacy"),
    getPublishedPageBySlug("terms"),
  ]);

  const legalLinks: MenuItemNode[] = [
    ...(privacyPage
      ? [{ id: -201, title: "حریم خصوصی", href: pageHref("privacy"), children: [] }]
      : []),
    ...(termsPage
      ? [{ id: -202, title: "قوانین و مقررات", href: pageHref("terms"), children: [] }]
      : []),
  ];
  const fallbackQuickLinks = [...staticQuickLinks, ...legalLinks];

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
                className="ms-1.5 inline-block size-1.5 rounded-[2px] bg-[#E0A800] align-middle"
              />
            </p>
            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              {FOOTER_BLURB}
            </p>
            {settings.appDownloadUrl ? (
              <Button
                asChild
                size="lg"
                className="mt-2 h-11 gap-2 rounded-xl bg-gradient-to-bl from-[#E0A800] via-[#C99416] to-[#9A6D00] px-5 text-sm font-extrabold text-[#2A1F00] shadow-md shadow-black/25 hover:from-[#EFAF0A] hover:via-[#D0A018] hover:to-[#A87800]"
              >
                <a href={settings.appDownloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="!size-4" />
                  دانلود اپلیکیشن
                </a>
              </Button>
            ) : null}
          </div>

          {quickLinks.length > 0 ? (
            <LinkColumn
              title="دسترسی سریع"
              links={[...quickLinks, ...legalLinks]}
              ariaLabel="دسترسی سریع"
            />
          ) : (
            <LinkColumn title="دسترسی سریع" links={fallbackQuickLinks} ariaLabel="دسترسی سریع" />
          )}

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
                        className="flex size-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-[12px] font-bold text-muted-foreground">عبارات پیشنهادی:</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {FOOTER_SUGGESTED_PHRASES.map((phrase) => (
              <li key={phrase.href}>
                <Link
                  href={phrase.href}
                  className="text-[12px] text-muted-foreground/80 transition-colors hover:text-foreground"
                >
                  {phrase.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          {FOOTER_COPYRIGHT}
        </div>
      </div>
    </footer>
  );
}
