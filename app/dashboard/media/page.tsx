import { AlertCircle, ImagePlus, Inbox, Search } from "lucide-react";
import Link from "next/link";

import { MediaBrowser } from "@/components/dashboard/media/media-browser";
import { MediaUploadButton } from "@/components/dashboard/media/media-upload-button";
import { PaginationNav } from "@/components/dashboard/shared/pagination-nav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MEDIA_LABELS } from "@/data/dashboard/ui";
import { getMediaPage } from "@/lib/media-list";
import { toFaDigits } from "@/lib/utils";

interface MediaPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const metadata = {
  title: MEDIA_LABELS.title,
};

export default async function DashboardMediaPage({ searchParams }: MediaPageProps) {
  const { q, page } = await searchParams;
  const query = (q ?? "").trim();
  const mediaPage = await getMediaPage({ query, page: Number(page) });

  const { items, total, totalPages, currentPage, failed } = mediaPage;

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (targetPage > 1) params.set("page", String(targetPage));
    const queryString = params.toString();
    return queryString ? `/dashboard/media?${queryString}` : "/dashboard/media";
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight text-foreground sm:text-2xl">{MEDIA_LABELS.title}</h1>
          <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-muted-foreground sm:text-sm">
            {MEDIA_LABELS.description}
          </p>
        </div>

        <MediaUploadButton />
      </div>

      <Card className="p-0">
        <div className="flex flex-wrap items-center gap-3 p-3 sm:p-4">
          <form role="search" aria-label={MEDIA_LABELS.searchLabel} action="/dashboard/media" className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50"
            />
            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={MEDIA_LABELS.searchPlaceholder}
              aria-label={MEDIA_LABELS.searchLabel}
              className="h-10 rounded-xl bg-card ps-9 pe-4 text-[13px] placeholder:text-muted-foreground/60"
            />
          </form>

          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold tabular-nums text-muted-foreground ring-1 ring-border/60">
            {toFaDigits(total)} {MEDIA_LABELS.countSuffix}
          </span>
        </div>

        <Separator className="bg-border/60" />

        {failed ? (
          <CardContent className="p-4">
            <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5">
              <AlertCircle className="size-4" aria-hidden="true" />
              <AlertTitle className="text-[13px] font-bold">{MEDIA_LABELS.loadError}</AlertTitle>
              <AlertDescription className="text-[13px] leading-5">{MEDIA_LABELS.loadErrorHint}</AlertDescription>
            </Alert>
          </CardContent>
        ) : items.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
              {query ? <Inbox className="size-6" aria-hidden="true" /> : <ImagePlus className="size-6" aria-hidden="true" />}
            </span>
            <p className="mt-3 text-[14px] font-bold">{MEDIA_LABELS.empty}</p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
              {query ? MEDIA_LABELS.emptyWithQuery : MEDIA_LABELS.emptyWithoutQuery}
            </p>
            {query ? (
              <Button variant="outline" asChild className="mt-4 h-9 rounded-xl px-4 text-[13px] font-bold">
                <Link href="/dashboard/media">{MEDIA_LABELS.clearSearch}</Link>
              </Button>
            ) : (
              <MediaUploadButton />
            )}
          </CardContent>
        ) : (
          <CardContent className="p-3 sm:p-4">
            <MediaBrowser items={items} />
          </CardContent>
        )}
      </Card>

      {totalPages > 1 ? (
        <PaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          buildHref={buildHref}
          labels={MEDIA_LABELS}
        />
      ) : null}
    </div>
  );
}

