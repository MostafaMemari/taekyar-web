"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { ApiClientError } from "@/lib/api/client";
import { categoriesApi, tagsApi } from "@/lib/api/endpoints";
import { toast } from "@/hooks/use-toast";

interface DeleteTaxonomyButtonProps {
  kind: "category" | "tag";
  id: number;
}

export function DeleteTaxonomyButton({ kind, id }: DeleteTaxonomyButtonProps) {
  const copy = TAXONOMY_LABELS.kinds[kind];
  const router = useRouter();

  return (
    <ConfirmDialog
      destructive
      title={copy.deleteTitle}
      description={copy.confirmDelete}
      confirmLabel={TAXONOMY_LABELS.deleteLabel}
      onConfirm={async () => {
        try {
          if (kind === "category") {
            await categoriesApi.remove(id);
          } else {
            await tagsApi.remove(id);
          }
          toast({ tone: "success", title: copy.deleted });
          router.refresh();
        } catch (error) {
          if (error instanceof ApiClientError && error.code === "hasChildren") {
            toast({ tone: "error", title: TAXONOMY_LABELS.deleteBlockedChildren });
          } else if (error instanceof ApiClientError && error.code === "hasPosts") {
            toast({ tone: "error", title: TAXONOMY_LABELS.deleteBlockedPosts });
          } else {
            toast({ tone: "error", title: TAXONOMY_LABELS.deleteError });
          }
        }
      }}
      trigger={
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={TAXONOMY_LABELS.deleteLabel}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      }
    />
  );
}
