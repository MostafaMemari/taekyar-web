"use client";

import { useTransition } from "react";
import { RotateCcw, Trash2 } from "lucide-react";

import {
  ROW_ACTION_DESTRUCTIVE_CLASS,
  ROW_ACTION_PRIMARY_CLASS,
  RowActionButton,
} from "@/components/dashboard/shared/row-action-button";
import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { POSTS_TABLE_LABELS } from "@/data/dashboard/ui";
import { deletePostPermanently, restorePost } from "@/lib/admin-actions";
import { toast } from "@/hooks/use-toast";

export function RestorePostButton({ slug }: { slug: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <RowActionButton
      disabled={isPending}
      aria-label={POSTS_TABLE_LABELS.restore}
      title={POSTS_TABLE_LABELS.restore}
      className={ROW_ACTION_PRIMARY_CLASS}
      onClick={() => {
        startTransition(async () => {
          const result = await restorePost(slug);
          if (result.ok) {
            toast({ tone: "success", title: POSTS_TABLE_LABELS.restored });
          } else {
            toast({ tone: "error", title: POSTS_TABLE_LABELS.restoreError });
          }
        });
      }}
    >
      <RotateCcw className="size-4" aria-hidden="true" />
    </RowActionButton>
  );
}

export function PermanentDeleteButton({ slug }: { slug: string }) {
  return (
    <ConfirmDialog
      destructive
      title={POSTS_TABLE_LABELS.permanentDelete}
      description={POSTS_TABLE_LABELS.permanentDeleteConfirm}
      confirmLabel={POSTS_TABLE_LABELS.permanentDelete}
      onConfirm={async () => {
        const result = await deletePostPermanently(slug);
        if (result.ok) {
          toast({ tone: "success", title: POSTS_TABLE_LABELS.permanentlyDeleted });
        } else {
          toast({ tone: "error", title: POSTS_TABLE_LABELS.deleteError });
        }
      }}
      trigger={
        <RowActionButton
          aria-label={POSTS_TABLE_LABELS.permanentDelete}
          title={POSTS_TABLE_LABELS.permanentDeleteTitle}
          className={ROW_ACTION_DESTRUCTIVE_CLASS}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </RowActionButton>
      }
    />
  );
}
