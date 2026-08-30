"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Inbox, LoaderCircle, Search, Upload } from "lucide-react";

import { useMediaUpload } from "./hooks/use-media-upload";
import { MediaGrid } from "./media-grid";
import { listMediaAction } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MEDIA_LABELS, POST_FORM_LABELS } from "@/data/dashboard/ui";
import type { MediaPage } from "@/lib/media-list";

export interface MediaPickerSelection {
  src: string;
  alt: string;
  caption: string;
}

interface MediaPickerProps {
  trigger: React.ReactNode;
  onSelect: (selection: MediaPickerSelection) => void;
}

export function MediaPicker({ trigger, onSelect }: MediaPickerProps) {
  const [mediaPage, setMediaPage] = useState<MediaPage | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPending: isUploading, upload } = useMediaUpload({ onUploaded: handleUploaded });

  const selected = mediaPage?.items.find((item) => item.key === selectedKey) ?? null;

  const load = useCallback(async (nextQuery: string, nextPage = 1) => {
    const result = await listMediaAction({ query: nextQuery, page: nextPage });
    setMediaPage(result);
  }, []);

  function reset() {
    setMediaPage(null);
    setSelectedKey(null);
    setQuery("");
    setAlt("");
    setCaption("");
  }

  function handleOpenChange(nextOpen: boolean) {
    reset();
    if (nextOpen) void load("");
  }

  function handleUploaded(keys: string[]) {
    setSelectedKey(keys[0] ?? null);
    void load(query, 1);
  }

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setSelectedKey(null);
    setMediaPage(null);
    void load(query, 1);
  }

  function handleSelectPage(targetPage: number) {
    setSelectedKey(null);
    setMediaPage(null);
    void load(query, targetPage);
  }

  function handleInsert() {
    if (!selected) return;
    onSelect({ src: selected.url, alt: alt.trim(), caption: caption.trim() });
    reset();
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{POST_FORM_LABELS.imageDialogTitle}</DialogTitle>
          <DialogDescription>{MEDIA_LABELS.description}</DialogDescription>
        </DialogHeader>

        {selected ? (
          <div>
            <Button
              type="button"
              variant="ghost"
              className="-ms-2 mb-3 h-8 gap-1.5 rounded-lg px-2 text-[12px] font-bold text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedKey(null)}
            >
              <ArrowRight className="size-3.5" aria-hidden="true" />
              {MEDIA_LABELS.pickerChange}
            </Button>

            <div className="overflow-hidden rounded-xl bg-muted ring-1 ring-border/60">
              <Image
                src={selected.url}
                alt={MEDIA_LABELS.pickerPreview}
                width={640}
                height={360}
                className="aspect-video w-full object-contain"
                unoptimized
              />
            </div>
            <p dir="ltr" className="mt-2 truncate text-start text-[11px] font-medium text-muted-foreground">
              {selected.name}
            </p>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="picker-image-alt" className="text-[12px] font-bold">
                  {POST_FORM_LABELS.imageAltLabel}
                </Label>
                <Input
                  id="picker-image-alt"
                  value={alt}
                  placeholder={POST_FORM_LABELS.imageAltPlaceholder}
                  className="h-9 rounded-xl"
                  onChange={(event) => setAlt(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="picker-image-caption" className="text-[12px] font-bold">
                  {POST_FORM_LABELS.imageCaptionLabel}
                </Label>
                <Input
                  id="picker-image-caption"
                  value={caption}
                  placeholder={POST_FORM_LABELS.imageCaptionPlaceholder}
                  className="h-9 rounded-xl"
                  onChange={(event) => setCaption(event.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="mt-5">
              <DialogClose asChild>
                <Button type="button" variant="ghost" className="h-9 rounded-xl px-4 text-[13px] font-bold">
                  {POST_FORM_LABELS.cancel}
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  type="button"
                  className="h-9 rounded-xl px-5 text-[13px] font-bold"
                  onClick={handleInsert}
                >
                  {POST_FORM_LABELS.imageInsert}
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <form role="search" aria-label={MEDIA_LABELS.pickerSearchLabel} onSubmit={handleSearch} className="relative min-w-0 flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50"
                />
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={MEDIA_LABELS.pickerSearchPlaceholder}
                  aria-label={MEDIA_LABELS.pickerSearchLabel}
                  className="h-9 rounded-xl bg-muted/40 ps-9 pe-3 text-[13px]"
                />
              </form>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  upload(event.target.files);
                  event.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="h-9 shrink-0 gap-1.5 rounded-xl px-3 text-[12px] font-bold"
              >
                {isUploading ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Upload className="size-4" aria-hidden="true" />
                )}
                {isUploading ? MEDIA_LABELS.uploading : MEDIA_LABELS.upload}
              </Button>
            </div>

            <div className="mt-4 min-h-64">
              {!mediaPage ? (
                <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <li key={index}>
                      <Skeleton className="aspect-square w-full rounded-xl" />
                    </li>
                  ))}
                </ul>
              ) : mediaPage.failed ? (
                <p className="py-10 text-center text-[13px] font-bold text-destructive">
                  {MEDIA_LABELS.pickerLoadError}
                </p>
              ) : mediaPage.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
                    <Inbox className="size-5" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-[13px] font-bold">{MEDIA_LABELS.pickerEmpty}</p>
                  <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                    {MEDIA_LABELS.pickerEmptyHint}
                  </p>
                </div>
              ) : (
                <>
                  <MediaGrid items={mediaPage.items} selectedKey={selectedKey} onSelect={setSelectedKey} />

                  {mediaPage.totalPages > 1 ? (
                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={mediaPage.currentPage <= 1}
                        onClick={() => handleSelectPage(mediaPage.currentPage - 1)}
                        className="h-8 gap-1.5 rounded-lg px-3 text-[12px] font-bold"
                      >
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                        {MEDIA_LABELS.prevPage}
                      </Button>
                      <span className="text-[12px] font-medium tabular-nums text-muted-foreground">
                        {mediaPage.currentPage} / {mediaPage.totalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={mediaPage.currentPage >= mediaPage.totalPages}
                        onClick={() => handleSelectPage(mediaPage.currentPage + 1)}
                        className="h-8 gap-1.5 rounded-lg px-3 text-[12px] font-bold"
                      >
                        {MEDIA_LABELS.nextPage}
                        <ArrowLeft className="size-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
