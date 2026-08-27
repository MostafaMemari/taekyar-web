import { CONTACT_PAGE_INTRO } from "@/data/contact";
import { BeltDivider } from "@/components/shared/belt-divider";

export function ContactHeader() {
  return (
    <div className="max-w-2xl">
      <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest text-primary sm:text-xs">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
        {CONTACT_PAGE_INTRO.eyebrow}
      </span>
      <h1 className="mt-2.5 text-balance text-[1.65rem] font-black leading-[1.35] tracking-tight sm:mt-3 sm:text-[2rem] sm:leading-[1.35] lg:text-[2.35rem]">
        {CONTACT_PAGE_INTRO.title}
      </h1>
      <BeltDivider fullWidth={false} variant="pill" className="mt-3.5 h-1 w-16 sm:w-20" />
      <p className="mt-3.5 max-w-xl text-pretty text-[14px] leading-7 text-muted-foreground sm:text-[15px] sm:leading-7">
        {CONTACT_PAGE_INTRO.description}
      </p>
    </div>
  );
}