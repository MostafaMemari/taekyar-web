"use client";

import { useState } from "react";
import { CornerDownLeft } from "lucide-react";

import type { PostComment } from "@/data/blog/comments";
import { COMMENT_AVATAR_TINTS, COMMENT_REPLY_LABELS } from "@/data/blog/comments";
import { ReplyForm } from "@/components/blog/comments/reply-form";
import { ReplyItem } from "@/components/blog/comments/reply-item";
import { Badge } from "@/components/ui/badge";
import { SURFACE_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";

function CommentAvatar({ author }: { author: string }) {
  const initial = author.trim().charAt(0);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 select-none items-center justify-center rounded-full text-base font-black ring-1 ring-black/[0.06]",
        COMMENT_AVATAR_TINTS[0],
      )}
    >
      {initial}
    </span>
  );
}

function RoleBadge({ role, accent }: { role: string; accent?: boolean }) {
  return (
    <Badge
      variant={accent ? "default" : "secondary"}
      className={cn(
        "text-[10.5px] leading-none",
        accent && "border-none bg-primary/10 font-bold text-primary",
      )}
    >
      {role}
    </Badge>
  );
}

function ReplyThread({ replies }: { replies: PostComment[] }) {
  return (
    <section
      aria-label={COMMENT_REPLY_LABELS.threadLabel}
      className="mt-4 rounded-xl bg-muted/70 p-1 sm:p-1.5"
    >
      <ul>
        {replies.map((reply) => (
          <li key={reply.id}>
            <ReplyItem reply={reply} />
          </li>
        ))}
      </ul>
    </section>
  );
}

interface CommentItemProps {
  comment: PostComment;
  postSlug: string;
}

export function CommentItem({ comment, postSlug }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const hasReplies = Boolean(comment.replies?.length);

  return (
    <article
      className={cn(
        SURFACE_CARD,
        "p-4 transition-shadow duration-300 hover:shadow-md hover:shadow-black/[0.06] sm:p-5",
      )}
    >
      <header className="flex items-center gap-3">
        <CommentAvatar author={comment.author} />

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="max-w-full truncate text-sm font-extrabold leading-6 sm:text-[15px]">
            {comment.author}
          </h3>
          <RoleBadge role={comment.role} accent={comment.isTeamAuthor} />
        </div>

        <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
          <time className="whitespace-nowrap text-[11px] font-medium leading-5 text-muted-foreground sm:text-xs">
            {comment.date}
          </time>
          <span aria-hidden="true" className="hidden h-4 w-px bg-black/[0.08] sm:block" />
          <button
            type="button"
            onClick={() => setIsReplying((previous) => !previous)}
            aria-expanded={isReplying}
            aria-controls={`reply-form-${comment.id}`}
            className="-me-1.5 inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-bold text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <CornerDownLeft className="size-3.5" aria-hidden="true" />
            {isReplying ? COMMENT_REPLY_LABELS.cancel : COMMENT_REPLY_LABELS.replyButton}
          </button>
        </div>
      </header>

      <p className="mt-3 border-t border-black/[0.04] pt-3 text-pretty text-[14px] leading-7 text-muted-foreground sm:mt-3.5 sm:pt-3.5 sm:text-[15px] sm:leading-8">
        {comment.message}
      </p>

      {isReplying ? (
        <div id={`reply-form-${comment.id}`}>
          <ReplyForm postSlug={postSlug} parentId={comment.id} parentAuthor={comment.author} onCancel={() => setIsReplying(false)} />
        </div>
      ) : null}

      {hasReplies ? <ReplyThread replies={comment.replies!} /> : null}
    </article>
  );
}

