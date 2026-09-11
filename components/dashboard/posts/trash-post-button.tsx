"use client";

import { Trash2 } from "lucide-react";

import { ROW_ACTION_DESTRUCTIVE_CLASS, RowActionButton } from "@/components/dashboard/shared/row-action-button";
import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { POSTS_TABLE_LABELS } from "@/data/dashboard/ui";
import { trashPost } from "@/lib/admin-actions";
import { toast } from "@/hooks/use-toast";

export function TrashPostButton({ slug }: { slug: string }) {
  return (
    <ConfirmDialog
      destructive
      title={POSTS_TABLE_LABELS.deleteTitle}
      description={POSTS_TABLE_LABELS.deleteConfirm}
      confirmLabel={POSTS_TABLE_LABELS.delete}
      onConfirm={async () => {
        const result = await trashPost(slug);
        if (result.ok) {
          toast({ tone: "success", title: POSTS_TABLE_LABELS.deleted });
        } else {
          toast({ tone: "error", title: POSTS_TABLE_LABELS.deleteError });
        }
      }}
      trigger={
        <RowActionButton
          aria-label={POSTS_TABLE_LABELS.delete}
          title={POSTS_TABLE_LABELS.delete}
          className={ROW_ACTION_DESTRUCTIVE_CLASS}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </RowActionButton>
      }
    />
  );
}
