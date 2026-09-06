import { cva, type VariantProps } from "class-variance-authority";

import { BeltDivider } from "@/components/shared/belt-divider";
import { cn } from "@/lib/utils";

const sectionVariants = cva("theme-light relative isolate", {
  variants: {
    tone: {
      default: "text-foreground",
      soft: "border-y border-border/50 bg-muted text-foreground",
      accent: "border-y border-primary/10 bg-primary/[0.04] text-foreground",
      contrast: "border-y border-border/50 bg-card text-foreground",
      hero: "bg-section-glow text-foreground",
      dark: "border-t border-white/10 bg-[#0b1220] bg-[radial-gradient(ellipse_40rem_20rem_at_50%_-8rem,rgba(37,99,235,0.28),transparent_70%)] text-slate-100",
    },
    divider: {
      top: "",
      none: "",
    },
  },
  defaultVariants: {
    tone: "default",
    divider: "none",
  },
});

type SectionVariants = VariantProps<typeof sectionVariants>;

export type SectionTone = NonNullable<SectionVariants["tone"]>;

interface SectionProps extends SectionVariants {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
}

export function Section({ children, id, tone = "default", divider = "none", className, containerClassName }: SectionProps) {
  return (
    <section id={id} className={cn(sectionVariants({ tone, divider }), id && "scroll-mt-20", className)}>
      {divider !== "none" ? <BeltDivider width="full" className="absolute inset-x-0 top-0 h-[3px] border-0 opacity-70" /> : null}
      <div className={cn("relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", containerClassName)}>{children}</div>
    </section>
  );
}

export const SectionWithDivider = (props: Omit<SectionProps, "divider">) => <Section divider="top" {...props} />;

export { sectionVariants };
