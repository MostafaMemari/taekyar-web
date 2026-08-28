import { cva, type VariantProps } from "class-variance-authority";

import { BeltDivider } from "@/components/shared/belt-divider";
import { cn } from "@/lib/utils";

const sectionVariants = cva("theme-light relative isolate bg-background text-foreground", {
  variants: {
    pattern: {
      tatami: "",
      none: "",
    },
    divider: {
      top: "",
      none: "",
    },
  },
  defaultVariants: {
    pattern: "tatami",
    divider: "none",
  },
});

type SectionVariants = VariantProps<typeof sectionVariants>;

interface SectionProps extends SectionVariants {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
}

export function Section({
  children,
  id,
  pattern = "tatami",
  divider = "none",
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(sectionVariants({ pattern, divider }), id && "scroll-mt-20", className)}
    >
      {divider !== "none" ? (
        <BeltDivider width="full" className="absolute inset-x-0 top-0 h-[3px] border-0 opacity-70" />
      ) : null}
      {pattern !== "none" ? (
        <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0" />
      ) : null}
      <div className={cn("relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

export const SectionWithDivider = (props: Omit<SectionProps, "divider">) => (
  <Section divider="top" {...props} />
);
export const SectionWithoutPattern = (props: Omit<SectionProps, "pattern">) => (
  <Section pattern="none" {...props} />
);
