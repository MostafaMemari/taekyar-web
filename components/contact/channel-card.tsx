import type { ContactChannel } from "@/data/contact";
import { SURFACE_CARD, SURFACE_CARD_INTERACTIVE } from "@/lib/styles";
import { cn } from "@/lib/utils";

const BASE_LINK_CLASS =
  "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-2xl";

export function ChannelCard({ title, value, hint, href, isExternal, chipClassName, Icon }: ContactChannel) {
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(SURFACE_CARD, SURFACE_CARD_INTERACTIVE, "group/channel block h-full p-5 sm:p-6", BASE_LINK_CLASS)}
      aria-label={`${title}: ${value}`}
    >
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
    </a>
  );
}