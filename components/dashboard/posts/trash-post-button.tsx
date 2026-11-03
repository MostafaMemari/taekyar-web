"use client";

import { Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { POSTS_TABLE_LABELS } from "@/data/dashboard/ui";
import { postsApi } from "@/lib/api/endpoints";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function TrashPostButton({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <ConfirmDialog
      destructive
      title={POSTS_TABLE_LABELS.deleteTitle}
      description={POSTS_TABLE_LABELS.deleteConfirm}
      confirmLabel={POSTS_TABLE_LABELS.delete}
      onConfirm={async () => {
        try {
          await postsApi.trash(slug);
          toast({ tone: "success", title: POSTS_TABLE_LABELS.deleted });
          router.refresh();
        } catch {
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
