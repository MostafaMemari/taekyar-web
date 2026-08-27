"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";

import { CommentForm } from "@/components/blog/comments/comment-form";
import { CommentList } from "@/components/blog/comments/comment-list";
import {
  COMMENT_REPLY_LABELS,
  COMMENTS_LABELS,
  type PostComment,
} from "@/data/blog/comments";
import { BeltDivider } from "@/components/shared/belt-divider";
import { Button } from "@/components/ui/button";
import { toFaDigits } from "@/lib/utils";

function countComments(comments: PostComment[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + (comment.replies?.length ?? 0),
    0,
  );
}

interface CommentsSectionProps {
  comments: PostComment[];
  postSlug: string;
}

export function CommentsSection({ comments, postSlug }: CommentsSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const totalComments = countComments(comments);

  return (
    <section aria-labelledby="comments-title" className="mt-8 sm:mt-10">
      <div className="border-b border-black/[0.06] pb-4 sm:pb-5">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div>
            <p className="text-[11px] font-bold tracking-wide text-primary sm:text-xs">
              {COMMENTS_LABELS.eyebrow}
            </p>
            <h2 id="comments-title" className="mt-1.5 text-[1.25rem] font-black leading-tight sm:text-2xl">
              {COMMENTS_LABELS.title}
              {totalComments > 0 ? (
                <span className="ms-2 align-middle text-sm font-bold text-muted-foreground sm:text-[15px]">
                  ({toFaDigits(totalComments)} {COMMENTS_LABELS.countSuffix})
                </span>
              ) : null}
            </h2>
            <BeltDivider variant="pill" className="mt-3 h-1 w-12 sm:w-16" />
          </div>

          <Button
            type="button"
            onClick={() => setIsFormOpen((previous) => !previous)}
            aria-expanded={isFormOpen}
            aria-controls="comment-composer"
            className={cnToggleButton(isFormOpen)}
          >
            <PenLine />
            {isFormOpen ? COMMENT_REPLY_LABELS.cancel : COMMENTS_LABELS.addCommentButton}
          </Button>
        </div>
      </div>

      <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
        {isFormOpen ? (
          <div
            id="comment-composer"
            className="animate-in fade-in-0 slide-in-from-bottom-4 overflow-hidden duration-500 ease-out"
          >
            <CommentForm postSlug={postSlug} onCancel={() => setIsFormOpen(false)} />
          </div>
        ) : null}

        <CommentList comments={comments} postSlug={postSlug} />
      </div>
    </section>
  );
}

function cnToggleButton(isOpen: boolean): string {
  return isOpen
    ? "h-9 gap-2 rounded-xl bg-primary/10 px-4 text-sm font-bold text-primary shadow-none hover:bg-primary/10"
    : "h-9 gap-2 rounded-xl px-4 text-sm font-bold shadow-md shadow-primary/20";
}

