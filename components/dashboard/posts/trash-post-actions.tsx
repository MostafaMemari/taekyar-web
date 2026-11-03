"use client";

import { RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { POSTS_TABLE_LABELS } from "@/data/dashboard/ui";
import { postsApi } from "@/lib/api/endpoints";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";

export function RestorePostButton({ slug }: { slug: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
          try {
            await postsApi.restore(slug);
            toast({ tone: "success", title: POSTS_TABLE_LABELS.restored });
            router.refresh();
          } catch {
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
  const router = useRouter();

  return (
    <ConfirmDialog
      destructive
      title={POSTS_TABLE_LABELS.permanentDelete}
      description={POSTS_TABLE_LABELS.permanentDeleteConfirm}
      confirmLabel={POSTS_TABLE_LABELS.permanentDelete}
      onConfirm={async () => {
        try {
          await postsApi.remove(slug);
          toast({ tone: "success", title: POSTS_TABLE_LABELS.permanentlyDeleted });
          router.refresh();
        } catch {
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
