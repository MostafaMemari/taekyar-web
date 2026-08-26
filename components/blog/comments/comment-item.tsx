import type { PostComment } from "@/components/blog/comments/data";
import { COMMENT_AVATAR_TINTS } from "@/components/blog/comments/data";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

function CommentAvatar({ author, index }: { author: string; index: number }) {
  const initial = author.trim().charAt(0);
  const tint = COMMENT_AVATAR_TINTS[index % COMMENT_AVATAR_TINTS.length];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 select-none items-center justify-center rounded-full text-base font-black ring-1 ring-black/[0.06]",
        tint,
      )}
    >
      {initial}
    </span>
  );
}

interface CommentItemProps {
  comment: PostComment;
  index: number;
}

export function CommentItem({ comment, index }: CommentItemProps) {
  return (
    <article className={cn(SURFACE_CARD, "p-4 sm:p-5")}>
      <div className="flex items-center gap-3">
        <CommentAvatar author={comment.author} index={index} />
        <div>
          <p className="text-sm font-bold leading-6">{comment.author}</p>
          <p className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs">
            {comment.date}
          </p>
        </div>
      </div>

      <p className="mt-3 text-pretty text-[14px] leading-7 text-muted-foreground sm:text-[15px] sm:leading-8">
        {comment.message}
      </p>
    </article>
  );
}
