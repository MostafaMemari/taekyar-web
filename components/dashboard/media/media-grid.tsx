"use client";

import type { MediaItem } from "@/lib/media";

import { MediaCard } from "./media-card";

interface MediaGridProps {
  items: MediaItem[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
}

export function MediaGrid({ items, selectedKey, onSelect }: MediaGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <li key={item.key} className="min-w-0">
          <MediaCard item={item} isSelected={item.key === selectedKey} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}
