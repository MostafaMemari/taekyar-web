"use client";

import { useState } from "react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MEDIA_LABELS } from "@/data/dashboard/ui";
import type { MediaItem } from "@/lib/media/media";

import { MediaDetailsPanel } from "./media-details-panel";
import { MediaGrid } from "./media-grid";

interface MediaBrowserProps {
  items: MediaItem[];
}

export function MediaBrowser({ items }: MediaBrowserProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selected = items.find((item) => item.key === selectedKey) ?? null;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0">
        <MediaGrid items={items} selectedKey={selected?.key ?? null} onSelect={setSelectedKey} />
      </div>

      <div className="hidden lg:block">
        <MediaDetailsPanel key={selected?.key ?? "empty"} item={selected} />
      </div>

      <Sheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedKey(null);
        }}
      >
        <SheetContent
          side="left"
          className="theme-admin w-[92%] gap-0 overflow-y-auto p-0 lg:hidden"
        >
          <SheetHeader className="sticky top-0 z-10 border-b border-border bg-card px-4 py-3 pe-12 text-start">
            <SheetTitle className="text-[13px] font-bold">{MEDIA_LABELS.detailsTitle}</SheetTitle>
            <SheetDescription className="sr-only">{MEDIA_LABELS.selectPrompt}</SheetDescription>
          </SheetHeader>
          <MediaDetailsPanel variant="embedded" item={selected} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
