"use client";

import { useTransition } from "react";
import { Check, Trash2, X } from "lucide-react";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { COMMENTS_ADMIN_LABELS } from "@/data/dashboard/ui";
import { deleteComment, setCommentStatus } from "@/lib/admin-actions";
import type { CommentStatus } from "@/lib/admin-types";
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
          className="h-8 gap-1.5 rounded-lg border-belt-green/30 text-[12px] font-bold text-belt-green hover:bg-belt-green/10"
          onClick={() => run(() => setCommentStatus(id, "APPROVED"), COMMENTS_ADMIN_LABELS.approved)}
        >
          <Check className="size-3.5" />
          {COMMENTS_ADMIN_LABELS.approve}
        </Button>
      ) : null}

      {status !== "REJECTED" ? (
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          className="h-8 gap-1.5 rounded-lg border-belt-red/30 text-[12px] font-bold text-belt-red hover:bg-belt-red/10"
          onClick={() => run(() => setCommentStatus(id, "REJECTED"), COMMENTS_ADMIN_LABELS.rejected)}
        >
          <X className="size-3.5" />
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
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={COMMENTS_ADMIN_LABELS.delete}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        }
      />
    </div>
  );
}
