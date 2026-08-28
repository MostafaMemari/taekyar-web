import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const BELT_ORDER = [
  "bg-belt-white",
  "bg-belt-yellow",
  "bg-belt-green",
  "bg-belt-blue",
  "bg-belt-red",
  "bg-belt-black",
] as const;

const beltDividerVariants = cva("overflow-hidden", {
  variants: {
    variant: {
      strip: "h-[5px] w-full border-y border-foreground/10",
      pill: "h-1.5 w-24 rounded-full",
      slant: "h-3 w-full gap-2 [&>div]:-skew-x-12",
    },
    width: {
      full: "w-full",
      contained: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
    },
  },
  defaultVariants: {
    variant: "strip",
    width: "full",
  },
});

type BeltDividerVariants = VariantProps<typeof beltDividerVariants>;

interface BeltDividerProps extends BeltDividerVariants {
  className?: string;
}

export function BeltDivider({ variant = "strip", width = "full", className }: BeltDividerProps) {
  const segments = BELT_ORDER.map((color) => (
    <div key={color} className={cn("h-full flex-1", color)} />
  ));

  if (variant === "pill") {
    return (
      <div aria-hidden="true" className={cn(beltDividerVariants({ variant, width: "full" }), className)}>
        <div className="flex h-full">{segments}</div>
      </div>
    );
  }

  if (variant === "slant") {
    return (
      <div
        aria-hidden="true"
        className={cn(
          beltDividerVariants({ variant, width }),
          "flex h-full items-stretch",
          className,
        )}
      >
        <div className="flex h-full w-full items-stretch gap-2 [&>div]:-skew-x-12">{segments}</div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={cn(beltDividerVariants({ variant, width }), className)}>
      <div className="flex h-full">{segments}</div>
    </div>
  );
}

export const BeltStripDivider = (props: Omit<BeltDividerProps, "variant">) => (
  <BeltDivider variant="strip" {...props} />
);
export const BeltPillDivider = (props: Omit<BeltDividerProps, "variant">) => (
  <BeltDivider variant="pill" {...props} />
);
export const BeltSlantDivider = (props: Omit<BeltDividerProps, "variant">) => (
  <BeltDivider variant="slant" {...props} />
);
