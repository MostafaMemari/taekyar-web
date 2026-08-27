"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { POSTS_TABLE_LABELS } from "@/data/dashboard/ui";
import { deletePost } from "@/lib/admin-actions";
import { toast } from "@/hooks/use-toast";

export function DeletePostButton({ slug }: { slug: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      aria-label={POSTS_TABLE_LABELS.delete}
      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      onClick={() => {
        if (!window.confirm(POSTS_TABLE_LABELS.deleteConfirm)) return;

        startTransition(async () => {
          const result = await deletePost(slug);
          if (result.ok) {
            toast({ tone: "success", title: POSTS_TABLE_LABELS.deleted });
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
