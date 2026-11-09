import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#E0A800]/25 bg-[#E0A800]/[0.08] px-3 py-1 text-xs font-bold text-[#a37800]",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#E0A800]" />
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-balance font-heading text-3xl leading-[1.4] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-[15px] font-normal leading-8 text-muted-foreground sm:text-base sm:leading-9">
          {description}
        </p>
      ) : null}
    </div>
  );
}
