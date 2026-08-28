import Link from "next/link";
import { BookOpen, ChevronLeft, Clock, Send } from "lucide-react";

import { FOLLOW_TITLE, PRE_CONTACT_TIPS, QUICK_FAQ_LABEL } from "@/data/contact";
import { SOCIALS } from "@/data/socials";
import { InstagramIcon, YoutubeIcon } from "@/components/shared/icons";

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  telegram: Send,
  youtube: YoutubeIcon,
} as const;
import { BeltDivider } from "@/components/shared/belt-divider";
import { Button } from "@/components/ui/button";
import { SURFACE_CARD } from "@/lib/styles";

export function SupportInfo() {
  return (
    <aside aria-label="راهنمای تماس" className={SURFACE_CARD + " h-full p-5 sm:p-6"}>
      <h2 className="text-base font-extrabold">پیش از ارسال پیام</h2>

      <ul className="mt-4 space-y-4">
        {PRE_CONTACT_TIPS.map(({ title, description, iconName }) => {
          const Icon = iconName === "clock" ? Clock : BookOpen;
          return (
            <li key={title} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="!size-4" />
              </span>
              <div>
                <p className="text-sm font-bold leading-6">{title}</p>
                <p className="mt-0.5 text-[13px] leading-6 text-muted-foreground">{description}</p>
              </div>
            </li>
          );
        })}
        <li className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ChevronLeft className="!size-4" />
          </span>
          <p className="text-[13px] leading-6 text-muted-foreground">{QUICK_FAQ_LABEL}</p>
        </li>
      </ul>

      <BeltDivider variant="pill" width="contained" className="mt-6 h-1 w-16 opacity-70" />

      <Button
        asChild
        variant="outline"
        className="mt-5 h-11 w-full gap-2 rounded-xl text-sm font-bold"
      >
        <Link href="/#faq">مشاهده سؤالات متداول</Link>
      </Button>

      <div className="mt-7 border-t border-border pt-5">
        <p className="text-sm font-bold">{FOLLOW_TITLE}</p>
        <div className="mt-3 flex items-center gap-2.5">
          {SOCIALS.map(({ label, href, iconName }) => {
            const Icon = SOCIAL_ICONS[iconName];
            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Icon className="!size-[18px]" />
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}