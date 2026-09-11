"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, ExternalLink, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MEDIA_LABELS } from "@/data/dashboard/ui";
import { toast } from "@/hooks/use-toast";
import type { MediaItem } from "@/lib/media";
import { cn, toPersianDigits } from "@/lib/utils";

import { DeleteMediaButton } from "./delete-media-button";

interface MediaDetailsPanelProps {
  item: MediaItem | null;
  variant?: "panel" | "embedded";
}

export function MediaDetailsPanel({ item, variant = "panel" }: MediaDetailsPanelProps) {
  const [dimensions, setDimensions] = useState<string | null>(null);
  const embedded = variant === "embedded";

  if (!item) {
    return (
      <div
        className={cn(
          "rounded-lg border border-dashed border-border bg-surface-muted px-5 py-8 text-center",
          !embedded && "lg:sticky lg:top-4",
        )}
      >
        <span
          aria-hidden="true"
          className="mx-auto flex size-12 items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-border"
        >
          <Info className="size-5" />
        </span>
        <p className="mt-3 text-[13px] font-bold text-foreground">{MEDIA_LABELS.selectPromptTitle}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{MEDIA_LABELS.selectPrompt}</p>
      </div>
    );
  }

  const { url } = item;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      toast({ tone: "success", title: MEDIA_LABELS.copyUrl });
    } catch {
      toast({ tone: "error", title: MEDIA_LABELS.copyError });
    }
  }

  const body = (
    <div className={cn("p-3 sm:p-4", embedded && "pt-4")}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={item.url}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 1024px) 100vw, 280px"
          className="object-contain"
          unoptimized
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget;
            if (naturalWidth > 0 && naturalHeight > 0) {
              setDimensions(`${naturalWidth} × ${naturalHeight}`);
            }
          }}
        />
      </div>

      <dl className="mt-2 divide-y divide-border">
        <MetaRow label={MEDIA_LABELS.fieldFile} value={item.name} dir="ltr" />
        <MetaRow label={MEDIA_LABELS.fieldType} value={item.typeLabel} dir="ltr" />
        <MetaRow label={MEDIA_LABELS.fieldSize} value={item.sizeLabel} />
        <MetaRow
          label={MEDIA_LABELS.fieldDimensions}
          value={dimensions ? toPersianDigits(dimensions) : "—"}
          dir="ltr"
        />
        <MetaRow label={MEDIA_LABELS.fieldUploadedAt} value={item.uploadedAtLabel} />
      </dl>

      <div className="mt-3 border-t border-border pt-3">
        <p className="pb-1.5 text-[11px] font-semibold text-muted-foreground">{MEDIA_LABELS.fieldUrl}</p>
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={item.url}
            dir="ltr"
            aria-label={MEDIA_LABELS.fieldUrl}
            onFocus={(event) => event.currentTarget.select()}
            className="h-9 min-w-0 rounded-lg border-border bg-surface-muted font-mono text-[11px]"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            aria-label={MEDIA_LABELS.copyUrl}
            className="h-9 shrink-0 gap-1.5 rounded-lg px-3 text-[12px] font-bold"
          >
            <Copy className="size-3.5" aria-hidden="true" />
            {MEDIA_LABELS.copyUrl}
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        <Button asChild variant="outline" className="h-10 w-full justify-between rounded-lg px-3 text-[12px] font-bold">
          <Link href={item.url} target="_blank" rel="noreferrer">
            {MEDIA_LABELS.openInNewTab}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        </Button>
        <DeleteMediaButton mediaKey={item.key} />
      </div>
    </div>
  );

  if (embedded) {
    return body;
  }

  return (
    <aside className="overflow-hidden rounded-xl border border-border bg-card lg:sticky lg:top-4">
      <div className="border-b border-border bg-surface-muted px-4 py-3">
        <h2 className="text-[13px] font-bold text-foreground">{MEDIA_LABELS.detailsTitle}</h2>
      </div>
      {body}
    </aside>
  );
}

function MetaRow({ label, value, dir }: { label: string; value: string; dir?: "ltr" }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <dt className="shrink-0 text-[11px] font-semibold text-muted-foreground">{label}</dt>
      <dd dir={dir} className="min-w-0 truncate text-[12px] font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}
