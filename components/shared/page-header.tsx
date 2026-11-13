import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/shared/section-header";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 text-balance font-heading text-[1.75rem] leading-[1.4] tracking-tight sm:text-[2.25rem] sm:leading-[1.35] lg:text-[2.5rem]">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-xl text-pretty text-[15px] leading-8 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
