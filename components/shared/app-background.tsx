import { cn } from "@/lib/utils";

export const APP_BACKGROUND_VARIANTS = ["tatami", "glow"] as const;

export type AppBackgroundVariant = (typeof APP_BACKGROUND_VARIANTS)[number];

const APP_BACKGROUND_STYLES: Record<AppBackgroundVariant, string> = {
  tatami: "bg-tatami",
  glow: "bg-section-glow",
};

interface AppBackgroundProps {
  variant?: AppBackgroundVariant;
  children: React.ReactNode;
}

export function AppBackground({ variant, children }: AppBackgroundProps) {
  return (
    <>
      <div aria-hidden="true" className="theme-light pointer-events-none fixed inset-0 -z-10 bg-background" />

      {variant && <div aria-hidden="true" className={cn("pointer-events-none fixed inset-0 -z-10", APP_BACKGROUND_STYLES[variant])} />}

      {children}
    </>
  );
}
