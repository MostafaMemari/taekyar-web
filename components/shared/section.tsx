import { cva, type VariantProps } from "class-variance-authority";

import { BeltDivider } from "@/components/shared/belt-divider";
import { cn } from "@/lib/utils";

const sectionVariants = cva("theme-light relative isolate text-foreground", {
  variants: {
    divider: {
      top: "",
      none: "",
    },
  },
  defaultVariants: {
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

export function Section({ children, id, divider = "none", className, containerClassName }: SectionProps) {
  return (
    <section id={id} className={cn(sectionVariants({ divider }), id && "scroll-mt-20", className)}>
      {divider !== "none" ? <BeltDivider width="full" className="absolute inset-x-0 top-0 h-[3px] border-0 opacity-70" /> : null}
      <div className={cn("relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", containerClassName)}>{children}</div>
    </section>
  );
}

export const SectionWithDivider = (props: Omit<SectionProps, "divider">) => <Section divider="top" {...props} />;
