"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { BLOCK_TYPE_LABELS } from "@/data/dashboard/ui";
import { BLOCK_MENU_GROUPS, type BlockType } from "./types";

interface BlockAddMenuProps {
  onAdd: (type: BlockType) => void;
  variant?: "slot" | "inline";
  label?: string;
}

export function BlockAddMenu({ onAdd, variant = "slot", label }: BlockAddMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  if (variant === "inline") {
    return (
      <div ref={rootRef} className="grid gap-4 sm:grid-cols-2">
        {BLOCK_MENU_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 text-[11px] font-bold text-muted-foreground">{group.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onAdd(type)}
                  className="rounded-xl border border-dashed border-border bg-card px-3 py-2 text-[13px] font-bold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  {BLOCK_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative flex justify-center">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={cn(
          "flex size-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
          open && "border-primary/40 text-primary",
        )}
      >
        <Plus className={cn("size-4 transition-transform", open && "rotate-45")} aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute top-9 z-30 w-64 rounded-2xl border border-border/70 bg-card p-3 shadow-xl shadow-black/[0.08]">
          {BLOCK_MENU_GROUPS.map((group) => (
            <div key={group.label} className="not-last:mb-2.5">
              <p className="mb-1 px-1 text-[10px] font-bold text-muted-foreground">{group.label}</p>
              <div className="flex flex-wrap gap-1">
                {group.types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      onAdd(type);
                      setOpen(false);
                    }}
                    className="rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold text-foreground/80 transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    {BLOCK_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
