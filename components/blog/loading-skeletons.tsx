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
        <Skeleton className="mt-3 h-3.5 w-full" />
        <Skeleton className="mt-2 h-3.5 w-5/6" />
        <div className="min-h-3 flex-1" />
        <div className="mt-4 flex items-center gap-3 border-t border-dashed border-black/[0.08] pt-3">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-20" />
        </div>
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

function TaxonomyHeaderSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="mx-auto h-3.5 w-48" />
      <Skeleton className="mx-auto mt-5 h-11 w-64 sm:h-16 sm:w-80" />
      <div className="mx-auto mt-6 flex w-56 items-center gap-2">
        <Skeleton className="h-px flex-1" />
        <Skeleton className="size-1.5 rotate-45" />
        <Skeleton className="h-px flex-1" />
      </div>
      <div className="mt-7 flex flex-wrap justify-center gap-2.5">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function BlogIndexSkeleton() {
  return (
    <>
      <Section spacing="none" containerClassName="pb-4 pt-8 sm:pt-10 lg:pt-12">
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
      <Section spacing="none" containerClassName="pt-8 sm:pt-10">
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
      <div className="bg-warm-dots">
        <Section spacing="none" containerClassName="pb-10 pt-8 sm:pt-10 lg:pt-12">
          <TaxonomyHeaderSkeleton />
        </Section>
        <Section spacing="none" containerClassName="pb-12 sm:pb-14">
          <PostGridSkeleton />
        </Section>
      </div>
    </>
  );
}
