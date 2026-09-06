import { Mail, Phone, Send } from "lucide-react";

import type { ContactChannel } from "@/data/contact";
import { InstagramIcon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const CONTACT_ICONS = {
  mail: Mail,
  phone: Phone,
  send: Send,
  instagram: InstagramIcon,
} as const;

export function ChannelCard({ title, value, hint, href, isExternal, chipClassName, iconName }: ContactChannel) {
  const Icon = CONTACT_ICONS[iconName];
  return (
    <Card
      asChild
      interactive
      className="group/channel h-full p-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <a
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-label={`${title}: ${value}`}
      >
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full ring-1", chipClassName)}>
              <Icon className="!size-[18px]" />
            </span>
            <h2 className="text-base font-bold leading-6">{title}</h2>
          </div>
          <p dir="ltr" className="mt-3 text-end text-[14px] font-bold leading-7 text-foreground transition-colors group-hover/channel:text-primary sm:text-[15px]">
            {value}
          </p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-[13px]">{hint}</p>
        </CardContent>
      </a>
    </Card>
  );
}