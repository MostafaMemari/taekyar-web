import { Section } from "@/components/shared/section";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArchiveHeaderSkeleton,
  LoadingStatus,
  PostGridSkeleton,
} from "@/components/blog/loading-skeletons";

export default function BlogLoading() {
  return (
    <>
      <LoadingStatus label="در حال بارگذاری مقالات…" />
      <Section containerClassName="pb-3 pt-6 sm:pb-4 sm:pt-8 lg:pt-10">
        <ArchiveHeaderSkeleton />
        <div aria-hidden="true" className="mt-6 flex flex-col gap-3 border-b border-border/60 pb-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5">
          <div className="flex items-center gap-2 overflow-hidden">
            <Skeleton className="h-8 w-16 shrink-0 rounded-full" />
            <Skeleton className="h-8 w-24 shrink-0 rounded-full" />
            <Skeleton className="h-8 w-20 shrink-0 rounded-full" />
            <Skeleton className="hidden h-8 w-24 shrink-0 rounded-full sm:block" />
          </div>
          <Skeleton className="h-4 w-32 shrink-0" />
        </div>
      </Section>
      <Section containerClassName="pt-6 pb-2 sm:pt-7 lg:pt-8">
        <PostGridSkeleton />
      </Section>
      <div className="pb-10" aria-hidden="true" />
    </>
  );
}
