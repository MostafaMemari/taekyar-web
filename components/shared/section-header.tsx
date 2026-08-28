import { BeltDivider } from "@/components/shared/belt-divider";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <span className="text-sm font-bold text-primary">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-extrabold leading-[1.4] sm:text-4xl">
        {title}
      </h2>
      <BeltDivider variant="pill" width="contained" className="mt-4 h-1 w-20" />
      {description ? (
        <p className="mt-4 text-[15px] font-normal leading-8 text-muted-foreground sm:text-base sm:leading-9">
          {description}
        </p>
      ) : null}
    </div>
  );
}
