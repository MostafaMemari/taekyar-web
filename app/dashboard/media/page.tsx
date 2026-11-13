import { AlertCircle, ImagePlus } from "lucide-react";
import Link from "next/link";

import { MediaBrowser } from "@/components/dashboard/media/media-browser";
import { MediaUploadButton } from "@/components/dashboard/media/media-upload-button";
import { DashboardEmptyState } from "@/components/dashboard/shared/dashboard-empty-state";
import { DashboardPageHeader } from "@/components/dashboard/shared/dashboard-page-header";
import {
  DashboardCountChip,
  DashboardSearchField,
  DashboardToolbar,
} from "@/components/dashboard/shared/dashboard-toolbar";
import { PaginationNav } from "@/components/dashboard/shared/pagination-nav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MEDIA_LABELS } from "@/data/dashboard/ui";
import { getMediaPage } from "@/lib/media/media-list";

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
      <DashboardPageHeader
        title={MEDIA_LABELS.title}
        description={MEDIA_LABELS.description}
        actions={<MediaUploadButton />}
      />

      <Card className="gap-0 rounded-xl p-0 shadow-none">
        <DashboardToolbar>
          <DashboardSearchField
            action="/dashboard/media"
            label={MEDIA_LABELS.searchLabel}
            placeholder={MEDIA_LABELS.searchPlaceholder}
            defaultValue={query}
          />
          <DashboardCountChip count={total} suffix={MEDIA_LABELS.countSuffix} />
        </DashboardToolbar>

        {failed ? (
          <div className="p-4">
            <Alert variant="destructive" className="rounded-lg">
              <AlertCircle className="size-4" aria-hidden="true" />
              <AlertTitle className="text-[13px] font-bold">{MEDIA_LABELS.loadError}</AlertTitle>
              <AlertDescription className="text-[13px] leading-5">{MEDIA_LABELS.loadErrorHint}</AlertDescription>
            </Alert>
          </div>
        ) : items.length === 0 ? (
          <DashboardEmptyState
            title={MEDIA_LABELS.empty}
            hint={query ? MEDIA_LABELS.emptyWithQuery : MEDIA_LABELS.emptyWithoutQuery}
            icon={query ? undefined : <ImagePlus className="size-6" aria-hidden="true" />}
            action={
              query ? (
                <Button variant="outline" asChild className="h-10 rounded-lg px-4 text-[13px] font-bold">
                  <Link href="/dashboard/media">{MEDIA_LABELS.clearSearch}</Link>
                </Button>
              ) : (
                <MediaUploadButton />
              )
            }
          />
        ) : (
          <div className="p-3 sm:p-4">
            <MediaBrowser items={items} />
          </div>
        )}
      </Card>

      {totalPages > 1 ? (
        <PaginationNav
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          buildHref={buildHref}
          labels={{ ...MEDIA_LABELS, title: MEDIA_LABELS.paginationNavLabel }}
        />
      ) : null}
    </div>
  );
}
