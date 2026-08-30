"use client";

import { useState } from "react";

import type { MediaItem } from "@/lib/media";

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
      <MediaDetailsPanel key={selected?.key ?? "empty"} item={selected} />
    </div>
  );
}
