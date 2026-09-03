import { Section } from "@/components/shared/section";
import { Skeleton } from "@/components/ui/skeleton";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function LoadingStatus({ label }: { label: string }) {
  return (
    <p role="status" className="sr-only">
      {label}
    </p>
  );
}

export function PostCardSkeleton() {
  return (
    <div aria-hidden="true" className={cn(SURFACE_CARD, "flex h-full flex-col overflow-hidden")}>
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="mt-2 h-5 w-2/3" />
        <Skeleton className="mt-3 h-3.5 w-1/2" />
        <Skeleton className="mt-3 h-3.5 w-full" />
        <Skeleton className="mt-2 h-3.5 w-5/6" />
        <Skeleton className="mb-1 mt-4 h-5 w-24" />
      </div>
    </div>
  );
}

export function PostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ArchiveHeaderSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="h-4 w-48" />
      <div className="mt-4 max-w-2xl">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-9 w-3/4 sm:h-11" />
        <Skeleton className="mt-3.5 h-1 w-16 rounded-full sm:w-20" />
        <Skeleton className="mt-3.5 h-4 w-40" />
      </div>
    </div>
  );
}

export function TaxonomyLoadingSkeleton({ label }: { label: string }) {
  return (
    <>
      <LoadingStatus label={label} />
      <Section containerClassName="pb-3 pt-6 sm:pb-4 sm:pt-8 lg:pt-10">
        <ArchiveHeaderSkeleton />
      </Section>
      <Section containerClassName="pt-6 pb-2 sm:pt-7 lg:pt-8">
        <PostGridSkeleton />
      </Section>
      <div className="pb-10" />
    </>
  );
}
