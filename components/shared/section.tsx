import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const sectionVariants = cva("theme-light relative isolate", {
  variants: {
    tone: {
      default: "text-foreground",
      soft: "border-y border-[#E0A800]/15 bg-[#E0A800]/[0.05] text-foreground",
    },
    spacing: {
      default: "py-12 sm:py-16 lg:py-20",
      compact: "py-8 sm:py-12",
      dense: "py-6 sm:py-8",
      none: "py-0",
    },
  },
  defaultVariants: {
    tone: "default",
    spacing: "default",
  },
});

type SectionVariants = VariantProps<typeof sectionVariants>;

export type SectionTone = NonNullable<SectionVariants["tone"]>;
export type SectionSpacing = NonNullable<SectionVariants["spacing"]>;

interface SectionProps extends SectionVariants {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
}

export function Section({
  children,
  id,
  tone = "default",
  spacing = "default",
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section id={id} className={cn(sectionVariants({ tone, spacing }), id && "scroll-mt-20", className)}>
      <div className={cn("relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", containerClassName)}>{children}</div>
    </section>
  );
}

export { sectionVariants };
