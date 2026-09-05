import Link from "next/link";
import { Check, SendHorizonal } from "lucide-react";

import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { COACH_CHAT, COACH_INTRO, COACH_POINTS } from "@/data/home/coach";

function CoachChatPreview() {
  return (
    <div className={cn(SURFACE_CARD, "overflow-hidden")}>
      <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
          م
          <span className="absolute -bottom-0.5 -start-0.5 size-3 rounded-full border-2 border-card bg-belt-green" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">{COACH_CHAT.name}</p>
          <p className="text-[11px] font-medium text-belt-green">{COACH_CHAT.status}</p>
        </div>
      </div>

      <div className="space-y-2.5 px-5 py-5">
        {COACH_CHAT.messages.map((message) => (
          <p
            key={message.text}
            className={cn(
              "w-fit max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-6",
              message.from === "coach"
                ? "bg-muted text-foreground rounded-ss-md"
                : "bg-primary text-primary-foreground rounded-se-md ms-auto"
            )}
          >
            {message.text}
          </p>
        ))}
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 rounded-xl bg-muted px-3.5 py-2.5">
          <p className="flex-1 text-xs text-muted-foreground">{COACH_CHAT.inputPlaceholder}</p>
          <SendHorizonal className="size-4 -scale-x-100 text-primary" />
        </div>
      </div>
    </div>
  );
}

export function CoachSection() {
  return (
    <Section containerClassName="py-10 sm:py-12 lg:py-14">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <Reveal>
          <SectionHeader {...COACH_INTRO} />
          <ul className="mt-6 space-y-2.5">
            {COACH_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-belt-green/10">
                  <Check className="size-3 text-belt-green" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-7 h-11 gap-2 rounded-xl px-6 text-[15px] font-bold shadow-sm shadow-primary/25">
            <Link href={COACH_CHAT.cta.href}>{COACH_CHAT.cta.label}</Link>
          </Button>
        </Reveal>

        <Reveal delay={120}>
          <CoachChatPreview />
        </Reveal>
      </div>
    </Section>
  );
}
