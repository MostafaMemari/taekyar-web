export type BeltState = "earned" | "next" | "locked";

const FILL_OPACITY: Record<BeltState, number> = {
  earned: 1,
  next: 0.5,
  locked: 0.16,
};

const STROKE_OPACITY: Record<BeltState, number> = {
  earned: 0.16,
  next: 0.12,
  locked: 0.1,
};

interface BeltIconProps {
  color: string;
  state: BeltState;
  className?: string;
}

export function BeltIcon({ color, state, className }: BeltIconProps) {
  return (
    <svg viewBox="0 0 40 27" className={className} aria-hidden="true">
      <g
        fill={color}
        fillOpacity={FILL_OPACITY[state]}
        stroke="#171717"
        strokeOpacity={STROKE_OPACITY[state]}
        strokeWidth="0.7"
      >
        <rect x="2.5" y="8" width="35" height="7" rx="3.5" />
        <rect x="15.9" y="14" width="3.6" height="11" rx="1.8" />
        <rect x="20.5" y="14" width="3.6" height="8.5" rx="1.8" />
        <rect x="14.4" y="5.4" width="11.2" height="12.2" rx="3.4" />
      </g>
      {state === "earned" ? (
        <rect
          x="14.4"
          y="5.4"
          width="11.2"
          height="12.2"
          rx="3.4"
          fill="#171717"
          fillOpacity="0.12"
        />
      ) : null}
    </svg>
  );
}
