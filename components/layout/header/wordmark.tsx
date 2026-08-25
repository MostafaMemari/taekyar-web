import Link from "next/link";

export function Wordmark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground"
    >
      <span className="flex items-center gap-1.5">
        تک‌یار
        <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-primary" />
      </span>
      <span
        lang="ko"
        aria-hidden="true"
        className="hidden rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-bold leading-none tracking-[0.2em] text-muted-foreground sm:inline-block"
      >
        태권도
      </span>
    </Link>
  );
}
