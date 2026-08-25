import Link from "next/link";
import { Send } from "lucide-react";

import { BeltDivider } from "@/components/belt-divider";
import { InstagramIcon, YoutubeIcon } from "@/components/icons";
import { blogCategories, navLinks } from "@/lib/mock-data";

const SOCIALS = [
  { label: "اینستاگرام", href: "#", Icon: InstagramIcon },
  { label: "تلگرام", href: "#", Icon: Send },
  { label: "یوتیوب", href: "#", Icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="bg-belt-black">
      <BeltDivider />
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="text-lg font-black text-foreground">
              تک‌یار
              <span aria-hidden="true" className="ms-1.5 inline-block size-1.5 rounded-[2px] bg-primary align-middle" />
            </p>
            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              همراه تمرینی تکواندوکاران؛ از اولین ضربه تا کمربند سیاه، تمرین
              هدفمند و پیشرفت واقعی را برایت ساده‌تر می‌کنیم.
            </p>
          </div>

          <nav aria-label="دسترسی سریع" className="space-y-3">
            <p className="text-sm font-bold text-foreground">دسترسی سریع</p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="دسته‌بندی‌های وبلاگ" className="space-y-3">
            <p className="text-sm font-bold text-foreground">موضوعات وبلاگ</p>
            <ul className="space-y-2.5">
              {blogCategories.map((category) => (
                <li key={category}>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3">
            <p className="text-sm font-bold text-foreground">تک‌یار را دنبال کنید</p>
            <div className="flex items-center gap-2.5">
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
          © تمامی حقوق برای تک‌یار محفوظ است.
        </div>
      </div>
    </footer>
  );
}
