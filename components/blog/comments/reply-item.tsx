import type { PostComment } from "@/data/blog/comments";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function ReplyAvatar({ author }: { author: string }) {
  const initial = author.trim().charAt(0);

  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/15 text-[13px] font-black text-primary ring-1 ring-black/[0.06] sm:size-9 sm:text-sm"
    >
      {initial}
    </span>
  );
}

interface ReplyItemProps {
  reply: PostComment;
}

/** One reply on the parent's soft thread panel — same row pattern as its parent, scaled down. */
export function ReplyItem({ reply }: ReplyItemProps) {
  return (
    <article className="rounded-lg px-2.5 py-3 transition-colors duration-200 hover:bg-black/[0.025]">
      <header className="flex items-center gap-2.5">
        <ReplyAvatar author={reply.author} />

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <h4
            className={cn(
              "max-w-full truncate text-[13px] font-extrabold leading-5",
              reply.isTeamAuthor && "text-primary",
            )}
          >
            {reply.author}
          </h4>
          <Badge
            variant={reply.isTeamAuthor ? "default" : "secondary"}
            className={cn(
              "h-4 px-1.5 text-[10px] leading-none",
              reply.isTeamAuthor && "border-none bg-primary/10 font-bold text-primary",
            )}
          >
            {reply.role}
          </Badge>
        </div>

        <time className="shrink-0 whitespace-nowrap text-[11px] font-medium leading-5 text-muted-foreground">
          {reply.date}
        </time>
      </header>

      <p className="mt-1.5 ps-[calc(2rem+0.625rem)] text-[13.5px] leading-6 text-muted-foreground sm:ps-[calc(2.25rem+0.625rem)]">
        {reply.message}
      </p>
    </article>
  );
}
