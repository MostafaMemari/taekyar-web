"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TAXONOMY_LABELS } from "@/data/dashboard/ui";
import { deleteTaxonomy } from "@/lib/admin-actions";
import { toast } from "@/hooks/use-toast";

interface DeleteTaxonomyButtonProps {
  kind: "category" | "tag";
  id: number;
}

export function DeleteTaxonomyButton({ kind, id }: DeleteTaxonomyButtonProps) {
  const [isPending, startTransition] = useTransition();
  const copy = TAXONOMY_LABELS.kinds[kind];

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      aria-label={copy.deleted}
      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      onClick={() => {
        if (!window.confirm(copy.confirmDelete)) return;

        startTransition(async () => {
          const result = await deleteTaxonomy(kind, id);
          if (result.ok) {
            toast({ tone: "success", title: copy.deleted });
          } else {
            toast({ tone: "error", title: TAXONOMY_LABELS.deleteError });
          }
        });
      }}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
