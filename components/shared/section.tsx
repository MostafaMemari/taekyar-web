import { BeltDivider } from "@/components/shared/belt-divider";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  pattern?: boolean;
  divider?: boolean;
  className?: string;
  containerClassName?: string;
}

export function Section({
  children,
  id,
  pattern = true,
  divider = false,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "theme-light relative isolate bg-background text-foreground",
        id && "scroll-mt-20",
        className
      )}
    >
      {divider ? (
        <BeltDivider fullWidth className="absolute inset-x-0 top-0 h-[3px] border-0 opacity-70" />
      ) : null}
      {pattern ? (
        <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0" />
      ) : null}
      <div
        className={cn(
          "relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-11 lg:px-8 lg:py-12",
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
