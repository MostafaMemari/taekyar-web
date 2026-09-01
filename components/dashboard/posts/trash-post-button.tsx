"use client";

import { Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
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
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={POSTS_TABLE_LABELS.delete}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      }
    />
  );
}
