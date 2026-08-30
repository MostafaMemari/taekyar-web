"use client";

import { useTransition } from "react";
import { RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { POSTS_TABLE_LABELS } from "@/data/dashboard/ui";
import { deletePostPermanently, restorePost } from "@/lib/admin-actions";
import { toast } from "@/hooks/use-toast";

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
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      aria-label={POSTS_TABLE_LABELS.permanentDelete}
      title={POSTS_TABLE_LABELS.permanentDelete}
      className="size-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      onClick={() => {
        if (!window.confirm(POSTS_TABLE_LABELS.permanentDeleteConfirm)) return;

        startTransition(async () => {
          const result = await deletePostPermanently(slug);
          if (result.ok) {
            toast({ tone: "success", title: POSTS_TABLE_LABELS.permanentlyDeleted });
          } else {
            toast({ tone: "error", title: POSTS_TABLE_LABELS.deleteError });
          }
        });
      }}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
