import Link from "next/link";

interface WordmarkProps {
  onNavigate?: () => void;
}

export function Wordmark({ onNavigate }: WordmarkProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex items-center gap-2 rounded-md text-xl font-black text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex items-center gap-1.5">
        تک‌یار
        <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-primary" />
      </span>
      <span
        lang="ko"
        aria-hidden="true"
        className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-bold leading-none tracking-[0.2em] text-muted-foreground sm:inline-block"
      >
        태권도
      </span>
    </Link>
  );
}
