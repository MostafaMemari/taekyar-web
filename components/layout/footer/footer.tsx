import Link from "next/link";

import { BeltDivider } from "@/components/shared/belt-divider";
import { blogCategories } from "@/data/blog/posts";
import { navLinks, type NavLink } from "@/data/layout/navigation";
import { FOOTER_BLURB, FOOTER_COPYRIGHT } from "@/data/layout/footer";
import { SOCIALS } from "@/data/socials";

function LinkColumn({
  title,
  links,
  ariaLabel,
}: {
  title: string;
  links: NavLink[];
  ariaLabel: string;
}) {
  return (
    <nav aria-label={ariaLabel} className="space-y-3">
      <p className="text-sm font-bold text-foreground">{title}</p>
      <ul className="space-y-2.5">
        {links.map(({ label, href }) => (
          <li key={label}>
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

export function Footer() {
  const categoryLinks = blogCategories.map((category) => ({
    label: category,
    href: "/blog",
  }));

  return (
    <footer className="bg-belt-black">
      <BeltDivider />
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          <div className="col-span-2 space-y-3 lg:col-span-1">
            <p className="text-lg font-black text-foreground">
              تک‌یار
              <span
                aria-hidden="true"
                className="ms-1.5 inline-block size-1.5 rounded-[2px] bg-primary align-middle"
              />
            </p>
            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              {FOOTER_BLURB}
            </p>
          </div>

          <LinkColumn title="دسترسی سریع" links={navLinks} ariaLabel="دسترسی سریع" />

          <LinkColumn
            title="موضوعات وبلاگ"
            links={categoryLinks}
            ariaLabel="دسته‌بندی‌های وبلاگ"
          />

          <div className="col-span-2 space-y-3 text-center lg:col-span-1 lg:text-start">
            <p className="text-sm font-bold text-foreground">تک‌یار را دنبال کنید</p>
            <div className="flex items-center justify-center gap-2.5 lg:justify-start">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="!size-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          {FOOTER_COPYRIGHT}
        </div>
      </div>
    </footer>
  );
}
