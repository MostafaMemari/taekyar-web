"use client";

import { RotateCcw, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { POSTS_TABLE_LABELS } from "@/data/dashboard/ui";
import { deletePostPermanently, restorePost } from "@/lib/admin-actions";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";

export function RestorePostButton({ slug }: { slug: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      aria-label={POSTS_TABLE_LABELS.restore}
      title={POSTS_TABLE_LABELS.restore}
      className="size-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
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
      <RotateCcw className="size-4" />
    </Button>
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
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={POSTS_TABLE_LABELS.permanentDelete}
      title={POSTS_TABLE_LABELS.permanentDeleteTitle}
          className="size-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      }
    />
  );
}
