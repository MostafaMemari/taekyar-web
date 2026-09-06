import { Section } from "@/components/shared/section";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingStatus } from "@/components/blog/loading-skeletons";
import { POST_LAYOUT } from "@/data/blog/post-config";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function PostLoading() {
  return (
    <>
      <LoadingStatus label="در حال بارگذاری مقاله…" />
      <Section className="pb-0 sm:pb-0 lg:pb-0">
        <div aria-hidden="true">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4 sm:pb-5">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="hidden h-4 w-28 sm:block" />
          </div>

          <div
            className={cn(
              "mt-6 grid gap-6 sm:mt-7 sm:gap-7 lg:mt-10 lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-8 lg:gap-y-8 xl:gap-x-10",
              POST_LAYOUT.postColumns,
            )}
          >
            <div className="min-w-0 space-y-3 lg:col-start-1 lg:row-start-1">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-6 w-32 rounded-md" />
              </div>
              <Skeleton className="h-9 w-full sm:h-11" />
              <Skeleton className="h-9 w-5/6 sm:h-11" />
              <Skeleton className="h-5 w-4/6" />
              <Skeleton className="h-5 w-3/6" />
            </div>

            <div className="min-w-0 lg:col-start-2 lg:row-start-1">
              <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            </div>

            <div className="min-w-0 lg:col-start-1 lg:row-start-2">
              <div className={cn(SURFACE_CARD, "space-y-4 p-4 sm:p-6 lg:p-10")}>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="mt-6 h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="mt-6 h-24 w-full rounded-xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>

            <div className="hidden min-w-0 lg:col-start-2 lg:row-start-2 lg:block">
              <div className={cn(SURFACE_CARD, "space-y-2.5 p-4")}>
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          </div>
        </div>
      </Section>
      <div className="pb-10" aria-hidden="true" />
    </>
  );
}
