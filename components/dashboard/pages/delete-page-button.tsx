"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { ROW_ACTION_DESTRUCTIVE_CLASS, RowActionButton } from "@/components/dashboard/shared/row-action-button";
import { ConfirmDialog } from "@/components/dashboard/shared/confirm-dialog";
import { PAGES_TABLE_LABELS } from "@/data/dashboard/ui";
import { deletePage } from "@/lib/admin-actions";
import { toast } from "@/hooks/use-toast";

export function DeletePageButton({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <ConfirmDialog
      destructive
      title={PAGES_TABLE_LABELS.deleteTitle}
      description={PAGES_TABLE_LABELS.deleteConfirm}
      confirmLabel={PAGES_TABLE_LABELS.delete}
      onConfirm={async () => {
        const result = await deletePage(slug);
        if (result.ok) {
          toast({ tone: "success", title: PAGES_TABLE_LABELS.deleted });
          router.refresh();
        } else {
          toast({ tone: "error", title: PAGES_TABLE_LABELS.deleteError });
        }
      }}
      trigger={
        <RowActionButton
          aria-label={PAGES_TABLE_LABELS.delete}
          title={PAGES_TABLE_LABELS.delete}
          className={ROW_ACTION_DESTRUCTIVE_CLASS}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </RowActionButton>
      }
    />
  );
}
