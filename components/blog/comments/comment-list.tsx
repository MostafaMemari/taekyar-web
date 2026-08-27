import { MessageSquareDashed } from "lucide-react";

import type { PostComment } from "@/data/blog/comments";
import { CommentItem } from "@/components/blog/comments/comment-item";

const EMPTY_STATE_COPY = {
  title: "هنوز دیدگاهی ثبت نشده",
  description: "اولین نفری باش که درباره این مقاله نظر می‌دهد؛ با نوشتن دیدگاه، گفت‌وگو را شروع کن.",
} as const;

function CommentsEmptyState() {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-border bg-card/60 p-8 text-center sm:p-10">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <MessageSquareDashed className="!size-5" />
      </span>
      <p className="mt-4 text-sm font-bold sm:text-[15px]">{EMPTY_STATE_COPY.title}</p>
      <p className="mt-1.5 max-w-sm text-[13px] leading-7 text-muted-foreground">
        {EMPTY_STATE_COPY.description}
      </p>
    </div>
  );
}

interface CommentListProps {
  comments: PostComment[];
  postSlug: string;
}

export function CommentList({ comments, postSlug }: CommentListProps) {
  if (comments.length === 0) return <CommentsEmptyState />;

  return (
    <ul className="space-y-3.5 sm:space-y-4">
      {comments.map((comment) => (
        <li key={comment.id}>
          <CommentItem comment={comment} postSlug={postSlug} />
        </li>
      ))}
    </ul>
  );
}
