"use client";

import { useState } from "react";
import { Dumbbell, Home, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { HomeScreen } from "./home-screen";
import { TrainingScreen } from "./training-screen";

type PhoneScreen = "home" | "training";

interface AppScreenProps {
  belts: string[];
}

export function AppScreen({ belts }: AppScreenProps) {
  const [screen, setScreen] = useState<PhoneScreen>("home");

  return (
    <div className="overflow-hidden rounded-[2.1rem] bg-white">
      <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-bold text-black/70">
        <span>۹:۴۱</span>
        <span className="h-5 w-16 rounded-full bg-[#16161a]" />
        <span className="flex items-end gap-[3px]">
          <span className="h-1 w-[3px] rounded-full bg-black/50" />
          <span className="h-1.5 w-[3px] rounded-full bg-black/50" />
          <span className="h-2 w-[3px] rounded-full bg-black/50" />
          <span className="h-2.5 w-[3px] rounded-full bg-black/70" />
        </span>
      </div>

      <div className="grid px-4 pb-4 pt-3">
        <div
          aria-hidden={screen !== "home"}
          inert={screen !== "home"}
          className={cn(
            "[grid-area:1/1] motion-safe:transition-all motion-safe:duration-300",
            screen === "home"
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-4 opacity-0"
          )}
        >
          <HomeScreen belts={belts} onStartTraining={() => setScreen("training")} />
        </div>
        <div
          aria-hidden={screen !== "training"}
          inert={screen !== "training"}
          className={cn(
            "[grid-area:1/1] motion-safe:transition-all motion-safe:duration-300",
            screen === "training"
              ? "translate-x-0 opacity-100"
              : "pointer-events-none -translate-x-4 opacity-0"
          )}
        >
          <TrainingScreen onBack={() => setScreen("home")} />
        </div>
      </div>

      <div className="flex items-center justify-around border-t border-black/5 px-6 py-2.5 text-black/30">
        <Home className="size-4 text-primary" />
        <Dumbbell className="size-4" />
        <User className="size-4" />
      </div>
    </div>
  );
}
