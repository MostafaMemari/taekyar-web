import { Apple, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORES = [
  { name: "گوگل‌پلی", icon: Play },
  { name: "اپ‌استور", icon: Apple },
];

interface DownloadButtonsProps {
  tone?: "dark" | "onRed";
  className?: string;
}

export function DownloadButtons({ tone = "dark", className }: DownloadButtonsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {STORES.map((store, index) => (
        <Button
          key={store.name}
          type="button"
          size="lg"
          className={cn(
            "h-11 gap-2.5 rounded-lg px-5 text-[15px] font-semibold",
            tone === "dark" && index === 0 && "bg-primary text-white hover:bg-primary/85",
            tone === "dark" &&
              index === 1 &&
              "border-white/25 bg-white/5 text-foreground hover:border-white/40 hover:bg-white/10",
            tone === "onRed" &&
              index === 0 &&
              "border-transparent bg-white text-primary shadow-lg shadow-black/20 hover:bg-white/90",
            tone === "onRed" &&
              index === 1 &&
              "border-white/50 bg-transparent text-white hover:border-white hover:bg-black/10"
          )}
        >
          <store.icon className="!size-[18px]" />
          دریافت از {store.name}
        </Button>
      ))}
    </div>
  );
}
