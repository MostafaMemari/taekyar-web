import { CommentForm } from "@/components/blog/comments/comment-form";
import { CommentList } from "@/components/blog/comments/comment-list";
import { COMMENTS_LABELS, type PostComment } from "@/components/blog/comments/data";
import { BeltDivider } from "@/components/shared/belt-divider";
import { toFaDigits } from "@/lib/utils";

interface CommentsSectionProps {
  comments: PostComment[];
}

export function CommentsSection({ comments }: CommentsSectionProps) {
  return (
    <section aria-labelledby="comments-title" className="mt-8 sm:mt-10">
      <div className="border-b border-black/[0.06] pb-4 sm:pb-5">
        <p className="text-[11px] font-bold tracking-wide text-primary sm:text-xs">
          {COMMENTS_LABELS.eyebrow}
        </p>
        <h2 id="comments-title" className="mt-1.5 text-[1.25rem] font-black leading-tight sm:text-2xl">
          {COMMENTS_LABELS.title}
          {comments.length > 0 ? (
            <span className="ms-2 align-middle text-sm font-bold text-muted-foreground sm:text-[15px]">
              ({toFaDigits(comments.length)} {COMMENTS_LABELS.countSuffix})
            </span>
          ) : null}
        </h2>
        <BeltDivider variant="pill" className="mt-3 h-1 w-12 sm:w-16" />
      </div>

      <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
        <CommentList comments={comments} />
        <CommentForm />
      </div>
    </section>
  );
}
