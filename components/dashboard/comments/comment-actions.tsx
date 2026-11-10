"use client";

import { useTransition } from "react";
import { Check, Trash2, X } from "lucide-react";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { ROW_ACTION_DESTRUCTIVE_CLASS, RowActionButton } from "@/components/dashboard/shared/row-action-button";
import { Button } from "@/components/ui/button";
import { COMMENTS_ADMIN_LABELS } from "@/data/dashboard/ui";
import { deleteComment, setCommentStatus } from "@/lib/admin-actions";
import type { CommentStatus } from "@/lib/admin/types";
import { toast } from "@/hooks/use-toast";

interface CommentActionsProps {
  id: string;
  status: CommentStatus;
}

export function CommentActions({ id, status }: CommentActionsProps) {
  const [isPending, startTransition] = useTransition();

  function run(task: () => Promise<{ ok: boolean }>, successMessage: string) {
    startTransition(async () => {
      const result = await task();
      if (result.ok) {
        toast({ tone: "success", title: successMessage });
      } else {
        toast({ tone: "error", title: COMMENTS_ADMIN_LABELS.error });
      }
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      {status !== "APPROVED" ? (
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          aria-busy={isPending}
          className="h-9 gap-1.5 rounded-lg border-success/30 text-[12px] font-bold text-success hover:bg-success/10"
          onClick={() => run(() => setCommentStatus(id, "APPROVED"), COMMENTS_ADMIN_LABELS.approved)}
        >
          <Check className="size-3.5" aria-hidden="true" />
          {COMMENTS_ADMIN_LABELS.approve}
        </Button>
      ) : null}

      {status !== "REJECTED" ? (
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          aria-busy={isPending}
          className="h-9 gap-1.5 rounded-lg border-destructive/30 text-[12px] font-bold text-destructive hover:bg-destructive/10"
          onClick={() => run(() => setCommentStatus(id, "REJECTED"), COMMENTS_ADMIN_LABELS.rejected)}
        >
          <X className="size-3.5" aria-hidden="true" />
          {COMMENTS_ADMIN_LABELS.reject}
        </Button>
      ) : null}

      <ConfirmDialog
        destructive
        title={COMMENTS_ADMIN_LABELS.deleteTitle}
        description={COMMENTS_ADMIN_LABELS.confirmDelete}
        confirmLabel={COMMENTS_ADMIN_LABELS.delete}
        onConfirm={async () => {
          const result = await deleteComment(id);
          if (result.ok) {
            toast({ tone: "success", title: COMMENTS_ADMIN_LABELS.deleted });
          } else {
            toast({ tone: "error", title: COMMENTS_ADMIN_LABELS.error });
          }
        }}
        trigger={
          <RowActionButton
            aria-label={COMMENTS_ADMIN_LABELS.delete}
            title={COMMENTS_ADMIN_LABELS.delete}
            className={ROW_ACTION_DESTRUCTIVE_CLASS}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </RowActionButton>
        }
      />
    </div>
  );
}
