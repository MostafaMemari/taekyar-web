"use client";

import { Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { deleteTaxonomy } from "@/lib/admin-actions";
import { toast } from "@/hooks/use-toast";

interface DeleteTaxonomyButtonProps {
  kind: "category" | "tag";
  id: number;
}

export function DeleteTaxonomyButton({ kind, id }: DeleteTaxonomyButtonProps) {
  const copy = TAXONOMY_LABELS.kinds[kind];

  return (
    <ConfirmDialog
      destructive
      title={copy.deleteTitle}
      description={copy.confirmDelete}
      confirmLabel={TAXONOMY_LABELS.deleteLabel}
      onConfirm={async () => {
        const result = await deleteTaxonomy(kind, id);
        if (result.ok) {
          toast({ tone: "success", title: copy.deleted });
        } else if (result.reason === "hasChildren") {
          toast({ tone: "error", title: TAXONOMY_LABELS.deleteBlockedChildren });
        } else if (result.reason === "hasPosts") {
          toast({ tone: "error", title: TAXONOMY_LABELS.deleteBlockedPosts });
        } else {
          toast({ tone: "error", title: TAXONOMY_LABELS.deleteError });
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
