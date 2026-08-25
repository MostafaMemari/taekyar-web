import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  pattern?: boolean;
  className?: string;
  containerClassName?: string;
}

export function Section({
  children,
  id,
  pattern = true,
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
      {pattern ? (
        <div aria-hidden="true" className="bg-tatami pointer-events-none absolute inset-0" />
      ) : null}
      <div
        className={cn(
          "relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20",
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
