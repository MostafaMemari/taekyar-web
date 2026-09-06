import { Section } from "@/components/shared/section";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingStatus({ label }: { label: string }) {
  return (
    <p role="status" className="sr-only">
      {label}
    </p>
  );
}

export function PostCardSkeleton() {
  return (
    <Card aria-hidden="true" className="h-full p-0">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <CardContent className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="mt-2 h-5 w-2/3" />
        <Skeleton className="mt-3 h-3.5 w-1/2" />
        <Skeleton className="mt-3 h-3.5 w-full" />
        <Skeleton className="mt-2 h-3.5 w-5/6" />
        <Skeleton className="mb-1 mt-4 h-5 w-24" />
      </CardContent>
    </Card>
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

export function BlogIndexSkeleton() {
  return (
    <>
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
